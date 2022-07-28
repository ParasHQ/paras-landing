import { formatNearAmount } from 'near-api-js/lib/utils/format'

const ActivityDescriptionTop = ({ activity, token, onClickToSeeDetails, onClickToCollection }) => {
	if (activity.type === 'add_market_data' || activity.type === 'update_market_data') {
		return (
			<>
				<span>{activity.msg.params.is_auction ? 'Auctioned ' : 'Listed '} </span>
				<span className="font-bold cursor-pointer hover:underline" onClick={onClickToSeeDetails}>
					{token?.metadata.title}
				</span>
				<span> for </span>
				<span className="font-bold">{formatNearAmount(activity.msg.params.price)} Ⓝ</span>
			</>
		)
	} else if (activity.type === 'nft_create_series') {
		return (
			<>
				<span>Created </span>
				<span className="font-bold cursor-pointer hover:underline" onClick={onClickToSeeDetails}>
					{token?.metadata.title}
				</span>
				<span> series</span>
			</>
		)
	} else if (activity.type === 'add_bid') {
		return (
			<>
				<span className="font-bold">Place a bid </span>
				<span>for </span>
				<span className="font-bold">{formatNearAmount(activity.msg.params.amount)} Ⓝ</span>
			</>
		)
	} else if (activity.type === 'add_offer') {
		return (
			<>
				<span className="font-bold">Made an offer </span>
				<span>for </span>
				<span className="font-bold">{formatNearAmount(activity.msg.params.price)} Ⓝ</span>
			</>
		)
	} else if (activity.type === 'resolve_purchase' && activity.is_auction) {
		return (
			<>
				<span>Bought a card from </span>
				<span className="font-bold cursor-pointer hover:underline" onClick={onClickToCollection}>
					{token?.metadata.collection || token?.metadata.contract_id}
				</span>
				<span> via Auction</span>
			</>
		)
	}
	return null
}

export default ActivityDescriptionTop
