import { useEffect, useState } from 'react'
import { parseImgUrl } from 'utils/common'
import Card from 'components/Card/Card'
import LoginModal from 'components/Modal/LoginModal'
import TokenHead from 'components/TokenUtils/TokenHead'
import TokenCurrentPrice from 'components/TokenUtils/TokenCurrentPrice'
import TokenOwners from 'components/TokenUtils/TokenOwners'
import TokenOffers from 'components/TokenUtils/TokenOffers'
import TokenDescription from 'components/TokenUtils/TokenDescription'
import TokenAttributes from 'components/TokenUtils/TokenAttributes'
import TokenInfo from 'components/TokenUtils/TokenInfo'
import TokenMoreCollection from 'components/TokenUtils/TokenMoreCollection'
import TokenAuction from 'components/TokenUtils/TokenAuction'
import TokenBidHistory from 'components/TokenUtils/TokenBidHistory'
import ArtistBanned from 'components/Common/ArtistBanned'
import { trackTokenSeriesDetailPage } from 'lib/ga'
import IFrame3DTokenModal from 'components/Modal/IFrame3DTokenModal'

const TokenSeriesDetailNew = ({ token }) => {
	const [showModal, setShowModal] = useState(null)

	useEffect(() => {
		trackTokenSeriesDetailPage(`${token.contract_id}::${token.token_series_id}`)
	}, [token.contract_id, token.token_series_id])

	const onDismissModal = () => {
		setShowModal(null)
	}

	const tokenOnClick = () => {
		if (token.metadata.mime_type.includes('model') || token.metadata.mime_type.includes('iframe')) {
			setShowModal('iframe3dtoken')
		}
		return
	}

	return (
		<>
			<div className="md:grid auto-rows-auto grid-cols-7 gap-x-10">
				<div className="row-span-6 col-start-1 col-end-4">
					<div className="w-full h-auto mb-10">
						<Card
							onClick={tokenOnClick}
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
							type="new-card-detail"
						/>
					</div>
					<ArtistBanned
						className="relative -mt-5 mb-5 md:mb-0"
						creatorId={token.metadata.creator_id}
					/>
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
						<TokenAttributes localToken={token} className="mb-10" />
						<TokenOwners localToken={token} className="mb-10" />
						<TokenOffers localToken={token} className="mb-10" />
						<TokenInfo localToken={token} />
						<TokenMoreCollection localToken={token} className="col-span-2 mb-10" />
					</div>
					<div className="hidden md:block">
						<TokenDescription localToken={token} className="mb-10" />
						<TokenAttributes localToken={token} className="mb-10" />
						<TokenInfo localToken={token} />
					</div>
				</div>
				<div className="hidden md:block col-start-4 col-end-8">
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
					<TokenOwners localToken={token} className="mb-10" />
					<TokenOffers localToken={token} className="mb-10" />
				</div>
			</div>
			<TokenMoreCollection localToken={token} className="col-span-2 mb-10 hidden md:block" />
			<LoginModal show={showModal === 'notLogin'} onClose={onDismissModal} />
			<IFrame3DTokenModal
				show={showModal === 'iframe3dtoken'}
				onClose={onDismissModal}
				typeToken="token-series"
				token={token}
			/>
		</>
	)
}

export default TokenSeriesDetailNew
