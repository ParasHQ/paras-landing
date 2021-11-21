import { useEffect, useState } from 'react'

import Button from 'components/Common/Button'
import { InputSelect, InputTextarea } from 'components/Common/form'
import Modal from 'components/Common/Modal'
import { IconX } from 'components/Icons'
import axios from 'axios'
import useStore from 'lib/store'
import { useToast } from 'hooks/useToast'
import { useIntl } from 'hooks/useIntl'

const reportOptions = [
	{ label: 'Art Theft', value: 'Art Theft' },
	{ label: 'Double Minting', value: 'Double Minting' },
	{ label: 'Inappropriate Content', value: 'Inappropriate Content' },
	{ label: 'Harmful Content', value: 'Harmful Content' },
	{ label: 'Rights Violation', value: 'Rights Violation' },
	{ label: 'Others', value: 'Others' },
]

const ReportModal = ({ show, onClose }) => {
	const [choosenReport, setChoosenReport] = useState('')
	const [detail, setDetail] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const currentUser = useStore((state) => state.currentUser)
	const toast = useToast()
	const { localeLn } = useIntl()

	useEffect(() => {
		if (!show) {
			setDetail('')
			setChoosenReport('')
			setIsSubmitting(false)
		}
	}, [show])

	const submitReport = async () => {
		setIsSubmitting(true)
		const formData = new FormData()
		const url = process.env.REPORT_URL

		currentUser && formData.append('userid', currentUser)
		formData.append('url', window.location.href)
		formData.append('report_type', choosenReport)
		formData.append('additional_info', detail)

		try {
			await axios.post(url, formData)

			setIsSubmitting(false)
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">{localeLn('ReportToastSuccess')}</div>
				),
				type: 'success',
				duration: 2500,
			})
		} catch (error) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">{localeLn('SomethingWentWrong')}</div>
				),
				type: 'error',
				duration: 2500,
			})
		}

		onClose()
	}

	return (
		<Modal isShow={show} close={onClose} closeOnBgClick={false} closeOnEscape={false}>
			<div className="max-w-sm w-full p-4 bg-gray-800 m-4 md:m-auto rounded-md text-white relative">
				<div className="absolute right-0 top-0 pr-4 pt-4">
					<div className="cursor-pointer" onClick={onClose}>
						<IconX />
					</div>
				</div>
				<div className="font-bold text-2xl mb-2">{localeLn('ReportTitle')}</div>
				<div className="my-2">
					<span className="opacity-80 mb-2">{localeLn('ReportReason')}</span>
					<InputSelect
						className=""
						options={reportOptions}
						onChange={(e) => setChoosenReport(e.target.value)}
						value={choosenReport}
					/>
				</div>
				<div className="my-2">
					<span className="opacity-80 mb-2">{localeLn('ReportDetail')}</span>
					<InputTextarea
						className="resize-none h-24"
						placeholder={localeLn('ReportDetailPlaceholder')}
						value={detail}
						onChange={(e) => setDetail(e.target.value)}
					/>
				</div>
				<Button
					isDisabled={!choosenReport || !detail || isSubmitting}
					className="mt-4"
					size="md"
					isFullWidth
					onClick={submitReport}
				>
					{isSubmitting ? localeLn('ReportButtonLoading') : localeLn('ReportButton')}
				</Button>
			</div>
		</Modal>
	)
}

export default ReportModal
