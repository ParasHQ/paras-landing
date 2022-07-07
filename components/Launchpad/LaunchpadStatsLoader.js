import React from 'react'
import ContentLoader from 'react-content-loader'

const LaunchpadStatsLoader = (props) =>
	props.uniqueKey === 'big-launchpad-stats-loader' ? (
		<div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between text-gray-200 mb-9">
			{[...Array(props.contentLength || 4).keys()].map((k) => (
				<div key={k} className="w-full md:w-2/12 flex-shrink-0 relative">
					<ContentLoader
						key={k}
						speed={2}
						width="100%"
						height="100%"
						viewBox="0 0 150 100"
						uniqueKey="big-project-loader"
						backgroundColor="#1D1D1D"
						foregroundColor="#282828"
					>
						<rect x="20" y="5" rx="4" ry="4" width="100" height="25" />
						<rect x="0" y="35" rx="4" ry="4" width="135" height="20" />
					</ContentLoader>
				</div>
			))}
		</div>
	) : (
		<div className="max-w-3xl mx-auto grid grid-cols-2 text-gray-200 mb-9">
			{[...Array(props.contentLength || 4).keys()].map((k) => (
				<div key={k} className="w-full relative">
					<ContentLoader
						key={k}
						speed={2}
						width="100%"
						height="100%"
						viewBox="0 0 150 60"
						uniqueKey="small-project-loader"
						backgroundColor="#1D1D1D"
						foregroundColor="#282828"
					>
						<rect x="36" y="5" rx="4" ry="4" width="80" height="20" />
						<rect x="25" y="35" rx="4" ry="4" width="100" height="10" />
					</ContentLoader>
				</div>
			))}
		</div>
	)

export default LaunchpadStatsLoader
