import axios from 'axios'
import Avatar from 'components/Common/Avatar'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { parseImgUrl } from 'utils/common'

const FETCH_TOKENS_LIMIT = 12

const TabOwners = ({ localToken }) => {
	const [tokens, setTokens] = useState([])
	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(async () => {
		if (localToken.token_series_id) {
			await fetchTokens()
		}
	}, [localToken])

	const fetchTokens = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const resp = await axios.get(`${process.env.V2_API_URL}/token`, {
			params: {
				token_series_id: localToken.token_series_id,
				__skip: page * FETCH_TOKENS_LIMIT,
				__limit: FETCH_TOKENS_LIMIT,
			},
		})
		const newData = resp.data.data

		const newTokens = [...(tokens || []), ...newData.results]
		setTokens(newTokens)
		setPage(page + 1)
		if (newData.results.length < FETCH_TOKENS_LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	return (
		<div>
			<InfiniteScroll
				dataLength={tokens.length}
				next={fetchTokens}
				hasMore={true}
			>
				{tokens.map((token) => (
					<Owner token={token} key={token.token_id} />
				))}
			</InfiniteScroll>
		</div>
	)
}

const Owner = ({ token = {} }) => {
	const [profile, setProfile] = useState({})

	useEffect(() => {
		if (token.owner_id) {
			fetchOwnerProfile()
		}
	}, [token.owner_id])

	const fetchOwnerProfile = async () => {
		try {
			const resp = await axios.get(`${process.env.V1_API_URL}/profiles`, {
				params: {
					accountId: token.owner_id,
				},
			})
			const newData = resp.data.data.results[0] || {}
			setProfile(newData)
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div className="bg-blueGray-900 border border-blueGray-700 mt-3 p-3 rounded-md shadow-md">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<Link href={`/${token.owner_id}`}>
						<a className="hover:opacity-80">
							<Avatar
								size="md"
								src={parseImgUrl(profile.imgUrl)}
								className="align-bottom"
							/>
						</a>
					</Link>
					{token.owner_id ? (
						<Link href={`/${token.owner_id}`}>
							<a className="hover:opacity-80">
								<p className="ml-2 text-white font-semibold">
									{token.owner_id}
								</p>
							</a>
						</Link>
					) : (
						<p className="ml-2 text-white font-semibold">Burned</p>
					)}
				</div>
				<div className="flex">
					<Link
						href={`/token/${token.contract_id}::${token.token_series_id}/${token.token_id}`}
					>
						<a className="hover:opacity-80">
							<p className="text-white font-semibold">
								Edition #{token.edition_id}
							</p>
						</a>
					</Link>
				</div>
			</div>
		</div>
	)
}

export default TabOwners
