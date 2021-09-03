import axios from 'axios'
import LinkToProfile from 'components/Common/LinkToProfile'
import Link from 'next/link'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useEffect, useState } from 'react'
import { timeAgo } from 'utils/common'

const FETCH_TOKENS_LIMIT = 12

const TabHistory = ({ localToken }) => {
	const [history, setHistory] = useState([])
	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (localToken.token_series_id) {
			fetchAllHistory()
		}
	}, [localToken])

	const fetchAllHistory = async () => {
		const _hasMore = await fetchHistory()

		if (_hasMore) {
			fetchAllHistory()
		}
	}

	const fetchHistory = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)

		const params = {
			__skip: page * FETCH_TOKENS_LIMIT,
			__limit: FETCH_TOKENS_LIMIT,
		}

		if (localToken.token_id) {
			params.token_id = localToken.token_id
		} else {
			params.token_series_id = localToken.token_series_id
		}

		const resp = await axios.get(`${process.env.V2_API_URL}/activities`, {
			params: params,
		})
		const newData = resp.data.data

		const newHistory = [...(history || []), ...newData.results]
		setHistory(newHistory)
		setPage(page + 1)
		const _hasMore = newData.results.length < FETCH_TOKENS_LIMIT ? false : true

		setHasMore(_hasMore)
		setIsFetching(false)

		return _hasMore
	}

	return (
		<div className="mt-4 text-white">
			{history.map((h) => (
				<Activity key={h._id} activity={h} />
			))}
		</div>
	)
}

const Activity = ({ activity }) => {
	const TextActivity = ({ type }) => {
		if (type === 'add_market_data' || type === 'update_market_data') {
			return (
				<p>
					<LinkToProfile accountId={activity.msg.params.owner_id} />
					<span>
						{' '}
						put on sale for {formatNearAmount(activity.msg.params.price)} Ⓝ
					</span>
				</p>
			)
		}

		if (type === 'delete_market_data') {
			return (
				<p>
					<LinkToProfile accountId={activity.msg.params.owner_id} />
					<span> remove from sale</span>
				</p>
			)
		}

		if (type === 'resolve_purchase') {
			return (
				<p>
					<LinkToProfile accountId={activity.from} />
					<span> bought from </span>
					<LinkToProfile accountId={activity.to} />
					<span> for </span>
					{formatNearAmount(activity.msg.params.price)} Ⓝ
				</p>
			)
		}

		if (type === 'nft_transfer' && activity.from === null) {
			const [series_id, edition_id] = activity.msg.params.token_id.split(':')

			return (
				<p>
					<LinkToProfile accountId={activity.to} />
					<span> minted #{edition_id || 1}</span>
				</p>
			)
		}

		if (type === 'nft_transfer' && activity.to === null) {
			const [series_id, edition_id] = activity.msg.params.token_id.split(':')

			return (
				<p>
					<LinkToProfile accountId={activity.from} />
					<span> burned #{edition_id || 1}</span>
				</p>
			)
		}

		if (type === 'nft_transfer') {
			return (
				<p>
					<LinkToProfile accountId={activity.to} />
					<span> transferred to </span>
					<LinkToProfile accountId={activity.from} />
				</p>
			)
		}

		if (type === 'nft_create_series') {
			return (
				<p>
					<span>Series created by </span>
					<LinkToProfile accountId={activity.msg.params.creator_id} />
				</p>
			)
		}

		if (type === 'nft_set_series_price') {
			return (
				<p>
					<span>
						put the series on sale for{' '}
						{formatNearAmount(activity.msg.params.price)} Ⓝ
					</span>
				</p>
			)
		}

		if (type === 'nft_set_series_non_mintable') {
			return (
				<p>
					<span> put the series to non-mintable </span>
				</p>
			)
		}

		if (type === 'nft_decrease_series_copies') {
			return (
				<p>
					<span>
						{' '}
						decrease the series copies to {activity.msg.params.copies}{' '}
					</span>
				</p>
			)
		}

		return null
	}

	return (
		<div className="bg-gray-900 border border-blueGray-700 mt-3 p-3 rounded-md shadow-md">
			<TextActivity type={activity.type} />
			<p className="mt-1 text-sm">
				{timeAgo.format(new Date(activity.msg.datetime))}
			</p>
		</div>
	)
}

export default TabHistory
