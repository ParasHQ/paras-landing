import ContentLoader from 'react-content-loader'

const TopActivityLoader = (props) => (
	<ContentLoader
		speed={2}
		width="100%"
		height="100%"
		viewBox="0 0 1200 230"
		className="hidden md:block"
		backgroundColor="#1D1D1D"
		foregroundColor="#282828"
		uniqueKey="top-activity-loader"
		{...props}
	>
		<circle cx="80" cy="80" r="45" />
		<rect x="145" y="40" rx="4" ry="4" width="250" height="25" />
		<rect x="145" y="75" rx="4" ry="4" width="175" height="15" />
		<rect x="145" y="100" rx="4" ry="4" width="150" height="15" />

		<rect x="500" y="40" rx="4" ry="4" width="125" height="160" />
		<rect x="640" y="40" rx="4" ry="4" width="125" height="160" />
		<rect x="780" y="40" rx="4" ry="4" width="125" height="160" />
		<rect x="920" y="40" rx="4" ry="4" width="125" height="160" />
		<rect x="1060" y="40" rx="4" ry="4" width="125" height="160" />
	</ContentLoader>
)

const TopActivityLoaderMobile = (props) => (
	<ContentLoader
		speed={2}
		width="100%"
		height="100%"
		className="md:hidden"
		viewBox="0 0 400 300"
		backgroundColor="#1D1D1D"
		foregroundColor="#282828"
		uniqueKey="top-activity-mobile-loader"
		{...props}
	>
		<circle cx="70" cy="60" r="45" />
		<rect x="145" y="20" rx="4" ry="4" width="220" height="25" />
		<rect x="145" y="55" rx="4" ry="4" width="175" height="15" />
		<rect x="145" y="80" rx="4" ry="4" width="150" height="15" />

		<rect x="25" y="140" rx="4" ry="4" width="105" height="130" />
		<rect x="145" y="140" rx="4" ry="4" width="105" height="130" />
		<rect x="265" y="140" rx="4" ry="4" width="105" height="130" />
	</ContentLoader>
)

const TopActivityListLoader = () =>
	[...Array(5).keys()].map((k) => (
		<div key={k} className="border-2 border-dashed border-gray-800 rounded-md my-4">
			<TopActivityLoader />
			<TopActivityLoaderMobile />
		</div>
	))

export default TopActivityListLoader
