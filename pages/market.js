import axios from 'axios'
import { useState } from 'react'
import Nav from '../components/Nav'
import CardList from '../components/CardList'

export default function MarketPage({ data }) {
	const [tokens, setTokens] = useState(data.results)
	const [page, setPage] = useState(1)
	const [isFetching, setIsFetching] = useState(false)
	const [hasMore, setHasMore] = useState(true)

	const _fetchData = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(
			`http://localhost:9090/tokens?__skip=${page * 5}&__limit=5`
		)
		const newData = await res.data.data

		const newTokens = [...tokens, ...newData.results]
		setTokens(newTokens)
		setPage(page + 1)
		if (newData.results.length === 0) {
			setHasMore(false)
		} else {
			setHasMore(true)
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
			<div className="max-w-6xl relative m-auto mt-12">
				<h1 className="text-3xl text-gray-100 text-center">Market</h1>
				<div className="p-4">
					<CardList name="market" tokens={tokens} fetchData={_fetchData} />
				</div>
			</div>
		</div>
	)
}

export async function getServerSideProps() {
	const res = await axios(`http://localhost:9090/tokens?__limit=5`)
	const data = await res.data.data

	return { props: { data } }
}
