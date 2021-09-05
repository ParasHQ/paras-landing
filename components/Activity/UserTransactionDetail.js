import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'

import Card from '../Card'
import LinkToProfile from '../LinkToProfile'

import { parseImgUrl } from '../../utils/common'
import InfiniteScroll from 'react-infinite-scroll-component'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import cachios from 'cachios'
import TokenDetailModal from 'components/TokenDetailModal'

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

const UserTransactionList = ({ usersData, fetchData, hasMore, type }) => {
	const [localToken, setLocalToken] = useState(null)

	return (
		<>
			<TokenDetailModal tokens={[localToken]} />
			<InfiniteScroll
				dataLength={usersData.length}
				next={fetchData}
				hasMore={hasMore}
			>
				{usersData.map((user, idx) => (
					<UserTransactionDetail
						data={user}
						key={user.account_id}
						idx={idx}
						type={type}
						setLocalToken={setLocalToken}
					/>
				))}
			</InfiniteScroll>
		</>
	)
}

const UserTransactionDetail = ({
	data,
	idx,
	type = 'buyer',
	setLocalToken,
}) => {
	const [profile, setProfile] = useState({})

	useEffect(async () => {
		const res = await axios(
			`${process.env.V2_API_URL}/profiles?accountId=${data.account_id}`
		)
		setProfile(res.data.data.results[0])
	}, [])

	return (
		<div
			key={idx}
			className="md:flex border-2 border-dashed border-gray-800 rounded-md my-4"
		>
			<div className="flex items-center md:w-2/5 p-4">
				<p className="text-base text-gray-100 opacity-50 mr-3 self-start">
					{idx + 1}
				</p>
				<div className="flex self-start">
					<Link href={`/${data.account_id}`}>
						<div className="cursor-pointer w-20 h-20 rounded-full overflow-hidden bg-primary">
							<img
								src={parseImgUrl(profile?.imgUrl, null, {
									width: `300`,
								})}
								className="object-cover"
							/>
						</div>
					</Link>
					<div className="ml-4">
						{data.account_id && (
							<LinkToProfile
								accountId={data.account_id}
								len={16}
								className="text-gray-100 hover:border-gray-100 font-bold text-lg md:text-2xl"
							/>
						)}
						<p className="text-base text-gray-400">
							Total {type !== 'buyer' ? 'sales' : 'purchase'}:{' '}
							{formatNearAmount(data.total_sum)} Ⓝ
						</p>
						<p className="text-base text-gray-400">
							Card {type !== 'buyer' ? 'sold' : 'bought'}:{' '}
							{data.contract_token_ids.length}
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
						{data.contract_token_ids.map((contract_token_id, idx) => (
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
						width: `600`,
						useOriginal: true,
					})}
					onClick={() => {
						router.push(
							{
								pathname: router.pathname,
								query: {
									...router.query,
									...{ tokenId: token.token_id },
									...{ prevAs: router.asPath },
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

export default UserTransactionList
