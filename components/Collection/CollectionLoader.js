import React from 'react'
import ContentLoader from 'react-content-loader'

const CollectionLoader = (props) => (
	<div className="flex flex-col items-center justify-center">
		<div style={{ width: '128px' }}>
			<ContentLoader
				speed={2}
				viewBox="0 0 128 128"
				backgroundColor="#1d1d1d"
				foregroundColor="#282828"
				uniqueKey="collection-loader-1"
				{...props}
			>
				<rect x="0" y="0" rx="4" ry="4" width="128" height="128" />
			</ContentLoader>
		</div>
		<div style={{ width: '188px' }}>
			<ContentLoader
				speed={2}
				viewBox="0 0 128 26"
				backgroundColor="#1d1d1d"
				uniqueKey="collection-loader-2"
				foregroundColor="#282828"
				{...props}
			>
				<rect x="0" y="10" rx="4" ry="4" width="128" height="16" />
			</ContentLoader>
		</div>
		<div style={{ width: '210px' }}>
			<ContentLoader
				speed={2}
				viewBox="0 0 150 60"
				backgroundColor="#1d1d1d"
				uniqueKey="collection-loader-3"
				foregroundColor="#282828"
				{...props}
			>
				<rect x="0" y="10" rx="4" ry="4" width="150" height="10" />
			</ContentLoader>
		</div>
	</div>
)

export default CollectionLoader
