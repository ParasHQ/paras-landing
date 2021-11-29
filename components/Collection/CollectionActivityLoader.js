import ContentLoader from 'react-content-loader'

const CollectionActivityLoader = (props) => (
	<ContentLoader
		speed={2}
		width="100%"
		height="100%"
		viewBox="0 0 1200 100"
		backgroundColor="#1D1D1D"
		foregroundColor="#282828"
		uniqueKey="card-stat-loader"
		{...props}
	>
		<rect x="0" y="0" rx="8" ry="8" width="80" height="100" />
		<rect x="100" y="30" rx="8" ry="8" width="250" height="30" />
		<rect x="360" y="30" rx="8" ry="8" width="160" height="30" />
		<rect x="540" y="30" rx="8" ry="8" width="160" height="30" />
		<rect x="720" y="30" rx="8" ry="8" width="160" height="30" />
		<rect x="900" y="30" rx="8" ry="8" width="160" height="30" />
		<rect x="1070" y="30" rx="8" ry="8" width="130" height="30" />
	</ContentLoader>
)

export default CollectionActivityLoader
