import Button from 'components/Common/Button'
import { useState } from 'react'

const Follow = ({ dataFollowing, dataFollower, showFollowModal = () => {} }) => {
	const [buttonHover, setButtonHover] = useState(false)

	return (
		<div>
			<div className="relative flex justify-between gap-32 text-white">
				<div
					className="cursor-pointer hover:text-gray-300"
					onClick={() => showFollowModal('following')}
				>
					<p className="-mb-1">{dataFollowing ? Object.keys(dataFollowing).length : 0}</p>
					<p>Following</p>
				</div>
				<div
					className="cursor-pointer hover:text-gray-300"
					onClick={() => showFollowModal('followers')}
				>
					<p className="-mb-1">{dataFollower ? Object.keys(dataFollower).length : 0}</p>
					<p>Followers</p>
				</div>
				<div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 px-[1.5px] py-2 bg-white bg-opacity-50" />
			</div>
			<Button
				className={`mt-4 mb-6 rounded-full w-3/6 ${buttonHover && 'bg-red-500'}`}
				size="sm"
				onMouseEnter={() => setButtonHover(true)}
				onMouseLeave={() => setButtonHover(false)}
			>
				{buttonHover ? 'Unfollow' : 'Following'}
			</Button>
		</div>
	)
}

export default Follow
