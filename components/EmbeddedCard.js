import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

import { parseImgUrl } from '../utils/common'
import Card from './Card'
import { useRouter } from 'next/router'
import CardDetailModal from './CardDetailModal'

const EmbeddedCard = ({ tokenId }) => {
	const router = useRouter()
	const [localToken, setLocalToken] = useState(null)

	useEffect(() => {
		fetchToken()
	}, [])

	const fetchToken = async () => {
		const res = await axios(`${process.env.API_URL}/tokens?tokenId=${tokenId}`)
		const token = (await res.data.data.results[0]) || null
		setLocalToken(token)
	}

	return (
		<div className="inline-block p-4 rounded-md w-full md:max-w-lg">
			<CardDetailModal tokens={[localToken]} />
			<div className="w-64 mx-auto">
				<Card
					imgUrl={parseImgUrl(localToken?.metadata?.image)}
					imgBlur={localToken?.metadata?.blurhash}
					token={{
						name: localToken?.metadata?.name,
						collection: localToken?.metadata?.collection,
						description: localToken?.metadata?.description,
						creatorId: localToken?.creatorId,
						supply: localToken?.supply,
						tokenId: localToken?.tokenId,
						createdAt: localToken?.createdAt,
					}}
					initialRotate={{
						x: 0,
						y: 0,
					}}
				/>
			</div>
			<div className="text-gray-100 pt-4 text-center">
				<div>
					<Link
						href={{
							pathname: router.pathname,
							query: {
								...router.query,
								...{ tokenId: localToken?.tokenId },
								...{ prevAs: router.asPath },
							},
						}}
						as={`/token/${localToken?.tokenId}`}
						scroll={false}
						shallow
					>
						<a
							title={localToken?.metadata?.name}
							className="text-2xl font-bold border-b-2 border-transparent"
						>
							{localToken?.metadata?.name}
						</a>
					</Link>
				</div>
				<p className="opacity-75 truncate">
					{localToken?.metadata?.collection}
				</p>
			</div>
		</div>
	)
}

export default EmbeddedCard
