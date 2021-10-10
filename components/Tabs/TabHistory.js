import cachios from 'cachios'
import LinkToProfile from 'components/Common/LinkToProfile'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useEffect, useState } from 'react'
import { timeAgo } from 'utils/common'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useIntl } from 'hooks/useIntl'
const FETCH_TOKENS_LIMIT = 12

const TabHistory = ({ localToken }) => {
	const [history, setHistory] = useState([])
	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)
	const { localeLn } = useIntl()

	useEffect(() => {
		if (localToken.token_series_id) {
			fetchHistory()
		}
	}, [localToken])

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
			params.contract_id = localToken.contract_id
		} else {
			params.token_series_id = localToken.token_series_id
			params.contract_id = localToken.contract_id
		}

		const resp = await cachios.get(`${process.env.V2_API_URL}/activities`, {
			params: params,
			ttl: 30,
		})
		const newData = resp.data.data

		const newHistory = [...(history || []), ...newData.results]
		const _hasMore = newData.results.length < FETCH_TOKENS_LIMIT ? false : true

		setHistory(newHistory)
		setPage(page + 1)
		setHasMore(_hasMore)

		setIsFetching(false)
	}

	return (
		<div className="text-white">
			<InfiniteScroll
				dataLength={history.length}
				next={fetchHistory}
				hasMore={hasMore}
				scrollableTarget="TokenScroll"
				loader={
					<div className="bg-gray-800 mt-3 p-3 rounded-md shadow-md">
						<div className="text-white text-center">{localeLn('Loading...')}</div>
					</div>
				}
			>
				{history.map((h) => (
					<Activity key={h._id} activity={h} />
				))}
			</InfiniteScroll>
		</div>
	)
}

const Activity = ({ activity }) => {
	const { localeLn } = useIntl()
	const TextActivity = ({ type }) => {
		if (type === 'add_market_data' || type === 'update_market_data') {
			return (
				<p>
					<LinkToProfile accountId={activity.msg.params.owner_id} />
					<span>
						{' '}
						{localeLn('put on sale for')} {formatNearAmount(activity.msg.params.price)} Ⓝ
					</span>
				</p>
			)
		}

		if (type === 'delete_market_data') {
			return (
				<p>
					<LinkToProfile accountId={activity.msg.params.owner_id} />
					<span> {localeLn('remove from sale')}</span>
				</p>
			)
		}

		if (type === 'nft_transfer' && activity.from === null) {
			const [, edition_id] = activity.msg.params.token_id.split(':')

			if (activity.price) {
				return (
					<p>
						<LinkToProfile accountId={activity.to} />
						<span> {localeLn('bought from')} </span>
						<LinkToProfile accountId={activity.from} />{' '}
						<span>
							{' '}
							{localeLn('for')} {formatNearAmount(activity.msg.params.price)} Ⓝ
						</span>
					</p>
				)
			}

			if (activity.to === activity.creator_id) {
				return (
					<p>
						<LinkToProfile accountId={activity.to} />
						<span>
							{' '}
							{localeLn('minted')} #{edition_id || 1}
						</span>
					</p>
				)
			}

			return (
				<p>
					<span>{localeLn('minted by')} </span>
					<LinkToProfile accountId={activity.to} />
				</p>
			)
		}

		if (type === 'nft_transfer' && activity.to === null) {
			const [, edition_id] = activity.msg.params.token_id.split(':')

			return (
				<p>
					<LinkToProfile accountId={activity.from} />
					<span>
						{' '}
						{localeLn('burned')} #{edition_id || 1}
					</span>
				</p>
			)
		}

		if (type === 'resolve_purchase' || type === 'nft_transfer') {
			if (activity.price) {
				if (activity.is_offer) {
					return (
						<p>
							<LinkToProfile
								className="text-gray-100 hover:border-gray-100"
								accountId={activity.from}
							/>
							<span> {localeLn('accepted offer from')} </span>
							<LinkToProfile
								className="text-gray-100 hover:border-gray-100"
								accountId={activity.to}
							/>{' '}
							<span>
								{' '}
								{localeLn('for')} {formatNearAmount(activity.msg.params.price)} Ⓝ
							</span>
						</p>
					)
				}
				return (
					<p>
						<LinkToProfile
							className="text-gray-100 hover:border-gray-100"
							accountId={activity.to}
						/>
						<span> {localeLn('bought from')} </span>
						<LinkToProfile
							className="text-gray-100 hover:border-gray-100"
							accountId={activity.from}
						/>{' '}
						<span>
							{' '}
							{localeLn('for')} {formatNearAmount(activity.msg.params.price)} Ⓝ
						</span>
					</p>
				)
			}
			return (
				<p>
					<LinkToProfile accountId={activity.from} />
					<span> {localeLn('transferred to')} </span>
					<LinkToProfile accountId={activity.to} />
				</p>
			)
		}

		if (type === 'nft_create_series') {
			return (
				<p>
					<span>{localeLn('Series created by')} </span>
					<LinkToProfile accountId={activity.msg.params.creator_id} />
				</p>
			)
		}

		if (type === 'nft_set_series_price') {
			if (!activity.msg.params.price) {
				return (
					<p>
						<span>{localeLn('Creator put the series to not for sale')}</span>
					</p>
				)
			}
			return (
				<p>
					<span>
						{localeLn('Creator put the series on sale for')}{' '}
						{formatNearAmount(activity.msg.params.price)} Ⓝ
					</span>
				</p>
			)
		}

		if (type === 'nft_set_series_non_mintable') {
			return (
				<p>
					<span>{localeLn('Creator put the series to non-mintable')} </span>
				</p>
			)
		}

		if (type === 'nft_decrease_series_copies') {
			return (
				<p>
					<span>
						{localeLn('Creator decrease the series copies to')} {activity.msg.params.copies}{' '}
					</span>
				</p>
			)
		}

		if (type === 'nft_decrease_series_copies') {
			return (
				<p>
					<span>
						{localeLn('Creator decrease the series copies to')} {activity.msg.params.copies}{' '}
					</span>
				</p>
			)
		}

		if (type === 'add_offer') {
			return (
				<p>
					<span>
						<LinkToProfile accountId={activity.from} />
					</span>
					<span> {localeLn('added offer for')}</span>
					<span> {formatNearAmount(activity.msg.params.price)} Ⓝ</span>
				</p>
			)
		}

		if (type === 'delete_offer') {
			return (
				<p>
					<span>
						<span>
							<LinkToProfile accountId={activity.from} />
						</span>
						<span> {localeLn('removed offer')}</span>
					</span>
				</p>
			)
		}

		return null
	}

	if (activity.type === 'resolve_purchase_fail' || activity.type === 'notification_add_offer') {
		return null
	}

	return (
		<div className="bg-gray-800 mt-3 p-3 rounded-md shadow-md">
			<TextActivity type={activity.type} />
			<p className="mt-1 text-sm">{timeAgo.format(new Date(activity.msg.datetime))}</p>
		</div>
	)
}

export default TabHistory
