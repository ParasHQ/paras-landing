import Modal from 'components/Common/Modal'
import { IconNear, IconX } from 'components/Icons'
import { useIntl } from 'hooks/useIntl'

const BuyOptionModal = ({ show, onClose, data, action, currentUser }) => {
	const { localeLn } = useIntl()

	return (
		<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
			<div className="max-w-md w-full p-4 bg-gray-800 m-4 md:m-auto rounded-md relative">
				<div className="absolute right-0 top-0 pr-4 pt-4">
					<div className="cursor-pointer" onClick={onClose}>
						<IconX />
					</div>
				</div>
				<h1 className="text-2xl font-bold text-white tracking-tight">
					{localeLn('SelectBuyTransaction')}
				</h1>
				<div className="grid col-span-2 grid-flow-col items-center gap-4 mt-6 mb-4 text-white">
					<div
						className="p-6 h-40 border-2 border-gray-700 rounded-md cursor-pointer hover:bg-gray-700 transition duration-200"
						onClick={action}
					>
						<div className="flex justify-center mb-4">
							<IconNear />
						</div>
						<p className="whitespace-nowrap text-center text-xl font-semibold">Buy with NEAR</p>
					</div>
					<a
						href={`https://checkout.ramper.xyz/buy?redirect_url=https%3A%2F%2Framper.xyz&network=mainnet&token_series_id=${data.token_series_id}&contract_address=x.paras.near&user_wallet_address=${currentUser}`}
						target="_blank"
						rel="noreferrer"
						onClick={onClose}
					>
						<div className="p-6 h-40 border-2 border-gray-700 rounded-md cursor-pointer hover:bg-gray-700 transition duration-200">
							<div className="flex justify-center mb-4">
								<img src="/usd.png" className="w-12 rounded-full" />
							</div>
							<p className="whitespace-nowrap text-center text-xl font-semibold">Buy with FIAT</p>
							<div className="flex justify-center items-center gap-1">
								<p className="text-xs">powered by</p>
								<img src="/assets/ramper-wallet-icon.png" width={40} />
							</div>
						</div>
					</a>
				</div>
			</div>
		</Modal>
	)
}

export default BuyOptionModal
