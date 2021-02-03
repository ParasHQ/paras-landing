import { useEffect, useState } from 'react'
import axios from 'axios'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { useRouter } from 'next/router'

import near from '../lib/near'
import { useToast } from '../hooks/useToast'
import { dataURLtoFile, parseImgUrl, readFileAsUrl } from '../utils/common'
import TextEditor from './TextEditor'
import Modal from './Modal'
import Card from './Card'
import usePreventRouteChangeIf from '../hooks/usePreventRouteChange'

const PublicationEditor = ({ isEdit = false, pubDetail = null }) => {
	const toast = useToast()
	const router = useRouter()

	const [preventLeaving, setPreventLeaving] = useState(true)
	const [showLeavingConfirmation, setShowLeavingConfirmation] = useState(false)

	usePreventRouteChangeIf(preventLeaving, () =>
		setShowLeavingConfirmation(true)
	)

	const [title, setTitle] = useState(defaultValueEditor)
	const [subTitle, setSubTitle] = useState('')
	const [thumbnail, setThumbnail] = useState(null)
	const [content, setContent] = useState(defaultValueEditor)
	const [showAlertErr, setShowAlertErr] = useState(false)
	const [embeddedCards, setEmbeddedCards] = useState([])

	const [showModal, setShowModal] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [searchToken, setSearchToken] = useState('')

	useEffect(() => {
		if (isEdit) {
			setInitialData()
			fetchToken()
		}
	}, [])

	const setInitialData = () => {
		setTitle(convertTextToEditorState(pubDetail.title))
		setSubTitle(pubDetail.description)
		setThumbnail(pubDetail.thumbnail)
		setContent(EditorState.createWithContent(convertFromRaw(pubDetail.content)))
	}

	const fetchToken = async () => {
		let token = []
		pubDetail.tokenIds.map(async (tokenId) => {
			const res = await axios(
				`${process.env.API_URL}/tokens?tokenId=${tokenId}`
			)
			token = [...token, res.data.data.results[0]]
			setEmbeddedCards(token)
		})
	}

	const getDataFromTokenId = async () => {
		if (embeddedCards.some((card) => card.tokenId === searchToken)) {
			showToast('You have embedded this card')
			setSearchToken('')
			return
		}

		const res = await axios(
			`${process.env.API_URL}/tokens?tokenId=${searchToken}`
		)
		const token = (await res.data.data.results[0]) || null

		if (token) {
			setEmbeddedCards([...embeddedCards, token])
			setShowModal(null)
			setSearchToken('')
		} else {
			showToast('Please enter correct token id')
		}
	}

	const showToast = (msg, type = 'error') => {
		toast.show({
			text: <div className="font-semibold text-center text-sm">{msg}</div>,
			type: type,
			duration: 1500,
		})
	}

	const showCardModal = () => {
		embeddedCards.length === 3
			? showToast('Maximum 3 cards')
			: setShowModal('card')
	}

	const postPublication = async () => {
		if (!thumbnail) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						Thumbnail is required
					</div>
				),
				type: 'error',
				duration: null,
			})
			return
		}
		if (!subTitle) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						Description is required
					</div>
				),
				type: 'error',
				duration: null,
			})
			return
		}

		setIsSubmitting(true)

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
			tokenIds: embeddedCards.map((card) => card.tokenId),
		}

		try {
			const url = `${process.env.API_URL}/publications`
			const res = await axios({
				url: isEdit ? url + `/${pubDetail._id}` : url,
				method: isEdit ? 'put' : 'post',
				data: data,
				headers: {
					authorization: await near.authToken(),
				},
			})
			const pub = res.data.data
			const routerUrl = `/publication/${pub.type}/${pub.slug}-${pub._id}`
			setTimeout(() => {
				router.push(routerUrl)
			}, 1000)
		} catch (err) {
			const msg =
				err.response?.data?.message || `Something went wrong, try again later`
			showToast(msg)
			setIsSubmitting(false)
		}
	}

	const uploadImage = async () => {
		let { entityMap } = convertToRaw(content.getCurrentContent())

		const formData = new FormData()
		for (let key in entityMap) {
			if (!entityMap[key].data.src.includes('ipfs://')) {
				const file = dataURLtoFile(entityMap[key].data.src, key)
				formData.append('files', file, key)
			}
		}

		const resp = await axios.post(`${process.env.API_URL}/uploads`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				authorization: await near.authToken(),
			},
		})

		for (let key in entityMap) {
			if (!entityMap[key].data.src.includes('ipfs://')) {
				entityMap[key].data.src = resp.data.data[key]
			}
		}

		return entityMap
	}

	const uploadThumbnail = async () => {
		const [protocol, path] = thumbnail.split('://')
		if (protocol === 'ipfs') {
			return thumbnail
		}

		const formData = new FormData()
		formData.append('files', dataURLtoFile(thumbnail), 'thumbnail')

		const resp = await axios.post(`${process.env.API_URL}/uploads`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				authorization: await near.authToken(),
			},
		})

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
			setThumbnail(entityMap[0]?.data.src || thumbnail)
		}
		setShowModal('final')
	}

	return (
		<div className="y-16 mx-auto max-w-3xl min-h-screen">
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
								placeholder="Token ID"
							/>
							<p className="text-gray-300 text-sm italic">
								TokenID is your card id. You can find your TokenID at
								https://paras.id/token/[TokenID]
							</p>
							<button
								className="font-semibold mt-4 py-3 w-full rounded-md bg-primary text-white"
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
					closeOnBgClick={true}
					closeOnEscape={true}
				>
					<div className="w-full max-w-3xl p-4 m-auto bg-dark-primary-2 rounded-md overflow-hidden">
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
											src={parseImgUrl(thumbnail)}
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
							Are you sure to leave this page? you will lose your publication
						</div>
						<div className="flex space-x-4">
							<button
								className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
								onClick={() => {
									setShowLeavingConfirmation(false)
									setPreventLeaving(false)
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
			<TextEditor
				content={content}
				setContent={setContent}
				title={title}
				setTitle={setTitle}
				onPressAddCard={getDataFromTokenId}
				showCardModal={showCardModal}
			/>
			{embeddedCards.length !== 0 && (
				<div className="border-2 border-dashed border-gray-800 p-4 rounded-md my-4 pd-4">
					<h1 className="p-4 pb-0 block text-white text-2xl font-bold">
						Embedded Card
					</h1>
					<div className="inline-block">
						{embeddedCards.map((card) => (
							<CardPublication
								key={card.tokenId}
								localToken={card}
								deleteCard={() => {
									const temp = embeddedCards.filter(
										(x) => x.tokenId != card.tokenId
									)
									setEmbeddedCards(temp)
								}}
							/>
						))}
					</div>
				</div>
			)}
			<div>
				<button
					className="font-semibold m-4 py-3 w-32 rounded-md bg-primary text-white"
					onClick={onPressContinue}
					disabled={title === '' || !content.getCurrentContent().hasText()}
				>
					Continue
				</button>
			</div>
		</div>
	)
}

const defaultValueEditor = EditorState.createWithContent(
	convertFromRaw({
		entityMap: {},
		blocks: [
			{
				text: '',
				key: 'foo',
				type: 'unstyled',
				entityRanges: [],
			},
		],
	})
)

const convertTextToEditorState = (text) =>
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

export const CardPublication = ({ localToken, deleteCard }) => {
	return (
		<div className="inline-block p-4 rounded-md max-w-sm">
			<div className="w-40 mx-auto">
				<Card
					imgUrl={parseImgUrl(localToken?.metadata?.image)}
					imgBlur={localToken?.metadata?.blurhash}
					token={{
						name: localToken?.metadata?.name,
						collection: localToken?.metadata?.collection,
						description: localToken?.metadata?.description,
						creatorId: localToken?.creatorId,
						supply: localToken?.supply,
						tokenId: localToken?.tokenId,
						createdAt: localToken?.createdAt,
					}}
					initialRotate={{
						x: 15,
						y: 15,
					}}
					disableFlip={true}
				/>
			</div>
			<div className="text-gray-100 pt-4">
				<div>
					<a
						title={localToken?.metadata?.name}
						className="text-2xl font-bold border-b-2 border-transparent"
					>
						{localToken?.metadata?.name}
					</a>
				</div>
				<p className="opacity-75 truncate">
					{localToken?.metadata?.collection}
				</p>
			</div>
			<div className="text-red-600 text-sm cursor-pointer" onClick={deleteCard}>
				Delete
			</div>
		</div>
	)
}

export default PublicationEditor
