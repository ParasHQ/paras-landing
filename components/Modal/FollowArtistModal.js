import axios from 'axios'
import Modal from 'components/Common/Modal'
import FollowList from 'components/Follow/FollowList'
import FollowListLoader from 'components/Follow/FollowListLoader'
import { IconX } from 'components/Icons'
import { useEffect, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'

const LIMIT = 10

const FollowArtistModal = ({
	show,
	onClose,
	userProfile,
	currentUser,
	typeFollow,
	fetchDataUdate = () => {},
}) => {
	const [follows, setFollows] = useState([])
	const [followCurrentUser, setFollowCurrentUser] = useState([])
	const [page, setPage] = useState(0)
	const [pageCurrUser, setPageCurrUser] = useState(0)
	const [isFetching, setIsFetching] = useState(false)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [hasMore, setHasMore] = useState(false)
	const [hasMoreCurrUser, setHasMoreCurrUser] = useState(false)
	const [startPositionY, setStartPositionY] = useState(340.5)
	const [endPositionY, setEndPositionY] = useState(404.5)

	const followParams = (_page = 0, type, typeActionFollow) => {
		const params = {
			account_id: type === 'current-user' ? currentUser : userProfile.accountId,
			__skip: typeActionFollow !== 'action-follow' ? _page * LIMIT : 0,
			__limit: typeActionFollow !== 'action-follow' ? LIMIT : LIMIT * _page,
		}
		return params
	}

	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = async (typeActionFollow) => {
		setIsRefreshing(true)

		const resFollowProfile = await axios(
			typeFollow === 'following'
				? `${process.env.V2_API_URL}/followings`
				: `${process.env.V2_API_URL}/followers`,
			{
				params:
					typeActionFollow !== 'action-follow'
						? followParams(page)
						: followParams(page, null, 'action-follow'),
			}
		)

		const resFollowCurrentUser = await axios(`${process.env.V2_API_URL}/followings`, {
			params:
				typeActionFollow !== 'action-follow'
					? followParams(page, 'current-user')
					: followParams(page, 'current-user', 'action-follow'),
		})

		if (resFollowProfile.data.data.length === LIMIT) {
			setPage(1)
			setHasMore(true)
		}
		if (resFollowCurrentUser.data.data.length === LIMIT) {
			setPageCurrUser(1)
			setHasMoreCurrUser(true)
		}

		setFollows(resFollowProfile.data.data)
		setFollowCurrentUser(resFollowCurrentUser.data.data)
		setIsRefreshing(false)
	}

	const getMoreData = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(
			typeFollow === 'following'
				? `${process.env.V2_API_URL}/followings`
				: `${process.env.V2_API_URL}/followers`,
			{
				params: followParams(page),
			}
		)
		const newData = await res.data.data

		const resCurrUser = await axios(
			typeFollow === 'following'
				? `${process.env.V2_API_URL}/followings`
				: `${process.env.V2_API_URL}/followers`,
			{
				params: followParams(page, 'current-user'),
			}
		)
		const newDataCurrUser = await resCurrUser.data.data

		const newFollows = [...follows, ...newData]
		const newFollowCurrUser = [...followCurrentUser, newDataCurrUser]

		setFollows(newFollows)
		setFollowCurrentUser(newFollowCurrUser)
		setPage(page + 1)
		setPageCurrUser(pageCurrUser + 1)

		if (newData.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}

		if (newDataCurrUser.length < LIMIT) {
			setHasMoreCurrUser(false)
		} else {
			setHasMoreCurrUser(true)
		}
		setIsFetching(false)
	}

	const scrollList = (e) => {
		const startPY = 540.5
		const endPY = 604.5
		if (e.scrollTop >= startPositionY && e.scrollTop <= endPositionY) {
			getMoreData()
			setStartPositionY(startPositionY + startPY)
			setEndPositionY(endPositionY + endPY)
		}
	}

	return (
		<>
			<Modal isShow={show} closeOnBgClick={true} closeOnEscape={true} close={onClose}>
				<div className="max-w-sm py-4 w-full bg-dark-primary-2 m-auto rounded-md relative">
					<div className="absolute right-0 top-0 pr-4 pt-4">
						<div className="cursor-pointer" onClick={onClose}>
							<IconX />
						</div>
					</div>
					<div className="px-4">
						<p className="text-2xl font-semibold text-gray-100">
							{typeFollow === 'following' ? 'Following' : 'Followers'}
						</p>
					</div>
					<div className="mr-4">
						<Scrollbars autoHeight autoHeightMax="40vh" onScrollFrame={(e) => scrollList(e)}>
							<div>
								{isRefreshing ? (
									<FollowListLoader length={5} />
								) : (
									<FollowList
										data={follows}
										dataCurrentUser={followCurrentUser}
										userProfile={userProfile}
										getMoreData={getMoreData}
										hasMore={hasMore}
										hasMoreCurrUser={hasMoreCurrUser}
										fetchDataAction={() => fetchData('action-follow')}
										fetchDataUdate={() => fetchDataUdate()}
										typeFollow={typeFollow}
									/>
								)}
							</div>
						</Scrollbars>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default FollowArtistModal
