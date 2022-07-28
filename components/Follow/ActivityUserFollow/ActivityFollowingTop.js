import { trackFollowingClick } from 'lib/ga'
import Link from 'next/link'
import { parseImgUrl, prettyTruncate, timeAgo } from 'utils/common'
import ActivityDescriptionTop from './ActivityDescriptionTop'

const ActivityFollowingTop = ({
	accountId,
	profile,
	activity,
	token,
	onClickToCollection,
	onClickToSeeDetails,
}) => {
	return (
		<div className="flex space-x-2">
			<Link href={`/${accountId}`}>
				<a
					onClick={() => trackFollowingClick('Following_click_artist')}
					className={`w-10 h-10 overflow-hidden ${
						!profile?.imgUrl ? 'bg-primary' : 'bg-dark-primary-2'
					} rounded-full cursor-pointer`}
				>
					<img
						src={parseImgUrl(profile?.imgUrl, null, { width: `300` })}
						className="w-full object-cover rounded-full cursor-pointer"
					/>
				</a>
			</Link>
			<div>
				<div className="flex gap-3 items-baseline">
					<Link href={`/${accountId}`}>
						<a
							className="text-white text-sm hover:underline"
							onClick={() => trackFollowingClick('Following_click_artist')}
						>
							{prettyTruncate(accountId, 15, 'address')}
						</a>
					</Link>
					<p className="text-gray-400 text-xs">{timeAgo.format(new Date(activity.msg.datetime))}</p>
				</div>
				<p className="text-white text-sm">
					<ActivityDescriptionTop
						activity={activity}
						token={token}
						onClickToCollection={onClickToCollection}
						onClickToSeeDetails={onClickToSeeDetails}
					/>
				</p>
			</div>
		</div>
	)
}

export default ActivityFollowingTop
