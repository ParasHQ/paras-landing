import axios from 'axios'
import Button from 'components/Common/Button'
import { useEffect, useState } from 'react'

const Follow = ({
	followingAmount,
	followerAmount,
	userProfile,
	currentUser,
	fetchDataUpdate,
	isLogin = () => {},
	showFollowModal = () => {},
}) => {
	const [buttonHover, setButtonHover] = useState(false)
	const [data, setData] = useState([])
	const [following, setFollowing] = useState(followingAmount)
	const [followers, setFollowers] = useState(followerAmount)

	useEffect(() => {
		if (fetchDataUpdate) {
			fetchData('update-data')
			return
		}
		fetchData()
	}, [userProfile, currentUser, fetchDataUpdate])

	const fetchData = async (type) => {
		const res = await axios.get(`${process.env.V2_API_URL}/followings`, {
			params: {
				account_id: currentUser,
			},
		})
		const resProfile = await axios.get(`${process.env.V2_API_URL}/profiles`, {
			params: {
				accountId: userProfile.accountId,
			},
		})
		const dataCurrentUser = res.data.data
		const dataUserProfile = (await resProfile.data.data.results[0]) || null

		if (type === 'update-data') {
			setData(dataCurrentUser)
			setFollowing(dataUserProfile.following)
			setFollowers(dataUserProfile.followers)
			return
		}
		let checkData = dataCurrentUser
		checkData.filter((user) => {
			if (userProfile.accountId === user.account_id) {
				Object.defineProperty(user, 'isFollowed', {
					value: true,
					writeable: true,
					enumerable: true,
				})
				setData(user)
			}
		})
		setFollowing(dataUserProfile.following)
		setFollowers(dataUserProfile.followers)
	}

	return (
		<div>
			<div className="relative flex justify-between gap-32 text-white mt-2 mb-4">
				<div
					className="cursor-pointer hover:text-gray-300"
					onClick={() => showFollowModal('following')}
				>
					<p className="-mb-1">{following ? following : 0}</p>
					<p>Following</p>
				</div>
				<div
					className="cursor-pointer hover:text-gray-300"
					onClick={() => showFollowModal('followers')}
				>
					<p className="-mb-1">{followers ? followers : 0}</p>
					<p>Followers</p>
				</div>
				<div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 px-[1.5px] py-2 bg-white bg-opacity-50" />
			</div>
			{currentUser !== userProfile.accountId && data?.isFollowed ? (
				<Button
					className={`mt-4 mb-6 rounded-full w-3/6 ${buttonHover && 'bg-red-500'}`}
					size="sm"
					onMouseEnter={() => setButtonHover(true)}
					onMouseLeave={() => setButtonHover(false)}
					onClick={() => isLogin('unfollow')}
				>
					{buttonHover ? 'Unfollow' : 'Following'}
				</Button>
			) : (
				currentUser !== userProfile.accountId &&
				currentUser && (
					<Button
						className="mt-4 mb-6 rounded-full w-3/6 bg-primary"
						size="sm"
						onMouseEnter={() => setButtonHover(true)}
						onMouseLeave={() => setButtonHover(false)}
						onClick={() => isLogin('follow')}
					>
						Follow
					</Button>
				)
			)}
		</div>
	)
}

export default Follow
