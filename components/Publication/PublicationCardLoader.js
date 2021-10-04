import ContentLoader from 'react-content-loader'

const PublicationCardLoader = (props) => (
	<ContentLoader
		speed={2}
		width="100%"
		height="100%"
		viewBox="0 0 612 509"
		backgroundColor="#1D1D1D"
		foregroundColor="#282828"
		uniqueKey="publication-card-loader"
		{...props}
	>
		<rect x="0" y="0" rx="4" ry="4" width="4" height="509" />
		<rect x="608" y="0" rx="4" ry="4" width="4" height="509" />
		<rect x="0" y="0" rx="4" ry="4" width="612" height="4" />
		<rect x="0" y="505" rx="4" ry="4" width="612" height="4" />

		<rect x="0" y="4" rx="0" ry="0" width="612" height="280" />

		<rect x="17" y="310" rx="4" ry="4" width="546" height="40" />

		<rect x="17" y="385" rx="4" ry="4" width="577" height="20" />
		<rect x="17" y="414" rx="4" ry="4" width="513" height="20" />

		<rect x="17" y="465" rx="4" ry="4" width="101" height="20" />
		<rect x="126" y="465" rx="4" ry="4" width="8" height="20" />
		<rect x="142" y="465" rx="4" ry="4" width="148" height="20" />
	</ContentLoader>
)

export default PublicationCardLoader
