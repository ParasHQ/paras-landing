import useStore from 'lib/store'
import LoginModal from './LoginModal'
import PlaceBidModal from './PlaceBidModal'
import TokenBuyModal from './TokenBuyModal'
import TokenSeriesBuyModal from './TokenSeriesBuyModal'
import TokenSeriesUpdatePriceModal from './TokenSeriesUpdatePriceModal'
import TokenUpdatePriceModal from './TokenUpdatePriceModal'

const MarketTokenModal = ({ useNFTModal = false, activeToken, modalType, onCloseModal }) => {
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
		return <PlaceBidModal data={localToken} onClose={onCloseModal} show />
	}

	if (modalType === 'updatelisting') {
		return activeToken.token || useNFTModal ? (
			<TokenUpdatePriceModal data={localToken} onClose={onCloseModal} show />
		) : (
			<TokenSeriesUpdatePriceModal data={localToken} onClose={onCloseModal} show />
		)
	}

	return null
}

export default MarketTokenModal
