import React from 'react'
import ContentLoader from 'react-content-loader'

const CollectionListLoader = (props) => (
	<div className="md:flex md:flex-wrap">
		{[...Array(3).keys()].map((k) => (
			<div key={k} className="w-full md:w-1/3 flex-shrink-0 md:p-4 relative ">
				<ContentLoader
					key={k}
					speed={2}
					width="100%"
					height="100%"
					viewBox="0 0 275 290"
					uniqueKey="card-loader"
					backgroundColor="#1D1D1D"
					foregroundColor="#282828"
					{...props}
				>
					<rect x="0" y="0" rx="11" ry="11" width="275" height="230" />
					<rect x="0" y="240" rx="4" ry="4" width="160" height="15" />
					<rect x="0" y="260" rx="4" ry="4" width="120" height="10" />
				</ContentLoader>
			</div>
		))}
	</div>
)

export default CollectionListLoader
