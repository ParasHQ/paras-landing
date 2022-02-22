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
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'

const CreateCollection = ({ onFinishCreate }) => {
	const { localeLn } = useIntl()
	const [showImgCrop, setShowImgCrop] = useState(false)
	const [showCoverCrop, setShowCoverCrop] = useState(false)
	const [imgFile, setImgFile] = useState({})
	const [coverFile, setCoverFile] = useState({})
	const [imgUrl, setImgUrl] = useState('')
	const [coverUrl, setCoverUrl] = useState('')

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

	const _setCover = async (e) => {
		if (e.target.files[0]) {
			setCoverFile(e.target.files[0])
			setShowCoverCrop(true)
		}
	}

	const _submit = async (e) => {
		e.preventDefault()

		setIsSubmitting(true)

		const formData = new FormData()
		if (imgFile) {
			formData.append('files', imgFile)
		}
		if (coverFile) {
			formData.append('files', coverFile)
		}
		formData.append('collection', collectionName)
		formData.append('description', collectionDesc)
		formData.append('creator_id', currentUser)

		try {
			const resp = await Axios.post(`${process.env.V2_API_URL}/collections`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					authorization: await near.authToken(),
				},
			})
			if (resp) {
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							{localeLn('CreateCollectionSuccess')}
						</div>
					),
					type: 'success',
					duration: 2500,
				})
				onFinishCreate
					? onFinishCreate(resp.data.data.collection)
					: onFinishDefault(resp.data.data.collection.collection_id)
			}
		} catch (err) {
			sentryCaptureException(err)
			const msg = err.response?.data?.message || 'Something went wrong, try again later.'
			toast.show({
				text: <div className="font-semibold text-center text-sm">{msg}</div>,
				type: 'error',
				duration: 2500,
			})
		}

		setIsSubmitting(false)
	}

	const onFinishDefault = (collectionId) => {
		setTimeout(() => {
			router.push(`/collection/${collectionId}`)
		}, 2500)
	}

	return (
		<>
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
			{showCoverCrop && (
				<ImgCrop
					input={coverFile}
					size={{
						width: 1024,
						height: 384,
					}}
					left={() => setShowCoverCrop(false)}
					right={(res) => {
						setCoverUrl(res.payload.imgUrl)
						setCoverFile(res.payload.imgFile)
						setShowCoverCrop(false)
					}}
				/>
			)}
			<div className="relative max-w-3xl m-auto p-4">
				<div className="text-white font-bold text-4xl">{localeLn('NavCreateCollection')}</div>
				<div className="md:flex gap-8">
					<div>
						<div className="text-white mt-4">{localeLn('Logo')}</div>
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
					</div>
					<div>
						<div className="text-white mt-4">{localeLn('Cover')}</div>
						<div className="relative cursor-pointer w-64 h-32 overflow-hidden rounded-md mt-2">
							<input
								className="cursor-pointer w-full opacity-0 absolute inset-0"
								type="file"
								accept="image/*"
								onChange={_setCover}
								onClick={(e) => {
									e.target.value = null
								}}
							/>
							<div className="flex items-center justify-center">
								<div className="w-64 h-32 overflow-hidden bg-primary shadow-inner">
									<img
										src={parseImgUrl(coverUrl, null, {
											width: `300`,
										})}
										className={`w-full ${coverUrl && 'h-full'} object-cover`}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="text-white mt-4">{localeLn('Name')}</div>
				<InputText
					type="text"
					value={collectionName}
					onChange={(e) => setCollectionName(e.target.value)}
					className="mt-2 focus:border-gray-800 focus:bg-white focus:bg-opacity-10"
					placeholder="Pillars of Paras"
				/>
				<div className="text-white mt-4">{localeLn('Description')}</div>
				<InputTextarea
					value={collectionDesc}
					onChange={(e) => setCollectionDesc(e.target.value)}
					className="mt-2 resize-none h-24 focus:border-gray-800 focus:bg-white focus:bg-opacity-10"
				/>
				<Button
					isDisabled={
						isSubmitting || imgUrl === '' || collectionName === '' || collectionDesc === ''
					}
					className="mt-8"
					onClick={_submit}
				>
					{isSubmitting ? localeLn('CreatingLoading') : localeLn('Create')}
				</Button>
			</div>
		</>
	)
}

export default CreateCollection
