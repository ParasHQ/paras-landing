import PublicationCardLoader from './PublicationCardLoader'

const PublicationCardListLoader = () => (
	<div className="flex flex-wrap">
		{[1, 2, 3, 4].map((k) => {
			return (
				<div key={k} className="flex-shrink-0 w-full md:w-1/2 p-4">
					<PublicationCardLoader uniqueKey={k} />
				</div>
			)
		})}
	</div>
)

export default PublicationCardListLoader
