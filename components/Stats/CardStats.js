import Link from 'next/link'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { parseImgUrl, prettyBalance } from '../../utils/common'
import Card from '../Card'
import LinkToProfile from '../LinkToProfile'

const CardStats = ({ cardsData, fetchData, hasMore }) => {
	return (
		<div>
			<InfiniteScroll
				dataLength={cardsData.length}
				next={fetchData}
				hasMore={hasMore}
			>
				<table className="text-white text-center">
					<thead>
						<tr>
							<th className="md:w-2/12">Card</th>
							<th className="md:w-3/12 text-left">Detail</th>
							<th className="md:w-1/12">Supply</th>
							<th className="md:w-1/12">
								<p className="mx-4">First price</p>
							</th>
							<th className="md:w-1/12">
								<p className="mx-4">Last price</p>
							</th>
							<th className="md:w-1/12">
								<p className="mx-4">Average</p>
							</th>
							<th className="md:w-1/12">
								<p className="mx-4">Total</p>
							</th>
							<th className="md:w-1/12">
								<p className="mx-4">Transaction</p>
							</th>
							<th className="md:w-1/12">
								<p className="mx-4">Change</p>
							</th>
						</tr>
					</thead>
					<tbody>
						{cardsData.map((card) => {
							const localToken = card.token
							const firstPrice = parseFloat(
								prettyBalance(card.firstSale.amount, 24, 6)
							)
							const lastPrice = parseFloat(
								prettyBalance(card.lastSale.amount, 24, 6)
							)
							const { txLength } = card
							const { supply } = localToken
							const average = prettyBalance(card.average, 24, 6)
							const total = prettyBalance(card.volume, 24, 6)
							const change = parseInt(
								((lastPrice - firstPrice) / firstPrice) * 100
							)

							return (
								<tr key={card._id}>
									<td>
										<div className="p-4">
											<Link href={`/token/${localToken.tokenId}`}>
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
											</Link>
										</div>
									</td>
									<td className="text-left">
										<Link href={`/token/${localToken.tokenId}`}>
											<a className="text-xl md:text-2xl font-bold tracking-tight pr-4 cursor-pointer select-none">
												{localToken.metadata.name}
											</a>
										</Link>
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
									<td className="text-lg font-bold">{lastPrice} Ⓝ</td>
									<td className="text-lg font-bold">{average} Ⓝ</td>
									<td className="text-lg font-bold">{total} Ⓝ</td>
									<td className="text-lg font-bold">{txLength}</td>
									<td className="text-lg font-bold">{change}%</td>
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
