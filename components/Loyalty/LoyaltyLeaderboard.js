import clsx from 'clsx'
import { IconRefresh, IconTrophy } from 'components/Icons'
import Link from 'next/link'
import { useRef } from 'react'
import { useState } from 'react'

const initialData = [
	{
		_id: '635bc042bf1bfff79ba62581',
		account_id: 'kangmalu1.testnet',
		raffle_id: '62ebd76758f5e9899f836259',
		duration_points: 24104,
		locked_amount: 96416,
		locked_duration: 540000,
		raffle_type: 'platinum',
		total_points: 120520,
	},
]

const rankImage = [
	'bafkreibbkbosvw6fg6t2g3zc43ehbxuctojlx6icpgra2flfpiad6lxrsa',
	'bafkreia5hodwsn7tkycevvvzvvhbr5i5h6mhh2mwkeskj3w6hwkim4u6ry',
	'bafkreidz44zrozu6a6wkt6yfwllubpgyddde2e4rpd44m5mbav4l6kundi',
]

const rankOrder = ['platinum', 'gold', 'silver']

const LoyaltyLeaderboard = () => {
	const [activeTab, setActiveTab] = useState('platinum')

	const dummyArr = Array.from(Array(10).keys())
	const data = [...initialData, ...dummyArr].slice(0, 10)

	const ref = useRef(null)

	const scrollToRight = () => {
		const scrollSkip = ref?.current?.clientWidth
		const currentOrder = rankOrder.indexOf(activeTab)
		if (typeof scrollSkip !== 'undefined') {
			ref?.current?.scrollTo({
				left: ref.current.scrollLeft + scrollSkip,
				// behavior: 'smooth',
			})
		}
		setActiveTab(rankOrder[currentOrder + 1])
	}

	const scrollToLeft = () => {
		const scrollSkip = ref?.current?.clientWidth
		const currentOrder = rankOrder.indexOf(activeTab)
		if (typeof scrollSkip !== 'undefined') {
			ref?.current?.scrollTo({
				left: ref?.current?.scrollLeft - scrollSkip,
				// behavior: 'smooth',
			})
		}
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
			<div className="mt-12 m-4 rounded-3xl border-[6px] border-[#36216A] p-8 relative">
				<div className="flex items-center justify-center gap-3 w-full -mt-12">
					<button
						className={clsx('active:scale-95', activeTab !== 'platinum' && 'opacity-50')}
						onClick={() => setActiveTab('platinum')}
					>
						<img
							className="pointer-events-none w-48"
							src="https://paras-cdn.imgix.net/bafkreihqrqmdoh3vj74733tvumf5ukhoxt4miqydwpkmlliulfxmw7ukwq"
						/>
					</button>
					<button
						className={clsx('active:scale-95', activeTab !== 'gold' && 'opacity-50')}
						onClick={() => setActiveTab('gold')}
					>
						<img
							className="pointer-events-none w-48"
							src="https://paras-cdn.imgix.net/bafkreidtfmk32fg355oe44h22ecwgkximo7totpvqzg5u2nrilgv4dawda"
						/>
					</button>
					<button
						className={clsx('active:scale-95', activeTab !== 'silver' && 'opacity-50')}
						onClick={() => setActiveTab('silver')}
					>
						<img
							className="pointer-events-none w-48"
							src="https://paras-cdn.imgix.net/bafkreieh3bemyhlz3si6wo43uxl6f5mowzfmsvr4vkxyln3d4zio6qg22e"
						/>
					</button>
				</div>
				<div className="flex items-center justify-end gap-2 my-4">
					<p className="text-xs text-white">Auto-refresh</p>
					<div
						className={clsx(
							'p-0.5 border-[0.5px] border-white rounded-full cursor-pointer animate-spin'
						)}
					>
						<IconRefresh size={14} />
					</div>
				</div>
				<div ref={ref} className="overflow-hidden flex">
					<LeaderBoardTable data={data} />
					<LeaderBoardTable data={data} />
					<LeaderBoardTable data={data} />
				</div>
				<div className="flex justify-between">
					<p
						className={clsx('text-white', activeTab === 'platinum' && 'hidden')}
						onClick={scrollToLeft}
					>
						Left
					</p>
					<p
						className={clsx('text-white text-right', activeTab === 'silver' && 'hidden')}
						onClick={scrollToRight}
					>
						Right
					</p>
				</div>
			</div>
		</div>
	)
}

export default LoyaltyLeaderboard

const LeaderBoardTable = ({ data }) => (
	<div className="w-full shrink-0">
		<div className="shrink-0 w-full grid grid-cols-12 text-white text-sm font-bold text-center mt-4 mb-3 p-2 bg-[#52447F] rounded-lg">
			<p>Top 10</p>
			<p className="col-span-3 text-left">Username</p>
			<p className="col-span-2">Locked Staking (LS)</p>
			<p className="col-span-2">Duration</p>
			<p className="col-span-2">Duration Point</p>
			<p className="col-span-2">Total Raffle Point</p>
		</div>
		{data?.map((item, index) => (
			<div
				key={item.account_id + index}
				className={clsx(
					'grid grid-cols-12 text-white text-sm text-center my-1 p-2 py-3 rounded-lg font-bold min-h-[36px]',
					index % 2 === 0 && 'bg-[#2A1C57]'
				)}
			>
				<div className="flex items-center justify-center">
					{index < 3 ? (
						<img
							className="w-9 h-9 -my-1"
							src={`https://paras-cdn.imgix.net/${rankImage[index]}?w=48&h=48`}
						/>
					) : (
						<p>{index + 1}</p>
					)}
				</div>
				<Link href={`/${item.account_id}`}>
					<a className="col-span-3 text-left flex items-center">{item.account_id}</a>
				</Link>
				<p className="col-span-2 flex items-center justify-center">
					{item.locked_amount ? `${(item.locked_amount / 10 ** 18).toLocaleString('en-US')} ℗` : ''}
				</p>
				<p className="col-span-2 flex items-center justify-center">
					{item.locked_duration ? `${item.locked_duration} days` : ''}
				</p>
				<div className="col-span-2 font-normal flex items-center gap-1 justify-center">
					{item.duration_points ? (
						<>
							<p>{item.duration_points?.toLocaleString('en-US')}</p>
							<IconTrophy size={12} />
						</>
					) : null}
				</div>
				<div className="col-span-2 flex items-center gap-1 justify-center">
					{item.total_points ? (
						<>
							<p>{item.total_points?.toLocaleString('en-US')}</p>
							<IconTrophy size={12} />
						</>
					) : null}
				</div>
			</div>
		))}
	</div>
)
