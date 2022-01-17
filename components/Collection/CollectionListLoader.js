import React from 'react'
import ContentLoader from 'react-content-loader'

const CardLoader = (props) => (
	<ContentLoader
		speed={2}
		width="100%"
		height="100%"
		viewBox="0 0 128 10"
		uniqueKey="card-loader"
		backgroundColor="#1D1D1D"
		foregroundColor="#282828"
		className="mt-10"
		{...props}
	>
		<rect x="0" y="0" rx="0" ry="0" width="35" height="30" />
		<rect x="0" y="32" rx="0" ry="0" width="35" height="2" />
		<rect x="0" y="35" rx="0" ry="0" width="35" height="2" />
		<rect x="40" y="0" rx="0" ry="0" width="35" height="30" />
		<rect x="40" y="32" rx="0" ry="0" width="35" height="2" />
		<rect x="40" y="35" rx="0" ry="0" width="35" height="2" />
		<rect x="80" y="0" rx="0" ry="0" width="35" height="30" />
		<rect x="80" y="32" rx="0" ry="0" width="35" height="2" />
		<rect x="80" y="35" rx="0" ry="0" width="35" height="2" />
	</ContentLoader>
)

export default CardLoader
