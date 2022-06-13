import axios from 'axios'
import Avatar from 'components/Common/Avatar'
import Modal from 'components/Common/Modal'
import { IconX } from 'components/Icons'
import { useToast } from 'hooks/useToast'
import { parseImgUrl } from 'utils/common'

const ActionFollowModal = ({ show, data, onClose, fetchDataAction = () => {} }) => {
	const toast = useToast()

	const actionUnfollow = async () => {
		const options = {
			url: `https://629fb1fd461f8173e4ef3a60.mockapi.io/api/v1/followings/${data.id}`,
			method: 'DELETE',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		}
		try {
			const resp = await axios.request(options)
			if (resp) {
				if (resp) {
					toast.show({
						text: <div className="font-semibold text-center text-sm">successfully unfollowed</div>,
						type: 'success',
						duration: 1000,
					})
					fetchDataAction()
					onClose()
				}
			}
		} catch (err) {
			const msg = err.response?.data?.message || 'Something went wrong, try again later.'
			toast.show({
				text: <div className="font-semibold text-center text-sm">{msg}</div>,
				type: 'error',
				duration: 1000,
			})
			fetchDataAction()
			onClose()
		}
	}
	return (
		<Modal isShow={show} closeOnBgClick={true} closeOnEscape={true} close={onClose}>
			<div className="max-w-sm pt-4 w-full bg-dark-primary-2 m-auto rounded-md relative">
				<div className="absolute right-0 top-0 pr-4 pt-4">
					<div className="cursor-pointer" onClick={onClose}>
						<IconX />
					</div>
				</div>
				<div className="px-8 mt-8 text-center text-white">
					<div className="ml-1 md:ml-2">
						<a>
							<Avatar size="xxl" src={parseImgUrl(data?.imgUrl)} className="align-bottom" />
						</a>
					</div>
					<p className="text-sm my-8">
						If you change your mind, you{`'`}ll have to request to follow {data.accountId} again.
					</p>
				</div>
				<hr />
				<div
					className="text-red-500 text-center my-3 cursor-pointer hover:text-opacity-80"
					onClick={() => actionUnfollow()}
				>
					Unfollow
				</div>
				<hr />
				<div
					className="text-white text-center my-3 cursor-pointer hover:text-opacity-80"
					onClick={onClose}
				>
					Cancel
				</div>
			</div>
		</Modal>
	)
}

export default ActionFollowModal
