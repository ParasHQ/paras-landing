import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import useStore from '../lib/store'
import ActivityDetail from '../components/ActivityDetail'
import { useRouter } from 'next/router'
import TopUsers from '../components/TopUsers'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import FilterActivity from '../components/FilterActivity'

const FETCH_TOKENS_LIMIT = 10

const ActivityLog = ({ query }) => {
	const {
		activityList,
		setActivityList,
		activityListPage,
		setActivityListPage,
		activityListHasMore,
		setActivityListHasMore,
	} = useStore()
	const router = useRouter()
	const modalRef = useRef()

	const [isFetching, setIsFetching] = useState(false)
	const [topUser, setTopUser] = useState([])
	const [showModal, setShowModal] = useState(false)
	const [activityType, setActivityType] = useState('activity')

	useEffect(() => {
		const onClick = (e) => {
			if (!modalRef.current.contains(e.target)) {
				setShowModal(false)
			}
		}
		if (showModal) {
			document.body.addEventListener('click', onClick)
		}
		return () => {
			document.body.removeEventListener('click', onClick)
		}
	})

	useEffect(async () => {
		if (query) {
			_fetchData(query, true)
		} else {
			_fetchData({}, true)
		}
		const res = await axios(
			`${process.env.V2_API_URL}/activities/top-users?__limit=5`
		)
		setTopUser(res.data.data)
	}, [])

	const onClickFilter = (query) => {
		_fetchData(query, true)
	}

	const onClickType = (type) => {
		setActivityType(type)
		setShowModal(false)
	}

	const _filterQuery = (filter) => {
		if (!filter || filter === 'showAll') {
			return ``
		}
		return `type=${filter}&`
	}

	const _filterMinMax = (filter, min, max) => {
		if (filter === 'mint' || filter === 'transfer' || filter === 'burn') {
			return ''
		}
		let priceQuery = ''
		if (min) {
			priceQuery += `min_price=${parseNearAmount(min)}&`
		}
		if (max) {
			priceQuery += `max_price=${parseNearAmount(max)}&`
		}
		return priceQuery
	}

	const _fetchData = async (fetchQuery, initial = false) => {
		const _activityList = initial ? [] : activityList
		const _activityListPage = initial ? 0 : activityListPage
		const _activityListHasMore = initial ? true : activityListHasMore

		if (!_activityListHasMore || isFetching) {
			return
		}

		setIsFetching(true)
		try {
			const _filter =
				_filterQuery(fetchQuery?.filter) +
				_filterMinMax(fetchQuery?.filter, fetchQuery?.pmin, fetchQuery?.pmax)

			const res = await axios.get(
				`${process.env.V2_API_URL}/activities?${_filter}`,
				{
					params: {
						__skip: _activityListPage * FETCH_TOKENS_LIMIT,
						__limit: FETCH_TOKENS_LIMIT,
					},
				}
			)
			const newData = await res.data.data

			const newActivityList = [..._activityList, ...newData.results]
			setActivityList(newActivityList)
			setActivityListPage(_activityListPage + 1)
			if (newData.results.length === 0) {
				setActivityListHasMore(false)
			} else {
				setActivityListHasMore(true)
			}
		} catch (err) {
			console.log(err)
		}
		setIsFetching(false)
	}

	const _fetchDataWrapper = async () => {
		_fetchData(router.query)
	}

	return (
		<div>
			<div className="min-h-screen bg-black">
				<div
					className="fixed inset-0 opacity-75"
					style={{
						zIndex: 0,
						backgroundImage: `url('/bg.jpg')`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'cover',
					}}
				></div>
				<Head>
					<title>Activity — Paras</title>
					<meta
						name="description"
						content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
					/>

					<meta
						name="twitter:title"
						content="Paras — Digital Art Cards Market"
					/>
					<meta name="twitter:card" content="summary_large_image" />
					<meta name="twitter:site" content="@ParasHQ" />
					<meta name="twitter:url" content="https://paras.id" />
					<meta
						name="twitter:description"
						content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
					/>
					<meta
						name="twitter:image"
						content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
					/>
					<meta property="og:type" content="website" />
					<meta
						property="og:title"
						content="Paras — Digital Art Cards Market"
					/>
					<meta
						property="og:site_name"
						content="Paras — Digital Art Cards Market"
					/>
					<meta
						property="og:description"
						content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
					/>
					<meta property="og:url" content="https://paras.id" />
					<meta
						property="og:image"
						content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
					/>
				</Head>
				<Nav />
				<div className="max-w-5xl m-auto py-12 md:flex md:space-x-8">
					<div className="md:w-2/3 max-w-2xl relative mx-auto">
						<div className="px-4 flex flex-wrap items-center justify-between">
							<div ref={modalRef}>
								<div
									className="flex items-baseline"
									onClick={() => setShowModal(!showModal)}
								>
									<h1 className="text-4xl font-bold text-gray-100 text-center mr-2 capitalize">
										{activityType.split('-').join(' ')}
									</h1>
									<svg
										viewBox="0 0 11 7"
										fill="whites"
										width="18"
										height="18"
										xlmns="http://www.w3.org/2000/svg"
										className="md:hidden"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M5.00146 6.41431L9.70857 1.7072C10.0991 1.31668 10.0991 0.683511 9.70857 0.292986C9.31805 -0.097538 8.68488 -0.097538 8.29436 0.292986L5.00146 3.58588L1.70857 0.292986C1.31805 -0.097538 0.684882 -0.097538 0.294358 0.292986C-0.0961662 0.68351 -0.0961662 1.31668 0.294358 1.7072L5.00146 6.41431Z"
											fill="white"
										></path>
									</svg>
								</div>
								{showModal && (
									<div className="absolute max-w-full z-20 bg-dark-primary-1 px-5 py-2 rounded-md text-lg text-gray-100 md:hidden w-1/2">
										<p
											className={`opacity-50 cursor-pointer select-none my-1
										${activityType === 'activity' && 'font-semibold opacity-100'}
									`}
											onClick={() => onClickType('activity')}
										>
											Activity
										</p>
										<p
											className={`opacity-50 cursor-pointer select-none my-1
										${activityType === 'top-users' && 'font-semibold opacity-100'}
									`}
											onClick={() => onClickType('top-users')}
										>
											Top Users
										</p>
									</div>
								)}
							</div>
							<div
								className={`${
									activityType === 'top-users' && 'hidden'
								} md:block`}
							>
								<FilterActivity onClickFilter={onClickFilter} />
							</div>
						</div>
						<div
							className={`px-4 max-w-2xl mx-auto ${
								activityType === 'top-users' && 'hidden'
							} md:block`}
						>
							{activityList.length === 0 && activityListHasMore && (
								<div className="border-2 border-gray-800 border-dashed mt-4 p-2 rounded-md text-center">
									<p className="text-gray-300 py-8">Loading</p>
								</div>
							)}
							{activityList.length === 0 && !activityListHasMore && (
								<div className="border-2 border-gray-800 border-dashed mt-4 p-2 rounded-md text-center">
									<p className="text-gray-300 py-8">No Transactions</p>
								</div>
							)}
							<InfiniteScroll
								dataLength={activityList.length}
								next={_fetchDataWrapper}
								hasMore={activityListHasMore}
							>
								{activityList.map((act) => {
									return (
										<div key={act._id} className="mt-6">
											<ActivityDetail activity={act} />
										</div>
									)
								})}
							</InfiniteScroll>
						</div>
					</div>
					<div
						className={`relative pt-8 md:pt-20 md:w-1/3 md:block px-4 md:p-0 ${
							activityType === 'activity' && 'hidden'
						} md:block`}
					>
						<TopUsers
							data={topUser.buyers}
							userType={'buyer'}
							linkTo="/activity/top-buyers"
						/>
						<TopUsers
							data={topUser.sellers}
							userType={'seller'}
							className="mt-12"
							linkTo="/activity/top-sellers"
						/>
					</div>
				</div>
				<Footer />
			</div>
		</div>
	)
}

export async function getServerSideProps({ query }) {
	return { props: { query } }
}

export default ActivityLog
