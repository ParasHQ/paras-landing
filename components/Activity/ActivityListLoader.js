import ContentLoader from 'react-content-loader'

const ActivityLoader = (props) => (
	<ContentLoader
		speed={2}
		width="100%"
		height="100%"
		viewBox="0 0 1200 430"
		className="hidden md:block"
		backgroundColor="#1D1D1D"
		foregroundColor="#282828"
		uniqueKey="top-activity-loader"
		{...props}
	>
		<rect x="70" y="40" rx="10" ry="10" width="300" height="350" />

		<rect x="430" y="60" rx="4" ry="4" width="350" height="40" />
		<rect x="430" y="110" rx="4" ry="4" width="175" height="20" />
		<rect x="430" y="170" rx="4" ry="4" width="350" height="30" />
		<rect x="430" y="210" rx="4" ry="4" width="175" height="20" />
	</ContentLoader>
)

const ActivityLoaderMobile = (props) => (
	<ContentLoader
		speed={2}
		width="100%"
		height="100%"
		className="md:hidden"
		viewBox="0 0 400 410"
		backgroundColor="#1D1D1D"
		foregroundColor="#282828"
		uniqueKey="top-activity-mobile-loader"
		{...props}
	>
		<rect x="100" y="20" rx="10" ry="10" width="200" height="240" />

		<rect x="50" y="280" rx="4" ry="4" width="300" height="30" />
		<rect x="50" y="320" rx="4" ry="4" width="150" height="10" />
		<rect x="50" y="350" rx="4" ry="4" width="300" height="20" />
		<rect x="50" y="380" rx="4" ry="4" width="140" height="10" />
	</ContentLoader>
)

const ActivityListLoader = () =>
	[...Array(5).keys()].map((k) => (
		<div key={k} className="border-2 border-dashed border-gray-800 rounded-md my-4 mt-6">
			<ActivityLoader />
			<ActivityLoaderMobile />
		</div>
	))

export default ActivityListLoader
