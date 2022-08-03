import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Head from 'next/head'
import Nav from 'components/Nav'
import Footer from 'components/Footer'
import useStore from 'lib/store'
import ActivityDetail, { descriptionMaker } from 'components/Activity/ActivityDetail'
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
import IconV from 'components/Icons/component/IconV'
import TokenSeriesDetailModal from 'components/TokenSeries/TokenSeriesDetailModal'
import TokenDetailModal from 'components/Token/TokenDetailModal'
import Modal from 'components/Modal'
import CopyLink from 'components/Common/CopyLink'
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share'
import RecyclerScrollCommon from 'components/RecyclerScroll/RecyclerCommon'

const HEADERS = [
	{
		id: 'title',
		title: 'Title',
		className: `w-3/12 p-3 h-full`,
	},
	{
		id: 'price',
		title: 'Price',
		className: `items-center text-center w-2/12 p-3 h-full`,
	},
	{
		id: 'from',
		title: 'From',
		className: `items-center w-2/12 p-3 h-full`,
	},
	{
		id: 'to',
		title: 'To',
		className: `items-center w-2/12 p-3 h-full`,
	},
	{
		id: 'time',
		title: 'Time',
		className: `w-4/12 md:w-2/12 pr-2 md:p-0 lg:p-3 text-center md:h-full`,
	},
	{
		id: 'type',
		title: 'Type',
		className: `w-2/12 p-3 h-full`,
	},
]

