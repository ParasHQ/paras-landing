import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'

const DisableMarketModal = ({ show, onClose }) => {
	return (
		<Modal isShow={show}>
			<div className="bg-gray-800 text-white m-auto p-4 rounded-md max-w-sm text-sm">
				<p className="mb-2">
					{
						'The contract owner has requested to disable listing for this token. Please contact the contract owner for further information.'
					}
				</p>
				<Button size="sm" className="px-12" onClick={onClose}>
					Okay
				</Button>
			</div>
		</Modal>
	)
}

export default DisableMarketModal
