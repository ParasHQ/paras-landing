import ContentLoader from 'react-content-loader'

const CardStatLoader = (props) => (
	<ContentLoader
		speed={2}
		width="100%"
		height="100%"
		viewBox="0 0 1200 260"
		backgroundColor="#1D1D1D"
		foregroundColor="#282828"
		uniqueKey="card-stat-loader"
		{...props}
	>
		<rect x="0" y="0" rx="8" ry="8" width="200" height="260" />
		<rect x="229" y="72" rx="4" ry="4" width="300" height="36" />
		<rect x="229" y="124" rx="4" ry="4" width="140" height="24" />
		<rect x="229" y="164" rx="4" ry="4" width="220" height="24" />
		<rect x="600" y="118" rx="4" ry="4" width="48" height="24" />
		<rect x="710" y="118" rx="4" ry="4" width="64" height="24" />

		<rect x="812" y="103" rx="4" ry="4" width="80" height="24" />
		<rect x="828" y="133" rx="4" ry="4" width="48" height="24" />

		<rect x="922" y="103" rx="4" ry="4" width="80" height="24" />
		<rect x="938" y="133" rx="4" ry="4" width="48" height="24" />

		<rect x="1041" y="118" rx="4" ry="4" width="48" height="24" />

		<rect x="1136" y="118" rx="4" ry="4" width="64" height="24" />
	</ContentLoader>
)

export default CardStatLoader
