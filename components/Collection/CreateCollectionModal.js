import Modal from 'components/Common/Modal'
import { IconX } from 'components/Icons'
import CreateCollection from './CreateCollection'
import Scrollbars from 'react-custom-scrollbars'

const CreateCollectionModal = ({ onClose, show, onFinishCreate }) => {
	return (
		<Modal close={onClose} isShow={show} closeOnEscape={false} closeOnBgClick={false}>
			<Scrollbars autoHeight autoHeightMax="90vh">
				<div className="bg-gray-800 m-auto w-full max-w-md rounded-md relative">
					<CreateCollection onFinishCreate={onFinishCreate} oneGrid={true} />
					<div className="absolute top-0 right-0 p-4 cursor-pointer" onClick={onClose}>
						<IconX />
					</div>
				</div>
			</Scrollbars>
		</Modal>
	)
}

export default CreateCollectionModal
