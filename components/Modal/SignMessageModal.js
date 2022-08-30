import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'

const SignMesssageModal = ({ show, onClick }) => {
	return (
		<Modal isShow={show}>
			<div className="bg-gray-800 text-white m-auto p-4 rounded-md max-w-xs text-sm">
				<p className="mb-2">If you use Ramper you need to sign message for PARAS first</p>
				<Button size="sm" className="px-12" onClick={onClick}>
					Sign
				</Button>
			</div>
		</Modal>
	)
}

export default SignMesssageModal
