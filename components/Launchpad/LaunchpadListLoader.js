import React from 'react'
import ContentLoader from 'react-content-loader'

const LaunchpadListLoader = (props) =>
	props.uniqueKey === 'big-project-loader' ? (
		<div className="flex flex-wrap mb-14">
			{[...Array(props.contentLength || 4).keys()].map((k) => (
				<div key={k} className="w-full md:w-1/4 flex-shrink-0 relative px-3">
					<ContentLoader
						key={k}
						speed={2}
						width="100%"
						height="100%"
						viewBox="0 0 275 250"
						uniqueKey="big-project-loader"
						backgroundColor="#1D1D1D"
						foregroundColor="#282828"
					>
						<rect x="0" y="0" rx="11" ry="11" width="262" height="160" />
						<rect x="60" y="170" rx="4" ry="4" width="150" height="20" />
						<rect x="30" y="205" rx="4" ry="4" width="70" height="15" />
						<rect x="160" y="205" rx="4" ry="4" width="70" height="15" />
						<rect x="105" y="230" rx="4" ry="4" width="50" height="15" />
					</ContentLoader>
				</div>
			))}
		</div>
	) : (
		<div className="flex pl-3 mb-14">
			{[...Array(props.contentLength || 2).keys()].map((k) => (
				<div key={k} className="w-full relative">
					<ContentLoader
						key={k}
						speed={2}
						width="100%"
						height="100%"
						viewBox="0 0 275 360"
						uniqueKey="small-project-loader"
						backgroundColor="#1D1D1D"
						foregroundColor="#282828"
					>
						<rect x="0" y="0" rx="11" ry="11" width="250" height="250" />
						<rect x="50" y="260" rx="4" ry="4" width="150" height="20" />
						<rect x="30" y="300" rx="4" ry="4" width="70" height="15" />
						<rect x="150" y="300" rx="4" ry="4" width="70" height="15" />
						<rect x="100" y="340" rx="4" ry="4" width="50" height="15" />
					</ContentLoader>
				</div>
			))}
		</div>
	)

export default LaunchpadListLoader
