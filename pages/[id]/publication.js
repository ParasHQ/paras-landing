import axios from 'axios'
import { useIntl } from 'hooks/useIntl'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Footer from 'components/Footer'
import Nav from 'components/Nav'
import Profile from 'components/Profile/Profile'
import PublicationCardListLoader from 'components/Publication/PublicationCardListLoader'
import useStore from 'lib/store'
import PublicationListScroll from 'components/Publication/PublicationListScroll'
import DraftPublication from 'components/Draft/DraftPublication'
import ButtonScrollTop from 'components/Common/ButtonScrollTop'
import { parseImgUrl } from 'utils/common'
const LIMIT = 6

const Publication = ({ userProfile, accountId }) => {
	const router = useRouter()
	const {
		currentUser,
		usersPublicationList,
		setUsersPublicationList,
		usersPublicationMeta,
		setUsersPublicationMeta,
	} = useStore()

	const [isFetching, setIsFetching] = useState(false)

	useEffect(() => {
		if (router.isReady && !usersPublicationList[router.query.id]) {
			_fetchData(true)
		}
	}, [router.isReady])

	const _fetchData = async (initial = false) => {
		const pubList = usersPublicationList[router.query.id]
		const meta = usersPublicationMeta[router.query.id]

		const _pubList = initial ? [] : pubList
		const _pubListPage = initial ? 0 : meta.page
		const _pubListHasMore = initial ? true : meta.hasMore

		if (!_pubListHasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios.get(`${process.env.V2_API_URL}/publications`, {
			params: {
				author_id: router.query.id,
				__skip: _pubListPage * LIMIT,
				__limit: LIMIT,
			},
		})
		const newData = await res.data.data

		const newPubData = [..._pubList, ...newData.results]

		setUsersPublicationList(router.query.id, newPubData)
		if (newData.results.length < LIMIT) {
			setUsersPublicationMeta(router.query.id, {
				page: _pubListPage + 1,
				hasMore: false,
			})
		} else {
			setUsersPublicationMeta(router.query.id, {
				page: _pubListPage + 1,
				hasMore: true,
			})
		}
		setIsFetching(false)
	}
	const headMeta = {
		title: `${accountId} — Paras`,
		description: `See NFT digital card collectibles and creations from ${accountId}. ${
			userProfile?.bio || ''
		}`,
		image: userProfile?.imgUrl
			? parseImgUrl(userProfile?.imgUrl, null, { useOriginal: true })
			: `https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png`,
	}
	const { localeLn } = useIntl()
	return (
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
				{accountId === currentUser && (
					<div className="flex justify-end mt-4 -mb-4 md:mb-10 md:-mr-4">
						<DraftPublication isShowVerified={false} />
					</div>
				)}
				<div>
					{!usersPublicationList[router.query.id] ? (
						<div className="mt-4 -mx-2">
							<PublicationCardListLoader />
						</div>
					) : usersPublicationList[router.query.id]?.length === 0 && !isFetching ? (
						<div className="mt-8 text-2xl text-gray-600 font-semibold py-32 text-center overflow-x-hidden border-2 border-dashed border-gray-800 rounded-md">
							<div className="w-40 m-auto">
								<img src="/cardstack.png" className="opacity-75" />
							</div>
							<p className="mt-4">{localeLn('NoPublications')}</p>
						</div>
					) : (
						<div className="mt-4 -mx-2">
							<PublicationListScroll
								data={usersPublicationList[router.query.id]}
								fetchData={_fetchData}
								hasMore={usersPublicationMeta[router.query.id]?.hasMore}
							/>
						</div>
					)}
				</div>
				<ButtonScrollTop />
			</div>
			<Footer />
		</div>
	)
}

export default Publication

export async function getServerSideProps({ params }) {
	const profileRes = await axios.get(`${process.env.V2_API_URL}/profiles`, {
		params: {
			accountId: params.id,
		},
	})

	const userProfile = (await profileRes.data.data.results[0]) || null

	return {
		props: { userProfile, accountId: params.id },
	}
}
