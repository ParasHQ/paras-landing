import axios from 'axios'
import Avatar from 'components/Common/Avatar'
import Button from 'components/Common/Button'
import { InputTextarea } from 'components/Common/form'
import ImgCrop from 'components/Common/ImgCrop'
import Modal from 'components/Common/Modal'
import { IconXCircle } from 'components/Icons'
import IconCamera from 'components/Icons/component/IconCamera'
import { sentryCaptureException } from 'lib/sentry'
import useStore from 'lib/store'
import { useState } from 'react'
import { parseImgUrl } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
const EditProfileModal = ({ userData = {}, setUserData, active, onClose }) => {
	const { setCurrentUser } = useStore()
	const [showImgCrop, setShowImgCrop] = useState(false)
	const [imgFile, setImgFile] = useState(null)
	const [imgUrl, setImgUrl] = useState(userData.imgUrl || '')
	const { localeLn } = useIntl()
	const [bio, setBio] = useState(userData.bio || '')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const _submit = async (e) => {
		e.preventDefault()

		setIsSubmitting(true)

		const formData = new FormData()
		if (imgFile) {
			formData.append('file', imgFile)
		}
		formData.append('bio', bio)
		formData.append('website', userData.website)
		formData.append('accountId', userData.accountId)
		formData.append('twitterId', userData.twitterId)
		formData.append('instagramId', userData.instagramId)

		try {
			const resp = await axios.put(`${process.env.V2_API_URL}/profiles`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})

			setUserData(resp.data.data)
			setCurrentUser(resp.data.data)
		} catch (err) {
			sentryCaptureException(err)
		} finally {
			setIsSubmitting(false)
			onClose()
		}
	}

	const _setImg = async (e) => {
		if (e.target.files[0]) {
			setImgFile(e.target.files[0])
			setShowImgCrop(true)
		}
	}

	return (
		<Modal closeOnBgClick closeOnEscape isShow={active} close={onClose}>
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
			<div className="w-full relative max-w-md md:flex bg-gray-800 rounded-lg m-4 md:m-auto ">
				<div className="w-full p-4">
					<div className="mt-4 mx-auto relative cursor-pointer w-32 h-32 rounded-full">
						<input
							className="cursor-pointer w-full opacity-0 absolute inset-0 z-10"
							type="file"
							accept="image/*"
							onChange={_setImg}
							onClick={(e) => {
								e.target.value = null
							}}
						/>
						<div className="flex items-center justify-center relative">
							<Avatar
								size="xxl"
								src={parseImgUrl(imgUrl, null, {
									width: `300`,
								})}
								entityName={userData?.accountId}
								className="md:w-32 md:h-32"
							/>
							<div className="absolute right-0 bottom-0">
								<div className="mx-auto">
									<IconCamera size={32} />
								</div>
							</div>
						</div>
					</div>
					<div className="mt-4">
						<label className="block font-bold text-gray-100">{localeLn('Bio')}</label>
						<InputTextarea
							type="text"
							name="description"
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							className={`mt-2 resize-none h-24 focus:border-gray-100`}
							placeholder="Tell us about yourself"
						></InputTextarea>
					</div>
					<div className="mt-8">
						<Button className="w-full" isDisabled={isSubmitting} onClick={_submit}>
							{localeLn('Save')}
						</Button>
					</div>
				</div>
				<div className="absolute z-10 top-0 right-0 cursor-pointer" onClick={onClose}>
					<div className="-mt-4 -mr-4">
						<IconXCircle size={40} />
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default EditProfileModal
