import { prettyBalance } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'

const CollectionStats = ({ stats }) => {
	const { localeLn } = useIntl()
	const [showTooltip, setShowTooltip] = useState(false)
	const randomID = 'collection-stats'

	useEffect(() => {
		setShowTooltip(true)
	}, [stats])

	return (
		<>
			{showTooltip && <ReactTooltip id={randomID} place="right" type="dark" />}
			<div className="grid grid-cols-3 md:flex md:flex-row justify-around items-center">
				<div
					data-for={randomID}
					data-tip="Number of NFT that has been minted."
					className="text-center rounded-l block p-3 sm:p-5"
				>
					<p className="text-white font-bold truncate text-md sm:text-sm md:text-2xl">
						{stats.total_cards || '---'}
					</p>
					<p className="text-gray-400 text-xs sm:text-sm md:text-md lg:text-lg">
						{localeLn('Items')}
					</p>
				</div>
				<div
					data-for={randomID}
					data-tip="Total NFT that is currently being sold."
					className="text-center block p-3 sm:p-5"
				>
					<p className="text-white font-bold truncate text-md sm:text-sm md:text-2xl">
						{stats.total_card_sale || '---'}
					</p>
					<p className="text-gray-400 text-xs sm:text-sm md:text-md lg:text-lg">
						{localeLn('TotalListed')}
					</p>
				</div>

				<div
					data-for={randomID}
					data-tip="Total of unique owners."
					className="text-center block p-3 sm:p-5"
				>
					<p className="text-white font-bold truncate text-md sm:text-sm md:text-2xl">
						{stats.total_owners || '---'}
					</p>
					<p className="text-gray-400 text-xs sm:text-sm md:text-md lg:text-lg">
						{localeLn('TotalOwners')}
					</p>
				</div>
				<div
					data-for={randomID}
					data-tip="Total volume all time."
					className="text-center block w-32 p-1 sm:w-auto sm:p-5"
				>
					<p className="text-white font-bold truncate text-md sm:text-sm md:text-2xl">
						{stats.volume ? formatNearAmount(stats.volume, 2) + ' Ⓝ' : '---'}
					</p>
					<p className="text-gray-400 text-xs sm:text-sm md:text-md lg:text-lg">
						{localeLn('TotalVolume')}
					</p>
				</div>
				<div
					data-for={randomID}
					data-tip="The cheapest price."
					className="text-center block p-3 sm:p-5"
				>
					<p className="text-white font-bold truncate text-md sm:text-sm md:text-2xl">
						{stats.floor_price ? prettyBalance(stats.floor_price, 24, 4) + ' Ⓝ' : '---'}
					</p>
					<p className="text-gray-400 text-xs sm:text-sm md:text-md lg:text-lg">
						{localeLn('FloorPrice')}
					</p>
				</div>
				<div
					data-for={randomID}
					data-tip="Average price all time."
					className="text-center rounded-r block p-3 sm:p-5"
				>
					<p className="text-white font-bold truncate text-md sm:text-sm md:text-2xl">
						{stats.avg_price ? prettyBalance(stats.avg_price || '0', 24, 4) + 'Ⓝ' : '---'}
					</p>
					<p className="text-gray-400 text-xs sm:text-sm md:text-md lg:text-lg">
						{localeLn('AveragePrice')}
					</p>
				</div>
			</div>
		</>
	)
}

export default CollectionStats
