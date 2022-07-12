import React from 'react'
import ContentLoader from 'react-content-loader'

const LaunchpadButtonLoader = (props) =>
	props.uniqueKey === 'big-launchpad-button-loader' ? (
		<div>
			{[...Array(props.contentLength || 1).keys()].map((k) => (
				<div key={k} className="w-full flex-shrink-0 relative">
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
						<rect x="0" y="0" rx="4" ry="4" width="100%" height="30" />
					</ContentLoader>
				</div>
			))}
		</div>
	) : (
		<div>
			{[...Array(props.contentLength || 1).keys()].map((k) => (
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
						<rect x="0" y="0" rx="4" ry="4" width="100%" height="35" />
					</ContentLoader>
				</div>
			))}
		</div>
	)

export default LaunchpadButtonLoader
