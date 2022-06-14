import { Fragment } from 'react'
import Link from 'next/link'

import { parseImgUrl, prettyBalance } from 'utils/common'
import Card from 'components/Card/Card'
import { useRouter } from 'next/router'

import useStore from 'lib/store'
import JSBI from 'jsbi'
import { useIntl } from 'hooks/useIntl'
import TokenSeriesDetailModal from 'components/TokenSeries/TokenSeriesDetailModal'
import TokenDetailModal from 'components/Token/TokenDetailModal'
import useTokenOrTokenSeries from 'hooks/useTokenOrTokenSeries'
import { useNonInitialEffect } from 'hooks/useNonInitialEffect'

const EmbeddedCard = ({ tokenId }) => {
	const currentUser = useStore((state) => state.currentUser)

	const [contractTokenId, token_id] = tokenId.split('/')
	const [contractId, tokenSeriesId] = contractTokenId.split('::')

	const { token, mutate } = useTokenOrTokenSeries({
		key: `${contractId}::${tokenSeriesId}${token_id ? `/${token_id}` : ''}`,
		params: {
			lookup_likes: true,
			liked_by: currentUser,
		},
	})

	useNonInitialEffect(() => {
		if (currentUser) {
			mutate()
		}
	}, [currentUser])

	const store = useStore()
	const router = useRouter()
	const { localeLn } = useIntl()
	const price = token && (token.lowest_price || token.price)

	if (!token) return null

	return (
		<Fragment>
			<TokenSeriesDetailModal tokens={[token]} />
			<TokenDetailModal tokens={[token]} />
			<Link href={`/token/${token.contract_id}::${token.token_series_id}/${token.token_id || ''}`}>
				<a
					onClick={(e) => {
						e.preventDefault()
					}}
				>
					<div className="w-full m-auto">
						<Card
							imgUrl={parseImgUrl(token.metadata.media, null, {
								width: `600`,
								useOriginal: process.env.APP_ENV === 'production' ? false : true,
								isMediaCdn: token.isMediaCdn,
							})}
							onClick={() => {
								router.push(
									{
										pathname: router.pathname,
										query: {
											...router.query,
											tokenSeriesId: token.token_series_id,
											tokenId: token.token_id,
											contractId: token.contract_id,
										},
									},
									`/token/${token.contract_id}::${token.token_series_id}/${token.token_id || ''}`,
									{
										shallow: true,
										scroll: false,
									}
								)
							}}
							imgBlur={token.metadata.blurhash}
							token={{
								title: token.metadata.title,
								collection: token.metadata.collection || token.contract_id,
								copies: token.metadata.copies,
								creatorId: token.metadata.creator_id || token.contract_id,
								is_creator: token.is_creator,
							}}
						/>
					</div>
				</a>
			</Link>
			<div className="text-center">
				<div className="mt-4">
					<div className="p-2 pb-4">
						<p className="text-gray-400 text-xs">{localeLn('StartFrom')}</p>
						<div className="text-gray-100 text-xl">
							{price ? (
								<div>
									<div>{prettyBalance(price, 24, 4)} Ⓝ</div>
									{store.nearUsdPrice !== 0 && (
										<div className="text-xs text-gray-400">
											~ ${prettyBalance(JSBI.BigInt(price * store.nearUsdPrice), 24, 4)}
										</div>
									)}
								</div>
							) : (
								<div className="line-through text-red-600">
									<span className="text-gray-100">{localeLn('SALE')}</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	)
}

export default EmbeddedCard
