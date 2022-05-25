import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'
import Head from 'next/head'
import Nav from 'components/Nav'
import Footer from 'components/Footer'
import useStore from 'lib/store'
import ActivityDetail from 'components/Activity/ActivityDetail'
import { useRouter } from 'next/router'
import ActivityTopUsers from 'components/Activity/ActivityTopUsers'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import FilterActivity from 'components/Filter/FilterActivity'
import { sentryCaptureException } from 'lib/sentry'

const FETCH_TOKENS_LIMIT = 10
import { useIntl } from 'hooks/useIntl'
import TopCollectorsAllTime from 'components/Activity/TopCollectorsAllTime'
import ButtonScrollTop from 'components/Common/ButtonScrollTop'
import ActivityListLoader from 'components/Activity/ActivityListLoader'

const ActivityLog = ({ query }) => {
	const {
		activityList,
		setActivityList,
		activityListIdBefore,
		setActivityListIdBefore,
		activityListHasMore,
		setActivityListHasMore,
		setActivitySlowUpdate,
	} = useStore()
	const router = useRouter()
	const modalRef = useRef()

	const [isFetching, setIsFetching] = useState(false)
	const [isFetchingTop, setIsFetchingTop] = useState(false)
	const [topUser, setTopUser] = useState([])
	const [showModal, setShowModal] = useState(false)
	const [activityType, setActivityType] = useState('activity')
	const { localeLn } = useIntl()
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
		setIsFetchingTop(true)
		if (query) {
			_fetchData(query, true)
		} else {
			_fetchData({}, true)
		}
		const res = await axios(`${process.env.V2_API_URL}/activities/top-users?__limit=5`)
		setTopUser(res.data.data)
		setIsFetchingTop(false)
	}, [])

	const onClickFilter = (query) => {
		_fetchData(query, true)
	}

	const onClickType = (type) => {
		setActivityType(type)
		setShowModal(false)
	}

	const _filterQuery = (filter) => {
		if (!filter) {
			return `type=market_sales&`
		}

		if (filter === 'showAll') {
			return ``
		}

		return `type=${filter}&`
	}

	const _filterVerified = (is_verified = true) => `is_verified=${is_verified}&`

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
		const _activityListIdBefore = initial ? null : activityListIdBefore
		const _activityListHasMore = initial ? true : activityListHasMore

		if (!_activityListHasMore || isFetching) {
			return
		}

		setIsFetching(true)
		try {
			const _filter =
				_filterQuery(fetchQuery?.filter) +
				_filterMinMax(fetchQuery?.filter, fetchQuery?.pmin, fetchQuery?.pmax) +
				_filterVerified(fetchQuery?.is_verified)

			const res = await axios.get(`${process.env.V2_API_URL}/activities?${_filter}`, {
				params: {
					_id_before: _activityListIdBefore,
					__limit: FETCH_TOKENS_LIMIT,
				},
			})
			const newData = await res.data.data

			const newActivityList = [..._activityList, ...newData.results]
			if (
				initial &&
				Math.floor((new Date() - new Date(newActivityList[0].msg?.datetime)) / (1000 * 60)) >= 5 &&
				_filterQuery(fetchQuery?.filter) === '' &&
				_filterMinMax(fetchQuery?.filter, fetchQuery?.pmin, fetchQuery?.pmax) === ''
			) {
				setActivitySlowUpdate(true)
			} else {
				setActivitySlowUpdate(false)
			}
			setActivityList(newActivityList)
			if (newData.results.length === 0) {
				setActivityListHasMore(false)
			} else {
				setActivityListHasMore(true)
				setActivityListIdBefore(newData.results[newData.results.length - 1]._id)
			}
		} catch (err) {
			sentryCaptureException(err)
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
					<title>{localeLn('ActivityParas')}</title>
					<meta
						name="description"
						content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
					/>

					<meta
						name="twitter:title"
						content="Paras - NFT Marketplace for Digital Collectibles on NEAR"
					/>
					<meta name="twitter:card" content="summary_large_image" />
					<meta name="twitter:site" content="@ParasHQ" />
					<meta name="twitter:url" content="https://paras.id" />
					<meta
						name="twitter:description"
						content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
					/>
					<meta
						name="twitter:image"
						content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
					/>
					<meta property="og:type" content="website" />
					<meta
						property="og:title"
						content="Paras - NFT Marketplace for Digital Collectibles on NEAR"
					/>
					<meta
						property="og:site_name"
						content="Paras - NFT Marketplace for Digital Collectibles on NEAR"
					/>
					<meta
						property="og:description"
						content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
					/>
					<meta property="og:url" content="https://paras.id" />
					<meta
						property="og:image"
						content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
					/>
				</Head>
				<Nav />
				<div className="max-w-5xl m-auto py-12 md:flex md:flex-col md:space-x-8">
					<div className="w-full relative md:pt-4 md:block md:p-0">
						<div className="px-4 flex flex-wrap items-center justify-between">
							<div ref={modalRef}>
								<div
									className="flex items-baseline cursor-pointer hover:opacity-90"
									onClick={() => setShowModal(!showModal)}
								>
									<h1 className="text-4xl font-bold text-gray-100 text-center mr-2 capitalize">
										{activityType === 'activity' ? localeLn('Activity') : localeLn('TopUsers')}
									</h1>
									<svg
										viewBox="0 0 11 7"
										fill="whites"
										width="18"
										height="18"
										xlmns="http://www.w3.org/2000/svg"
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
									<div className="absolute max-w-full z-30 bg-dark-primary-1 px-5 py-2 rounded-md text-lg text-gray-100 w-44">
										<p
											className={`opacity-50 cursor-pointer select-none my-1
										${activityType === 'activity' && 'font-semibold opacity-100'}
									`}
											onClick={() => onClickType('activity')}
										>
											{localeLn('Activity')}
										</p>
										<p
											className={`opacity-50 cursor-pointer select-none my-1
										${activityType === 'top-users' && 'font-semibold opacity-100'}
									`}
											onClick={() => onClickType('top-users')}
										>
											{localeLn('TopUsers')}
										</p>
									</div>
								)}
							</div>
							<div className={`${activityType === 'top-users' ? 'hidden' : 'md:block'}`}>
								<FilterActivity onClickFilter={onClickFilter} />
							</div>
						</div>

						{activityType === 'top-users' && (
							<div className="w-full">
								<div
									className="flex cursor-pointer mt-10 px-4"
									onClick={() => window.open('https://stats.paras.id', '_blank').focus()}
								>
									<div className="font-bold text-white text-3xl ">Stats Page</div>
									<svg
										className="inline-block pl-1 -mt-2"
										width="30"
										height="30"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M5 5V19H19V12H21V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H12V5H5ZM14 5V3H21V10H19V6.41L9.17 16.24L7.76 14.83L17.59 5H14Z"
											fill="white"
										/>
									</svg>
								</div>
								<div className="block md:grid md:grid-cols-3">
									<ActivityTopUsers
										data={topUser.buyers}
										userType={'buyer'}
										linkTo="/activity/top-buyers"
										isFetching={isFetchingTop}
										className="mt-8 px-4 py-2"
									/>
									<ActivityTopUsers
										data={topUser.sellers}
										userType={'seller'}
										linkTo="/activity/top-sellers"
										isFetching={isFetchingTop}
										className="mt-8 px-4 py-2"
									/>
									<TopCollectorsAllTime className="mt-8 px-4 py-2" />
								</div>
							</div>
						)}

						{activityType === 'activity' && (
							<div className="relative w-full text-white">
								<div
									className={`px-4 w-full mx-auto ${
										activityType === 'top-users' && 'hidden'
									} md:block`}
								>
									{activityList.length === 0 && !activityListHasMore && (
										<div className="border-2 border-gray-800 border-dashed mt-4 p-2 rounded-md text-center">
											<p className="text-gray-300 py-8">{localeLn('NoTransactions')}</p>
										</div>
									)}
									<InfiniteScroll
										dataLength={activityList.length}
										next={_fetchDataWrapper}
										hasMore={activityListHasMore}
										loader={<ActivityListLoader />}
									>
										{activityList.map((act, index) => {
											return (
												<div key={act._id} className="mt-6">
													<ActivityDetail activity={act} index={index} />
												</div>
											)
										})}
									</InfiniteScroll>
								</div>
							</div>
						)}
					</div>

					<ButtonScrollTop />
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
