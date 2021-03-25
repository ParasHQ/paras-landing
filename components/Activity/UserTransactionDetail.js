import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

import Card from '../Card'
import CardDetailModal from '../CardDetailModal'
import LinkToProfile from '../LinkToProfile'

import { parseImgUrl, prettyBalance } from '../../utils/common'
import Scrollbars from 'react-custom-scrollbars'

const UserTransactionDetail = ({ data, idx, type = 'buyer' }) => {
	const [profile, setProfile] = useState({})

	useEffect(async () => {
		const res = await axios(
			`${process.env.API_URL}/profiles?accountId=${data._id}`
		)
		setProfile(res.data.data.results[0])
	}, [])

	return (
		<div className="md:flex border-2 border-dashed border-gray-800 rounded-md my-4">
			<div className="flex items-center md:w-2/5 p-4">
				<p className="text-base text-gray-100 opacity-50 mr-3 self-start">
					{idx + 1}
				</p>
				<div className="flex self-start">
					<Link href={`/${data._id}`}>
						<div className="cursor-pointer w-20 h-20 rounded-full overflow-hidden bg-primary">
							<img
								src={parseImgUrl(profile?.imgUrl)}
								className="object-cover"
							/>
						</div>
					</Link>
					<div className="ml-4">
						<LinkToProfile
							accountId={data._id}
							len={18}
							className="text-gray-100 hover:border-gray-100 font-bold text-2xl"
						/>
						<p className="text-base text-gray-400">
							Total {type !== 'buyer' ? 'sales' : 'purchase'}:{' '}
							{prettyBalance(data.total, 24, 6)} Ⓝ
						</p>
						<p className="text-base text-gray-400">
							Card {type !== 'buyer' ? 'sold' : 'bought'}: {data.txList.length}{' '}
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
				>
					{data.txList.map((tx) => (
						<UserTransactionCard key={tx._id} tokenId={tx.tokenId} />
					))}
				</Scrollbars>
			</div>
		</div>
	)
}

const UserTransactionCard = ({ tokenId }) => {
	const router = useRouter()

	const fetcher = async (key) => {
		const resp = await axios.get(`${process.env.API_URL}/${key}`)
		if (resp.data.data.results.length > 0) {
			return resp.data.data.results[0]
		} else {
			return {}
		}
	}

	const { data: localToken } = useSWR(`tokens?tokenId=${tokenId}`, fetcher)

	return (
		<div
			className="w-1/3 md:w-1/5 px-2 inline-block m-auto whitespace-normal overflow-visible"
			onClick={() =>
				router.push(
					{
						pathname: router.pathname,
						query: {
							...router.query,
							...{ tokenId: localToken?.tokenId },
							...{ prevAs: router.asPath },
						},
					},
					`/token/${localToken?.tokenId}`,
					{ shallow: true }
				)
			}
		>
			<CardDetailModal tokens={[localToken]} />
			<div className="w-full m-auto">
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
					disableFlip={true}
					borderRadius={'5px'}
				/>
			</div>
		</div>
	)
}

export default UserTransactionDetail