const ActivityLog = ({ query }) => {
	const {
		activityList,
		setActivityList,
		activityListIdBefore,
		setActivityListIdBefore,
		activityListHasMore,
		setActivityListHasMore,
		setActivitySlowUpdate,
		localToken,
		localTradedToken,
		activity,
	} = useStore()
	const router = useRouter()
	const modalRef = useRef()

	const [isFetching, setIsFetching] = useState(false)
	const [isFetchingTop, setIsFetchingTop] = useState(false)
	const [topUser, setTopUser] = useState([])
	const [showModal, setShowModal] = useState(false)
	const [activityType, setActivityType] = useState(router.query.tab ? router.query.tab : 'activity')
	const [isLoading, setIsLoading] = useState(false)
	const [initialState, setInitialState] = useState(true)
	const parentRef = useRef()
	const [activityDetailIdx, setActivityDetailIdx] = useState(-1)
	const [showModalShare, setShowModalShare] = useState(null)
	const [isCopiedShare, setIsCopiedShare] = useState(false)
	const shareLink = `${process.env.BASE_URL}/activity/${activity._id}`
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

	useEffect(() => {
		const fetchingTopUser = async () => {
			setIsFetchingTop(true)
			if (query) {
				_fetchData(query, true)
			} else {
				_fetchData({}, true)
			}
			let res
			res = await axios(`${process.env.V2_API_URL}/activities/top-users?__limit=5`)
			setTopUser(res.data.data)
			setIsFetchingTop(false)
		}
		fetchingTopUser()
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

		if (initial) setIsLoading(true)

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
		setIsLoading(false)
		setInitialState(false)
	}

	const _fetchDataWrapper = async () => {
		_fetchData(router.query)
	}

	const handleAfterCopyShare = () => {
		setIsCopiedShare(true)

		setTimeout(() => {
			setShowModalShare(false)
			setIsCopiedShare(false)
		}, 1500)
	}

	const rowActivity = (type, data, index, state) => {
		const { detailIndex } = state
		return (
			<div
				key={`${data._id}-${index}`}
				className={`my-3 md:mt-6 ${index === detailIndex ? `h-36` : `h-auto`}`}
				style={{ width: `${parentRef.current?.clientWidth}px` }}
			>
				<ActivityDetail
					activity={data}
					index={index}
					isLoading={isLoading}
					isFetching={isFetching}
					setShowDetailIndex={setActivityDetailIdx}
					setShowModalShare={setShowModalShare}
				/>
			</div>
		)
	}

	const renderLoader = () => {
		if (isFetching || isLoading) return <ActivityListLoader />
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
									<IconV size={18} />
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
										<p
											className={`opacity-50 cursor-pointer select-none my-1
										${activityType === 'following' && 'font-semibold opacity-100'}
									`}
											onClick={() => {
												setShowModal(false)
												router.push('/activity/following')
											}}
										>
											{localeLn('Following')}
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
									<div className="w-full hidden md:block">
										<div className="flex flex-row w-full text-gray-300 hover:opacity-75 items-center">
											{HEADERS.map((d, index) => {
												return (
													<div key={d.id} className={`${HEADERS[index].className} h-full`}>
														<span className="capitalize">{localeLn(d.title)}</span>
													</div>
												)
											})}
										</div>
									</div>
									{initialState && isLoading ? (
										<ActivityListLoader />
									) : (
										<div ref={parentRef} className="relative block w-full h-70vh mt-2">
											<RecyclerScrollCommon
												fetchNext={_fetchDataWrapper}
												items={activityList}
												rowRender={rowActivity}
												renderLoader={renderLoader}
												hasMore={activityListHasMore}
												windowScroll={false}
												extendedState={{ detailIndex: activityDetailIdx }}
												nonDeterministicRendering={true}
												initialState={initialState}
												parentRef={parentRef}
											/>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
					{showModalShare === 'options' && (
						<Modal close={() => setShowModalShare('')}>
							<div className="max-w-sm w-full px-4 py-2 bg-gray-100 m-auto rounded-md text-black">
								<CopyLink link={shareLink} afterCopy={handleAfterCopyShare}>
									<div className="py-2 cursor-pointer flex items-center">
										<svg
											className="rounded-md"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<rect width="24" height="24" fill="#11111F" />
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M12.7147 14.4874L13.7399 15.5126L11.6894 17.5631C10.2738 18.9787 7.97871 18.9787 6.56313 17.5631C5.14755 16.1476 5.14755 13.8524 6.56313 12.4369L8.61364 10.3864L9.63889 11.4116L7.58839 13.4621C6.73904 14.3115 6.73904 15.6885 7.58839 16.5379C8.43773 17.3872 9.8148 17.3872 10.6641 16.5379L12.7147 14.4874ZM11.6894 9.36136L10.6641 8.3361L12.7146 6.2856C14.1302 4.87002 16.4253 4.87002 17.8409 6.2856C19.2565 7.70118 19.2565 9.99628 17.8409 11.4119L15.7904 13.4624L14.7651 12.4371L16.8156 10.3866C17.665 9.53726 17.665 8.1602 16.8156 7.31085C15.9663 6.4615 14.5892 6.4615 13.7399 7.31085L11.6894 9.36136ZM9.12499 13.9751L10.1502 15.0004L15.2765 9.87409L14.2513 8.84883L9.12499 13.9751Z"
												fill="white"
											/>
										</svg>
										<p className="pl-2">{isCopiedShare ? `Copied` : `Copy Link`}</p>
									</div>
								</CopyLink>
								<div className="py-2 cursor-pointer">
									<TwitterShareButton
										title={`${descriptionMaker(
											activity,
											localToken,
											localTradedToken
										)} via @ParasHQ\n\n#paras #cryptoart #digitalart #tradingcards`}
										url={shareLink}
										className="flex items-center w-full"
									>
										<TwitterIcon
											size={24}
											className="rounded-md"
											bgStyle={{
												fill: '#11111F',
											}}
										></TwitterIcon>
										<p className="pl-2">{localeLn('Twitter')}</p>
									</TwitterShareButton>
								</div>
								<div className="py-2 cursor-pointer">
									<FacebookShareButton url={shareLink} className="flex items-center w-full">
										<FacebookIcon
											size={24}
											className="rounded-md"
											bgStyle={{
												fill: '#11111F',
											}}
										></FacebookIcon>
										<p className="pl-2">{localeLn('Facebook')}</p>
									</FacebookShareButton>
								</div>
							</div>
						</Modal>
					)}
					<TokenSeriesDetailModal tokens={[localToken]} />
					<TokenDetailModal tokens={[localToken]} />
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
