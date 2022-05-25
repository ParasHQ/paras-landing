import React from 'react'
import ContentLoader from 'react-content-loader'

const HomeFeaturedLoader = (props) => (
	<ContentLoader
		speed={2}
		width="100%"
		viewBox="0 0 600 500"
		uniqueKey="home-feature-loader"
		backgroundColor="#1d1d1d"
		foregroundColor="#282828"
		{...props}
	>
		<rect x="0" y="0" rx="8" ry="8" width="600" height="500" />
	</ContentLoader>
)

export default HomeFeaturedLoader
