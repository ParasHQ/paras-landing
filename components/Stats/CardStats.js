import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { parseImgUrl, prettyBalance } from '../../utils/common'
import Card from '../Card'
import CardDetailModal from '../CardDetailModal'
import LinkToProfile from '../LinkToProfile'

const CardStats = ({ cardsData, fetchData, hasMore }) => {
	const [token, setToken] = useState(null)
	const router = useRouter()

	const onPressCard = (localToken) => {
		setToken(localToken)
		router.push(
			{
				pathname: router.pathname,
				query: {
					...router.query,
					...{ tokenId: localToken?.tokenId },
					...{ prevAs: router.asPath },
				},
			},
			`/token/${localToken?.tokenId}`,
			{ shallow: true }
		)
	}

	return (
		<div>
			<CardDetailModal tokens={[token]} />
			<InfiniteScroll dataLength={cardsData.length} next={fetchData} hasMore={hasMore}>
				<table className="text-white text-center">
					<thead>
						<tr>
							<th className="md:w-2/12">Card</th>
							<th className="md:w-3/12 text-left">Detail</th>
							<th className="md:w-1/12">
								<p className="mx-4">Supply</p>
							</th>
							<th className="md:w-1/12">
								<p className="mx-4">First price</p>
							</th>
							<th className="md:w-1/12">
								<p className="mx-4">Last price</p>
							</th>
							<th className="md:w-1/12">
								<p className="mx-4">Average price</p>
							</th>
							<th className="md:w-1/12">
								<p className="mx-4">Volume</p>
							</th>
							<th className="md:w-1/12">
								<p className="mx-4">Total card sold</p>
							</th>
							<th className="md:w-1/12">
								<p className="mx-4">Total sales</p>
							</th>
						</tr>
					</thead>
					<tbody>
						{cardsData.map((card) => {
							const localToken = card.token
							const firstPrice = parseFloat(prettyBalance(card.firstSale.amount, 24, 6)) || 1
							const lastPrice = parseFloat(prettyBalance(card.lastSale.amount, 24, 6))
							const { txLength, totalSales } = card
							const { supply } = localToken
							const average = prettyBalance(card.average, 24, 6)
							const total = prettyBalance(card.volume, 24, 6)
							const changeLastPrice = parseInt(((lastPrice - firstPrice) / firstPrice) * 100)
							const changeAveragePrice = parseInt(((average - firstPrice) / firstPrice) * 100)

							return (
								<tr key={card._id}>
									<td>
										<div className="p-4" onClick={() => onPressCard(localToken)}>
											<div className="w-32 md:w-full">
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
													disableFlip
													borderRadius={'5px'}
												/>
											</div>
										</div>
									</td>
									<td className="text-left">
										<a
											onClick={() => onPressCard(localToken)}
											className="text-xl md:text-2xl font-bold tracking-tight pr-4 cursor-pointer select-none"
										>
											{localToken.metadata.name}
										</a>
										<p className="mb-4">{localToken.metadata.collection}</p>
										<div>
											by{' '}
											<LinkToProfile
												accountId={localToken.creatorId}
												className="text-white hover:border-white"
											/>
										</div>
									</td>
									<td className="text-lg font-bold">{supply}</td>
									<td className="text-lg font-bold">{firstPrice} Ⓝ</td>
									<td>
										<p className="text-lg font-bold">{lastPrice} Ⓝ</p>
										<p className={changeLastPrice > 0 ? 'text-green-400' : 'text-red-600'}>
											{changeLastPrice}%
										</p>
									</td>
									<td>
										<p className="text-lg font-bold">{average} Ⓝ</p>
										<p className={changeAveragePrice > 0 ? 'text-green-400' : 'text-red-600'}>
											{changeAveragePrice}%
										</p>
									</td>
									<td className="text-lg font-bold">{total} Ⓝ</td>
									<td className="text-lg font-bold">{txLength}</td>
									<td className="text-lg font-bold">{totalSales}</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</InfiniteScroll>
		</div>
	)
}

export default CardStats
