import { useState } from 'react'
import { useIntl } from 'hooks/useIntl'
import { prettyBalance } from 'utils/common'
import useStore from 'lib/store'
import Button from 'components/Common/Button'
import TokenTransferModal from 'components/Modal/TokenTransferModal'
import PlaceOfferModal from 'components/Modal/PlaceOfferModal'
import TokenUpdatePriceModal from 'components/Modal/TokenUpdatePriceModal'
import TokenBuyModal from 'components/Modal/TokenBuyModal'
import JSBI from 'jsbi'
import TokenSeriesMintModal from 'components/Modal/TokenSeriesMintModal'
import TokenSeriesUpdatePriceModal from 'components/Modal/TokenSeriesUpdatePriceModal'
import LoginModal from 'components/Modal/LoginModal'
import TokenSeriesBuyModal from 'components/Modal/TokenSeriesBuyModal'
import { formatNearAmount } from 'near-api-js/lib/utils/format'

const TokenCurrentPrice = ({ localToken, className, typeCurrentPrice }) => {
	const [showModal, setShowModal] = useState('')

	const currentUser = useStore((state) => state.currentUser)
	const store = useStore()
	const { localeLn } = useIntl()

	const disableOfferContract = (process.env.DISABLE_OFFER_CONTRACT_ID || '')
		.split(',')
		.includes(localToken.contract_id)

	const isShowButton =
		localToken.contract_id === process.env.NFT_CONTRACT_ID ||
		process.env.WHITELIST_CONTRACT_ID.split(',').includes(localToken.contract_id)

	const onDismissModal = () => {
		setShowModal(null)
	}

	const onClickBuy = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('buy')
	}

	const onClickTransfer = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('transfer')
	}

	const onClickOffer = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('placeoffer')
	}

	const onClickMint = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('confirmMint')
	}

	const onClickBuySeries = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('confirmBuy')
	}

	const onClickUpdatePrice = () => {
		setShowModal('updatePrice')
	}

	const onClickUpdatePriceSeries = () => {
		setShowModal('updatePriceSeries')
	}

	const handleScroll = () => {
		const scrollDiv = document.getElementById('owner-section').offsetTop
		if (window.innerWidth < 720) {
			window.scrollTo({ top: scrollDiv, behavior: 'smooth' })
		} else {
			window.scrollTo({ top: scrollDiv + 800, behavior: 'smooth' })
		}
	}

	const isCreator = () => {
		if (!currentUser) {
			return false
		}
		return (
			currentUser === localToken.metadata.creator_id ||
			(!localToken.metadata.creator_id && currentUser === localToken.contract_id)
		)
	}

	const tokenSeriesButton = () => {
		// For external contract
		if (!isShowButton) {
			return (
				<Button size="md" onClick={() => handleScroll()} isFullWidth>
					{localeLn('CheckOwners')}
				</Button>
			)
		}

		if (localToken.is_non_mintable || localToken.total_mint === localToken.metadata.copies) {
			return (
				<div className="flex space-x-2">
					<Button size="md" onClick={() => handleScroll()} isFullWidth>
						{localeLn('CheckOwners')}
					</Button>
					{!disableOfferContract && (
						<Button size="md" onClick={onClickOffer} isFullWidth variant="ghost">
							{`Place an offer`}
						</Button>
					)}
				</div>
			)
		} else if (isCreator()) {
			return (
				<div className="flex flex-wrap space-x-4">
					<div className="w-full flex-1">
						<Button size="md" onClick={onClickMint} isFullWidth>
							{localeLn('Mint')}
						</Button>
					</div>
					<div className="w-full flex-1">
						<Button size="md" onClick={onClickUpdatePriceSeries} isFullWidth>
							{localeLn('UpdatePrice')}
						</Button>
					</div>
				</div>
			)
		} else if (localToken.price) {
			return (
				<>
					<div className="flex space-x-2">
						<Button size="md" onClick={onClickBuySeries} isFullWidth>
							{localToken.price === '0' ? 'Free' : 'Buy'}
						</Button>
						{!disableOfferContract && (
							<Button size="md" onClick={onClickOffer} isFullWidth variant="ghost">
								{`Place an offer`}
							</Button>
						)}
					</div>
					{localToken.lowest_price &&
						parseFloat(formatNearAmount(localToken.price)) >
							parseFloat(formatNearAmount(localToken.lowest_price)) && (
							<Button
								size="md"
								className="mt-2"
								variant="secondary"
								onClick={() => handleScroll()}
								isFullWidth
							>
								{localeLn('Buy')}
							</Button>
						)}
				</>
			)
		} else {
			return (
				<Button size="md" onClick={onClickOffer} isFullWidth variant="secondary">
					{`Place an offer`}
				</Button>
			)
		}
	}

	return (
		<div className={className}>
			<div className="text-white bg-cyan-blue-3 rounded-t-xl mt-3">
				<div className="flex justify-between items-center pr-2 pl-6">
					<p className="text-xl py-3">Current Price</p>
				</div>
			</div>
			<div className="text-white bg-cyan-blue-1 rounded-b-xl px-6 pb-8">
				<p className="flex items-center gap-1 text-4xl font-bold py-8">
					{localToken.price ? (
						<div className="flex">
							<div className="truncate">
								{localToken.price === '0'
									? localeLn('Free')
									: localToken.price && (
											<p>
												{prettyBalance(localToken.price, 24, 4)}
												<span className="pl-1">Ⓝ</span>
												<span className="text-[10px] font-normal text-gray-400 pt-2">
													($
													{prettyBalance(JSBI.BigInt(localToken.price * store.nearUsdPrice), 24, 4)}
													)
												</span>
											</p>
									  )}
							</div>
						</div>
					) : (
						<div>
							<div className="line-through text-red-600">
								<span className="text-gray-100">{localeLn('SALE')}</span>
							</div>
						</div>
					)}
				</p>
				{typeCurrentPrice === 'token-series' ? (
					tokenSeriesButton()
				) : (
					<div>
						{localToken.is_staked && currentUser === localToken.owner_id ? (
							<div className="flex flex-wrap flex-col">
								<div className="w-full flex-1">
									<Button
										size="md"
										isFullWidth
										onClick={() => {
											window.location.href = 'https://stake.paras.id'
										}}
									>
										{localeLn('Unstake')}
									</Button>
								</div>
							</div>
						) : (
							localToken.owner_id === currentUser && (
								<div className="flex flex-wrap space-x-4">
									<div className="w-full flex-1">
										<Button size="md" onClick={onClickUpdatePrice} isFullWidth>
											{localeLn('UpdateListing')}
										</Button>
									</div>
									<div className="w-full flex-1">
										<Button size="md" onClick={onClickTransfer} isFullWidth>
											{localeLn('Transfer')}
										</Button>
									</div>
								</div>
							)
						)}
						{localToken.owner_id !== currentUser && localToken.price && (
							<div className="flex space-x-2">
								<Button size="md" className="truncate" onClick={onClickBuy} isFullWidth>
									{`Buy`}
								</Button>
								<Button size="md" onClick={onClickOffer} isFullWidth variant="ghost">
									{`Place an offer`}
								</Button>
							</div>
						)}
						{localToken.owner_id !== currentUser && !localToken.price && (
							<Button size="md" onClick={onClickOffer} isFullWidth variant="ghost">
								{`Place an offer`}
							</Button>
						)}
					</div>
				)}
			</div>
			<TokenUpdatePriceModal
				show={showModal === 'updatePrice'}
				onClose={onDismissModal}
				data={localToken}
			/>
			<TokenBuyModal show={showModal === 'buy'} onClose={onDismissModal} data={localToken} />
			<TokenTransferModal
				show={showModal === 'transfer'}
				onClose={onDismissModal}
				data={localToken}
			/>
			<PlaceOfferModal
				show={showModal === 'placeoffer'}
				data={localToken}
				onClose={onDismissModal}
				setShowModal={setShowModal}
			/>
			<TokenSeriesMintModal
				show={showModal === 'confirmMint'}
				onClose={onDismissModal}
				data={localToken}
			/>
			<TokenSeriesBuyModal
				show={showModal === 'confirmBuy'}
				onClose={onDismissModal}
				data={localToken}
			/>
			<TokenSeriesUpdatePriceModal
				show={showModal === 'updatePriceSeries'}
				onClose={onDismissModal}
				data={localToken}
			/>
			<LoginModal show={showModal === 'notLogin'} onClose={onDismissModal} />
		</div>
	)
}

export default TokenCurrentPrice
