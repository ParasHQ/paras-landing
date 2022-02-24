import React from 'react'
import ContentLoader from 'react-content-loader'

const CardLoader = (props) => (
	<ContentLoader
		speed={2}
		width="100%"
		height="100%"
		viewBox="0 0 275 500"
		uniqueKey="card-loader"
		backgroundColor="#1D1D1D"
		foregroundColor="#282828"
		{...props}
	>
		<rect x="0" y="0" rx="11" ry="11" width="275" height="380" />
		<rect x="0" y="400" rx="4" ry="4" width="120" height="16" />
		<rect x="0" y="425" rx="4" ry="4" width="160" height="35" />
		<rect x="0" y="470" rx="4" ry="4" width="100" height="16" />
	</ContentLoader>
)

export default CardLoader
