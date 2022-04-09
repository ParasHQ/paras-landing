import Cachios from 'cachios'
import Card from 'components/Card/Card'
import { useEffect, useState } from 'react'
import { parseImgUrl } from 'utils/common'

const TradingCard = ({
	contract_token_id,
	setTradedToken,
	onClickTradingCard,
	afterCreate = false,
}) => {
	const [token, setToken] = useState(null)

	const [contractId, tokenId] = contract_token_id?.split('/')

	useEffect(() => {
		fetchTradedToken()
	}, [])

	const fetchTradedToken = async () => {
		const params = {
			contract_id: contractId.split('::')[0],
			[tokenId ? `token_id` : `token_series_id`]: tokenId
				? tokenId
				: contract_token_id.split('::')[1],
		}
		const resp = await Cachios.get(
			`${process.env.V2_API_URL}/${tokenId ? `token` : `token-series`}`,
			{
				params: params,
				ttl: 60,
			}
		)
		if (resp.data.data.results.length === 0) {
			setTradedToken([])
			return
		} else {
			setToken(resp.data.data.results[0])
		}
	}

	if (!token) {
		return null
	}

	return (
		<>
			<div
				id={contract_token_id}
				className="w-6/12 md:w-full hidden md:flex flex-col items-center whitespace-normal overflow-visible"
				onClick={onClickTradingCard}
			>
				<div className="w-full m-auto">
					<Card
						imgUrl={parseImgUrl(token.metadata.media, null, {
							width: `600`,
							useOriginal: process.env.APP_ENV === 'production' ? false : true,
							isMediaCdn: token.isMediaCdn,
						})}
						imgBlur={token.metadata.blurhash}
						token={{
							title: token.metadata.title,
							collection: token.metadata.collection || token.contract_id,
							copies: token.metadata.copies,
							creatorId: token.metadata.creator_id || token.contract_id,
							is_creator: token.is_creator,
							mime_type: token.metadata.mime_type,
						}}
					/>
				</div>
				{!afterCreate && (
					<div
						className="cursor-pointer flex items-center mt-2"
						onClick={() => {
							setTradedToken([])
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="icon icon-tabler icon-tabler-trash"
							width={20}
							height={20}
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="#ff2825"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<line x1={4} y1={7} x2={20} y2={7} />
							<line x1={10} y1={11} x2={10} y2={17} />
							<line x1={14} y1={11} x2={14} y2={17} />
							<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
							<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
						</svg>
					</div>
				)}
			</div>
			<div className="flex md:hidden">
				<Card
					imgUrl={parseImgUrl(token.metadata.media, null, {
						width: `600`,
						useOriginal: process.env.APP_ENV === 'production' ? false : true,
						isMediaCdn: token.isMediaCdn,
					})}
					imgBlur={token.metadata.blurhash}
					token={{
						title: token.metadata.title,
						collection: token.metadata.collection || token.contract_id,
						copies: token.metadata.copies,
						creatorId: token.metadata.creator_id || token.contract_id,
						is_creator: token.is_creator,
						mime_type: token.metadata.mime_type,
					}}
				/>
				{!afterCreate && (
					<div
						className="cursor-pointer flex items-center mt-2"
						onClick={() => {
							setTradedToken([])
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="icon icon-tabler icon-tabler-trash"
							width={20}
							height={20}
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="#ff2825"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<line x1={4} y1={7} x2={20} y2={7} />
							<line x1={10} y1={11} x2={10} y2={17} />
							<line x1={14} y1={11} x2={14} y2={17} />
							<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
							<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
						</svg>
					</div>
				)}
			</div>
		</>
	)
}

export default TradingCard
