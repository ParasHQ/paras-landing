import axios from 'axios'
import Button from 'components/Common/Button'
import FollowArtistModal from 'components/Modal/FollowArtistModal'
import LoginModal from 'components/Modal/LoginModal'
import { trackFollowButton, trackUnfollowButton } from 'lib/ga'
import WalletHelper from 'lib/WalletHelper'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

const Follow = ({ userProfile, currentUser }) => {
	const [buttonHover, setButtonHover] = useState(false)
	const [showLogin, setShowLogin] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [followListModal, setFollowListModal] = useState('')

	const fetchProfile = async () => {
		const res = await axios.get(`${process.env.V2_API_URL}/profiles`, {
			params: {
				accountId: userProfile.accountId,
				followed_by: currentUser,
			},
		})
		return (await res.data.data.results[0]) || null
	}

	const { data, mutate } = useSWR(userProfile.accountId, fetchProfile, {
		fallbackData: userProfile,
		revalidateOnFocus: false,
		revalidateIfStale: false,
		revalidateOnReconnect: false,
	})

	useEffect(() => {
		mutate()
	}, [currentUser, mutate])

	const actionFollowUnfollow = async () => {
		if (!currentUser) {
			setShowLogin(true)
			return
		}

		setIsLoading(true)

		try {
			await axios.request({
				url: `${process.env.V2_API_URL}${data.follows ? '/unfollow' : '/follow'}`,
				method: 'PUT',
				headers: {
					authorization: await WalletHelper.authToken(),
				},
				params: {
					account_id: currentUser,
					following_account_id: userProfile.accountId,
				},
			})
		} catch (error) {
			null
		}

		if (data.follows) {
			trackUnfollowButton(data.accountId)
		} else {
			trackFollowButton(data.accountId)
		}

		setTimeout(() => {
			mutate()
			setIsLoading(false)
			setButtonHover(false)
		}, 500)
	}

	const handleFollowModal = (typeList) => {
		if (!currentUser) {
			setShowLogin(true)
			return
		}

		setFollowListModal(typeList)
	}

	return (
		<div>
			{showLogin && <LoginModal onClose={() => setShowLogin(false)} show={showLogin} />}
			<div className="relative flex justify-around gap-20 text-white mt-2 mb-4">
				<div
					className="cursor-pointer hover:text-gray-300"
					onClick={() => handleFollowModal('following')}
				>
					<p className="-mb-1">{data?.following || 0}</p>
					<p>Following</p>
				</div>
				<div
					className="cursor-pointer hover:text-gray-300"
					onClick={() => handleFollowModal('followers')}
				>
					<p className="-mb-1">{data?.followers || 0}</p>
					<p>Followers</p>
				</div>
				<div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 px-[1.5px] py-2 bg-white bg-opacity-50" />
			</div>
			{currentUser !== userProfile.accountId && data?.follows?.follower === currentUser ? (
				<div
					className="mt-4 mb-6 w-3/6 mx-auto"
					onMouseEnter={() => setButtonHover(true)}
					onMouseLeave={() => setButtonHover(false)}
				>
					<Button
						className={`rounded-full w-full ${buttonHover ? 'bg-red-500' : 'bg-[#1B4FA7]'} h-9`}
						size="sm"
						isLoading={isLoading}
						loadingStyle="h-4"
						onClick={() => actionFollowUnfollow()}
					>
						{buttonHover ? 'Unfollow' : 'Following'}
					</Button>
				</div>
			) : (
				currentUser !== userProfile.accountId &&
				currentUser && (
					<div className="mt-4 mb-6 w-3/6 mx-auto">
						<Button
							className="rounded-full w-full bg-primary h-9"
							size="sm"
							isLoading={isLoading}
							loadingStyle="h-4"
							onClick={() => actionFollowUnfollow()}
						>
							Follow
						</Button>
					</div>
				)
			)}
			{followListModal && (
				<FollowArtistModal
					show={true}
					userProfile={data}
					currentUser={currentUser}
					typeFollowListModal={followListModal}
					onClose={() => setFollowListModal('')}
				/>
			)}
		</div>
	)
}

export default Follow
