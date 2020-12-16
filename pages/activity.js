import { useEffect, useState } from 'react'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import useStore from '../store'
import ActivityDetail from '../components/ActivityDetail'
import { useRouter } from 'next/router'

const LIMIT = 20

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
	const [isFetching, setIsFetching] = useState(false)

	useEffect(() => {
		if (activityList.length === 0 && activityListHasMore) {
			if (query) {
				_fetchData(query, true)
			} else {
				_fetchData({}, true)
			}
		}
	}, [])

	useEffect(() => {
		if (router.query) {
			_fetchData(router.query, true)
		} else {
			_fetchData()
		}
	}, [router.query])

	const _changeFilter = (e) => {
		router.push({
			query: { filter: encodeURI(e.target.value) },
		})
	}

	const _filterQuery = (filter) => {
		if (!filter || filter === 'showAll') {
			return ``
		}
		if (filter === 'mint') {
			return `type=transfer&from=root&`
		}
		return `type=${filter}&`
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
			const _filter = _filterQuery(fetchQuery.filter)
			const res = await axios.get(
				`${process.env.API_URL}/activities?${_filter}__skip=${
					_activityListPage * LIMIT
				}&__limit=${LIMIT}`
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

	return (
		<div>
			<div
				className="min-h-screen bg-dark-primary-1"
				style={{
					backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
				}}
			>
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
				<div className="max-w-2xl relative m-auto py-12">
					<div className="px-4 flex items-center justify-between">
						<h1 className="text-4xl font-bold text-gray-100 text-center">
							Activity
						</h1>
						<div>
							<select
								className="p-2 bg-dark-primary-4 text-gray-100 rounded-md"
								onChange={(e) => _changeFilter(e)}
								value={router.query.filter}
							>
								<option value="showAll">Show All</option>
								<option value="marketBuy">Market Sales</option>
								<option value="marketUpdate">Market Update</option>
								<option value="mint">Card Creation</option>
								<option value="transfer">Card Transfer</option>
							</select>
						</div>
					</div>
					<div className="px-4 max-w-2xl mx-auto">
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
							next={_fetchData}
							hasMore={activityListHasMore}
						>
							{activityList.map((act, idx) => {
								return (
									<div key={idx} className="mt-6">
										<ActivityDetail activity={act} />
									</div>
								)
							})}
						</InfiniteScroll>
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
