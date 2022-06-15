import React from 'react'
import ContentLoader from 'react-content-loader'

const CollectionListLoader = (props) => (
	<div className="md:flex md:flex-wrap">
		{[...Array(props.contentLength || 3).keys()].map((k) => (
			<div key={k} className="w-full md:w-1/3 flex-shrink-0 md:p-4 relative ">
				<ContentLoader
					key={k}
					speed={2}
					width="100%"
					height="100%"
					viewBox="0 0 275 250"
					uniqueKey="card-loader"
					backgroundColor="#1D1D1D"
					foregroundColor="#282828"
				>
					<rect x="0" y="0" rx="11" ry="11" width="275" height="130" />
					<rect x="0" y="140" rx="30" ry="30" width="50" height="50" />
					<rect x="60" y="147" rx="4" ry="4" width="120" height="15" />
					<rect x="60" y="170" rx="4" ry="4" width="150" height="10" />
					<rect x="18" y="210" rx="4" ry="4" width="60" height="10" />
					<rect x="13" y="225" rx="4" ry="4" width="70" height="15" />
					<rect x="108" y="210" rx="4" ry="4" width="60" height="10" />
					<rect x="103" y="225" rx="4" ry="4" width="70" height="15" />
					<rect x="198" y="210" rx="4" ry="4" width="60" height="10" />
					<rect x="193" y="225" rx="4" ry="4" width="70" height="15" />
				</ContentLoader>
			</div>
		))}
	</div>
)

export default CollectionListLoader
