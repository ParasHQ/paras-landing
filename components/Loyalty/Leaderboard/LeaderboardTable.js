import clsx from 'clsx'
import { IconLeft, IconRight } from 'components/Icons'
import LeaderboardColumn from './LeaderboardColum'

const LeaderBoardTable = ({ data, activeTab, onClickLeft, onClickRight }) => (
	<div className="w-full shrink-0 overflow-x-scroll md:overflow-x-auto no-scrollbar">
		<div className="flex flex-nowrap w-[250%] md:w-auto md:grid md:grid-cols-12 text-white text-sm font-bold text-center mb-3 p-2 bg-[#52447F] rounded-lg">
			<p className="flex-shrink-0 w-1/12 md:w-auto flex items-center justify-center">Top 10</p>
			<p className="flex-shrink-0 w-3/12 md:w-auto col-span-3 text flex items-center">Username</p>
			<p className="flex-shrink-0 w-2/12 md:w-auto col-span-2 flex items-center justify-center">
				Locked Staking (LS)
			</p>
			<p className="flex-shrink-0 w-2/12 md:w-auto col-span-2 flex items-center justify-center">
				Duration
			</p>
			<p className="flex-shrink-0 w-2/12 md:w-auto col-span-2 flex items-center justify-center">
				Duration Point
			</p>
			<p className="flex-shrink-0 w-2/12 md:w-auto col-span-2 flex items-center justify-center">
				Total Raffle Point
			</p>
		</div>

		{data?.map((item, index) => (
			<LeaderboardColumn
				key={activeTab + (item?.account_id || '') + index}
				data={item}
				idx={index}
			/>
		))}

		<div className="hidden md:flex justify-between">
			<div
				className={clsx(
					'text-white absolute inset-y-0 left-0 flex items-center',
					activeTab === 'platinum' && 'hidden'
				)}
			>
				<button
					className="cursor-pointer p-1 rounded-full bg-[#52447F] bg-opacity-40 active:scale-90"
					onClick={onClickLeft}
				>
					<IconLeft size={30} />
				</button>
			</div>
			<div
				className={clsx(
					'text-white absolute inset-y-0 right-0 flex items-center',
					activeTab === 'silver' && 'hidden'
				)}
			>
				<button
					className="cursor-pointer p-1 rounded-full bg-[#52447F] bg-opacity-40 active:scale-90"
					onClick={onClickRight}
				>
					<IconRight size={30} />
				</button>
			</div>
		</div>
	</div>
)

export default LeaderBoardTable
