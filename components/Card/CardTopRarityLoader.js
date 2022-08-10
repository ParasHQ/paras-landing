import React from 'react'
import ContentLoader from 'react-content-loader'

const CardTopRarityLoader = (props) => (
	<ContentLoader
		speed={2}
		width="100%"
		height="100%"
		viewBox="0 0 275 380"
		uniqueKey="card-top-rarity-loader"
		backgroundColor="#1D1D1D"
		foregroundColor="#282828"
		{...props}
	>
		<rect x="0" y="0" rx="11" ry="11" width="275" height="380" />
	</ContentLoader>
)

export default CardTopRarityLoader
