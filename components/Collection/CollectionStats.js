import { prettyBalance } from 'utils/common'

const CollectionStats = ({ stats }) => {
	return (
		<>
			<div className="text-center rounded-l block p-3 sm:p-5">
				<p className="text-white font-bold truncate text-md sm:text-sm md:text-2xl">
					{stats.total_cards ? stats.total_cards : '0'}
				</p>
				<p className="text-gray-400 text-xs sm:text-sm md:text-md lg:text-lg">Total Cards</p>
			</div>
			<div className="text-center block p-3 sm:p-5">
				<p className="text-white font-bold truncate text-md sm:text-sm md:text-2xl">
					{stats.total_owners ? stats.total_owners : '0'}
				</p>
				<p className="text-gray-400 text-xs sm:text-sm md:text-md lg:text-lg">Total Owners</p>
			</div>
			<div className="text-center block p-3 sm:p-5">
				<p className="text-white font-bold truncate text-md sm:text-sm md:text-2xl">
					{prettyBalance(stats.floor_price ? stats.floor_price : '---', 24, 4)} Ⓝ
				</p>
				<p className="text-gray-400 text-xs sm:text-sm md:text-md lg:text-lg">Floored Price</p>
			</div>
			<div className="text-center rounded-r block p-3 sm:p-5">
				<p className="text-white font-bold truncate text-md sm:text-sm md:text-2xl">
					{prettyBalance(stats.avg_price ? stats.avg_price : '0', 24, 4)} Ⓝ
				</p>
				<p className="text-gray-400 text-xs sm:text-sm md:text-md lg:text-lg">Average Price</p>
			</div>
		</>
	)
}

export default CollectionStats
