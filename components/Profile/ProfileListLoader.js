import React from 'react'
import ContentLoader from 'react-content-loader'

const ProfileListLoader = (props) => (
	<div className="md:flex md:flex-wrap">
		{[...Array(3).keys()].map((k) => (
			<div key={k} className="w-full md:w-1/3 flex-shrink-0 md:p-4 relative pb-12">
				<ContentLoader
					key={k}
					speed={2}
					width="100%"
					height="100%"
					viewBox="0 0 275 250"
					uniqueKey="card-loader"
					backgroundColor="#1D1D1D"
					foregroundColor="#282828"
					{...props}
				>
					<rect x="0" y="0" rx="11" ry="11" width="275" height="130" />
					<rect x="95" y="90" rx="77" ry="77" width="77" height="77" />
					<rect x="75" y="180" rx="4" ry="4" width="120" height="18" />
					<rect x="60" y="205" rx="4" ry="4" width="150" height="12" />
					<rect x="98" y="225" rx="4" ry="4" width="20" height="20" />
					<rect x="123" y="225" rx="4" ry="4" width="20" height="20" />
					<rect x="148" y="225" rx="4" ry="4" width="20" height="20" />
				</ContentLoader>
			</div>
		))}
	</div>
)

export default ProfileListLoader
