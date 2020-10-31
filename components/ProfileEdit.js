import { useState } from 'react'
import ImgCrop from './ImgCrop'
import Nav from './Nav'

const ProfileEdit = ({ close }) => {
	const [showImgCrop, setShowImgCrop] = useState(false)
	const [imgFile, setImgFile] = useState('')
	const [imgUrl, setImgUrl] = useState('')

	const [bio, setBio] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

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
				<div className="mx-auto relative cursor-pointer w-32 h-32 rounded-full overflow-hidden">
					<input
						className="cursor-pointer w-full opacity-0 absolute inset-0"
						type="file"
						accept="image/*"
						onChange={_setImg}
					/>
					<div className="flex items-center justify-center">
						<div className="w-32 h-32 rounded-full bg-primary">
							<img src={imgUrl} className="w-full object-cover" />
						</div>
					</div>
				</div>
				{/* <div className="mt-4">
					<label className="block text-sm">Name</label>
					<input
						type="text"
						name="name"
						placeholder="Card name"
					/>
					<div className="mt-2 text-sm text-red-500">
						{errors.name && 'Name is required'}
					</div>
				</div> */}
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
						className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-white"
						// onClick={_submit}
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
