import axios from 'axios'
import Avatar from 'components/Common/Avatar'
import Modal from 'components/Common/Modal'
import { IconX } from 'components/Icons'
import { useToast } from 'hooks/useToast'
import WalletHelper from 'lib/WalletHelper'
import { parseImgUrl } from 'utils/common'
import { flagColor, flagText } from 'constants/flag'
import { useIntl } from 'hooks/useIntl'
import Scrollbars from 'react-custom-scrollbars'

const ActionFollowModal = ({
	show,
	data,
	currentUser,
	onClose,
	type,
	fetchDataAction = () => {},
	fetchDataUdate = () => {},
}) => {
	const toast = useToast()
	const { localeLn } = useIntl()

	const actionUnfollow = async (type) => {
		const options = {
			url: `${process.env.V2_API_URL}/${type === 'follow' ? 'follow' : 'unfollow'}`,
			method: 'PUT',
			headers: {
				authorization: await WalletHelper.authToken(),
			},
			params: {
				account_id: currentUser,
				following_account_id: data.account_id,
			},
		}
		try {
			const resp = await axios.request(options)
			if (resp) {
				if (resp) {
					toast.show({
						text: (
							<div className="font-semibold text-center text-sm">
								Successfully {type === 'follow' ? 'Followed' : 'Unfollowed'}
							</div>
						),
						type: 'success',
						duration: 1000,
					})
					fetchDataAction()
					fetchDataUdate()
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
			fetchDataUdate()
			onClose()
		}
	}

	return (
		<Modal isShow={show} closeOnBgClick={true} closeOnEscape={true} close={onClose}>
			<div className="max-w-sm pt-4 w-full bg-dark-primary-2 m-auto rounded-md relative">
				<div className="absolute right-0 top-0 pr-4 pt-4 z-50">
					<div className="cursor-pointer" onClick={onClose}>
						<IconX />
					</div>
				</div>
				<Scrollbars autoHeight autoHeightMin="50vh">
					<div>
						<div className="px-8 mt-8 text-center text-white">
							<div>
								<a>
									<Avatar size="xxl" src={parseImgUrl(data?.imgUrl)} className="align-bottom" />
								</a>
							</div>
							{data?.flag && (
								<div>
									<p
										className={`text-white text-xs mt-2 p-1 rounded-md font-bold w-full mx-auto text-center max-w-2xl ${
											flagColor[data?.flag]
										}`}
									>
										{localeLn(flagText[data?.flag])}
									</p>
								</div>
							)}
							<p className={`text-sm ${data?.flag ? 'mt-2' : 'mt-10'}`}>
								{type === 'follow'
									? `Are you sure you want to follow ${data?.account_id} ?`
									: `If you change your mind, you'll have to request to follow ${data?.account_id} again.`}
							</p>
						</div>
						<div className="absolute inset-x-0 bottom-0">
							<hr />
							<div
								className={`${
									type === 'follow' ? 'text-[#1B4FA7]' : 'text-red-500'
								} text-center my-3 cursor-pointer hover:text-opacity-80`}
								onClick={() => actionUnfollow(type)}
							>
								{type === 'follow' ? 'Follow' : 'Unfollow'}
							</div>
							<hr />
							<div
								className="text-white text-center my-3 cursor-pointer hover:text-opacity-80"
								onClick={onClose}
							>
								Cancel
							</div>
						</div>
					</div>
				</Scrollbars>
			</div>
		</Modal>
	)
}

export default ActionFollowModal
