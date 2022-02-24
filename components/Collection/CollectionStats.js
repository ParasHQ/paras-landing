import { prettyBalance } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import { formatNearAmount } from 'near-api-js/lib/utils/format'

const CollectionStats = ({ stats }) => {
	const { localeLn } = useIntl()

	return (
		<>
			<div className="text-center rounded-l block p-3 sm:p-5">
				<p className="text-white font-bold truncate text-md sm:text-sm md:text-2xl">
					{stats.total_cards || '0'}
				</p>
				<p className="text-gray-400 text-xs sm:text-sm md:text-md lg:text-lg">
					{localeLn('Items')}
				</p>
			</div>
			<div className="text-center block p-3 sm:p-5">
				<p className="text-white font-bold truncate text-md sm:text-sm md:text-2xl">
					{stats.total_owners || '0'}
				</p>
				<p className="text-gray-400 text-xs sm:text-sm md:text-md lg:text-lg">
					{localeLn('TotalOwners')}
				</p>
			</div>
			<div className="text-center block p-3 sm:p-5">
				<p className="text-white font-bold truncate text-md sm:text-sm md:text-2xl">
					{formatNearAmount(stats.volume, 2) + ' Ⓝ'}
				</p>
				<p className="text-gray-400 text-xs sm:text-sm md:text-md lg:text-lg">
					{localeLn('TotalVolume')}
				</p>
			</div>
			<div className="flex md:flex-none justify-center">
				<div className="text-center block p-3 sm:p-5">
					<p className="text-white font-bold truncate text-md sm:text-sm md:text-2xl">
						{stats.floor_price ? prettyBalance(stats.floor_price, 24, 4) + ' Ⓝ' : '---'}
					</p>
					<p className="text-gray-400 text-xs sm:text-sm md:text-md lg:text-lg">
						{localeLn('FloorPrice')}
					</p>
				</div>
				<div className="text-center rounded-r block p-3 sm:p-5">
					<p className="text-white font-bold truncate text-md sm:text-sm md:text-2xl">
						{prettyBalance(stats.avg_price || '0', 24, 4)} Ⓝ
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
