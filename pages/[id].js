import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useStore from '../store'
import { parseImgUrl } from '../utils/common'

const { default: CardList } = require('../components/CardList')
const { default: Nav } = require('../components/Nav')

const ProfileDetail = ({ creatorTokens, ownerTokens, userProfile }) => {
	const store = useStore()
	const router = useRouter()

	const scrollCollection = `${router.query.id}::collection`
  const scrollCreation = `${router.query.id}::creation`
  
  const oTokens = store.marketDataPersist[scrollCollection]
  const cTokens = store.marketDataPersist[scrollCreation]

	const [cPage, setCPage] = useState(1)
	const [oPage, setOPage] = useState(1)

	const [cHasMore, setCHasMore] = useState(true)
	const [oHasMore, setOHasMore] = useState(true)

	const [activeTab, setActiveTab] = useState('collection')

	const [isFetching, setIsFetching] = useState(false)

	useEffect(() => {
    store.setMarketDataPersist(scrollCollection, ownerTokens)
    store.setMarketDataPersist(scrollCreation, creatorTokens)

		return () => {
			store.setMarketScrollPersist(scrollCollection, 0)
			store.setMarketScrollPersist(scrollCreation, 0)
		}
	}, [])

	const fetchOwnerTokens = async () => {
		if (!oHasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(
			`http://localhost:9090/tokens?ownerId=${router.query.id}&__skip=${
				oPage * 5
			}&__limit=5`
		)
    const newData = await res.data.data

		const newTokens = [...oTokens, ...newData.results]
    store.setMarketDataPersist(scrollCollection, newTokens)
		setOPage(cPage + 1)
		if (newData.results.length === 0) {
			setOHasMore(false)
		} else {
			setOHasMore(true)
		}
		setIsFetching(false)
	}

	const fetchCreatorTokens = async () => {
		if (!cHasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(
			`http://localhost:9090/tokens?creatorId=${router.query.id}&__skip=${
				cPage * 5
			}&__limit=5`
		)
		const newData = await res.data.data

		const newTokens = [...cTokens, ...newData.results]
		store.setMarketDataPersist(scrollCreation, newTokens)
		setCPage(cPage + 1)
		if (newData.results.length === 0) {
			setCHasMore(false)
		} else {
			setCHasMore(true)
		}
		setIsFetching(false)
	}

	return (
		<div
			className="min-h-screen bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Nav />

			<div className="max-w-6xl py-12 px-4 relative m-auto">
				<div className="flex flex-col items-center justify-center">
					<div className="w-32 h-32 rounded-full bg-red-100">
            <img src={parseImgUrl(userProfile.imgUrl)} className="object-cover" />
          </div>
					<div className="mt-4 max-w-sm text-center">
						<h4 className="text-white font-bold">{router.query.id}</h4>
						<p className="mt-2 text-gray-300">
							{userProfile.bio}
						</p>
					</div>
				</div>
				<div className="flex justify-center mt-4">
					<div className="flex -mx-4">
						<div
							className="px-4 relative"
							onClick={(_) => setActiveTab('collection')}
						>
							<h4 className="text-white font-bold cursor-pointer">
								Collection
							</h4>
							{activeTab === 'collection' && (
								<div
									className="absolute left-0 right-0"
									style={{
										bottom: `-.25rem`,
									}}
								>
									<div className="mx-auto w-8 h-1 bg-gray-100"></div>
								</div>
							)}
						</div>
						<div
							className="px-4 relative"
							onClick={(_) => setActiveTab('creation')}
						>
							<h4 className="text-white font-bold cursor-pointer">Creation</h4>
							{activeTab === 'creation' && (
								<div
									className="absolute left-0 right-0"
									style={{
										bottom: `-.25rem`,
									}}
								>
									<div className="mx-auto w-8 h-1 bg-gray-100"></div>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="mt-8">
					{activeTab === 'collection' && oTokens && (
						<CardList
							name={scrollCollection}
							tokens={oTokens}
							fetchData={fetchOwnerTokens}
						/>
					)}
					{activeTab === 'creation' && cTokens && (
						<CardList
							name={scrollCreation}
							tokens={cTokens}
							fetchData={fetchCreatorTokens}
						/>
					)}
				</div>
			</div>
		</div>
	)
}

export async function getServerSideProps({ params }) {
	const creatorRes = await axios(
		`http://localhost:9090/tokens?creatorId=${params.id}&__limit=5`
	)
	const ownerRes = await axios(
		`http://localhost:9090/tokens?ownerId=${params.id}&__limit=5`
  )
  const profileRes = await axios(
		`http://localhost:9090/profiles?accountId=${params.id}`
	)
	const creatorTokens = await creatorRes.data.data.results
  const ownerTokens = await ownerRes.data.data.results
  const userProfile = await profileRes.data.data.results[0] || {}

	return { props: { creatorTokens, ownerTokens, userProfile } }
}

export default ProfileDetail
