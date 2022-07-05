import ContentLoader from 'react-content-loader'

const ActivityUserFollowLoader = () => {
	return (
		<>
			<div className="md:block hidden">
				<DesktopLoader />
			</div>
			<div className="md:hidden">
				<MobileLoader />
			</div>
		</>
	)
}

const MobileLoader = () =>
	[1, 2, 3, 4].map((k) => {
		return (
			<div key={k} className="border border-gray-600 rounded-xl mb-8 mx-4">
				<ContentLoader
					speed={2}
					width="100%"
					height="100%"
					viewBox="0 0 88 88"
					uniqueKey={`activity-user-follow-loader-mobile-${k}`}
					backgroundColor="#1D1D1D"
					foregroundColor="#282828"
				>
					<rect x="28" y="5" rx="1.5" ry="1.5" width="29" height="40" />
					<rect x="6" y="49" rx="1.5" ry="1.5" width="74" height="20" />
					<rect x="6" y="72" rx="1.5" ry="1.5" width="74" height="8" />
				</ContentLoader>
			</div>
		)
	})

const DesktopLoader = () =>
	[1, 2, 3, 4].map((k) => {
		return (
			<div key={k} className="border border-gray-600 rounded-xl mb-8 mx-4">
				<ContentLoader
					key={k}
					speed={2}
					width="100%"
					height="100%"
					viewBox="0 0 88 35"
					uniqueKey={`activity-user-follow-loader-${k}`}
					backgroundColor="#1D1D1D"
					foregroundColor="#282828"
				>
					<rect x="1.5" y="2" rx="1.5" ry="1.5" width="22.5" height="31.5" />
					<rect x="26.5" y="2.75" rx="0.5" ry="0.5" width="30" height="4" />
					<rect x="26.5" y="13" rx="0.5" ry="0.5" width="20" height="8" />
					<rect x="26.5" y="28" rx="0.5" ry="0.5" width="60" height="4" />
				</ContentLoader>
			</div>
		)
	})

export default ActivityUserFollowLoader
