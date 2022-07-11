import { useEffect, useState } from 'react'
import { parseImgUrl } from 'utils/common'
import Card from 'components/Card/Card'
import LoginModal from 'components/Modal/LoginModal'
import TokenBuyModal from 'components/Modal/TokenBuyModal'
import PlaceOfferModal from 'components/Modal/PlaceOfferModal'
import TokenHead from 'components/TokenUtils/TokenHead'
import TokenCurrentPrice from 'components/TokenUtils/TokenCurrentPrice'
import TokenPriceHistory from 'components/TokenUtils/TokenPriceHistory'
import TokenOwners from 'components/TokenUtils/TokenOwners'
import TokenOffers from 'components/TokenUtils/TokenOffers'
import TokenDescription from 'components/TokenUtils/TokenDescription'
import TokenAttributes from 'components/TokenUtils/TokenAttributes'
import TokenInfo from 'components/TokenUtils/TokenInfo'
import TokenMoreCollection from 'components/TokenUtils/TokenMoreCollection'

const TokenSeriesDetailNew = ({ token }) => {
	const [showModal, setShowModal] = useState(null)

	useEffect(() => {
		console.log('token-series-detail-new', token)
	}, [])

	const onDismissModal = () => {
		setShowModal(null)
	}

	return (
		<div className="grid auto-rows-auto grid-cols-2 gap-x-10">
			<div className="row-span-6">
				<div className="w-full h-auto mb-10">
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
					/>
				</div>
				<TokenDescription localToken={token} className="mb-10" />
				<TokenAttributes localToken={token} className="mb-10" />
				<TokenInfo localToken={token} />
			</div>
			<TokenHead localToken={token} setShowModal={(e) => setShowModal(e)} tokenSeriesDetail />
			<TokenCurrentPrice
				localToken={token}
				setShowModal={(e) => setShowModal(e)}
				className="col-start-2 mb-10"
			/>
			<TokenPriceHistory
				localToken={token}
				setShowModal={(e) => setShowModal(e)}
				className="mb-10"
			/>
			<TokenOwners localToken={token} className="mb-10" />
			<TokenOffers localToken={token} />
			<TokenMoreCollection localToken={token} className="col-span-2 mb-10" />
			<TokenBuyModal show={showModal === 'buy'} onClose={onDismissModal} data={token} />
			<PlaceOfferModal
				show={showModal === 'placeoffer'}
				data={token}
				onClose={onDismissModal}
				setShowModal={setShowModal}
			/>
			<LoginModal show={showModal === 'notLogin'} onClose={onDismissModal} />
		</div>
	)
}

export default TokenSeriesDetailNew
