import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import { useIntl } from 'hooks/useIntl'

const CancelBid = ({ show, onClose, onDelete }) => {
	const { localeLn } = useIntl()

	return (
		<Modal isShow={show} close={onClose} closeOnBgClick={false} closeOnEscape={false}>
			<div className="w-full max-w-xs p-4 m-auto bg-gray-800 text-white rounded-md overflow-y-auto max-h-screen">
				<div className="w-full mb-4">{localeLn('Are you sure to delete your bids?')}</div>
				<div className="flex space-x-4">
					<Button size="md" isFullWidth onClick={onDelete}>
						{'Delete'}
					</Button>
					<Button size="md" isFullWidth variant="ghost" onClick={onClose}>
						{localeLn('Cancel')}
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export default CancelBid
