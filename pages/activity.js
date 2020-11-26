import { useEffect, useState } from 'react'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'
import Link from 'next/link'
import { parseImgUrl, prettyBalance, timeAgo } from '../utils/common'
import Card from '../components/Card'
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import useStore from '../store'
import JSBI from 'jsbi'
import useSWR from 'swr'

const LIMIT = 20


const ActivityWrapper = ({ activity }) => {
	const fetcher = async (key) => {
		const resp = await axios.get(`${process.env.API_URL}/${key}`)
		if (resp.data.data.results.length > 0) {
			return resp.data.data.results[0]
		} else {
			return {}
		}
	}

	const { data: token } = useSWR(
		`tokens?tokenId=${activity.tokenId}`,
		fetcher
	)

	if (activity.type === 'transfer' && !activity.from) {
		return null
	}

	if (activity.type === 'transfer' && !activity.to) {
		return null
	}

	return (
		<div className="flex flex-wrap border-2 border-dashed border-gray-800 p-4 rounded-md max-w-2xl mx-auto">
			<div className="w-full md:w-1/3">
				<div className="w-40 mx-auto">
					<Card
						imgUrl={parseImgUrl(token?.metadata?.image)}
						imgBlur={token?.metadata?.blurhash}
						token={{
							name: token?.metadata?.name,
							collection: token?.metadata?.collection,
							description: token?.metadata?.description,
							creatorId: token?.creatorId,
							supply: token?.supply,
							tokenId: token?.tokenId,
							createdAt: token?.createdAt,
						}}
						initialRotate={{
							x: 15,
							y: 15,
						}}
						disableFlip={true}
					/>
				</div>
			</div>
			<div className="w-full md:w-2/3 text-gray-100 pt-4 pl-0 md:pt-0 md:pl-4">
				<div className="overflow-hidden">
					<Link href={`/token/${token?.tokenId}`}>
						<a className="text-2xl font-bold truncate border-b-2 border-transparent hover:border-gray-100">
							{token?.metadata?.name}
						</a>
					</Link>
					<p className="opacity-75 truncate">{token?.metadata?.collection}</p>
					<div className="mt-4">
						<Activity activity={activity} />
						<p className="mt-2 text-sm opacity-50">
							{timeAgo.format(activity.createdAt)}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

const Activity = ({ activity }) => {
	const { nearUsdPrice } = useStore()

	if (activity.type === 'marketUpdate') {
		return (
			<div className="text-gray-300">
				<p>
					<Link href={`/${activity.from}`}>
						<a className="text-gray-100 font-semibold border-b-2 border-transparent hover:border-gray-100">{activity.from}</a>
					</Link>
					<span>
						{' '}
						put on sale for {prettyBalance(activity.amount, 24, 4)} Ⓝ
					</span>
					<span>
						{' '}
						($
						{prettyBalance(JSBI.BigInt(activity.amount * nearUsdPrice), 24, 4)})
					</span>
				</p>
			</div>
		)
	}

	if (activity.type === 'marketDelete') {
		return (
			<div className="text-gray-300">
				<p>
					<Link href={`/${activity.from}`}>
						<a className="text-gray-100 font-semibold border-b-2 border-transparent hover:border-gray-100">{activity.from}</a>
					</Link>
					<span> remove from sale</span>
				</p>
			</div>
		)
	}

	if (activity.type === 'marketBuy') {
		return (
			<div className="text-gray-300">
				<p>
					<Link href={`/${activity.from}`}>
						<a className="text-gray-100 font-semibold border-b-2 border-transparent hover:border-gray-100">{activity.from}</a>
					</Link>
					<span> bought {activity.quantity}pcs from </span>
					<Link href={`/${activity.to}`}>
						<a className="text-gray-100 font-semibold border-b-2 border-transparent hover:border-gray-100">{activity.to}</a>
					</Link>
					<span> for </span>
					{prettyBalance(activity.amount, 24, 4)} Ⓝ
					<span>
						{' '}
						($
						{prettyBalance(JSBI.BigInt(activity.amount * nearUsdPrice), 24, 4)})
					</span>
				</p>
			</div>
		)
	}

	return (
		<div className="text-gray-300">
			<p>
				<Link href={`/${activity.from}`}>
					<a className="text-gray-100 font-semibold border-b-2 border-transparent hover:border-gray-100">{activity.from}</a>
				</Link>
				<span> transfer {activity.quantity}pcs to </span>
				<Link href={`/${activity.to}`}>
					<a className="text-gray-100 font-semibold border-b-2 border-transparent hover:border-gray-100">{activity.to}</a>
				</Link>
			</p>
		</div>
	)
}

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
										<ActivityWrapper activity={act} />
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
