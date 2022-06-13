import axios from 'axios'
import Modal from 'components/Common/Modal'
import FollowList from 'components/Follow/FollowList'
import FollowListLoader from 'components/Follow/FollowListLoader'
import { IconX } from 'components/Icons'
import { useEffect, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'

const LIMIT = 10

const FollowArtistModal = ({ show, onClose, typeFollow }) => {
	const [follows, setFollows] = useState([])
	const [page, setPage] = useState(1)
	const [isFetching, setIsFetching] = useState(false)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [hasMore, setHasMore] = useState(false)
	const [startPositionY, setStartPositionY] = useState(340.5)
	const [endPositionY, setEndPositionY] = useState(404.5)

	const followParams = (_page = 1, type) => {
		const params = {
			page: type !== 'action-unfollow' ? _page : 1,
			limit: type !== 'action-unfollow' ? LIMIT : LIMIT * (page === 1 ? page : page - 1),
		}
		return params
	}

	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = async (type) => {
		setIsRefreshing(true)

		let res
		res = await axios(
			typeFollow === 'following'
				? `https://629fb1fd461f8173e4ef3a60.mockapi.io/api/v1/followings`
				: `https://629fb1fd461f8173e4ef3a60.mockapi.io/api/v1/followers`,
			{
				params:
					type !== 'action-unfollow' ? followParams(page) : followParams(page, 'action-unfollow'),
			}
		)
		if (res.data.length === LIMIT && type !== 'action-unfollow') {
			setPage(2)
			setHasMore(true)
		}
		setFollows(res.data)
		setIsRefreshing(false)
	}

	const getMoreData = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(
			typeFollow === 'following'
				? `https://629fb1fd461f8173e4ef3a60.mockapi.io/api/v1/followings`
				: `https://629fb1fd461f8173e4ef3a60.mockapi.io/api/v1/followers`,
			{
				params: followParams(page),
			}
		)
		const newData = await res.data

		const newFollows = [...follows, ...newData]
		setFollows(newFollows)
		setPage(page + 1)
		if (newData.length < LIMIT) {
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
				<div>
					<Scrollbars autoHeight autoHeightMax="30vh" onScrollFrame={(e) => scrollList(e)}>
						<div className="ml-2">
							{isRefreshing ? (
								<FollowListLoader length={5} />
							) : (
								<FollowList
									data={follows}
									getMoreData={getMoreData}
									hasMore={hasMore}
									fetchDataAction={() => fetchData('action-unfollow')}
								/>
							)}
						</div>
					</Scrollbars>
				</div>
			</div>
		</Modal>
	)
}

export default FollowArtistModal
