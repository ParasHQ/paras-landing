import CountdownSimple from 'components/Common/CountdownSimple'
import { timeAgo } from 'utils/common'

const ActivityDescriptionBottom = ({ activity, token }) => {
	if (activity.type === 'add_market_data' && activity.msg.params.is_auction) {
		return (
			<div>
				<CountdownSimple endedDate={activity.msg.params.ended_at} />
			</div>
		)
	}

	const issuedAt = token?.metadata?.issued_at
	if (issuedAt && issuedAt instanceof Date && !isNaN(issuedAt)) {
		return (
			<div>
				<p className="text-xs text-gray-400">Minted {timeAgo.format(new Date(issuedAt))}</p>
			</div>
		)
	}
	if (typeof issuedAt === 'string') {
		return (
			<div>
				<p className="text-xs text-gray-400">
					Minted {timeAgo.format(new Date(parseInt(issuedAt) / 10 ** 6))}
				</p>
			</div>
		)
	}

	return null
}

export default ActivityDescriptionBottom
