import Modal from 'components/Modal'
import { useIntl } from 'hooks/useIntl'

const SubmissionSubmitModal = ({
	type = 'accept' | 'reject',
	multiple = false,
	onClose,
	categoryId,
	isLoading,
	onSubmitSubmission,
	token,
}) => {
	const { localeLn } = useIntl()
	return (
		<Modal close={onClose} closeOnEscape={true} closeOnBgClick={true}>
			<div className="bg-dark-primary-1 w-full max-w-xs p-4 m-auto rounded-md text-center">
				<div className="font-bold text-2xl mb-4 text-white">
					{type === 'accept' ? `Accept the card` : localeLn('RejectTheCard')}
				</div>
				<div className="mb-6 m-auto text-gray-400">
					<span>{type === 'accept' ? `You are going to accept ` : localeLn('GoingToReject')} </span>
					<span className="font-bold text-white">
						{multiple ? `multiple selected cards` : token?.metadata.title}
					</span>
					<span>
						{' '}
						{localeLn('From{categoryId}Category', {
							categoryId,
						})}
					</span>
				</div>
				<button
					disabled={isLoading}
					className={`w-full outline-none rounded-md bg-transparent text-sm font-semibold border-2 px-16 py-2 text-gray-100 ${
						type === 'accept' ? `border-primary bg-primary` : `border-red-600 bg-red-600`
					}`}
					onClick={() => onSubmitSubmission(type)}
					type="button"
				>
					{isLoading ? localeLn('Loading') : type === 'accept' ? `Accept` : localeLn('Reject')}
				</button>
			</div>
		</Modal>
	)
}

export default SubmissionSubmitModal
