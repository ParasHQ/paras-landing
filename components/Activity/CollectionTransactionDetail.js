import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'

import Card from '../Card/Card'

import { parseImgUrl } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import cachios from 'cachios'
import TokenDetailModal from 'components/Token/TokenDetailModal'

const renderThumb = ({ style, ...props }) => {
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

const CollectionTransactionList = ({ data }) => {
	const [localToken, setLocalToken] = useState(null)

	return (
		<>
			<TokenDetailModal tokens={[localToken]} />
			{data.map((user, idx) => (
				<UserTransactionDetail
					data={user}
					key={user.account_id}
					idx={idx}
					setLocalToken={setLocalToken}
				/>
			))}
		</>
	)
}

const UserTransactionDetail = ({ data, idx, setLocalToken }) => {
	const { localeLn } = useIntl()

	const [colDetail, setColDetail] = useState({})

	useEffect(async () => {
		const res = await axios(`${process.env.V2_API_URL}/collections`, {
			params: {
				collection_id: data.collection_id,
			},
		})
		setColDetail(res.data.data.results[0])
	}, [])

	return (
		<div key={idx} className="md:flex border-2 border-dashed border-gray-800 rounded-md my-4">
			<div className="flex items-center md:w-2/5 p-4">
				<p className="text-base text-gray-100 opacity-50 mr-3 self-start">{idx + 1}</p>
				<div className="flex self-start">
					<Link href={`/collection/${data.collection_id}`}>
						<a>
							<div className="cursor-pointer w-20 h-20 rounded-full overflow-hidden bg-primary">
								<img
									src={parseImgUrl(colDetail?.media, null, {
										width: `300`,
									})}
									className="object-cover"
								/>
							</div>
						</a>
					</Link>
					<div className="ml-4">
						{colDetail.collection && (
							<Link href={`/collection/${data.collection_id}`}>
								<a className="text-gray-100 border-b-2 border-transparent hover:border-gray-100 font-bold text-lg md:text-2xl">
									{colDetail.collection}
								</a>
							</Link>
						)}
						<p className="text-base text-gray-400">
							Total sales: {formatNearAmount(data.total_sum)} Ⓝ
						</p>
						<p className="text-base text-gray-400">
							{localeLn('Card')} sold: {data.contract_token_ids.length}
						</p>
					</div>
				</div>
			</div>
			<div className="md:w-3/5 p-4 px-2">
				<Scrollbars
					autoHeight
					autoHeightMax={`24rem`}
					renderView={(props) => <div {...props} id="scrollableDiv" />}
					className="overflow-auto whitespace-no-wrap"
					universal={true}
					renderThumbHorizontal={renderThumb}
				>
					<div className="flex py-2">
						{data.contract_token_ids.slice(0, 5).map((contract_token_id, idx) => (
							<UserTransactionCard
								key={idx}
								contract_token_id={contract_token_id}
								setLocalToken={setLocalToken}
							/>
						))}
					</div>
				</Scrollbars>
			</div>
		</div>
	)
}

const UserTransactionCard = ({ contract_token_id, setLocalToken }) => {
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
		const resp = await cachios.get(`${process.env.V2_API_URL}/token`, {
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
						width: `300`,
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
					}}
				/>
			</div>
		</div>
	)
}

export default CollectionTransactionList
