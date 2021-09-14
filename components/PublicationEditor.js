import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { useRouter } from 'next/router'

import near from '../lib/near'
import { useToast } from '../hooks/useToast'
import {
	compressImg,
	dataURLtoFile,
	parseGetTokenIdfromUrl,
	parseImgUrl,
	readFileAsUrl,
} from '../utils/common'
import TextEditor from './TextEditor'
import Modal from './Modal'
import Card from './Card'
import usePreventRouteChangeIf from '../hooks/usePreventRouteChange'

let redirectUrl = null

const PublicationEditor = ({ isEdit = false, pubDetail = null }) => {
	const toast = useToast()
	const router = useRouter()

	const [preventLeaving, setPreventLeaving] = useState(true)
	const [showLeavingConfirmation, setShowLeavingConfirmation] = useState(false)

	usePreventRouteChangeIf(preventLeaving, (url) => {
		redirectUrl = url
		setShowLeavingConfirmation(true)
	})

	const [title, setTitle] = useState(convertTextToEditorState(pubDetail?.title))
	const [subTitle, setSubTitle] = useState(pubDetail?.description || '')
	const [thumbnail, setThumbnail] = useState(pubDetail?.thumbnail)
	const [content, setContent] = useState(
		generateEditorState(pubDetail?.content)
	)
	const [showAlertErr, setShowAlertErr] = useState(false)
	const [embeddedCards, setEmbeddedCards] = useState([])

	const [showModal, setShowModal] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [searchToken, setSearchToken] = useState('')

	useEffect(() => {
		if (isEdit) {
			fetchToken()
		}
	}, [])

	const fetchToken = async () => {
		let token = []
		pubDetail.contract_token_ids?.map(async (tokenId) => {
			const [contractTokenId, token_id] = tokenId.split('/')
			const [contractId, tokenSeriesId] = contractTokenId.split('::')

			const url = process.env.V2_API_URL
			const res = await axios({
				url: url + (tokenId ? `/token` : `/token-series`),
				method: 'GET',
				params: token_id
					? {
							token_id: token_id,
					  }
					: {
							contract_id: contractId,
							token_series_id: tokenSeriesId,
					  },
			})

			const _token = (await res.data.data.results[0]) || null
			token = [...token, _token]
			setEmbeddedCards(token)
		})
	}

	const getDataFromTokenId = async () => {
		const { token_id, token_series_id } = parseGetTokenIdfromUrl(searchToken)

		if (token_id) {
			const res = await axios.get(`${process.env.V2_API_URL}/token`, {
				params: {
					token_id: token_id,
				},
			})

			const token = (await res.data.data.results[0]) || null

			if (token) {
				setEmbeddedCards([...embeddedCards, token])
				setShowModal(null)
				setSearchToken('')
			} else {
				showToast('Please enter correct url')
			}
			return
		}

		if (token_series_id.split('::')[1]) {
			const res = await axios.get(`${process.env.V2_API_URL}/token-series`, {
				params: {
					token_series_id: token_series_id.split('::')[1],
				},
			})

			const token = (await res.data.data.results[0]) || null

			if (token) {
				setEmbeddedCards([...embeddedCards, token])
				setShowModal(null)
				setSearchToken('')
			} else {
				showToast('Please enter correct url')
			}
			return
		}

		showToast('Please enter correct url')
	}

	const getTokenIds = () => {
		return embeddedCards.map((token) => {
			let tokenId = `${token.contract_id}::${token.token_series_id}`
			if (token.token_id) {
				tokenId += `/${token.token_id}`
			}
			return tokenId
		})
	}

	const showToast = (msg, type = 'error') => {
		toast.show({
			text: <div className="font-semibold text-center text-sm">{msg}</div>,
			type: type,
			duration: 1500,
		})
	}

	const showCardModal = () => {
		embeddedCards.length === 6
			? showToast('Maximum 6 cards')
			: setShowModal('card')
	}

	const postPublication = async () => {
		if (!thumbnail || !subTitle) {
			let error = []
			if (!thumbnail) error.push('Thumbnail')
			if (!subTitle) error.push('Description')

			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{error.join(' and ')} is required
					</div>
				),
				type: 'error',
				duration: null,
			})
			return
		}

		setIsSubmitting(true)
		setPreventLeaving(false)

		const entityMap = await uploadImage()
		const _thumbnail = await uploadThumbnail()

		const data = {
			title: title.getCurrentContent().getPlainText(),
			thumbnail: _thumbnail,
			description: subTitle,
			content: {
				blocks: convertToRaw(content.getCurrentContent()).blocks,
				entityMap: entityMap,
			},
			contract_token_ids: getTokenIds(),
		}

		try {
			const url = `${process.env.V2_API_URL}/publications`
			const res = await axios({
				url: isEdit ? url + `/${pubDetail._id}` : url,
				method: isEdit ? 'put' : 'post',
				data: data,
				headers: {
					authorization: await near.authToken(),
				},
			})
			const pub = res.data.data
			const routerUrl = `/publication/${pub.slug}-${pub._id}`
			setTimeout(() => {
				router.push(routerUrl)
			}, 1000)
		} catch (err) {
			const msg =
				err.response?.data?.message || `Something went wrong, try again later`
			showToast(msg)
			setIsSubmitting(false)
			setPreventLeaving(true)
		}
	}

	const uploadImage = async () => {
		let { entityMap } = convertToRaw(content.getCurrentContent())

		const formData = new FormData()
		for (let key in entityMap) {
			if (
				entityMap[key].type === 'IMAGE' &&
				!entityMap[key].data.src?.includes('ipfs://')
			) {
				const file = dataURLtoFile(entityMap[key].data.src, key)
				formData.append('files', file, key)
			}
		}

		const resp = await axios.post(
			`${process.env.V2_API_URL}/uploads`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
					authorization: await near.authToken(),
				},
			}
		)

		let idx = 0
		for (let key in entityMap) {
			if (
				entityMap[key].type === 'IMAGE' &&
				!entityMap[key].data.src?.includes('ipfs://')
			) {
				entityMap[key].data.src = resp.data.data[idx]
				idx++
			}
		}

		return entityMap
	}

	const uploadThumbnail = async () => {
		// eslint-disable-next-line no-unused-vars
		const [protocol, path] = thumbnail.split('://')
		if (protocol === 'ipfs') {
			return thumbnail
		}

		const formData = new FormData()
		formData.append('files', dataURLtoFile(thumbnail), 'thumbnail')

		const resp = await axios.post(
			`${process.env.V2_API_URL}/uploads`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
					authorization: await near.authToken(),
				},
			}
		)

		return resp.data.data[0]
	}

	const updateThumbnail = async (e) => {
		if (e.target.files[0]) {
			if (e.target.files[0].size > 3 * 1024 * 1024) {
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							Maximum file size 3MB
						</div>
					),
					type: 'error',
					duration: null,
				})
				return
			}
			const compressedImg =
				e.target.files[0].type === 'image/gif'
					? e.target.files[0]
					: await compressImg(e.target.files[0])
			setThumbnail(await readFileAsUrl(compressedImg))
		}
	}

	const onPressContinue = () => {
		const { entityMap } = convertToRaw(content.getCurrentContent())
		if (!thumbnail) {
			for (let key in entityMap) {
				if (entityMap[key].type === 'IMAGE') {
					setThumbnail(entityMap[key].data.src || thumbnail)
					break
				}
			}
		}
		setShowModal('final')
	}

	return (
		<div className="py-16 min-h-screen">
			{showModal === 'card' && (
				<Modal
					close={() => setShowModal(null)}
					closeOnBgClick={true}
					closeOnEscape={true}
				>
					<div className="w-full max-w-md p-4 m-auto bg-dark-primary-2 rounded-md overflow-hidden">
						<div className="m-auto">
							<label className="mb-4 block text-white text-2xl font-bold">
								Add card to your publication
							</label>
							<input
								type="text"
								name="Token"
								onChange={(e) => setSearchToken(e.target.value)}
								value={searchToken}
								className={`resize-none h-auto focus:border-gray-100 mb-4`}
								placeholder="Url of the Token"
							/>
							<p className="text-gray-300 text-sm italic">
								Please input the link of your token
							</p>
							<p className="text-gray-300 text-sm italic">
								https://paras.id/token/x.paras.near::1
							</p>
							<button
								className="font-semibold mt-4 py-3 w-full rounded-md bg-primary text-white"
								disabled={!searchToken}
								onClick={getDataFromTokenId}
							>
								Add Card
							</button>
						</div>
					</div>
				</Modal>
			)}
			{showModal === 'final' && (
				<Modal
					close={() => setShowModal(null)}
					closeOnBgClick={false}
					closeOnEscape={false}
				>
					<div className="w-full max-h-screen max-w-3xl p-4 m-auto bg-dark-primary-2 rounded-md overflow-hidden overflow-y-auto">
						<div className="flex justify-between">
							<h1 className="mb-4 block text-white text-2xl font-bold">
								{isEdit ? 'Edit Publication' : 'Preview Publication'}
							</h1>
							<div onClick={() => setShowModal(null)}>
								<svg
									className="cursor-pointer"
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M8.00008 9.41423L3.70718 13.7071L2.29297 12.2929L6.58586 8.00001L2.29297 3.70712L3.70718 2.29291L8.00008 6.5858L12.293 2.29291L13.7072 3.70712L9.41429 8.00001L13.7072 12.2929L12.293 13.7071L8.00008 9.41423Z"
										fill="white"
									/>
								</svg>
							</div>
						</div>
						<div className="flex flex-col md:flex-row -mx-2">
							<div className="w-full md:w-1/2 px-2">
								<h1 className="mb-2 block text-white text-md font-medium">
									Thumbnail
								</h1>
								<div className="bg-white h-64 mb-4 overflow-hidden relative rounded-md">
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="bg-opacity-75 bg-black p-2 rounded-md">
											<div className="flex items-center">
												<svg
													className="m-auto"
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														fillRule="evenodd"
														clipRule="evenodd"
														d="M4 2H20C21.1046 2 22 2.89543 22 4V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V4C2 2.89543 2.89543 2 4 2ZM4 4V15.5858L8 11.5858L11.5 15.0858L18 8.58579L20 10.5858V4H4ZM4 20V18.4142L8 14.4142L13.5858 20H4ZM20 20H16.4142L12.9142 16.5L18 11.4142L20 13.4142V20ZM14 8C14 6.34315 12.6569 5 11 5C9.34315 5 8 6.34315 8 8C8 9.65685 9.34315 11 11 11C12.6569 11 14 9.65685 14 8ZM10 8C10 7.44772 10.4477 7 11 7C11.5523 7 12 7.44772 12 8C12 8.55228 11.5523 9 11 9C10.4477 9 10 8.55228 10 8Z"
														fill="rgba(255,255,255,1)"
													/>
												</svg>
												<p className="text-white font-semibold ml-2 text-sm">
													Update Thumbnail (Max. 3MB)
												</p>
											</div>
										</div>
									</div>
									<input
										className="cursor-pointer w-full opacity-0 absolute inset-0"
										type="file"
										accept="image/*"
										onChange={updateThumbnail}
									/>
									{thumbnail && (
										<img
											className="w-full h-full object-cover m-auto"
											src={parseImgUrl(thumbnail, null, {
												width: `600`,
											})}
										/>
									)}
								</div>
							</div>
							<div className="w-full md:w-1/2 px-2">
								<h1 className="mb-2 block text-white text-md font-medium">
									Title
								</h1>
								<input
									type="text"
									name="Title"
									disabled={true}
									value={title.getCurrentContent().getPlainText()}
									className={`resize-none h-auto focus:border-gray-100`}
									placeholder="Preview Title"
								/>
								<h1 className="mt-3 mb-2 block text-white text-md font-medium">
									Description
								</h1>
								<textarea
									type="text"
									name="SubTitle"
									onChange={(e) => setSubTitle(e.target.value)}
									value={subTitle}
									className={`resize-none focus:border-gray-100 h-24`}
									placeholder="Preview Description"
								/>
								<button
									className="font-semibold mt-3 py-3 w-40 rounded-md bg-primary text-white"
									disabled={isSubmitting}
									onClick={postPublication}
								>
									{isSubmitting ? 'Publishing...' : 'Publish'}
								</button>
							</div>
						</div>
					</div>
				</Modal>
			)}
			{showLeavingConfirmation && (
				<Modal
					close={() => setShowLeavingConfirmation(false)}
					closeOnBgClick
					closeOnEscape
				>
					<div className="w-full max-w-xs p-4 m-auto bg-gray-100 rounded-md overflow-y-auto max-h-screen">
						<div className="w-full">
							Are you sure to leave this page? You will lose any unpublished
							changes
						</div>
						<div className="flex space-x-4">
							<button
								className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
								onClick={() => {
									setPreventLeaving(false)
									setTimeout(() => {
										setShowLeavingConfirmation(false)
										router.push(redirectUrl)
									}, 100)
								}}
							>
								OK
							</button>
							<button
								className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-white text-primary"
								onClick={() => setShowLeavingConfirmation(false)}
							>
								Cancel
							</button>
						</div>
					</div>
				</Modal>
			)}
			{showAlertErr && (
				<Modal close={() => setShowAlertErr(false)}>
					<div className="w-full max-w-xs p-4 m-auto bg-gray-100 rounded-md overflow-y-auto max-h-screen">
						<div className="w-full">{showAlertErr}</div>
						<button
							className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
							onClick={() => setShowAlertErr(false)}
						>
							OK
						</button>
					</div>
				</Modal>
			)}
			<div className="mx-auto max-w-3xl px-4">
				<TextEditor
					content={content}
					setContent={setContent}
					title={title}
					setTitle={setTitle}
					onPressAddCard={getDataFromTokenId}
					showCardModal={showCardModal}
				/>
			</div>
			{embeddedCards.length !== 0 && (
				<div className="max-w-4xl mx-auto px-4 pt-16">
					<div className=" border-2 border-dashed border-gray-800 rounded-md p-4 md:p-8">
						<h4 className="text-white font-semibold text-3xl mb-4 text-center">
							Card Collectibles
						</h4>
						<div
							className={`md:flex md:flex-wrap ${
								embeddedCards.length <= 3 && 'justify-center'
							}`}
						>
							{embeddedCards.map((card) => (
								<div
									key={card.tokenId}
									className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-8"
								>
									<CardPublication
										localToken={card}
										deleteCard={() => {
											const temp = embeddedCards.filter(
												(x) => x.token_series_id != card.token_series_id
											)
											setEmbeddedCards(temp)
										}}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
			<div className="max-w-3xl mx-auto px-4 pt-8">
				<button
					className="font-semibold py-3 w-32 rounded-md bg-primary text-white"
					onClick={onPressContinue}
					disabled={title === '' || !content.getCurrentContent().hasText()}
				>
					Continue
				</button>
			</div>
		</div>
	)
}

const generateEditorState = (content = null) => {
	if (!content) {
		content = {
			entityMap: {},
			blocks: [
				{
					text: '',
					key: 'foo',
					type: 'unstyled',
					entityRanges: [],
				},
			],
		}
	}
	return EditorState.createWithContent(convertFromRaw(content))
}

const convertTextToEditorState = (text = '') =>
	EditorState.createWithContent(
		convertFromRaw({
			entityMap: {},
			blocks: [
				{
					text: text,
					key: 'title',
					type: 'unstyled',
					entityRanges: [],
				},
			],
		})
	)

const CardPublication = ({ localToken, deleteCard }) => {
	return (
		<Fragment>
			<div className="w-full m-auto">
				<Card
					imgUrl={parseImgUrl(localToken.metadata.media, null, {
						width: `600`,
						useOriginal: process.env.APP_ENV === 'production' ? false : true,
					})}
					imgBlur={localToken.metadata.blurhash}
					token={{
						title: localToken.metadata.title,
						collection:
							localToken.metadata.collection || localToken.contract_id,
						copies: localToken.metadata.copies,
						creatorId: localToken.metadata.creator_id || localToken.contract_id,
					}}
				/>
			</div>
			<div className="text-gray-100 pt-4">
				<div className=" overflow-hidden">
					<p
						title={localToken?.metadata?.title}
						className="text-2xl font-bold border-b-2 border-transparent truncate"
					>
						{localToken?.metadata?.title}
					</p>
				</div>
				<p className="opacity-75 truncate">
					{localToken?.metadata?.collection}
				</p>
			</div>
			<div className="text-red-600 text-sm cursor-pointer" onClick={deleteCard}>
				Delete
			</div>
		</Fragment>
	)
}

export default PublicationEditor
