import { formatNearAmount } from 'near-api-js/lib/utils/format'

const ActivityDescriptionCenter = ({ activity }) => {
	if (activity.type === 'add_market_data') {
		return (
			<div>
				<p className="text-gray-300 text-xs">
					{activity.msg.params.is_auction ? 'Starting Price' : 'Listed Price'}
				</p>
				<p className="text-white text-2xl font-bold">
					{formatNearAmount(activity.msg.params.price)} Ⓝ
				</p>
			</div>
		)
	} else if (activity.type === 'nft_create_series' && activity.msg.params.price) {
		return (
			<div>
				<p className="text-gray-300 text-xs">Current Price</p>
				<p className="text-white text-2xl font-bold">
					{formatNearAmount(activity.msg.params.price)} Ⓝ
				</p>
			</div>
		)
	} else if (activity.type === 'resolve_purchase' && activity.is_offer) {
		return (
			<div>
				<p className="text-gray-300 text-xs">Last Sold</p>
				<p className="text-white text-2xl font-bold">
					{formatNearAmount(activity.msg.params.price)} Ⓝ
				</p>
			</div>
		)
	} else if (activity.type === 'resolve_purchase') {
		return (
			<div>
				<p className="text-gray-300 text-xs">Bought Price</p>
				<p className="text-white text-2xl font-bold">
					{formatNearAmount(activity.msg.params.price)} Ⓝ
				</p>
			</div>
		)
	}

	return null
}

export default ActivityDescriptionCenter
