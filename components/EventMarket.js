import { useRouter } from 'next/router'
import Card from './Card'

const EventMarket = ({ data }) => {
	const router = useRouter()

	return (
		<div className="lg:flex items-center border-2 border-dashed rounded-md border-red-600 m-4">
			<div className="w-full lg:w-2/5 p-4">
				<h1 className="text-4xl font-bold text-yellow-400 ml-4">
					Lunar New Year 2021
				</h1>
				<p className="m-4 mt-2 text-white text-xl">
					Explore card from Lunar 21 collection. Win total prize of 1500 Ⓝ.
				</p>
				<div className="space-x-8 m-4">
					<button
						className="outline-none h-10 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-0 text-gray-100 bg-red-600 border-red-600 leading-relaxed"
						onClick={() => router.push('market/lunar-new-year-2021')}
					>
						View Collection
					</button>
					<a
						className="text-gray-200 hover:text-white font-semibold border-b-2 cursor-pointer"
						onClick={() =>
							window.open(
								'https://medium.com/paras-media/paras-lunar-new-year-ab1197074abd'
							)
						}
					>
						Learn more
					</a>
				</div>
			</div>
			<div className="hidden w-full lg:w-3/5 md:flex flex-wrap select-none ">
				{data.results.map((token) => (
					<div className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-4 relative">
						<div className="w-full">
							<Card
								imgUrl={token.metadata.image}
								imgBlur={token.metadata.blurhash}
								token={{
									name: token.metadata.name,
									collection: token.metadata.collection,
									description: token.metadata.description,
									creatorId: token.creatorId,
									supply: token.supply,
									tokenId: token.tokenId,
									createdAt: token.createdAt,
								}}
								disableFlip
								initialRotate={{ x: 0, y: 0 }}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default EventMarket
