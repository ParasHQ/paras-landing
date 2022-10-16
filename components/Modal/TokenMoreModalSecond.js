const TokenMoreModalSecond = ({ show, onShowTradeModal }) => {
	if (!show) {
		return null
	}

	return (
		<div className="w-40 absolute grid grid-cols-1 z-10 top-16 right-5 bg-neutral-01 border border-neutral-10 rounded-lg p-2 shadow-lg">
			<button className="text-neutral-10 text-left p-2" onClick={onShowTradeModal}>
				Offer via NFT
			</button>
			<button className="text-neutral-10 text-left p-2">Report</button>
		</div>
	)
}

export default TokenMoreModalSecond
