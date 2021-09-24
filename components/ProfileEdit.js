import axios from 'axios'
import { useState } from 'react'
import { strings } from 'utils/strings'
import { useToast } from '../hooks/useToast'
import near from '../lib/near'
import useStore from '../lib/store'
import { checkUrl, parseImgUrl } from '../utils/common'
import ImgCrop from './ImgCrop'

const ProfileEdit = ({ close }) => {
	const store = useStore()
	const toast = useToast()
	const [showImgCrop, setShowImgCrop] = useState(false)
	const [imgFile, setImgFile] = useState({})
	const [imgUrl, setImgUrl] = useState(store.userProfile.imgUrl || '')

	const [bio, setBio] = useState(store.userProfile.bio || '')
	const [website, setWebsite] = useState(store.userProfile.website || '')
	const [instagram, setInstagram] = useState(
		store.userProfile.instagramId || ''
	)
	const [twitter, setTwitter] = useState(store.userProfile.twitterId || '')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const _submit = async (e) => {
		e.preventDefault()

		setIsSubmitting(true)

		if (website && !checkUrl(website)) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{strings.HEADER.USER.EDIT_PROFILE.STATUS_MESSAGE.VALID_WEBSITE}
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
			formData.append('file', imgFile)
		}
		formData.append('bio', bio)
		formData.append('website', website)
		formData.append('accountId', store.currentUser)
		formData.append('twitterId', twitter)
		formData.append('instagramId', instagram)

		try {
			const resp = await axios.put(
				`${process.env.V2_API_URL}/profiles`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						authorization: await near.authToken(),
					},
				}
			)
			store.setUserProfile(resp.data.data)
			close()
		} catch (err) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{strings.HEADER.USER.EDIT_PROFILE.STATUS_MESSAGE.WENT_WRONG}
					</div>
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

	return (
		<div>
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
			<div className="m-auto">
				<h1 className="text-2xl font-bold text-gray-100 tracking-tight">
					{strings.HEADER.EDIT_PROFILE.HEADING}
				</h1>
				<div className="mt-4 mx-auto relative cursor-pointer w-32 h-32 rounded-full overflow-hidden">
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
						<div className="w-32 h-32 rounded-full overflow-hidden bg-primary shadow-inner">
							<img
								src={parseImgUrl(imgUrl, null, {
									width: `300`,
								})}
								className="w-full object-cover"
							/>
						</div>
					</div>
				</div>
				<div className="mt-4">
					<label className="block text-sm text-gray-100">Bio</label>
					<textarea
						type="text"
						name="description"
						value={bio}
						onChange={(e) => setBio(e.target.value)}
						className={`resize-none h-24 focus:border-gray-100`}
						placeholder={strings.HEADER.EDIT_PROFILE.ABOUT_PLACEHOLDER}
					></textarea>
				</div>
				<div className="mt-2">
					<label className="block text-sm text-gray-100">Website</label>
					<input
						type="text"
						name="website"
						value={website}
						onChange={(e) => setWebsite(e.target.value)}
						className={`resize-none h-auto focus:border-gray-100`}
						placeholder={strings.HEADER.EDIT_PROFILE.WEBSITE_PLACEHOLDER}
					/>
				</div>
				<div className="my-4 flex space-x-4">
					<div>
						<label className="block text-sm text-gray-100">Instagram</label>
						<input
							type="text"
							name="instagram"
							value={instagram}
							onChange={(e) => setInstagram(e.target.value)}
							className={`resize-none h-auto focus:border-gray-100`}
							placeholder={strings.HEADER.EDIT_PROFILE.USERNAME_PLACEHOLDER}
						/>
					</div>
					<div>
						<label className="block text-sm text-gray-100">Twitter</label>
						<input
							type="text"
							name="twitter"
							value={twitter}
							onChange={(e) => setTwitter(e.target.value)}
							className={`resize-none h-auto focus:border-gray-100`}
							placeholder={strings.HEADER.EDIT_PROFILE.USERNAME_PLACEHOLDER}
						/>
					</div>
				</div>
				<div className="">
					<button
						disabled={isSubmitting}
						className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
						onClick={_submit}
					>
						{!isSubmitting ? strings.SAVE : strings.SAVING}
					</button>
					<button
						className="w-full outline-none h-12 mt-4 rounded-md bg-gray-100 text-sm font-semibold border-2 px-4 py-2 text-primary"
						onClick={close}
					>
						{strings.HEADER.EDIT_PROFILE.CANCEL}
					</button>
				</div>
			</div>
		</div>
	)
}

export default ProfileEdit
