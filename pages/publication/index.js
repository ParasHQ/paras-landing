import Head from 'next/head'
import { useState, useEffect } from 'react'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'

import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import PublicationList from '../../components/PublicationList'
import PublicationCardListLoader from '../../components/Publication/PublicationCardListLoader'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useStore from '../../store'

const LIMIT = 6

const PublicationListContainer = ({ data, fetchData, hasMore }) => (
	<InfiniteScroll
		dataLength={data.length}
		next={fetchData}
		hasMore={hasMore}
		loader={<PublicationCardListLoader />}
	>
		<div className="flex flex-wrap">
			{data.map((pub, idx) => (
				<div key={idx} className="w-full md:w-1/2 p-4">
					<PublicationList key={pub._id} data={pub} />
				</div>
			))}
		</div>
	</InfiniteScroll>
)

const Publication = () => {
	const router = useRouter()
	const [isFetching, setIsFetching] = useState(false)
	const {
		pubList,
		setPubList,
		pubListHasMore,
		setPubListHasMore,
		pubListPage,
		setPubListPage,
		pubListEditorial,
		setPubListEditorial,
		pubListEditorialPage,
		setPubListEditorialPage,
		pubListEditorialHasMore,
		setPubListEditorialHasMore,
		pubListCommunity,
		setPubListCommunity,
		pubListCommunityPage,
		setPubListCommunityPage,
		pubListCommunityHasMore,
		setPubListCommunityHasMore,
	} = useStore()

	useEffect(() => {
		if (router.isReady) {
			if (
				(!router.query.type && pubList.length === 0) ||
				(router.query.type === 'editorial' && pubListEditorial.length === 0) ||
				(router.query.type === 'community' && pubListCommunity.length === 0)
			) {
				fetchData(true)
			}
		}
	}, [router.isReady, router.query])

	useEffect(() => {
		const handleRouteChange = () => {
			window.scrollTo(0, 0)
		}

		router.events.on('routeChangeComplete', handleRouteChange)

		return () => {
			router.events.off('routeChangeComplete', handleRouteChange)
		}
	}, [])

	const fetchData = async (initial = false) => {
		if (!router.query.type) {
			_fetchData(
				initial,
				pubList,
				setPubList,
				pubListHasMore,
				setPubListHasMore,
				pubListPage,
				setPubListPage
			)
		} else if (router.query.type === 'editorial') {
			_fetchData(
				initial,
				pubListEditorial,
				setPubListEditorial,
				pubListEditorialHasMore,
				setPubListEditorialHasMore,
				pubListEditorialPage,
				setPubListEditorialPage
			)
		} else if (router.query.type === 'community') {
			_fetchData(
				initial,
				pubListCommunity,
				setPubListCommunity,
				pubListCommunityHasMore,
				setPubListCommunityHasMore,
				pubListCommunityPage,
				setPubListCommunityPage
			)
		}
	}

	const _fetchData = async (
		initial = false,
		list,
		setList,
		hasMore,
		setHasMore,
		page,
		setPage
	) => {
		const _pubList = initial ? [] : list
		const _hasMore = initial ? true : hasMore
		const _page = initial ? 0 : page

		if (!_hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(
			`${process.env.API_URL}/publications?${
				router.query.type ? `type=${router.query.type}` : ``
			}&__skip=${_page * LIMIT}&__limit=${LIMIT}`
		)
		const newData = await res.data.data
		const newPubList = [..._pubList, ...newData.results]

		setList(newPubList)
		setPage(_page + 1)

		if (newData.results.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	return (
		<div className="min-h-screen relative bg-black">
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
				<title>Publication — Paras</title>
				<meta
					name="description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>

				<meta name="twitter:title" content="Paras — Digital Art Cards Market" />
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
				<meta property="og:title" content="Paras — Digital Art Cards Market" />
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
					Publication
				</h1>
				<div className="mt-4">
					<p className="text-center text-xl text-gray-300">
						Enhancing The Visuals through Stories
					</p>
				</div>
				<div className="mt-8">
					<div className="flex text-white">
						<div className="px-4">
							<Link href="/publication">
								<a className="text-xl text-gray-600 font-semibold">
									<span
										className={!router.query.type ? 'text-gray-100' : undefined}
									>
										All
									</span>
								</a>
							</Link>
						</div>
						<div className="px-4">
							<Link href="/publication?type=editorial" shallow={true}>
								<a className="text-xl text-gray-600 font-semibold">
									<span
										className={
											router.query.type === 'editorial'
												? 'text-gray-100'
												: undefined
										}
									>
										Editorial
									</span>
								</a>
							</Link>
						</div>
						<div className="px-4">
							<Link href="/publication?type=community" shallow={true}>
								<a className="text-xl text-gray-600 font-semibold">
									<span
										className={
											router.query.type === 'community'
												? 'text-gray-100'
												: undefined
										}
									>
										Community
									</span>
								</a>
							</Link>
						</div>
					</div>
					{/* render All */}
					{!router.query.type && (
						<PublicationListContainer
							data={pubList}
							hasMore={pubListHasMore}
							fetchData={fetchData}
						/>
					)}
					{/* render Editorial */}
					{router.query.type === 'editorial' && (
						<PublicationListContainer
							data={pubListEditorial}
							hasMore={pubListEditorialHasMore}
							fetchData={fetchData}
						/>
					)}
					{/* render Community */}
					{router.query.type === 'community' && (
						<PublicationListContainer
							data={pubListCommunity}
							hasMore={pubListCommunityHasMore}
							fetchData={fetchData}
						/>
					)}
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default Publication
