import CardLoader from './CardLoader'

const CardListLoaderSmall = ({ length = 18 }) => (
	<>
		<div className="hidden md:flex md:flex-wrap">
			{[...Array(length).keys()].map((k) => {
				return (
					<div key={k} className="w-1/2 md:w-1/4 lg:w-1/6 flex-shrink-0 p-4 relative ">
						<CardLoader uniqueKey={'card-loader-' + k} />
					</div>
				)
			})}
		</div>
		<div className="flex md:hidden">
			<div className="w-1/2 md:w-1/4 lg:w-1/6 flex-shrink-0 p-4 relative ">
				<CardLoader />
			</div>
			<div className="w-1/2 md:w-1/4 lg:w-1/6 flex-shrink-0 p-4 relative ">
				<CardLoader />
			</div>
		</div>
	</>
)

export default CardListLoaderSmall
