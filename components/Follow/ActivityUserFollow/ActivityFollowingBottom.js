import Button from 'components/Common/Button'
import ActivityDescriptionBottom from './ActivityDescriptionBottom'

const ActivityFollowingBottom = ({ onClickToSeeDetails, activity, token }) => {
	return (
		<div>
			<hr className="border-gray-600 mb-3" />
			<div className="flex items-end justify-between flex-row-reverse">
				<Button size="md" className="px-8" onClick={onClickToSeeDetails}>
					See Details
				</Button>
				<ActivityDescriptionBottom activity={activity} token={token} />
			</div>
		</div>
	)
}

export default ActivityFollowingBottom
