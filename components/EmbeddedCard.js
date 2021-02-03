import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

import { parseImgUrl, prettyBalance } from '../utils/common'
import Card from './Card'
import { useRouter } from 'next/router'
import CardDetailModal from './CardDetailModal'
import useStore from '../store'
import JSBI from 'jsbi'

const EmbeddedCard = ({ tokenId }) => {
	const store = useStore()
	const router = useRouter()
	const [localToken, setLocalToken] = useState(null)

	useEffect(() => {
		fetchToken()
	}, [])

	const fetchToken = async () => {
		const res = await axios(`${process.env.API_URL}/tokens?tokenId=${tokenId}`)
		const token = (await res.data.data.results[0]) || null
		setLocalToken(token)
	}

	const _getLowestPrice = (ownerships = []) => {
		const marketDataList = ownerships
			.filter((ownership) => ownership.marketData)
			.map((ownership) => ownership.marketData.amount)
			.sort((a, b) => a - b)

		return marketDataList[0]
	}

	return (
		<Fragment>
			<CardDetailModal tokens={[localToken]} />
			<div className="w-full m-auto">
				<Card
					imgUrl={parseImgUrl(localToken?.metadata?.image)}
					imgBlur={localToken?.metadata?.blurhash}
					token={{
						name: localToken?.metadata?.name,
						collection: localToken?.metadata?.collection,
						description: localToken?.metadata?.description,
						creatorId: localToken?.creatorId,
						supply: localToken?.supply,
						tokenId: localToken?.tokenId,
						createdAt: localToken?.createdAt,
					}}
					initialRotate={{
						x: 0,
						y: 0,
					}}
				/>
			</div>
			<div className="text-center">
				<div className="mt-8">
					<div className="p-2">
						<p className="text-gray-400 text-xs">Start From</p>
						<div className="text-gray-100 text-2xl">
							{_getLowestPrice(localToken?.ownerships) ? (
								<div>
									<div>
										{prettyBalance(
											_getLowestPrice(localToken?.ownerships),
											24,
											4
										)}{' '}
										Ⓝ
									</div>
									<div className="text-sm text-gray-400">
										~ $
										{prettyBalance(
											JSBI.BigInt(
												_getLowestPrice(localToken?.ownerships) *
													store.nearUsdPrice
											),
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
			<div className="text-center mt-2 text-sm">
				<Link
					href={{
						pathname: router.pathname,
						query: {
							...router.query,
							...{ tokenId: localToken?.tokenId },
							...{ prevAs: router.asPath },
						},
					}}
					as={`/token/${localToken?.tokenId}`}
					scroll={false}
					shallow
				>
					<p className="inline-block text-gray-100 cursor-pointer font-semibold border-b-2 border-gray-100">
						See Details
					</p>
				</Link>
			</div>
		</Fragment>
	)
}

export default EmbeddedCard
