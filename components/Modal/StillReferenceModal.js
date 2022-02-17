import Modal from 'components/Common/Modal'
import { IconX } from 'components/Icons'

const StillReferenceModal = ({ show, onClose }) => {
	return (
		<Modal isShow={show} closeOnBgClick={true} closeOnEscape={true} close={onClose}>
			<div className="max-w-sm py-4 w-full bg-gray-800 m-auto rounded-md relative">
				<div className="absolute right-0 top-0 pr-4 pt-4">
					<div className="cursor-pointer" onClick={onClose}>
						<IconX />
					</div>
				</div>
				<div className="px-4">
					<p className="text-2xl font-semibold text-gray-100 mb-2">Fetching Metadata</p>
				</div>
				<div className="px-4">
					<h4 className="text-white text-justify pr-2">
						The metadata is still indexing. It might take a while to show collection, attributes,
						and description information.
					</h4>
				</div>
			</div>
		</Modal>
	)
}

export default StillReferenceModal
