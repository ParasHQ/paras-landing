import React from 'react'
import ContentLoader from 'react-content-loader'

const FollowLoader = ({ props }) => (
	<ContentLoader
		speed={2}
		width="100%"
		height="100%"
		viewBox="0 0 275 45"
		uniqueKey="follow-loader"
		backgroundColor="#332D3B"
		foregroundColor="#473E52"
		{...props}
	>
		<>
			<rect x="0" y="0" rx="100%" ry="100%" width="40" height="40" />
			<rect x="44" y="8" rx="4" ry="4" width="140" height="23" />
			<rect x="204" y="8" rx="4" ry="4" width="58" height="23" />
		</>
	</ContentLoader>
)

export default FollowLoader
