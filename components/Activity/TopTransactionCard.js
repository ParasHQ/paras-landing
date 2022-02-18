import Cachios from 'cachios'
import Card from 'components/Card/Card'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { parseImgUrl } from 'utils/common'

const TopTransactionCard = ({ contract_token_id, setLocalToken }) => {
	const router = useRouter()
	const [token, setToken] = useState(null)

	const [contractId, tokenId] = contract_token_id.split('::')

	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = async () => {
		const params = {
			contract_id: contractId,
			token_id: tokenId,
		}
		const resp = await Cachios.get(`${process.env.V2_API_URL}/token`, {
			params: params,
			ttl: 60,
		})
		setToken(resp.data.data.results[0])
	}

	if (!token) {
		return null
	}

	return (
		<div
			id={contract_token_id}
			className="w-1/3 md:w-1/5 px-2 inline-block whitespace-normal overflow-visible flex-shrink-0"
		>
			<div className="w-full m-auto" onClick={() => setLocalToken(token)}>
				<Card
					imgUrl={parseImgUrl(token.metadata.media, null, {
						width: `200`,
						useOriginal: process.env.APP_ENV === 'production' ? false : true,
						isMediaCdn: token.isMediaCdn,
					})}
					onClick={() => {
						router.push(
							{
								pathname: router.pathname,
								query: {
									...router.query,
									tokenId: token.token_id,
									contractId: token.contract_id,
								},
							},
							`/token/${token.contract_id}::${token.token_series_id}/${token.token_id}`,
							{
								shallow: true,
								scroll: false,
							}
						)
					}}
					imgBlur={token.metadata.blurhash}
					token={{
						title: token.metadata.title,
						collection: token.metadata.collection || token.contract_id,
						copies: token.metadata.copies,
						creatorId: token.metadata.creator_id || token.contract_id,
						is_creator: token.is_creator,
					}}
				/>
			</div>
		</div>
	)
}

export const renderThumb = ({ style, ...props }) => {
	return (
		<div
			{...props}
			style={{
				...style,
				cursor: 'pointer',
				borderRadius: 'inherit',
				backgroundColor: 'rgba(255, 255, 255, 0.2)',
			}}
		/>
	)
}

export default TopTransactionCard
