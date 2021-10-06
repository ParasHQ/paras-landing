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
		<rect x="20" y="20" rx="4" ry="4" width="553" height="237" />
		<rect x="20" y="275" rx="4" ry="4" width="389" height="44" />
		<rect x="20" y="333" rx="4" ry="4" width="458" height="21" />
		<rect x="20" y="367" rx="4" ry="4" width="425" height="21" />
	</ContentLoader>
)

export default HomeFeaturedLoader
