import axios from 'axios'
import Avatar from 'components/Common/Avatar'
import Button from 'components/Common/Button'
import { IconVerified } from 'components/Icons'
import { useToast } from 'hooks/useToast'
import useStore from 'lib/store'
import WalletHelper from 'lib/WalletHelper'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { parseImgUrl, prettyTruncate } from 'utils/common'
import FollowListLoader from './FollowListLoader'

const FollowList = ({
	data,
	dataCurrentUser,
	userProfile,
	getMoreData,
	hasMore,
	hasMoreCurrUser,
	typeFollow,
	fetchDataAction = () => {},
	fetchDataUdate = () => {},
}) => {
	const [buttonHover, setButtonHover] = useState()
	const [newDataChecked, setNewDataChecked] = useState([])
	const currentUser = useStore((state) => state.currentUser)
	const toast = useToast()

	useEffect(() => {
		let checkDataFollow = data
		dataCurrentUser.filter((currUser) => {
			return checkDataFollow.some((user) => {
				if (currUser.account_id === user.account_id) {
					return Object.defineProperty(user, 'isFollowed', {
						value: true,
						writeable: true,
						enumerable: true,
					})
				}
			})
		})
		setNewDataChecked(checkDataFollow)
	}, [dataCurrentUser, data])

	const actionButton = async (data, type) => {
		const options = {
			url: `${process.env.V2_API_URL}/${type === 'follow' ? 'follow' : 'unfollow'}`,
			method: 'PUT',
			headers: {
				authorization: await WalletHelper.authToken(),
			},
			params: {
				account_id: currentUser,
				following_account_id: data.account_id,
			},
		}
		try {
			const resp = await axios.request(options)
			if (resp) {
				if (resp) {
					toast.show({
						text: (
							<div className="font-semibold text-center text-sm">
								Successfully {type === 'follow' ? 'Followed' : 'Unfollowed'}
							</div>
						),
						type: 'success',
						duration: 1000,
					})
					fetchDataAction()
					fetchDataUdate()
				}
			}
		} catch (err) {
			const msg = err.response?.data?.message || 'Something went wrong, try again later.'
			toast.show({
				text: <div className="font-semibold text-center text-sm">{msg}</div>,
				type: 'error',
				duration: 1000,
			})
			fetchDataAction()
			fetchDataUdate()
		}
	}

	return (
		<div className="rounded-md ml-1 md:ml-0">
			{newDataChecked.length === 0 && !hasMore && (
				<div className="w-full">
					<div className="m-auto text-2xl text-gray-600 font-semibold py-20 text-center">
						{typeFollow === 'following' ? <p>No Following</p> : <p>No Followers</p>}
					</div>
				</div>
			)}
			<InfiniteScroll
				dataLength={newDataChecked.length}
				next={getMoreData}
				hasMore={hasMore || hasMoreCurrUser}
				loader={<FollowListLoader length={3} />}
			>
				<div className="ml-2">
					{newDataChecked.map((user, idx) => {
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
								<div
									className="absolute right-4"
									onMouseEnter={() => setButtonHover(idx)}
									onMouseLeave={() => setButtonHover(null)}
								>
									{currentUser === userProfile.accountId &&
									currentUser !== user.account_id &&
									user?.isFollowed ? (
										<ButtonUnfollow
											idx={idx}
											buttonHover={buttonHover}
											followAction={() => actionButton(user, 'unfollow')}
										/>
									) : user?.isFollowed && currentUser !== user.account_id ? (
										<ButtonUnfollow
											idx={idx}
											buttonHover={buttonHover}
											followAction={() => actionButton(user, 'unfollow')}
										/>
									) : (
										currentUser !== user.account_id && (
											<Button
												key={idx}
												className="mt-1 px-2 w-20 bg-primary"
												size="sm"
												variant="primary"
												onClick={() => actionButton(user, 'follow')}
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

const ButtonUnfollow = ({ idx, buttonHover, followAction = () => {} }) => {
	return (
		<Button
			key={idx}
			className={`mt-1 px-2 w-20 ${buttonHover === idx ? 'hover:bg-red-500' : 'bg-[#1B4FA7]'}`}
			size="sm"
			variant="error"
			onClick={() => followAction()}
		>
			{buttonHover === idx ? 'Unfollow' : 'Following'}
		</Button>
	)
}
