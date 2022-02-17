import { IconX } from 'components/Icons'
import Modal from 'components/Modal'
import { flagText } from 'constants/flag'
import { useIntl } from 'hooks/useIntl'
import React from 'react'

const BannedConfirmModal = ({ creatorData, action, event, setIsShow, onClose, type }) => {
	const { localeLn } = useIntl()

	const onSubmit = () => {
		switch (type) {
			case 'offer':
				action(event)
				break
			default:
				action()
				break
		}
	}

	return (
		<Modal close={() => setIsShow(false)}>
			<div className="w-full max-w-sm p-4 m-auto bg-gray-800 rounded-md overflow-y-auto max-h-screen relative">
				<h1 className="text-2xl font-bold text-white text-center tracking-tight">
					{localeLn('Warning')}
				</h1>
				<div className="absolute right-0 top-0 pr-4 pt-4">
					<div className="cursor-pointer" onClick={() => setIsShow(false)}>
						<IconX onClick={onClose} />
					</div>
				</div>
				<div className="w-full text-white bg-red-600 p-2 rounded-md text-center mt-2 mb-6">
					{localeLn(flagText[creatorData?.flag] || 'FlaggedByPARASStealing')}
				</div>
				<div className="w-full text-white text-center">{localeLn('AreYouSureBuy')}</div>
				<button
					className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
					onClick={onSubmit}
				>
					{localeLn('IUnderstand')}
				</button>
			</div>
		</Modal>
	)
}

export default BannedConfirmModal
