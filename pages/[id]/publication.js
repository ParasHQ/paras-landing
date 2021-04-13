import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Footer from '../../components/Footer'
import Nav from '../../components/Nav'
import Profile from '../../components/Profile'
import PublicationList from '../../components/PublicationList'

const Publication = ({ publications, userProfile, accountId }) => {
	const router = useRouter()

	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)
	const [pubData, setPubData] = useState(publications)

	const _fetchData = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(
			`${process.env.API_URL}/publications?authorId=${router.query.id}&__skip=${
				page * 5
			}&__limit=5`
		)
		const newData = await res.data.data

		const newPubData = [...pubData, ...newData.results]
		setPubData(newPubData)
		setPage(page + 1)
		if (newData.results.length === 0) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	const headMeta = {
		title: `${accountId} — Paras`,
		description: `See digital card collectibles and creations from ${accountId}. ${
			userProfile?.bio || ''
		}`,
		image: userProfile?.imgUrl
			? `${process.env.API_URL}/socialCard/avatar/${
					userProfile.imgUrl.split('://')[1]
			  }`
			: `https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png`,
	}

	return (
		<div
			className="min-h-screen bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Head>
				<title>{headMeta.title}</title>
				<meta name="description" content={headMeta.description} />

				<meta name="twitter:title" content={headMeta.title} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta name="twitter:description" content={headMeta.description} />
				<meta name="twitter:image" content={headMeta.image} />
				<meta property="og:type" content="website" />
				<meta property="og:title" content={headMeta.title} />
				<meta property="og:site_name" content={headMeta.title} />
				<meta property="og:description" content={headMeta.description} />
				<meta property="og:url" content="https://paras.id" />
				<meta property="og:image" content={headMeta.image} />
			</Head>
			<Nav />
			<div className="max-w-6xl py-12 px-4 relative m-auto">
				<Profile userProfile={userProfile} activeTab={'publication'} />
				<div className="mt-8 overflow-x-hidden border-2 border-dashed border-gray-800 rounded-md">
					{pubData.length === 0 && !isFetching ? (
						<div className="">
							<div className="m-auto text-2xl text-gray-600 font-semibold py-32 text-center">
								<div className="w-40 m-auto">
									<img src="/cardstack.png" className="opacity-75" />
								</div>
								<p className="mt-4">No Publications</p>
							</div>
						</div>
					) : (
						<div className="max-w-4xl mx-auto px-4 mb-8">
							<InfiniteScroll
								dataLength={pubData.length}
								next={_fetchData}
								hasMore={hasMore}
							>
								{pubData.map((pub) => (
									<PublicationList key={pub._id} data={pub} />
								))}
							</InfiniteScroll>
						</div>
					)}
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default Publication

export async function getServerSideProps({ params }) {
	const publicationRes = await axios(
		`${process.env.API_URL}/publications?authorId=${params.id}&__limit=5`
	)
	const profileRes = await axios(
		`${process.env.API_URL}/profiles?accountId=${params.id}`
	)

	const publications = await publicationRes.data.data.results
	const userProfile = (await profileRes.data.data.results[0]) || null

	return {
		props: { publications, userProfile, accountId: params.id },
	}
}
