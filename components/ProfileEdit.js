import axios from 'axios'
import { useState } from 'react'
import near from '../lib/near'
import useStore from '../store'
import { parseImgUrl } from '../utils/common'
import ImgCrop from './ImgCrop'

const ProfileEdit = ({ close }) => {
	const store = useStore()
	const [showImgCrop, setShowImgCrop] = useState(false)
	const [imgFile, setImgFile] = useState({})
	const [imgUrl, setImgUrl] = useState(store.userProfile.imgUrl || '')

	const [bio, setBio] = useState(store.userProfile.bio || '')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const _submit = async (e) => {
		e.preventDefault()

		setIsSubmitting(true)

		const formData = new FormData()
		if (imgFile) {
			formData.append('file', imgFile)
		}
		formData.append('bio', bio)
		formData.append('accountId', store.currentUser)

		try {
			const resp = await axios.put(`${process.env.API_URL}/profiles`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'authorization': await near.authToken()
				},
			})
			store.setUserProfile(resp.data.data)
			close()
		} catch (err) {
			console.log(err)
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
					left={(_) => setShowImgCrop(false)}
					right={(res) => {
						setImgUrl(res.payload.imgUrl)
						setImgFile(res.payload.imgFile)
						setShowImgCrop(false)
					}}
				/>
			)}
			<div className="m-auto">
				<h1 className="text-2xl font-bold text-gray-900 tracking-tight">
					Edit Profile
				</h1>
				<div className="mt-4 mx-auto relative cursor-pointer w-32 h-32 rounded-full overflow-hidden">
					<input
						className="cursor-pointer w-full opacity-0 absolute inset-0"
						type="file"
						accept="image/*"
						onChange={_setImg}
					/>
					<div className="flex items-center justify-center">
						<div className="w-32 h-32 rounded-full bg-primary">
							<img src={parseImgUrl(imgUrl)} className="w-full object-cover" />
						</div>
					</div>
				</div>
				<div className="mt-4">
					<label className="block text-sm">Bio</label>
					<textarea
						type="text"
						name="description"
						value={bio}
						onChange={(e) => setBio(e.target.value)}
						className={`resize-none h-24`}
						placeholder="Tell us about yourself"
					></textarea>
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
						className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary text-primary"
						onClick={close}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	)
}

export default ProfileEdit
