import React from 'react'
import ContentLoader from 'react-content-loader'

const LaunchpadContentLoader = (props) =>
	props.uniqueKey === 'big-launchpad-content-loader' ? (
		<div>
			{[...Array(props.contentLength || 1).keys()].map((k) => (
				<div key={k} className="w-full flex-shrink-0 relative">
					<ContentLoader
						key={k}
						speed={2}
						width="100%"
						height="100%"
						viewBox="0 0 1000 600"
						uniqueKey="big-project-loader"
						backgroundColor="#1D1D1D"
						foregroundColor="#282828"
					>
						<rect x="10%" y="0" rx="4" ry="4" width="90%" height="30" />
						<rect x="0" y="50" rx="4" ry="4" width="100%" height="30" />
						<rect x="0" y="100" rx="4" ry="4" width="100%" height="30" />
						<rect x="0" y="150" rx="4" ry="4" width="100%" height="30" />
						<rect x="0" y="200" rx="4" ry="4" width="100%" height="30" />
						<rect x="0" y="300" rx="4" ry="4" width="100%" height="30" />
						<rect x="0" y="350" rx="4" ry="4" width="100%" height="30" />
						<rect x="0" y="400" rx="4" ry="4" width="100%" height="30" />
						<rect x="0" y="450" rx="4" ry="4" width="100%" height="30" />
						<rect x="0" y="500" rx="4" ry="4" width="100%" height="30" />
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
						viewBox="0 0 1000 600"
						uniqueKey="small-project-loader"
						backgroundColor="#1D1D1D"
						foregroundColor="#282828"
					>
						<rect x="10%" y="0" rx="4" ry="4" width="90%" height="30" />
						<rect x="0" y="50" rx="4" ry="4" width="100%" height="30" />
						<rect x="0" y="100" rx="4" ry="4" width="100%" height="30" />
						<rect x="0" y="150" rx="4" ry="4" width="100%" height="30" />
						<rect x="0" y="200" rx="4" ry="4" width="100%" height="30" />
						<rect x="0" y="300" rx="4" ry="4" width="100%" height="30" />
						<rect x="0" y="350" rx="4" ry="4" width="100%" height="30" />
						<rect x="0" y="400" rx="4" ry="4" width="100%" height="30" />
						<rect x="0" y="450" rx="4" ry="4" width="100%" height="30" />
						<rect x="0" y="500" rx="4" ry="4" width="100%" height="30" />
					</ContentLoader>
				</div>
			))}
		</div>
	)

export default LaunchpadContentLoader
