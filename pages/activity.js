import { useEffect, useState } from 'react'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import useStore from '../store'
import ActivityDetail from '../components/ActivityDetail'

const LIMIT = 20

const ActivityLog = () => {
	const {
		activityList,
		setActivityList,
		activityListPage,
		setActivityListPage,
		activityListHasMore,
		setActivityListHasMore,
	} = useStore()
	const [isFetching, setIsFetching] = useState(false)

	useEffect(() => {
		if (activityList.length === 0 && activityListHasMore) {
			_fetchData()
		}
	}, [])

	const _fetchData = async () => {
		if (!activityListHasMore || isFetching) {
			return
		}

		setIsFetching(true)
		try {
			const res = await axios.get(
				`${process.env.API_URL}/activities?__skip=${
					activityListPage * LIMIT
				}&__limit=${LIMIT}`
			)
			const newData = await res.data.data

			const newActivityList = [...activityList, ...newData.results]
			setActivityList(newActivityList)
			setActivityListPage(activityListPage + 1)
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
				<div className="max-w-6xl relative m-auto py-12">
					<h1 className="text-4xl font-bold text-gray-100 text-center">
						Activity
					</h1>
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

export default ActivityLog
