import { useEffect, useState } from 'react'
import axios from 'axios'
import CardList from 'components/TokenSeries/CardList'
import CardListLoader from 'components/Card/CardListLoader'

export const HomeCardList = () => {
	const [tokenList, setTokenList] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		fetchTokenList()
	}, [])

	const fetchTokenList = async () => {
		const resp = await axios.get(`${process.env.V2_API_URL}/token-series`, {
			params: {
				is_verified: true,
				__sort: `_id::-1`,
				__limit: 8,
			},
		})
		if (resp.data.data) {
			setTokenList(resp.data.data.results)
			setIsLoading(false)
		}
	}

	return (
		<div className="mt-8 w-full">
			<div className="flex items-center justify-between">
				<div className="md:flex items-baseline gap-2">
					<h1 className="text-white font-semibold text-3xl capitalize">Highest Sale</h1>
					<p className="text-white">in 24 hours</p>
				</div>
			</div>
			<div className="mt-4">
				{!isLoading ? <CardList tokens={tokenList} /> : <CardListLoader length={4} />}
			</div>
		</div>
	)
}
