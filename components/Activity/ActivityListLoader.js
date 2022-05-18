import ContentLoader from 'react-content-loader'

const ActivityLoader = (props) => (
	<ContentLoader
		speed={2}
		width="100%"
		height="100%"
		viewBox="0 0 850 100"
		className="hidden md:block"
		backgroundColor="#1D1D1D"
		foregroundColor="#282828"
		uniqueKey="activity-list-loader"
		{...props}
	>
		<rect x="0" y="10" rx="4" ry="4" width="60" height="60" />

		<rect x="70" y="20" rx="4" ry="4" width="300" height="15" />
		<rect x="70" y="45" rx="4" ry="4" width="300" height="15" />
		<rect x="380" y="20" rx="4" ry="4" width="330" height="15" />
		<rect x="380" y="45" rx="4" ry="4" width="330" height="15" />
		<rect x="720" y="20" rx="4" ry="4" width="100" height="15" />
		<rect x="720" y="45" rx="4" ry="4" width="100" height="15" />
	</ContentLoader>
)

const ActivityLoaderMobile = (props) => (
	<ContentLoader
		speed={2}
		width="100%"
		height="100%"
		className="md:hidden mt-4"
		viewBox="0 0 100 30"
		backgroundColor="#1D1D1D"
		foregroundColor="#282828"
		uniqueKey="top-activity-mobile-loader"
		{...props}
	>
		<rect x="0" y="0" rx="4" ry="4" width="18" height="18" />

		<rect x="22" y="0" rx="4" ry="4" width="60" height="4" />
		<rect x="22" y="7" rx="4" ry="4" width="60" height="4" />
		<rect x="22" y="14" rx="4" ry="4" width="20" height="4" />
	</ContentLoader>
)

const ActivityListLoader = () =>
	[...Array(5).keys()].map((k) => (
		<div key={k}>
			<ActivityLoader />
			<ActivityLoaderMobile />
		</div>
	))

export default ActivityListLoader
