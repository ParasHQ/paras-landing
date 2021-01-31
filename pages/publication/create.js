import Head from 'next/head'
import { useState } from 'react'
import axios from 'axios'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { useRouter } from 'next/router'

import near from '../../lib/near'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import TextEditor from '../../components/TextEditor'
import Modal from '../../components/Modal'
import Card from '../../components/Card'
import { dataURLtoFile, parseImgUrl, readFileAsUrl } from '../../utils/common'
import { useToast } from '../../hooks/useToast'

const Publication = () => {
	const toast = useToast()
	const router = useRouter()

	const [title, setTitle] = useState(defaultValueEditor)
	const [subTitle, setSubTitle] = useState('')
	const [thumbnail, setThumbnail] = useState(null)
	const [content, setContent] = useState(defaultValueEditor)
	const [showAlertErr, setShowAlertErr] = useState(false)
	const [embeddedCards, setEmbeddedCards] = useState([])

	const [showModal, setShowModal] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [searchToken, setSearchToken] = useState('')

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
			setShowAlertErr('Thumbnail must not empty')
			return
		}
		if (!subTitle) {
			setShowAlertErr('Description must not empty')
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
			await axios.post(`${process.env.API_URL}/publications`, data, {
				headers: {
					authorization: await near.authToken(),
				},
			})
			setTimeout(() => {
				router.push('/publication/community')
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
			const file = dataURLtoFile(entityMap[key].data.src, key)
			formData.append('files', file, key)
		}

		const resp = await axios.post(`${process.env.API_URL}/uploads`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				authorization: await near.authToken(),
			},
		})

		for (let key in entityMap) {
			entityMap[key].data.src = resp.data.data[key]
		}

		return entityMap
	}

	const uploadThumbnail = async () => {
		const [protocol, path] = thumbnail.split('://')
		if (protocol === 'ipfs') {
			return
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
			setThumbnail(await readFileAsUrl(e.target.files[0]))
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
		<div
			className="min-h-screen bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Head>
				<title>Publication — Paras</title>
				<meta
					name="description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta name="twitter:title" content="Paras — Digital Art Cards Market" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Paras — Digital Art Cards Market" />
				<meta
					property="og:site_name"
					content="Paras — Digital Art Cards Market"
				/>
				<meta
					property="og:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta charSet="utf-8" />
			</Head>
			<Nav />
			<div className="y-16 mx-auto max-w-3xl">
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
						<div className="max-w-lg p-4 m-auto bg-dark-primary-2 rounded-md overflow-hidden">
							<h1 className="mb-4 block text-white text-2xl font-bold">
								Publication preview
							</h1>
							<h1 className="mb-2 block text-white text-md font-medium">
								Thumbnail
							</h1>
							<div className="bg-black h-64 mb-4 overflow-hidden relative">
								<input
									className="cursor-pointer w-full opacity-0 absolute inset-0"
									type="file"
									accept="image/*"
									onChange={updateThumbnail}
								/>
								<img className="w-full object-cover m-auto" src={thumbnail} />
							</div>
							<h1 className="mb-2 block text-white text-md font-medium">
								Title
							</h1>
							<input
								type="text"
								name="Title"
								disabled={true}
								value={title.getCurrentContent().getPlainText()}
								className={`resize-none h-auto focus:border-gray-100 mb-4`}
								placeholder="Preview Title"
							/>
							<h1 className="mb-2 block text-white text-md font-medium">
								Description
							</h1>
							<textarea
								type="text"
								name="SubTitle"
								onChange={(e) => setSubTitle(e.target.value)}
								value={subTitle}
								className={`resize-none focus:border-gray-100 mb-4 h-24`}
								placeholder="Preview SubTitle"
							/>
							<button
								className="font-semibold mt-4 py-3 w-40 rounded-md bg-primary text-white"
								onClick={postPublication}
							>
								{isSubmitting ? 'Publishing...' : 'Publish now'}
							</button>
						</div>
					</Modal>
				)}
				{showAlertErr && (
					<Modal close={(_) => setShowAlertErr(false)}>
						<div className="w-full max-w-xs p-4 m-auto bg-gray-100 rounded-md overflow-y-auto max-h-screen">
							<div>
								<div className="w-full">{showAlertErr}</div>
								<div>
									<button
										className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
										onClick={(_) => setShowAlertErr(false)}
									>
										OK
									</button>
								</div>
							</div>
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
			<Footer />
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

const CardPublication = ({ localToken, deleteCard }) => {
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
				<div className>
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

export default Publication
