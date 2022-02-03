import React from 'react'
import { useIntl } from 'hooks/useIntl'
import Modal from 'components/Common/Modal'
import { IconX } from 'components/Icons'
import Button from 'components/Common/Button'

const DeleteCollectionModal = ({ show, onClose, onSubmit, loading }) => {
	const { localeLn } = useIntl()
	return (
		<Modal close={onClose} isShow={show} closeOnEscape={false} closeOnBgClick={false}>
			<div className="max-w-sm w-full p-4 bg-gray-800  m-auto rounded-md relative">
				<div className="absolute right-0 top-0 pr-4 pt-4">
					<div className="cursor-pointer" onClick={onClose}>
						<IconX />
					</div>
				</div>
				<div>
					<h1 className="text-2xl font-bold text-white tracking-tight">
						{localeLn(`DeleteTitle`)}
					</h1>
				</div>
				<div className=" mt-5">
					<p className="text-white">{localeLn(`DeleteText`)}</p>
				</div>
				<div className="mt-5 flex justify-between">
					<Button onClick={onClose} variant="secondary" size="md" className="w-40 m-auto">
						{localeLn(`DeleteCancel`)}
					</Button>
					<Button
						onClick={onSubmit}
						isDisabled={loading}
						variant="error"
						size="md"
						className="w-40 m-auto"
					>
						{loading ? `${localeLn(`Loading`)}...` : localeLn(`Delete`)}
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export default DeleteCollectionModal
