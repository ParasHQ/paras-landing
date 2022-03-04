import ContentLoader from 'react-content-loader'

const TopLoader = (props) => (
	<ContentLoader
		speed={2}
		width="100%"
		height="100%"
		viewBox="0 0 500 140"
		className="hidden md:block"
		backgroundColor="#1D1D1D"
		foregroundColor="#282828"
		uniqueKey="top-user-loader"
		{...props}
	>
		<circle cx="60" cy="75" r="40" />
		<rect x="120" y="40" rx="4" ry="4" width="250" height="30" />
		<rect x="120" y="80" rx="4" ry="4" width="200" height="20" />
	</ContentLoader>
)

const TopUserLoader = () =>
	[...Array(5).keys()].map((k) => (
		<div key={k} className="rounded-md">
			<TopLoader />
		</div>
	))

export default TopUserLoader
