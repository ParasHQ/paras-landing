import { useEffect, useState } from 'react'
import useStore from 'lib/store'
import { parseImgUrl, ModalEnum } from 'utils/common'
import Button from 'components/Common/Button'
import Card from 'components/Card/Card'
import CardLowerController from 'components/TokenUtils/CardLowerController'
import TokenAttributesSecond from 'components/TokenUtils/TokenAttributesSecond'
import TokenPublicationSecond from 'components/TokenUtils/TokenPublicationSecond'
import TokenHeadSecond from 'components/TokenUtils/TokenHeadSecond'
import TokenPriceInfo from 'components/TokenUtils/TokenPriceInfo'
import TokenInformation from 'components/TokenUtils/TokenInformation'
import TokenPriceHistorySecond from 'components/TokenUtils/TokenPriceHistorySecond'
import TokenTransactionHistory from 'components/TokenUtils/TokenTransactionHistory'
import TokenMoreCollectionSecond from 'components/TokenUtils/TokenMoreCollectionSecond'
import TokenBuyModalSecond from 'components/Modal/TokenBuyModalSecond'
import TokenOfferModal from 'components/Modal/TokenOfferModal'
import TokenTradeModal from 'components/Modal/TokenTradeModal'
import TokenBidModal from 'components/Modal/TokenBidModal'
import TokenMintModal from 'components/Modal/TokenMintModal'
import TokenUpdatePriceModalSecond from 'components/Modal/TokenUpdatePriceModalSecond'
import TokenUpdateListing from 'components/Modal/TokenUpdateListing'
import TokenTransferModalSecond from 'components/Modal/TokenTransferModalSecond'
import TokenRemoveAuction from 'components/Modal/TokenRemoveAuction'
import TokenAuctionModal from 'components/Modal/TokenAuctionModal'
import SuccessTransactionModalSecond from 'components/Modal/SuccessTransactionModalSecond'
import LoginModal from 'components/Modal/LoginModal'

const TokenDetailNewSecond = ({ token }) => {
	const store = useStore()
	const currentUser = store.currentUser

	const [showLoginModal, setShowLoginModal] = useState(false)
	const [showModal, setShowModal] = useState(null)

	const onCloseModal = () => {
		setShowModal(null)
	}

	return (
		<>
			<div className="relative max-w-6xl m-auto pt-16 px-4">
				<div className="md:grid auto-rows-auto grid-cols-7 gap-x-14">
					<div className="row-span-6 col-start-1 col-end-4">
						<div className="w-full h-auto text-white mb-4">
							<Card
								imgUrl={parseImgUrl(token.metadata.media, null, {
									width: `600`,
									useOriginal: process.env.APP_ENV === 'production' ? false : true,
									isMediaCdn: token.isMediaCdn,
								})}
								audioUrl={
									token.metadata.mime_type &&
									token.metadata.mime_type.includes('audio') &&
									token.metadata?.animation_url
								}
								threeDUrl={
									token.metadata.mime_type &&
									token.metadata.mime_type.includes('model') &&
									token.metadata.animation_url
								}
								iframeUrl={
									token.metadata.mime_type &&
									token.metadata.mime_type.includes('iframe') &&
									token.metadata.animation_url
								}
								imgBlur={token.metadata.blurhash}
								token={{
									title: token.metadata.title,
									collection: token.metadata.collection || token.contract_id,
									copies: token.metadata.copies,
									creatorId: token.metadata.creator_id || token.contract_id,
									is_creator: token.is_creator,
									mime_type: token.metadata.mime_type,
								}}
								isNewDesign={true}
							/>
						</div>
						<div>
							<CardLowerController localToken={token} />
							<TokenAttributesSecond localToken={token} />
							<TokenPublicationSecond localToken={token} />
						</div>
					</div>

					<div className="hidden md:block col-start-4 col-end-8">
						<TokenHeadSecond
							localToken={token}
							onShowTradeModal={() => {
								setShowModal(ModalEnum.TRADE)
							}}
						/>
						<TokenPriceInfo
							localToken={token}
							onShowBuyModal={() =>
								currentUser ? setShowModal(ModalEnum.BUY) : setShowLoginModal(true)
							}
							onShowBidModal={() =>
								currentUser ? setShowModal(ModalEnum.BID) : setShowLoginModal(true)
							}
							onShowOfferModal={() =>
								currentUser ? setShowModal(ModalEnum.OFFER) : setShowLoginModal(true)
							}
							onShowMintModal={() =>
								currentUser ? setShowModal(ModalEnum.MINT) : setShowLoginModal(true)
							}
							onShowUpdatePriceModal={() =>
								currentUser ? setShowModal(ModalEnum.UPDATE_PRICE) : setShowLoginModal(true)
							}
							onShowAuctionModal={() =>
								currentUser ? setShowModal(ModalEnum.AUCTION) : setShowLoginModal(true)
							}
							onShowTransferModal={() =>
								currentUser ? setShowModal(ModalEnum.TRANSFER) : setShowLoginModal(true)
							}
							onShowUpdateListingModal={() =>
								currentUser ? setShowModal(ModalEnum.UPDATE_LISTING) : setShowLoginModal(true)
							}
							onShowRemoveAuction={() =>
								currentUser ? setShowModal(ModalEnum.REMOVE_AUCTION) : setShowLoginModal(true)
							}
						/>
						<TokenInformation
							localToken={token}
							onShowBuyModal={() =>
								currentUser ? setShowModal(ModalEnum.BUY) : setShowLoginModal(true)
							}
							onShowBidModal={() =>
								currentUser ? setShowModal(ModalEnum.BID) : setShowLoginModal(true)
							}
							onShowOfferModal={() =>
								currentUser ? setShowModal(ModalEnum.OFFER) : setShowLoginModal(true)
							}
						/>
						<TokenPriceHistorySecond localToken={token} />
					</div>
				</div>
			</div>
			<div className="max-w-full bg-neutral-03 rounded-t-xl">
				<TokenTransactionHistory localToken={token} />
			</div>
			<div className="max-w-full bg-neutral-03 border-t border-neutral-05">
				<TokenMoreCollectionSecond localToken={token} />
			</div>

			{/* Modals Component */}
			<TokenBuyModalSecond show={showModal === ModalEnum.BUY} data={token} onClose={onCloseModal} />
			<TokenOfferModal show={showModal === ModalEnum.OFFER} data={token} onClose={onCloseModal} />
			<TokenTradeModal show={showModal === ModalEnum.TRADE} data={token} onClose={onCloseModal} />
			<TokenBidModal show={showModal === ModalEnum.BID} data={token} onClose={onCloseModal} />
			<TokenMintModal show={showModal === ModalEnum.MINT} data={token} onClose={onCloseModal} />
			<TokenUpdatePriceModalSecond
				show={showModal === ModalEnum.UPDATE_PRICE}
				data={token}
				onClose={onCloseModal}
			/>
			<TokenUpdateListing
				show={showModal === ModalEnum.UPDATE_LISTING}
				data={token}
				onClose={onCloseModal}
			/>
			<TokenTransferModalSecond
				show={showModal === ModalEnum.TRANSFER}
				data={token}
				onClose={onCloseModal}
			/>
			<TokenRemoveAuction
				show={showModal === ModalEnum.REMOVE_AUCTION}
				data={token}
				onClose={onCloseModal}
			/>
			<TokenAuctionModal
				show={showModal === ModalEnum.AUCTION}
				data={token}
				onClose={onCloseModal}
			/>
			<LoginModal onClose={() => setShowLoginModal(false)} show={showLoginModal} />
		</>
	)
}

export default TokenDetailNewSecond
