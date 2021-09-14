import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

import { parseImgUrl, prettyBalance } from '../utils/common'
import Card from './Card'
import { useRouter } from 'next/router'
import TokenSeriesDetailModal from './TokenSeriesDetailModal'
import useStore from '../lib/store'
import JSBI from 'jsbi'

const EmbeddedCard = ({ tokenId }) => {
	const store = useStore()
	const router = useRouter()
	const [token, setToken] = useState(null)

	const price = token && (token.lowest_price || token.price)

	useEffect(() => {
		fetchToken()
	}, [])

	const fetchToken = async () => {
		const [contractTokenId, token_id] = tokenId.split('/')
		const [contractId, tokenSeriesId] = contractTokenId.split('::')

		const url = process.env.V2_API_URL
		const res = await axios({
			url: url + (token_id ? `/token` : `/token-series`),
			method: 'GET',
			params: token_id
				? {
						token_id: token_id,
				  }
				: {
						contract_id: contractId,
						token_series_id: tokenSeriesId,
				  },
		})

		const _token = (await res.data.data.results[0]) || null
		setToken(_token)
	}

	if (!token) return null

	return (
		<Fragment>
			<TokenSeriesDetailModal tokens={[token]} />
			<Link href={`/token/${token.contract_id}::${token.token_series_id}`}>
				<a
					onClick={(e) => {
						e.preventDefault()
					}}
				>
					<div className="w-full m-auto">
						<Card
							imgUrl={parseImgUrl(token.metadata.media, null, {
								width: `600`,
								useOriginal:
									process.env.APP_ENV === 'production' ? false : true,
							})}
							onClick={() => {
								router.push(
									{
										pathname: router.pathname,
										query: {
											...router.query,
											...{ tokenSeriesId: token.token_series_id },
											...{ prevAs: router.asPath },
										},
									},
									`/token/${token.contract_id}::${token.token_series_id}`,
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
							}}
						/>
					</div>
				</a>
			</Link>
			<div className="text-center">
				<div className="mt-4">
					<div className="p-2 pb-4">
						<p className="text-gray-400 text-xs">Start From</p>
						<div className="text-gray-100 text-xl">
							{price ? (
								<div>
									<div>{prettyBalance(price, 24, 4)} Ⓝ</div>
									<div className="text-xs text-gray-400">
										~ $
										{prettyBalance(
											JSBI.BigInt(price * store.nearUsdPrice),
											24,
											4
										)}
									</div>
								</div>
							) : (
								<div className="line-through text-red-600">
									<span className="text-gray-100">SALE</span>
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
