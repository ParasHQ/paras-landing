import Button from 'components/Common/Button'
import IconEmptyMoreCollection from 'components/Icons/component/IconEmptyMoreCollection'
import React, { useEffect, useState } from 'react'
import { IconDownArrow } from 'components/Icons'
import CardTopRarityListLoader from 'components/Card/CardTopRarityListLoader'
import router from 'next/router'
import CardList from 'components/TokenSeries/CardList'
import ParasRequest from 'lib/ParasRequest'
import IconLoaderSecond from 'components/Icons/component/IconLoaderSecond'

const LIMIT = 10

const TokenMoreCollectionSecond = ({ localToken, className }) => {
	const [moreFromCollections, setMoreFromCollections] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		fetchMoreFromCollection()
	}, [localToken])

	const fetchMoreFromCollection = async () => {
		setIsLoading(true)

		const params = {
			collection_id: localToken.metadata.collection_id
				? localToken.metadata.collection_id
				: localToken.contract_id,
			exclude_total_burn: true,
			__sort: 'updated_at::-1',
			__limit: LIMIT,
		}

		const res = await ParasRequest.get(`${process.env.V2_API_URL}/token-series`, {
			params: params,
		})

		const newRes = res.data.data.results
		const filteredRes = newRes.filter(
			(token) =>
				`${localToken.contract_id}::${localToken.token_series_id}` !==
				`${token.contract_id}::${token.token_series_id}`
		)

		if (filteredRes.length === LIMIT) {
			filteredRes.pop()
			setMoreFromCollections(filteredRes)
			setIsLoading(false)
			return
		}

		setMoreFromCollections(filteredRes)
		setIsLoading(false)
	}

	return (
		<div className="relative max-w-6xl m-auto pt-10 pb-14">
			<p className="text-xl text-white font-bold mb-5">More from this Collection</p>
			<div className="mb-5">
				<div className="bg-neutral-01 border border-neutral-05 rounded-lg px-6 py-4">
					{moreFromCollections.length <= 0 ? (
						<IconEmptyMoreCollection size={150} className="mx-auto" />
					) : (
						<div>
							{isLoading ? (
								<IconLoaderSecond size={30} />
							) : (
								<>
									<div className="block md:hidden">
										<CardList
											tokens={moreFromCollections}
											displayType="large"
											typeCardList="top-rarity-token"
											showLike={true}
										/>
									</div>
									<div className="hidden md:block">
										<CardList
											tokens={moreFromCollections}
											displayType="large"
											typeCardList="top-rarity-token"
											showLike={true}
										/>
									</div>
								</>
							)}
						</div>
					)}
				</div>
			</div>
			<div className="text-center">
				<Button variant="second">View Collection</Button>
			</div>
		</div>
	)
}

export default TokenMoreCollectionSecond
