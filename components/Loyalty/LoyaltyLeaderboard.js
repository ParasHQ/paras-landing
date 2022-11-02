import clsx from 'clsx'
import useStore from 'lib/store'
import { useState } from 'react'
import { IconRefresh } from 'components/Icons'
import useLeaderboardLoyalty from 'hooks/useLeaderboardLoyalty'
import { useNonInitialEffect } from 'hooks/useNonInitialEffect'
import LeaderboardColumn from './Leaderboard/LeaderboardColum'
import LeaderBoardTable from './Leaderboard/LeaderboardTable'
import LeaderboardButton from './Leaderboard/LeaderboardButton'

const myRankImge = {
	platinum: 'bafkreid7umxapn4menc4o4fawfpvjzeamvyyosxxjgikchlxaqd4et73mq',
	gold: 'bafkreif5n52vzymtk23hcxbmqtxfzutvcceezgc2l3jw7jqpvr4djocv6e',
	silver: 'bafkreiby37ezw5fypfoheq2hcrhpby2cfepaydt6ra7bp2hy4ctsvxwqhm',
	bronze: 'bafkreigc44a5n5x7ukhfqjr3uncnnv4lwwcgshvjyriecn5kfbw36gkf3i',
}

const rankOrder = ['platinum', 'gold', 'silver']

const LoyaltyLeaderboard = ({ raffleId }) => {
	const [activeTab, setActiveTab] = useState('platinum')
	const [isRefreshing, setIsRefreshing] = useState(false)
	const currentUser = useStore((store) => store.currentUser)

	const { data: lbData, myRank, mutate } = useLeaderboardLoyalty({ raffleId, currentUser })

	const dummyArr = Array.from(Array(10).keys())
	const data = [...lbData[activeTab], ...dummyArr].slice(0, 10)

	useNonInitialEffect(() => {
		mutate()
	}, [activeTab])

	const scrollToRight = () => {
		const currentOrder = rankOrder.indexOf(activeTab)
		setActiveTab(rankOrder[currentOrder + 1])
	}

	const scrollToLeft = () => {
		const currentOrder = rankOrder.indexOf(activeTab)
		setActiveTab(rankOrder[currentOrder - 1])
	}

	return (
		<div className="m-4 md:m-6 my-12">
			<img
				className="pointer-events-none"
				src="https://paras-cdn.imgix.net/bafkreib4jn7plqqrkvqzod4latmyfp2z5qzeswgkzaysl43p6hw7zhilei"
			/>
			<div className="bg-[#52447F] px-4 py-3 border mb-4 border-white text-white rounded-md whitespace-pre-line text-center text-sm m-4 md:m-auto md:w-3/4">
				<p>
					This locked staking leaderboard is NOT a winner list. Winners will be chosen randomly
					through raffles.
				</p>
				<p className="font-bold mt-1">
					The higher your raffle point, the bigger your chance to win.
				</p>
			</div>
			<div className="mt-12 md:m-4 md:mt-12 rounded-3xl border-[6px] border-[#36216A] p-2 md:p-8 relative">
				<LeaderboardButton activeTab={activeTab} setActiveTab={setActiveTab} />
				<div className="flex items-center justify-end gap-2 my-4">
					<p className="text-xs text-white">Auto-refresh</p>
					<div
						onClick={() => {
							setIsRefreshing(true)
							setTimeout(() => {
								mutate()
								setIsRefreshing(false)
							}, 1000)
						}}
						className={clsx(
							'p-0.5 border-[0.5px] border-white rounded-full cursor-pointer',
							isRefreshing && 'animate-spin'
						)}
					>
						<IconRefresh size={14} />
					</div>
				</div>
				<LeaderBoardTable
					data={data}
					activeTab={activeTab}
					onClickLeft={scrollToLeft}
					onClickRight={scrollToRight}
				/>
			</div>

			{/* My rank */}
			<div className="mt-24 md:m-4 md:mt-24 rounded-3xl border-[6px] border-[#36216A] p-8 py-6 relative">
				<div className="absolute -top-20 inset-x-0 w-full">
					<img
						className="pointer-events-none w-48 m-auto"
						src={`https://paras-cdn.imgix.net/${myRankImge[myRank?.data?.raffle_type || 'bronze']}`}
					/>
				</div>
				{myRank?.data && myRank?.rank ? (
					<LeaderboardColumn data={myRank.data} idx={myRank.rank - 1} />
				) : (
					<div className="text-white text-center text-sm">
						<p className="font-bold">
							Only users who have registered for the raffle are displayed on this leaderboard.
						</p>
						<p className="mt-1">
							Click{' '}
							<span>
								<a
									className="font-bold"
									href="https://paras.id/publication/how-to-do-locked-staking-6311c2d10de00d001cd7a05a"
								>
									here
								</a>
							</span>{' '}
							for the raffle registration tutorial.
						</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default LoyaltyLeaderboard
