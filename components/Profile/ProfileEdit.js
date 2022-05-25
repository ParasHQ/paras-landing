import axios from 'axios'
import { sentryCaptureException } from 'lib/sentry'
import { useState } from 'react'
import { useIntl } from 'hooks/useIntl'
import useStore from 'lib/store'
import { useToast } from 'hooks/useToast'
import { checkSocialMediaUrl, checkUrl, parseImgUrl } from 'utils/common'
import ImgCrop from 'components/ImgCrop'
import Scrollbars from 'react-custom-scrollbars'
import WalletHelper from 'lib/WalletHelper'

const ProfileEdit = ({ close }) => {
	const { localeLn } = useIntl()
	const store = useStore()
	const toast = useToast()
	const [coverFile, setCoverFile] = useState()
	const [coverUrl, setCoverUrl] = useState(store.userProfile.coverUrl || '')
	const [showImgCrop, setShowImgCrop] = useState(false)
	const [imgFile, setImgFile] = useState()
	const [imgUrl, setImgUrl] = useState(store.userProfile.imgUrl || '')

	const [bio, setBio] = useState(store.userProfile.bio || '')
	const [website, setWebsite] = useState(store.userProfile.website || '')
	const [weibo, setWeibo] = useState(store.userProfile.weiboUrl || '')
	const [instagram, setInstagram] = useState(store.userProfile.instagramId || '')
	const [twitter, setTwitter] = useState(store.userProfile.twitterId || '')
	const [showCoverCrop, setShowCoverCrop] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const _submit = async (e) => {
		e.preventDefault()

		setIsSubmitting(true)

		if (website && !checkUrl(website)) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">{localeLn('EnterValidWebsite')}</div>
				),
				type: 'error',
				duration: 2500,
			})
			setIsSubmitting(false)
			return
		}

		if (weibo && (!checkUrl(weibo) || !weibo.includes('weibo.com'))) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{localeLn('Please enter valid weibo url')}
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			setIsSubmitting(false)
			return
		}

		if (instagram && checkSocialMediaUrl(instagram)) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{localeLn('Please enter only your instagram username')}
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			setIsSubmitting(false)
			return
		}

		if (twitter && checkSocialMediaUrl(twitter)) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{localeLn('Please enter only your twitter username')}
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			setIsSubmitting(false)
			return
		}

		const formData = new FormData()
		if (imgFile) {
			formData.append('files', imgFile, 'logo')
		}
		if (coverFile) {
			formData.append('files', coverFile, 'cover')
		}
		formData.append('bio', bio)
		formData.append('website', website)
		formData.append('weiboUrl', weibo)
		formData.append('accountId', store.currentUser)
		formData.append('twitterId', twitter)
		formData.append('instagramId', instagram)

		try {
			const resp = await axios.put(`${process.env.V2_API_URL}/profiles`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					authorization: await WalletHelper.authToken(),
				},
			})
			store.setUserProfile(resp.data.data)
			close()
		} catch (err) {
			sentryCaptureException(err)
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">{localeLn('SomethingWentWrong')}</div>
				),
				type: 'error',
				duration: 2500,
			})
		}

		setIsSubmitting(false)
	}

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

	return (
		<div>
			<Scrollbars autoHeight autoHeightMax="85vh">
				{showImgCrop && (
					<ImgCrop
						input={imgFile}
						size={{
							width: 512,
							height: 512,
						}}
						type="circle"
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
							width: 1152,
							height: 288,
						}}
						left={() => setShowCoverCrop(false)}
						right={(res) => {
							setCoverUrl(res.payload.imgUrl)
							setCoverFile(res.payload.imgFile)
							setShowCoverCrop(false)
						}}
					/>
				)}
				<div className="m-auto">
					<h1 className="text-2xl font-bold text-gray-100 tracking-tight">
						{localeLn('Edit Profile')}
					</h1>
					<div className="relative cursor-pointer w-full h-32 overflow-hidden rounded-md mt-2">
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
							<div className="w-full h-32 overflow-hidden bg-primary shadow-inner">
								<img
									src={parseImgUrl(coverUrl, null, {
										width: `300`,
									})}
									className={`w-full ${coverUrl && 'h-full'} object-cover`}
								/>
							</div>
						</div>
					</div>
					<div className="absolute top-28 inset-x-0 mt-4 mx-auto cursor-pointer w-20 h-20 rounded-full overflow-hidden border-4 border-dark-primary-2">
						<div>
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
								<div className="w-20 h-20 rounded-full overflow-hidden bg-primary shadow-inner">
									<img
										src={parseImgUrl(imgUrl, null, {
											width: `300`,
										})}
										className="w-full rounded-full object-cover"
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-12">
						<label className="block text-sm text-gray-100">{localeLn('Bio')}</label>
						<textarea
							type="text"
							name="description"
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							className={`resize-none h-24 focus:border-gray-100`}
							placeholder="Tell us about yourself"
						></textarea>
					</div>
					<div className="mt-2">
						<label className="block text-sm text-gray-100">{localeLn('Website')}</label>
						<input
							type="text"
							name="website"
							value={website}
							onChange={(e) => setWebsite(e.target.value)}
							className="focus:border-gray-100"
							placeholder="Website"
						/>
					</div>
					<div className="mt-2">
						<label className="block text-sm text-gray-100">{localeLn('Weibo')}</label>
						<input
							type="text"
							name="weibo"
							value={weibo}
							onChange={(e) => setWeibo(e.target.value)}
							className="focus:border-gray-100"
							placeholder="Weibo URL"
						/>
					</div>
					<div className="my-2 flex space-x-4">
						<div>
							<label className="block text-sm text-gray-100">{localeLn('Instagram')}</label>
							<input
								type="text"
								name="instagram"
								value={instagram}
								onChange={(e) => setInstagram(e.target.value)}
								className="focus:border-gray-100"
								placeholder="Username"
							/>
						</div>
						<div>
							<label className="block text-sm text-gray-100">{localeLn('Twitter')}</label>
							<input
								type="text"
								name="twitter"
								value={twitter}
								onChange={(e) => setTwitter(e.target.value)}
								className="focus:border-gray-100"
								placeholder="Username"
							/>
						</div>
					</div>
					<div className="">
						<button
							disabled={isSubmitting}
							className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
							onClick={_submit}
						>
							{!isSubmitting ? 'Save' : 'Saving...'}
						</button>
						<button
							className="w-full outline-none h-12 mt-4 rounded-md bg-gray-100 text-sm font-semibold border-2 px-4 py-2 text-primary"
							onClick={close}
						>
							{localeLn('Cancel')}
						</button>
					</div>
				</div>
			</Scrollbars>
		</div>
	)
}

export default ProfileEdit
