import { useEffect, useState } from 'react'
import { parseImgUrl } from 'utils/common'
import Card from 'components/Card/Card'
import LoginModal from 'components/Modal/LoginModal'
import TokenBuyModal from 'components/Modal/TokenBuyModal'
import PlaceOfferModal from 'components/Modal/PlaceOfferModal'
import TokenHead from 'components/TokenUtils/TokenHead'
import TokenCurrentPrice from 'components/TokenUtils/TokenCurrentPrice'

const TokenDetailNew = ({ token }) => {
	const [showModal, setShowModal] = useState(null)

	useEffect(() => {
		console.log('token', token)
	}, [])

	const onDismissModal = () => {
		setShowModal(null)
	}

	return (
		<div className="grid auto-rows-auto grid-cols-2 gap-x-10">
			<div className="w-full h-full row-span-6">
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
			<TokenHead token={token} setShowModal={(e) => setShowModal(e)} />
			<div className="col-start-2 mb-10">
				<TokenCurrentPrice token={token} setShowModal={(e) => setShowModal(e)} />
			</div>
			<TokenCurrentPrice token={token} setShowModal={(e) => setShowModal(e)} />
			<TokenCurrentPrice token={token} setShowModal={(e) => setShowModal(e)} />
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

export default TokenDetailNew
