import CardStatLoader from './CardStatLoader'

const CardStatListLoader = () => (
	<div className="flex flex-wrap">
		{[1, 2, 3, 4, 5].map((k) => {
			return (
				<div key={k} className="flex-shrink-0 w-full pl-4 py-4">
					<CardStatLoader
						uniqueKey={k}
						style={{
							minWidth: `800px`,
						}}
					/>
				</div>
			)
		})}
	</div>
)

export default CardStatListLoader
