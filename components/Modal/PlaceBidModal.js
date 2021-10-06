import { useForm } from 'react-hook-form'
import useStore from 'lib/store'
import { prettyBalance } from 'utils/common'
import Modal from 'components/Modal'
import { useIntl } from 'hooks/useIntl'

const PlaceBidModal = ({
	localToken,
	onSubmitForm,
	onCancel,
	isSubmitting,
	bidAmount,
	bidQuantity,
	isUpdate = false,
}) => {
	const { localeLn } = useIntl()
	const { errors, register, handleSubmit, watch } = useForm({
		defaultValues: {
			bidAmount,
			bidQuantity,
		},
	})
	const store = useStore()

	return (
		<Modal close={onCancel} closeOnBgClick={false} closeOnEscape={false}>
			<div className="max-w-sm w-full p-4 bg-gray-100 m-auto rounded-md">
				<div>
					<h1 className="text-2xl font-bold text-gray-900 tracking-tight">
						{isUpdate ? 'Update My Bid' : 'Place a Bid'}
					</h1>
					<p className="text-gray-900 mt-2">
						{localeLn('You are about to bid')} <b>{localToken.metadata.name}</b>.
					</p>
					<form onSubmit={handleSubmit(onSubmitForm)}>
						<div className="mt-4 flex space-x-4">
							<div className="w-1/2">
								<label className="block text-sm">{localeLn('Quantity')}</label>
								<input
									type="number"
									name="bidQuantity"
									ref={register({
										required: true,
										min: 1,
										max: localToken.supply,
									})}
									className={`${errors.bidQuantity && 'error'}`}
									placeholder="Bid quantity"
								/>
								<div className="mt-2 text-sm text-red-500">
									{errors.bidQuantity?.type === 'required' && `Bid quantity is required`}
									{errors.bidQuantity?.type === 'min' && `Minimum 1`}
									{errors.bidQuantity?.type === 'max' && `Must be less than number of supply`}
								</div>
							</div>
							<div className="w-1/2">
								<label className="block text-sm">{localeLn('Amount in')} Ⓝ</label>
								<input
									name="bidAmount"
									type="number"
									step="any"
									ref={register({
										required: true,
										min: 0.01,
									})}
									className={`${errors.bidAmount && 'error'}`}
									placeholder="Place your bid"
								/>
								<div className="mt-2 text-sm text-red-500">
									{errors.bidAmount?.type === 'required' && `Buy quantity is required`}
									{errors.bidAmount?.type === 'min' && `Minimum 0.01 Ⓝ`}
								</div>
							</div>
						</div>
						<div className="mt-4 text-center">
							<div className="flex justify-between">
								<div className="text-sm">Your balance</div>
								<div>{prettyBalance(store.userBalance.available, 24, 4)} Ⓝ</div>
							</div>
							<div className="flex justify-between">
								<div className="text-sm">{localeLn('Total bid Amount')}</div>
								<div>
									{watch('bidQuantity', bidQuantity || 0) * watch('bidAmount', bidAmount || 0)} Ⓝ
								</div>
							</div>
							<div className="flex justify-between">
								<div className="text-sm">{localeLn('Service Fee')}</div>
								<div>0.003 Ⓝ</div>
							</div>
						</div>
						<p className="text-gray-900 mt-4 text-sm text-center">
							{localeLn('You will be redirected to NEAR Web Wallet to confirm your transaction')}
						</p>
						<div className="">
							<button
								disabled={isSubmitting}
								className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
								type="submit"
							>
								{isSubmitting ? localeLn('Redirecting...') : localeLn('Submit Bid')}
							</button>
							<button
								disabled={isSubmitting}
								className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary text-primary"
								onClick={onCancel}
							>
								{localeLn('Cancel')}
							</button>
						</div>
					</form>
				</div>
			</div>
		</Modal>
	)
}

export default PlaceBidModal
