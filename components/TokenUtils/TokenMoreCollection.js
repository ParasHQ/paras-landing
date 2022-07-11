import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { IconDownArrow } from 'components/Icons'
import TokenList from 'components/Token/TokenList'
import CardTopRarityListLoader from 'components/Card/CardTopRarityListLoader'

const LIMIT = 7

const TokenMoreCollection = ({ localToken, className, tokenId }) => {
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
			const resp = await axios.get(`${process.env.V2_API_URL}/token`, {
				params: auctionParams,
			})
			const dataTopRarity = resp.data.data.results
			const results = dataTopRarity.filter(
				(token) => tokenId !== `${token.contract_id}::${token.token_id}`
			)
			if (results.length === LIMIT) {
				results.pop()
				setTopRarity(dataTopRarity)
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
				<div className="text-white text-lg bg-cyan-blue-1 px-6 pt-4 rounded-b-xl overflow-auto">
					{!isLoading ? (
						<>
							<div className="block md:hidden">
								<TokenList
									tokens={topRarity}
									displayType="small"
									typeTokenList="top-rarity-token"
								/>
							</div>
							<div className="hidden md:block">
								<TokenList tokens={topRarity} typeTokenList="top-rarity-token" />
							</div>
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
