import axios from 'axios'
import Avatar from 'components/Common/Avatar'
import Button from 'components/Common/Button'
import { IconVerified } from 'components/Icons'
import { trackFollowButton, trackUnfollowButton } from 'lib/ga'
import useStore from 'lib/store'
import WalletHelper from 'lib/WalletHelper'
import Link from 'next/link'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { mutate } from 'swr'
import { parseImgUrl, prettyTruncate } from 'utils/common'
import FollowListLoader from './FollowListLoader'

const FollowList = ({ data, userProfile, getMoreData, hasMore, typeFollow }) => {
	const [buttonHover, setButtonHover] = useState('')
	const currentUser = useStore((state) => state.currentUser)
	const [isLoading, setIsLoading] = useState('')

	const actionFollowUnfollow = async (user, typeAction) => {
		setIsLoading(user.account_id)

		const res = await axios.request({
			url: `${process.env.V2_API_URL}${typeAction === 'follow' ? '/follow' : '/unfollow'}`,
			method: 'PUT',
			headers: {
				authorization: await WalletHelper.authToken(),
			},
			params: {
				account_id: currentUser,
				following_account_id: user.account_id,
			},
		})

		if (res.status === 200) {
			Object.defineProperty(user, 'isFollowed', {
				value: !user?.isFollowed,
				writable: true,
				enumerable: true,
			})
			setButtonHover(null)

			if (typeAction === 'follow') {
				trackFollowButton(user.account_id)
			} else {
				trackUnfollowButton(user.account_id)
			}
		}

		setIsLoading('')

		if (currentUser === userProfile.accountId) {
			setTimeout(() => {
				mutate(userProfile.accountId)
			}, 200)
		}
	}

	return (
		<div className="rounded-md ml-1 md:ml-0">
			{data.length === 0 && !hasMore && (
				<div className="w-full">
					<div className="m-auto text-2xl text-gray-600 font-semibold py-20 text-center">
						{typeFollow === 'following' ? <p>No Following</p> : <p>No Followers</p>}
					</div>
				</div>
			)}
			<InfiniteScroll
				dataLength={data.length}
				next={getMoreData}
				hasMore={hasMore}
				loader={<FollowListLoader length={3} />}
				scrollableTarget="follow-scroll"
			>
				<div className="ml-1">
					{data.map((user, idx) => {
						return (
							<div className="flex items-center gap-2 mt-2" key={idx}>
								<div className={`ml-1 md:ml-2 ${user?.flag && 'opacity-50'}`}>
									<Link href={`/${user.account_id}`}>
										<div className="relative hover:opacity-80 cursor-pointer">
											<a>
												<Avatar
													size="lg"
													src={parseImgUrl(user.imgUrl, null, {
														width: `50`,
													})}
													className="align-bottom"
												/>
											</a>
										</div>
									</Link>
								</div>
								<div>
									<div className={`text-white flex gap-1 ${user?.flag && 'opacity-50'}`}>
										<Link href={`/${user.account_id}`}>
											<a className="hover:opacity-80 mt-1">{prettyTruncate(user.account_id, 15)}</a>
										</Link>
										{user?.isCreator && <IconVerified size={15} color="#0816B3" />}
									</div>
								</div>
								<div className="absolute right-4">
									{user?.isFollowed && currentUser !== user.account_id ? (
										<div
											onMouseEnter={() => setButtonHover(idx)}
											onMouseLeave={() => setButtonHover(null)}
										>
											<ButtonUnfollow
												idx={idx}
												buttonHover={buttonHover}
												loading={isLoading === user.account_id ? true : false}
												followAction={() => actionFollowUnfollow(user, 'unfollow')}
											/>
										</div>
									) : (
										currentUser !== user.account_id && (
											<Button
												key={idx}
												className="mt-1 px-2 w-20 bg-primary h-9"
												size="sm"
												variant="primary"
												isLoading={isLoading === user.account_id ? true : false}
												loadingStyle="h-2"
												onClick={() => actionFollowUnfollow(user, 'follow')}
											>
												Follow
											</Button>
										)
									)}
								</div>
							</div>
						)
					})}
				</div>
			</InfiniteScroll>
		</div>
	)
}

export default FollowList

const ButtonUnfollow = ({ idx, buttonHover, loading, followAction = () => {} }) => {
	return (
		<Button
			key={idx}
			className={`mt-1 px-2 w-20 ${buttonHover === idx ? 'hover:bg-red-500' : 'bg-[#1B4FA7]'} h-9`}
			size="sm"
			loadingStyle="h-2"
			isLoading={loading}
			onClick={() => followAction()}
		>
			{buttonHover === idx ? 'Unfollow' : 'Following'}
		</Button>
	)
}
