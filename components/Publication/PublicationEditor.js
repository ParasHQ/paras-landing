import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { useRouter } from 'next/router'

import { useToast } from 'hooks/useToast'
import {
	compressImg,
	dataURLtoFile,
	parseGetCollectionIdfromUrl,
	parseGetTokenIdfromUrl,
	parseImgUrl,
	readFileAsUrl,
} from 'utils/common'
import TextEditor from './TextEditor'
import Modal from '../Modal'
import Card from '../Card/Card'
import usePreventRouteChangeIf from 'hooks/usePreventRouteChange'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import { v4 as uuidv4 } from 'uuid'
import DraftPublication from 'components/Draft/DraftPublication'
import { generateFromString } from 'generate-avatar'
import WalletHelper from 'lib/WalletHelper'
import { IconX } from 'components/Icons'

let redirectUrl = null

const PublicationEditor = ({ isEdit = false, pubDetail = null, draftDetail = [] }) => {
	const toast = useToast()
	const router = useRouter()
	const { localeLn } = useIntl()
	const [preventLeaving, setPreventLeaving] = useState(true)
	const [showLeavingConfirmation, setShowLeavingConfirmation] = useState(false)
	const [isPubDetail, setIsPubDetail] = useState(false)

	usePreventRouteChangeIf(preventLeaving, (url) => {
		redirectUrl = url
		setShowLeavingConfirmation(true)
	})

	const [title, setTitle] = useState(
		convertTextToEditorState(pubDetail?.title || draftDetail[0]?.title)
	)
	const [subTitle, setSubTitle] = useState(
		pubDetail?.description || draftDetail[0]?.description || ''
	)
	const [thumbnail, setThumbnail] = useState(pubDetail?.thumbnail || draftDetail[0]?.thumbnail)
	const [content, setContent] = useState(
		generateEditorState(pubDetail?.content || draftDetail[0]?.content)
	)
	const [showAlertErr, setShowAlertErr] = useState(false)
	const [embeddedCards, setEmbeddedCards] = useState([])
	const [embeddedCollections, setEmbeddedCollections] = useState([])

	const [showModal, setShowModal] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isDraftIn, setIsDraftIn] = useState(false)
	const [searchToken, setSearchToken] = useState('')
	const [searchCollection, setSearchCollection] = useState('')
	const [currentDraftStorage, setCurrentDraftStorage] = useState()
	const currentUser = WalletHelper.currentUser
	const uid = uuidv4()

	useEffect(() => {
		if (pubDetail !== null) setIsPubDetail(true)
	}, [])

	useEffect(() => {
		const draftStorage = JSON.parse(localStorage.getItem('draft-publication'))
		const currentUserDraft = draftStorage?.filter(
			(item) => item.author_id === currentUser?.accountId
		)
		setCurrentDraftStorage(currentUserDraft)
	}, [])

	useEffect(() => {
		if (isEdit) {
			fetchToken()
			fetchCollection()
		}
	}, [])

	const fetchToken = async () => {
		let token = []
		pubDetail?.contract_token_ids?.map(async (tokenId) => {
			const [contractTokenId, token_id] = tokenId.split('/')
			const [contractId, tokenSeriesId] = contractTokenId.split('::')

			const url = process.env.V2_API_URL
			const res = await axios({
				url: url + (token_id ? `/token` : `/token-series`),
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

	const fetchCollection = async () => {
		if (pubDetail?.isComic) {
			let comic = []
			pubDetail?.collection_ids?.map(async (comicId) => {
				const url = process.env.COMIC_API_URL
				const res = await axios({
					url: url + `/comics`,
					method: 'GET',
					params: {
						comic_id: comicId,
					},
				})
				const _comic = (await res.data.data.results[0]) || null
				comic = [...comic, _comic]
				setEmbeddedCollections(comic)
			})
		} else {
			let collection = []
			pubDetail?.collection_ids?.map(async (collectionId) => {
				const url = process.env.V2_API_URL
				const res = await axios({
					url: url + `/collections`,
					method: 'GET',
					params: {
						collection_id: collectionId,
					},
				})

				const _collection = (await res.data.data.results[0]) || null
				collection = [...collection, _collection]
				setEmbeddedCollections(collection)
			})
		}
	}

	const getDataFromTokenId = async () => {
		const { token_id, token_series_id } = parseGetTokenIdfromUrl(searchToken)

		if (token_id) {
			const res = await axios.get(`${process.env.V2_API_URL}/token`, {
				params: {
					token_id: token_id,
					contract_id: token_series_id.split('::')[0],
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
					contract_id: token_series_id.split('::')[0],
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

	const getDataFromCollectionId = async () => {
		const { collection_id } = parseGetCollectionIdfromUrl(searchCollection)

		if (embeddedCollections.some((col) => col.collection_id === collection_id)) {
			showToast('You have added this collection')
			return
		}

		const res = await axios.get(`${process.env.V2_API_URL}/collections`, {
			params: {
				collection_id: collection_id,
			},
		})

		const collection = (await res.data.data.results[0]) || null

		if (collection) {
			setEmbeddedCollections([...embeddedCollections, collection])
			setShowModal(null)
			setSearchCollection('')
		} else {
			showToast('Please enter correct url')
		}
		return
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

	const getCollectionIds = () => {
		return embeddedCollections.map((coll) => coll.collection_id)
	}

	const showToast = (msg, type = 'error') => {
		toast.show({
			text: <div className="font-semibold text-center text-sm">{msg}</div>,
			type: type,
			duration: 1500,
		})
	}

	const showCardModal = () => {
		embeddedCards.length === 6 ? showToast('Maximum 6 cards') : setShowModal('card')
	}

	const showCollectionModal = () => {
		embeddedCollections.length === 6
			? showToast('Maximum 6 collection')
			: setShowModal('collection')
	}

	const postPublication = async () => {
		if (!thumbnail || !subTitle) {
			let error = []
			if (!thumbnail) error.push('Thumbnail')
			if (!subTitle) error.push('Description')

			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">{error.join(' and ')} is required</div>
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
			collection_ids: getCollectionIds(),
		}

		try {
			const url = `${process.env.V2_API_URL}/publications`
			const res = await axios(
				!isPubDetail && draftDetail.length > 0
					? {
							url: url,
							method: 'post',
							data: data,
							headers: {
								authorization: await WalletHelper.authToken(),
							},
					  }
					: {
							url: isEdit ? url + `/${pubDetail._id}` : url,
							method: isEdit ? 'put' : 'post',
							data: data,
							headers: {
								authorization: await WalletHelper.authToken(),
							},
					  }
			)
			if (!isPubDetail && draftDetail.length > 0) deleteDraft(draftDetail[0]._id)
			const pub = res.data.data
			const routerUrl = `/publication/${pub.slug}-${pub._id}`
			setTimeout(() => {
				router.push(routerUrl)
			}, 1000)
		} catch (err) {
			sentryCaptureException(err)
			const msg = err.response?.data?.message || `Something went wrong, try again later`
			showToast(msg)
			setIsSubmitting(false)
			setPreventLeaving(true)
		}
	}

	const saveDraft = async () => {
		let checkTotalDraft = false
		if (!window.location.href.includes('edit')) checkTotalDraft = currentDraftStorage?.length >= 10
		if (checkTotalDraft) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{' '}
						{checkTotalDraft && 'The maximum number of drafts is 10 drafts'}
					</div>
				),
				type: 'error',
				duration: null,
			})
			return
		}

		setIsDraftIn(true)
		setPreventLeaving(false)

		const entityMap = await uploadImage()
		const _thumbnail = await uploadThumbnail()

		const data = {
			_id: uid,
			author_id: currentUser.accountId,
			title: title.getCurrentContent().getPlainText(),
			draft: true,
			thumbnail: _thumbnail,
			description: subTitle,
			content: {
				blocks: convertToRaw(content.getCurrentContent()).blocks,
				entityMap: entityMap,
			},
			contract_token_ids: getTokenIds(),
		}

		let draftStorage = JSON.parse(localStorage.getItem('draft-publication')) || []
		const draftCurrentEdit = JSON.parse(localStorage.getItem('edit-draft'))
		let checkDraft = []
		if (draftCurrentEdit !== null) {
			checkDraft = draftStorage.find((item) => item._id === draftCurrentEdit[0]._id)
		}

		if (checkDraft && window.location.href.includes('edit')) {
			checkDraft.title = data.title
			checkDraft.thumbnail = data.thumbnail
			checkDraft.description = data.subTitle
			checkDraft.content = data.content
			checkDraft.contract_token_ids = data.contract_token_ids
			draftStorage.push(checkDraft)
			draftStorage.pop()
			localStorage.setItem('draft-publication', JSON.stringify(draftStorage))
		} else {
			draftStorage.push(data)
			localStorage.setItem('draft-publication', JSON.stringify(draftStorage))
		}

		const routerUrl = `/${currentUser.accountId}/publication`
		router.push(routerUrl)
	}

	const deleteDraft = (_id) => {
		const dataDraftPublication = JSON.parse(localStorage.getItem('draft-publication'))
		const deleteItem = dataDraftPublication.filter((item) => item._id !== _id)
		localStorage.setItem('draft-publication', JSON.stringify(deleteItem))
		if (dataDraftPublication.length === 1) localStorage.removeItem('draft-publication')
	}

	const uploadImage = async () => {
		let { entityMap } = convertToRaw(content.getCurrentContent())

		const formData = new FormData()
		for (let key in entityMap) {
			if (entityMap[key].type === 'IMAGE' && !entityMap[key].data.src?.includes('ipfs://')) {
				const file = dataURLtoFile(entityMap[key].data.src, key)
				formData.append('files', file, key)
			}
		}

		const resp = await axios.post(`${process.env.V2_API_URL}/uploads`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				authorization: await WalletHelper.authToken(),
			},
		})

		let idx = 0
		for (let key in entityMap) {
			if (entityMap[key].type === 'IMAGE' && !entityMap[key].data.src?.includes('ipfs://')) {
				entityMap[key].data.src = resp.data.data[idx]
				idx++
			}
		}

		return entityMap
	}

	const uploadThumbnail = async () => {
		if (thumbnail !== undefined) {
			// eslint-disable-next-line no-unused-vars
			const [protocol, path] = thumbnail.split('://')
			if (protocol === 'ipfs') {
				return thumbnail
			}

			const formData = new FormData()
			formData.append('files', dataURLtoFile(thumbnail), 'thumbnail')

			const resp = await axios.post(`${process.env.V2_API_URL}/uploads`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					authorization: await WalletHelper.authToken(),
				},
			})
			return resp.data.data[0]
		}
	}

	const updateThumbnail = async (e) => {
		if (e.target.files[0]) {
			if (e.target.files[0].size > 3 * 1024 * 1024) {
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">{localeLn('MaximumSize3MB')}</div>
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
				<Modal close={() => setShowModal(null)} closeOnBgClick={true} closeOnEscape={true}>
					<div className="w-full max-w-md p-4 m-auto bg-dark-primary-2 rounded-md overflow-hidden">
						<div className="m-auto">
							<label className="mb-4 block text-white text-2xl font-bold">
								{localeLn('AddCardToPublication')}
							</label>
							<input
								type="text"
								name="Token"
								onChange={(e) => setSearchToken(e.target.value)}
								value={searchToken}
								className={`resize-none h-auto focus:border-gray-100 mb-4`}
								placeholder="Url of the Token"
							/>
							<p className="text-gray-300 text-sm italic">Please input the link of your token</p>
							<p className="text-gray-300 text-sm italic">https://paras.id/token/x.paras.near::1</p>
							<button
								className="font-semibold mt-4 py-3 w-full rounded-md bg-primary text-white"
								disabled={!searchToken}
								onClick={getDataFromTokenId}
							>
								{localeLn('AddCard')}
							</button>
						</div>
					</div>
				</Modal>
			)}
			{showModal === 'collection' && (
				<Modal
					close={() => {
						setShowModal(null)
					}}
					closeOnBgClick={true}
					closeOnEscape={true}
				>
					<div className="w-full max-w-md p-4 m-auto bg-dark-primary-2 rounded-md overflow-hidden">
						<div className="m-auto">
							<label className="mb-4 block text-white text-2xl font-bold">
								{localeLn('AddCollectionToPublication')}
							</label>
							<input
								type="text"
								name="video"
								onChange={(e) => setSearchCollection(e.target.value)}
								value={searchCollection}
								className={`resize-none h-auto focus:border-gray-100 mb-4 text-black`}
								placeholder="Url of the Collection"
							/>
							<p className="text-gray-300 text-sm italic">
								Please input the link of your collection
							</p>
							<p className="text-gray-300 text-sm italic">https://paras.id/collection/paradigm</p>
							<button
								className="font-semibold mt-4 py-3 w-full rounded-md bg-primary text-white"
								disabled={!searchCollection}
								onClick={getDataFromCollectionId}
							>
								{localeLn('AddCollection')}
							</button>
						</div>
					</div>
				</Modal>
			)}
			{showModal === 'final' && (
				<Modal close={() => setShowModal(null)} closeOnBgClick={false} closeOnEscape={false}>
					<div className="w-full max-h-screen max-w-3xl p-4 m-auto bg-dark-primary-2 rounded-md overflow-hidden overflow-y-auto">
						<div className="flex justify-between">
							<h1 className="mb-4 block text-white text-2xl font-bold">
								{isEdit ? 'Edit Publication' : 'Preview Publication'}
							</h1>
							<div onClick={() => setShowModal(null)}>
								<IconX size={24} className="cursor-pointer" />
							</div>
						</div>
						<div className="flex flex-col md:flex-row -mx-2">
							<div className="w-full md:w-1/2 px-2">
								<h1 className="mb-2 block text-white text-md font-medium">
									{localeLn('Thumbnail')}
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
													{localeLn('UpdateThumbnail3MB')}
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
								<h1 className="mb-2 block text-white text-md font-medium">{localeLn('Title')}</h1>
								<input
									type="text"
									name="Title"
									disabled={true}
									value={title.getCurrentContent().getPlainText()}
									className={`resize-none h-auto focus:border-gray-100`}
									placeholder="Preview Title"
								/>
								<h1 className="mt-3 mb-2 block text-white text-md font-medium">
									{localeLn('Description')}
								</h1>
								<textarea
									type="text"
									name="SubTitle"
									onChange={(e) => setSubTitle(e.target.value)}
									value={subTitle}
									className={`resize-none focus:border-gray-100 h-24`}
									placeholder="Preview Description"
								/>
								<div className="flex gap-4">
									<button
										className="font-semibold mt-3 py-3 w-40 rounded-md bg-primary text-white"
										disabled={isSubmitting}
										onClick={postPublication}
									>
										{isSubmitting ? 'Publishing...' : 'Publish'}
									</button>
									{!isPubDetail && (
										<button
											className="font-semibold mt-3 py-3 w-40 rounded-md border-2 border-white text-white"
											disabled={isDraftIn}
											onClick={saveDraft}
										>
											{isDraftIn ? 'Draft in...' : 'Draft'}
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</Modal>
			)}
			{showLeavingConfirmation && (
				<Modal close={() => setShowLeavingConfirmation(false)} closeOnBgClick closeOnEscape>
					<div className="w-full max-w-xs p-4 m-auto bg-gray-100 rounded-md overflow-y-auto max-h-screen">
						<div className="w-full">{localeLn('SureToLeavepage')}</div>
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
								{localeLn('Cancel')}
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
							{localeLn('OK')}
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
					showCollectionModal={showCollectionModal}
				/>
			</div>
			{embeddedCollections.length !== 0 && (
				<div className="max-w-4xl mx-auto px-4 pt-16">
					<div className="rounded-md p-4 md:p-8">
						<h4 className="text-white font-semibold text-3xl mb-4 text-center">
							{pubDetail?.isComic ? 'Comics' : localeLn('Collections')}
						</h4>
						<div
							className={`md:flex md:flex-wrap ${
								embeddedCollections.length <= 3 && 'justify-center'
							}`}
						>
							{embeddedCollections.map((coll, key) => (
								<div key={key} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-4">
									<CollectionPublication
										localCollection={coll}
										onDelete={() => {
											const temp = embeddedCollections.filter(
												(x) => x.collection_id != coll.collection_id
											)
											setEmbeddedCollections(temp)
										}}
										pubDetail={pubDetail}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
			{embeddedCards.length !== 0 && (
				<div className="max-w-4xl mx-auto px-4 pt-16">
					<div className=" border-2 border-dashed border-gray-800 rounded-md p-4 md:p-8">
						<h4 className="text-white font-semibold text-3xl mb-4 text-center">
							{localeLn('CardCollectibles')}
						</h4>
						<div
							className={`md:flex md:flex-wrap ${embeddedCards.length <= 3 && 'justify-center'}`}
						>
							{embeddedCards.map((card) => (
								<div key={card._id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-8">
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
			<div className="flex items-center max-w-3xl mx-auto px-4 pt-8">
				<button
					className="font-semibold py-3 w-32 rounded-md bg-primary text-white"
					onClick={onPressContinue}
					disabled={title === '' || !content.getCurrentContent().hasText()}
				>
					{localeLn('Continue')}
				</button>
				<DraftPublication onCreatePublication />
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
	const { localeLn } = useIntl()
	return (
		<Fragment>
			<div className="w-full m-auto">
				<Card
					imgUrl={parseImgUrl(localToken.metadata.media, null, {
						width: `600`,
						useOriginal: process.env.APP_ENV === 'production' ? false : true,
						isMediaCdn: localToken.isMediaCdn,
					})}
					imgBlur={localToken.metadata.blurhash}
					token={{
						title: localToken.metadata.title,
						collection: localToken.metadata.collection || localToken.contract_id,
						copies: localToken.metadata.copies,
						creatorId: localToken.metadata.creator_id || localToken.contract_id,
						is_creator: localToken.is_creator,
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
				<p className="opacity-75 truncate">{localToken?.metadata?.collection}</p>
			</div>
			<div className="text-red-600 text-sm cursor-pointer" onClick={deleteCard}>
				{localeLn('Delete')}
			</div>
		</Fragment>
	)
}

const CollectionPublication = ({ localCollection, onDelete, pubDetail }) => {
	const { localeLn } = useIntl()
	return (
		<div className="flex flex-col">
			<div className="w-full h-full rounded">
				{pubDetail?.isComic ? (
					<div
						className="mx-auto w-52 h-72 lg:w-56 lg:h-80 flex-none bg-no-repeat bg-center bg-cover shadow-xl"
						style={{
							backgroundImage: `url(${parseImgUrl(
								localCollection?.media
							)}?w=800&auto=format,compress)`,
						}}
					/>
				) : (
					<img
						className="object-cover w-full md:h-56 h-full transform ease-in-out duration-200 hover:opacity-80 rounded-xl"
						src={parseImgUrl(
							localCollection?.media ||
								`data:image/svg+xml;utf8,${generateFromString(localCollection?.collection_id)}`,
							null,
							{
								width: `600`,
								useOriginal: process.env.APP_ENV === 'production' ? false : true,
							}
						)}
					/>
				)}
			</div>
			<a
				href={`/collection/${localCollection?.collection_id}`}
				className="cursor-pointer"
				target={`_blank`}
			>
				<p
					title={pubDetail?.isComic ? localCollection?.title : localCollection?.collection}
					className="text-2xl font-bold truncate hover:underline text-white mt-4"
				>
					{pubDetail?.isComic ? localCollection?.title : localCollection?.collection}
				</p>
			</a>
			<div className="flex flex-row flex-wrap text-sm text-gray-400 items-center w-full">
				<span className="mr-1">collection by</span>
				<span className="truncate font-semibold">
					{pubDetail?.isComic ? localCollection?.author_ids[0] : localCollection?.creator_id}
				</span>
			</div>
			<div className="text-red-600 text-sm cursor-pointer mt-2" onClick={onDelete}>
				{localeLn('Delete')}
			</div>
		</div>
	)
}

export default PublicationEditor
