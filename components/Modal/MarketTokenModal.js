import useStore from 'lib/store'
import LoginModal from './LoginModal'
import PlaceOfferModal from './PlaceOfferModal'
import TokenAuctionBidModal from './TokenAuctionBidModal'
import TokenBuyModal from './TokenBuyModal'
import TokenSeriesBuyModal from './TokenSeriesBuyModal'
import TokenSeriesUpdatePriceModal from './TokenSeriesUpdatePriceModal'
import TokenUpdatePriceModal from './TokenUpdatePriceModal'
import TradeNFTModal from './TradeNFTModal'

const MarketTokenModal = ({
	useNFTModal = false,
	activeToken,
	modalType,
	onCloseModal,
	setModalType,
}) => {
	const { currentUser } = useStore()

	if (!activeToken) return null

	if (!currentUser) return <LoginModal onClose={onCloseModal} />

	const localToken = activeToken.token
		? { ...activeToken.token, price: activeToken.lowest_price || activeToken.price }
		: activeToken

	if (modalType === 'buy') {
		return activeToken.token || useNFTModal ? (
			<TokenBuyModal data={localToken} onClose={onCloseModal} show />
		) : (
			<TokenSeriesBuyModal data={localToken} onClose={onCloseModal} show />
		)
	}

	if (modalType === 'offer') {
		return (
			<PlaceOfferModal
				data={localToken}
				onClose={onCloseModal}
				show
				setShowModal={setModalType}
				fromDetail={false}
			/>
		)
	}

	if (modalType === 'offerNFT') {
		return (
			<TradeNFTModal
				data={localToken}
				show={modalType === 'offerNFT'}
				onClose={onCloseModal}
				tokenType={activeToken?.token_id ? `token` : `tokenSeries`}
			/>
		)
	}

	if (modalType === 'updatelisting') {
		return activeToken.token || useNFTModal ? (
			<TokenUpdatePriceModal data={localToken} onClose={onCloseModal} show />
		) : (
			<TokenSeriesUpdatePriceModal data={localToken} onClose={onCloseModal} show />
		)
	}

	if (modalType === 'placebid') {
		return <TokenAuctionBidModal data={localToken} onClose={onCloseModal} show />
	}

	return null
}

export default MarketTokenModal
