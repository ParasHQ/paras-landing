import { useState } from 'react'
import { parseImgUrl } from 'utils/common'
import Card from 'components/Card/Card'
import LoginModal from 'components/Modal/LoginModal'
import TokenHead from 'components/TokenUtils/TokenHead'
import TokenCurrentPrice from 'components/TokenUtils/TokenCurrentPrice'
import TokenPriceHistory from 'components/TokenUtils/TokenPriceHistory'
import TokenOwners from 'components/TokenUtils/TokenOwners'
import TokenOffers from 'components/TokenUtils/TokenOffers'
import TokenDescription from 'components/TokenUtils/TokenDescription'
import TokenAttributes from 'components/TokenUtils/TokenAttributes'
import TokenInfo from 'components/TokenUtils/TokenInfo'
import TokenMoreCollection from 'components/TokenUtils/TokenMoreCollection'
import TokenAuction from 'components/TokenUtils/TokenAuction'
import TokenBidHistory from 'components/TokenUtils/TokenBidHistory'
import { IconArrow } from 'components/Icons'

const TokenSeriesDetailNew = ({ token, tokenId }) => {
	const [showModal, setShowModal] = useState(null)

	const onDismissModal = () => {
		setShowModal(null)
	}

	return (
		<div className="md:grid auto-rows-auto grid-cols-2 gap-x-10">
			<div className="row-span-6">
				<div className="mb-4">
					<a onClick={() => history.back()}>
						<IconArrow className="hover:cursor-pointer" size={40} />
					</a>
				</div>
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
				<div className="block md:hidden">
					<TokenHead
						localToken={token}
						typeToken="token-series"
						setShowModal={(e) => setShowModal(e)}
					/>
					{token.is_auction ? (
						<div>
							<TokenAuction localToken={token} className="mb-10" />
							<TokenBidHistory localToken={token} className="mb-10" />
						</div>
					) : (
						<TokenCurrentPrice
							localToken={token}
							typeCurrentPrice="token-series"
							className="col-start-2 mb-10"
						/>
					)}
					<TokenDescription localToken={token} className="mb-10" />
					<TokenPriceHistory localToken={token} typePriceHistory="token-series" className="mb-10" />
					<TokenAttributes localToken={token} className="mb-10" />
					<TokenOwners localToken={token} className="mb-10" />
					<TokenOffers localToken={token} className="mb-10" />
					<TokenInfo localToken={token} />
					<TokenMoreCollection localToken={token} tokenId={tokenId} className="col-span-2 mb-10" />
				</div>
				<div className="hidden md:block">
					<TokenDescription localToken={token} className="mb-10" />
					<TokenAttributes localToken={token} className="mb-10" />
					<TokenInfo localToken={token} />
				</div>
			</div>
			<div className="hidden md:block">
				<TokenHead
					localToken={token}
					typeToken="token-series"
					setShowModal={(e) => setShowModal(e)}
				/>
				{token.is_auction ? (
					<div>
						<TokenAuction localToken={token} className="mb-10" />
						<TokenBidHistory localToken={token} className="mb-10" />
					</div>
				) : (
					<TokenCurrentPrice
						localToken={token}
						typeCurrentPrice="token-series"
						className="col-start-2 mb-10"
					/>
				)}
				<TokenPriceHistory localToken={token} typePriceHistory="token-series" className="mb-10" />
				<TokenOwners localToken={token} className="mb-10" />
				<TokenOffers localToken={token} />
			</div>
			<TokenMoreCollection
				localToken={token}
				tokenId={tokenId}
				className="col-span-2 mb-10 hidden md:block"
			/>
			<LoginModal show={showModal === 'notLogin'} onClose={onDismissModal} />
		</div>
	)
}

export default TokenSeriesDetailNew
