import React from 'react'
import ContentLoader from 'react-content-loader'

const HomePublicationLoader = (props) => (
	<ContentLoader
		speed={2}
		height="100%"
		viewBox="0 0 400 480"
		backgroundColor="#1d1d1d"
		foregroundColor="#282828"
		uniqueKey="home-publication-loader"
		{...props}
	>
		<rect x="16" y="16" rx="4" ry="4" width="150" height="120" />
		<rect x="182" y="32" rx="4" ry="4" width="120" height="16" />
		<rect x="182" y="60" rx="4" ry="4" width="180" height="24" />
		<rect x="182" y="96" rx="4" ry="4" width="160" height="16" />

		<rect x="16" y="150" rx="4" ry="4" width="150" height="120" />
		<rect x="182" y="166" rx="4" ry="4" width="120" height="16" />
		<rect x="182" y="194" rx="4" ry="4" width="180" height="24" />
		<rect x="182" y="230" rx="4" ry="4" width="160" height="16" />

		<rect x="16" y="284" rx="4" ry="4" width="150" height="120" />
		<rect x="182" y="300" rx="4" ry="4" width="120" height="16" />
		<rect x="182" y="328" rx="4" ry="4" width="180" height="24" />
		<rect x="182" y="364" rx="4" ry="4" width="160" height="16" />
	</ContentLoader>
)

export default HomePublicationLoader
