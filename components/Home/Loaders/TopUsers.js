import React from 'react'
import ContentLoader from 'react-content-loader'

const TopUserLoader = (props) => (
	<ContentLoader
		speed={2}
		width="100%"
		viewBox="0 0 256 60"
		backgroundColor="#1d1d1d"
		foregroundColor="#282828"
		{...props}
	>
		<circle cx="40" cy="30" r="24" />
		<rect x="80" y="12" rx="4" ry="4" width="130" height="20" />
		<rect x="80" y="40" rx="4" ry="4" width="40" height="10" />
	</ContentLoader>
)

const HomeTopUsersLoader = (props) => {
	return (
		<div className="w-full flex -mx-4 py-2 pb-4">
			{[1, 2, 3, 4, 5].map((x) => {
				return (
					<div className="flex-shrink-0 flex-grow-0">
						<TopUserLoader />
					</div>
				)
			})}
		</div>
	)
}
export default HomeTopUsersLoader
