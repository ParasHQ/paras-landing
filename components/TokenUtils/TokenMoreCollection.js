import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { IconDownArrow } from 'components/Icons'
import CardTopRarityListLoader from 'components/Card/CardTopRarityListLoader'
import Button from 'components/Common/Button'
import router from 'next/router'
import CardList from 'components/TokenSeries/CardList'

const LIMIT = 7

const TokenMoreCollection = ({ localToken, className }) => {
	const [isDropDown, setIsDropDown] = useState(true)
	const [topRarity, setTopRarity] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const auctionParams = {
			collection_id: localToken.metadata.collection_id
				? localToken.metadata.collection_id
				: localToken.contract_id,
			__sort: 'metadata.score::-1',
			__limit: LIMIT,
		}
		const fetchTopRarityToken = async () => {
			setIsLoading(true)
			const resp = await axios.get(`${process.env.V2_API_URL}/token-series`, {
				params: auctionParams,
			})
			const dataTopRarity = resp.data.data.results
			const results = dataTopRarity.filter(
				(token) =>
					`${localToken.contract_id}::${localToken.token_series_id}` !==
					`${token.contract_id}::${token.token_series_id}`
			)
			if (results.length === LIMIT) {
				results.pop()
				setTopRarity(results)
				setIsLoading(false)
				return
			}
			setTopRarity(results)
			setIsLoading(false)
		}
		fetchTopRarityToken()
	}, [localToken])

	return (
		<div className={`${className} my-8 w-full`}>
			<div
				className={`text-white bg-cyan-blue-3 ${
					isDropDown ? 'rounded-t-xl' : 'rounded-xl'
				} hover:cursor-pointer mt-3`}
			>
				<div
					className="flex justify-between items-center pr-2 pl-6 hover:cursor-pointer"
					onClick={() => setIsDropDown(!isDropDown)}
				>
					<p className="text-xl py-3">More from this Collection</p>
					<IconDownArrow size={30} />
				</div>
			</div>
			{isDropDown && (
				<div className="text-white text-lg bg-cyan-blue-1 px-6 pt-4 rounded-b-xl overflow-x-auto">
					{!isLoading ? (
						<>
							{topRarity.length !== 0 ? (
								<>
									<div className="block md:hidden">
										<CardList
											tokens={topRarity}
											displayType="large"
											typeCardList="top-rarity-token"
										/>
									</div>
									<div className="hidden md:block">
										<CardList
											tokens={topRarity}
											displayType="large"
											typeCardList="top-rarity-token"
										/>
									</div>
								</>
							) : (
								<div className="text-center py-28">
									<p className="mb-8">Oops, there{`'`}s nothing else to see from this collection</p>
									<Button size="md" onClick={() => router.push('/market')}>
										Explore Market
									</Button>
								</div>
							)}
						</>
					) : (
						<CardTopRarityListLoader length={4} />
					)}
				</div>
			)}
		</div>
	)
}

export default TokenMoreCollection
