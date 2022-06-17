import axios from 'axios'
import Modal from 'components/Common/Modal'
import FollowList from 'components/Follow/FollowList'
import FollowListLoader from 'components/Follow/FollowListLoader'
import { IconX } from 'components/Icons'
import { useEffect, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'

const LIMIT = 10

const FollowArtistModal = ({ show, onClose, userProfile, currentUser, typeFollowListModal }) => {
	const [data, setData] = useState([])
	const [page, setPage] = useState(0)
	const [isFetching, setIsFetching] = useState(false)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [hasMore, setHasMore] = useState(false)
	const [startPositionY, setStartPositionY] = useState(340.5)
	const [endPositionY, setEndPositionY] = useState(404.5)

	const followParams = (_page = 0) => {
		const params = {
			account_id: userProfile.accountId,
			followed_by: currentUser,
			__skip: _page * LIMIT,
			__limit: LIMIT,
		}
		return params
	}

	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = async () => {
		setIsRefreshing(true)

		const res = await axios(
			typeFollowListModal === 'following'
				? `${process.env.V2_API_URL}/followings`
				: `${process.env.V2_API_URL}/followers`,
			{
				params: followParams(page),
			}
		)

		if (res.data.data.length === LIMIT) {
			setPage(1)
			setHasMore(true)
		}

		setData(res.data.data)
		setIsRefreshing(false)
	}

	const getMoreData = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(
			typeFollowListModal === 'following'
				? `${process.env.V2_API_URL}/followings`
				: `${process.env.V2_API_URL}/followers`,
			{
				params: followParams(page),
			}
		)
		const dataRes = await res.data.data
		const newData = [...data, ...dataRes]

		setData(newData)
		setPage(page + 1)

		if (dataRes.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)
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
						<p className="text-2xl text-left font-semibold text-gray-100">
							{typeFollowListModal === 'following' ? 'Following' : 'Followers'}
						</p>
					</div>
					<div>
						<Scrollbars autoHeight autoHeightMax="35vh" onScrollFrame={(e) => scrollList(e)}>
							<div>
								{isRefreshing ? (
									<FollowListLoader length={5} />
								) : (
									<FollowList
										data={data}
										userProfile={userProfile}
										getMoreData={getMoreData}
										hasMore={hasMore}
										typeFollow={typeFollowListModal}
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
