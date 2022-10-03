import { useEffect, useState } from 'react'
import { parseImgUrl } from 'utils/common'
import Card from 'components/Card/Card'
import CardLowerController from 'components/TokenUtils/CardLowerController'
import TokenAttributesSecond from 'components/TokenUtils/TokenAttributesSecond'
import TokenPublicationSecond from 'components/TokenUtils/TokenPublicationSecond'
import TokenHeadSecond from 'components/TokenUtils/TokenHeadSecond'

const TokenDetailNewSecond = ({ token }) => {
	return (
		<div className="md:grid auto-rows-auto grid-cols-7 gap-x-10">
			<div className="row-span-6 col-start-1 col-end-4">
				<div className="w-full h-auto text-white">
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
				<div>
					<CardLowerController localToken={token} />
					<TokenAttributesSecond localToken={token} />
					<TokenPublicationSecond localToken={token} />
				</div>
			</div>

			<div className="hidden md:block col-start-4 col-end-8">
				<TokenHeadSecond localToken={token} />
			</div>
		</div>
	)
}

export default TokenDetailNewSecond
