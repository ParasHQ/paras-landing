import { useRouter } from 'next/router'
import Card from './Card'

const EventMarket = ({ data }) => {
	const router = useRouter()

	return (
		<div className="md:flex p-4 border-2 border-dashed rounded-md border-gray-800 m-4">
			<div className="md:w-2/5">
				<h1 className="text-4xl font-bold text-gray-100 ml-4">
					Lunar New Year
				</h1>
				<p className="m-4 mt-2 text-white text-xl">
					Explore card from Lunar new year. Lorem ipsum dolor sit amet,
					consectetur adipiscing elit. Ut condimentum sollicitudin gravida.
				</p>
				<div className="space-x-2 m-4">
					<button
						className="outline-none h-10 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-0 text-gray-100 bg-primary border-primary"
						onClick={() => router.push('market/lunarnewyear')}
					>
						View Market
					</button>
					<button
						className="outline-none h-10 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-0 text-primary bg-white"
						onClick={() => window.open('https://www.google.com/')}
					>
						See More
					</button>
				</div>
			</div>
			<div className="md:w-3/5 md:flex mt-4 mb-8 px-4">
				{data.results.map((card) => (
					<div className="md:w-40 my-8 md:m-auto">
						<Card
							imgUrl={card.metadata.image}
							token={card}
							disableFlip
							initialRotate={{ x: 0, y: 0 }}
						/>
					</div>
				))}
			</div>
		</div>
	)
}

export default EventMarket
