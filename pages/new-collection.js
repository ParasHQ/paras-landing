import Head from 'next/head'
import Footer from 'components/Footer'
import Nav from 'components/Nav'
import { InputText, InputTextarea } from 'components/Common/form'
import Button from 'components/Common/Button'
import { parseImgUrl } from 'utils/common'
import { useState } from 'react'
import ImgCrop from 'components/ImgCrop'
import useStore from 'lib/store'
import Axios from 'axios'
import near from 'lib/near'
import { useToast } from 'hooks/useToast'
import { useRouter } from 'next/router'

const NewCollection = () => {
	const [showImgCrop, setShowImgCrop] = useState(false)
	const [imgFile, setImgFile] = useState({})
	const [imgUrl, setImgUrl] = useState('')

	const [collectionName, setCollectionName] = useState('')
	const [collectionDesc, setCollectionDesc] = useState('')

	const [isSubmitting, setIsSubmitting] = useState(false)

	const toast = useToast()
	const currentUser = useStore((state) => state.currentUser)
	const router = useRouter()

	const _setImg = async (e) => {
		if (e.target.files[0]) {
			setImgFile(e.target.files[0])
			setShowImgCrop(true)
		}
	}

	const _submit = async (e) => {
		e.preventDefault()

		setIsSubmitting(true)

		const formData = new FormData()
		if (imgFile) {
			formData.append('file', imgFile)
		}
		formData.append('collection', collectionName)
		formData.append('description', collectionDesc)
		formData.append('creator_id', currentUser)

		try {
			const resp = await Axios.post(
				`${process.env.V2_API_URL}/collections`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						authorization: await near.authToken(),
					},
				}
			)
			if (resp) {
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							Create collection success
						</div>
					),
					type: 'success',
					duration: 2500,
				})
				setTimeout(() => {
					router.push(`/collection/${resp.data.data.collection.collection_id}`)
				}, 2500)
			}
		} catch (err) {
			const msg =
				err.response?.data?.message || 'Something went wrong, try again later.'
			toast.show({
				text: <div className="font-semibold text-center text-sm">{msg}</div>,
				type: 'error',
				duration: 2500,
			})
		}

		setIsSubmitting(false)
	}

	return (
		<div className="min-h-screen bg-black">
			<div
				className="fixed inset-0 opacity-75"
				style={{
					zIndex: 0,
					backgroundImage: `url('/bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			></div>
			<Head>
				<title>Create New Collection — Paras</title>
				<meta
					name="description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>

				<meta name="twitter:title" content="Market — Paras" />
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
				<meta property="og:title" content="Market — Paras" />
				<meta property="og:site_name" content="Market — Paras" />
				<meta
					property="og:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>
			<Nav />
			{showImgCrop && (
				<ImgCrop
					input={imgFile}
					size={{
						width: 512,
						height: 512,
					}}
					left={() => setShowImgCrop(false)}
					right={(res) => {
						setImgUrl(res.payload.imgUrl)
						setImgFile(res.payload.imgFile)
						setShowImgCrop(false)
					}}
				/>
			)}
			<div className="relative max-w-3xl m-auto py-12 px-4">
				<div className="text-white font-bold text-4xl">Create collection</div>
				<div className="text-white mt-4">Logo</div>
				<div className="relative cursor-pointer w-32 h-32 overflow-hidden rounded-md mt-2">
					<input
						className="cursor-pointer w-full opacity-0 absolute inset-0"
						type="file"
						accept="image/*"
						onChange={_setImg}
						onClick={(e) => {
							e.target.value = null
						}}
					/>
					<div className="flex items-center justify-center">
						<div className="w-32 h-32 overflow-hidden bg-primary shadow-inner">
							<img
								src={parseImgUrl(imgUrl, null, {
									width: `300`,
								})}
								className="w-full object-cover"
							/>
						</div>
					</div>
				</div>
				<div className="text-white mt-4">Name</div>
				<InputText
					type="text"
					value={collectionName}
					onChange={(e) => setCollectionName(e.target.value)}
					className="mt-2 focus:border-gray-800 focus:bg-white focus:bg-opacity-10"
					placeholder="Pillars of Paras"
				/>
				<div className="text-white mt-4">Description</div>
				<InputTextarea
					value={collectionDesc}
					onChange={(e) => setCollectionDesc(e.target.value)}
					className="mt-2 resize-none h-24 focus:border-gray-800 focus:bg-white focus:bg-opacity-10"
				/>
				<Button
					isDisabled={
						isSubmitting ||
						imgUrl === '' ||
						collectionName === '' ||
						collectionDesc === ''
					}
					className="mt-8"
					onClick={_submit}
				>
					<div className="text-white">Create</div>
				</Button>
			</div>
			<Footer />
		</div>
	)
}

export default NewCollection
