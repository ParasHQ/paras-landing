import { useState } from 'react'
import { useToast } from 'hooks/useToast'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import { IconX } from 'components/Icons'
import { sentryCaptureException } from 'lib/sentry'
import useStore from 'lib/store'
import Media from 'components/Common/Media'
import { parseImgUrl, prettyTruncate, prettyBalance } from 'utils/common'
import JSBI from 'jsbi'
import Link from 'next/link'
import ParasRequest from 'lib/ParasRequest'

const RejectOfferModal = ({ show, onClose, token, data }) => {
	const store = useStore()
	const toast = useToast()

	const [isProcessing, setIsProcessing] = useState(false)

	if (!show) return null

	const onRejectOffer = async () => {
		try {
			setIsProcessing(true)

			await ParasRequest.post(`${process.env.V2_API_URL}/offers/reject`, {
				contract_id: data.contract_id,
				token_id: data.token_id,
				buyer_id: data.buyer_id,
			})

			onClose()
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{`Successfully rejected ${data.contract_id}:${data.token_id}`}
					</div>
				),
				type: 'success',
				duration: 2500,
			})
		} catch (err) {
			sentryCaptureException(err)
			const msg = err.response?.data?.message || `Something went wrong, try again later`
			toast.show({
				text: <div className="font-semibold text-center text-sm">{msg}</div>,
				type: 'error',
				duration: 2500,
			})
			setIsProcessing(false)
			return
		}
	}

	return (
		<>
			<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
				<div className="max-w-[504px] w-full bg-neutral-03 text-white rounded-lg mx-auto p-6">
					<div className="relative mb-5">
						<p className="text-sm font-bold text-center">Accept Offer</p>
						<button className="absolute bg-neutral-05 rounded-md right-0 -top-2" onClick={onClose}>
							<IconX className={'ml-1 mt-1'} />
						</button>
					</div>

					<div className="bg-neutral-02 rounded-lg p-4 mb-4">
						<p className="text-xs my-1 p-1">You are about to accept offer from {data.buyer_id}</p>
						<p className="text-sm font-bold p-1">Item</p>
						<div className="border-b border-b-neutral-05 mx-1"></div>

						<div>
							<div className="flex flex-row justify-between items-center p-2">
								<div className="inline-flex items-center w-16">
									<Media
										className="rounded-lg"
										url={parseImgUrl(token?.metadata.media, null, {
											width: `30`,
											useOriginal: process.env.APP_ENV === 'production' ? false : true,
											isMediaCdn: token?.isMediaCdn,
										})}
										videoControls={false}
										videoLoop={true}
										videoMuted={true}
										autoPlay={false}
										playVideoButton={false}
									/>
									<div className="flex flex-col justify-between items-stretch ml-2">
										<p className="text-xs font-thin mb-2">Collection</p>
										<Link
											href={`/collection/${token.metadata?.collection_id || token.contract_id}`}
										>
											<a className="text-sm font-bold truncate">
												{prettyTruncate(token.metadata?.collection || token.contract_id, 20)}
											</a>
										</Link>
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-row justify-between items-center p-2">
							<p className="text-sm text-neutral-10">Offer</p>
							<div className="inline-flex">
								<p className="font-bold text-sm text-neutral-10 truncate">
									{`${prettyBalance(data.price, 24, 4)} Ⓝ`}
								</p>

								{data.price && data.price !== '0' && store.nearUsdPrice !== 0 && (
									<div className="text-[10px] text-gray-400 truncate ml-2">
										(~$
										{prettyBalance(JSBI.BigInt(data.price) * store.nearUsdPrice, 24, 2)})
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-x-4">
						<div>
							<Button variant="second" className={'text-sm'} onClick={onClose}>
								Cancel
							</Button>
						</div>
						<div>
							<Button
								variant="primary"
								className={'text-sm w-full pl-14 text-center'}
								isDisabled={isProcessing}
								isLoading={isProcessing}
								onClick={onRejectOffer}
							>
								Reject Offer
							</Button>
						</div>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default RejectOfferModal
