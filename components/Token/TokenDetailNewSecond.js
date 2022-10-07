import { useEffect, useState } from 'react'
import { parseImgUrl } from 'utils/common'
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

const ModalEnum = Object.freeze({
	BUY: 'buy',
	OFFER: 'offer',
	TRADE: 'trade',
	BID: 'bid',
	MINT: 'mint',
	UPDATE_LISTING: 'update_listing',
	UPDATE_PRICE: 'update_price',
	AUCTION: 'auction',
	TRANSFER: 'transfer',
	REMOVE_AUCTION: 'remove_auction',
})

const TokenDetailNewSecond = ({ token }) => {
	const DUMMY = {
		_id: {
			$oid: '612f3b189523cb06e3887740',
		},
		contract_id: 'paras-token-v1.testnet',
		token_id: '1:2',
		owner_id: 'johnnear.testnet',
		token_series_id: '1',
		edition_id: '2',
		metadata: {
			title: 'Dragon Slayer #2',
			description: 'Killing a dragon is not an easy job',
			media: 'bafybeihdvqgsoab4wbaeziot2i23zca4o3hnrdg5z6y7xtprxsfynw3k34',
			media_hash: null,
			copies: 5,
			issued_at: '1609834941794',
			expires_at: null,
			starts_at: null,
			updated_at: null,
			extra: null,
			reference: 'bafybeigurmyt46hvno5754sf3toahihumvphgsn2tapaifxo7hmmq43kiu',
			reference_hash: null,
			collection: 'Mythical Warrior',
			collectionId: 'mythical-warrior-by-hdriqi',
			creatorId: 'hdriqi',
			blurhash: 'UAAnGO*G.P?spGE1IAk8uN.6tkM|NMH[bJai',
			creator_id: 'hdriqi',
			score: 0,
			rank: 263,
		},
		royalty: {},
		price: '1000000000000000000000000000000000',
		approval_id: null,
		ft_token_id: null,
		is_creator: true,
		has_rank: true,
	}

	const [showModal, setShowModal] = useState(null)

	const onCloseModal = () => {
		setShowModal(null)
	}

	return (
		<>
			<div className="relative max-w-6xl m-auto pt-16 px-4">
				{/* TODO: REMOVE THIS IF DONE */}
				<p className="text-white">BUTTON TO TEST MODAL ONLY - ONLY ON DEVELOPMENT</p>
				<div className="grid grid-cols-5 gap-x-2">
					<Button variant="second" onClick={() => setShowModal(ModalEnum.BUY)}>
						BUY
					</Button>
					<Button variant="second" onClick={() => setShowModal(ModalEnum.OFFER)}>
						OFFER
					</Button>
					<Button variant="second" onClick={() => setShowModal(ModalEnum.TRADE)}>
						TRADE
					</Button>
					<Button variant="second" onClick={() => setShowModal(ModalEnum.BID)}>
						BID
					</Button>
					<Button variant="second" onClick={() => setShowModal(ModalEnum.MINT)}>
						MINT
					</Button>
					<Button variant="second" onClick={() => setShowModal(ModalEnum.UPDATE_LISTING)}>
						UPDATE_LISTING
					</Button>
					<Button variant="second" onClick={() => setShowModal(ModalEnum.UPDATE_PRICE)}>
						UPDATE_PRICE
					</Button>
					<Button variant="second" onClick={() => setShowModal(ModalEnum.AUCTION)}>
						AUCTION
					</Button>
					<Button variant="second" onClick={() => setShowModal(ModalEnum.TRANSFER)}>
						TRANSFER
					</Button>
					<Button variant="second" onClick={() => setShowModal(ModalEnum.REMOVE_AUCTION)}>
						REMOVE_AUCTION
					</Button>
				</div>

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
						<TokenHeadSecond localToken={token} />
						<TokenPriceInfo localToken={token} />
						<TokenInformation localToken={token} />
						<TokenPriceHistorySecond localToken={token} />
					</div>
				</div>
			</div>
			<div className="max-w-full bg-neutral-03 rounded-t-xl">
				<TokenTransactionHistory />
			</div>
			<div className="max-w-full bg-neutral-03 border-t border-neutral-05">
				<TokenMoreCollectionSecond />
			</div>

			<TokenBuyModalSecond show={showModal === ModalEnum.BUY} data={DUMMY} onClose={onCloseModal} />
			<TokenOfferModal show={showModal === ModalEnum.OFFER} data={DUMMY} onClose={onCloseModal} />
			<TokenTradeModal show={showModal === ModalEnum.TRADE} data={DUMMY} onClose={onCloseModal} />
			<TokenBidModal show={showModal === ModalEnum.BID} data={DUMMY} onClose={onCloseModal} />
			<TokenMintModal show={showModal === ModalEnum.MINT} data={DUMMY} onClose={onCloseModal} />
			<TokenUpdatePriceModalSecond
				show={showModal === ModalEnum.UPDATE_PRICE}
				data={DUMMY}
				onClose={onCloseModal}
			/>
			<TokenUpdateListing
				show={showModal === ModalEnum.UPDATE_LISTING}
				data={DUMMY}
				onClose={onCloseModal}
			/>
			<TokenTransferModalSecond
				show={showModal === ModalEnum.TRANSFER}
				data={DUMMY}
				onClose={onCloseModal}
			/>
			<TokenRemoveAuction
				show={showModal === ModalEnum.REMOVE_AUCTION}
				data={DUMMY}
				onClose={onCloseModal}
			/>
			<TokenAuctionModal
				show={showModal === ModalEnum.AUCTION}
				data={DUMMY}
				onClose={onCloseModal}
			/>
		</>
	)
}

export default TokenDetailNewSecond
