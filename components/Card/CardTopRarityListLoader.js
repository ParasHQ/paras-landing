import CardTopRarityLoader from './CardTopRarityLoader'

const CardTopRarityListLoader = ({ length = 12 }) => (
	<>
		<div className="hidden md:flex md:flex-wrap">
			{[...Array(length).keys()].map((k) => {
				return (
					<div key={k} className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 p-4 relative ">
						<CardTopRarityLoader uniqueKey={'card-top-rarity-loader-' + k} />
					</div>
				)
			})}
		</div>
		<div className="flex md:hidden">
			<div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 p-4 relative mt-4">
				<CardTopRarityLoader />
			</div>
		</div>
	</>
)

export default CardTopRarityListLoader
