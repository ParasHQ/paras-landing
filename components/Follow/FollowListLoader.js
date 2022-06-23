import FollowLoader from './FollowLoader'

const FollowListLoader = ({ length = 4 }) => (
	<div className="mt-2 ml-1.5">
		{[...Array(length).keys()].map((k) => {
			return <FollowLoader key={k} uniqueKey={'follow-loader-' + k} />
		})}
	</div>
)

export default FollowListLoader
