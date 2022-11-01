import clsx from 'clsx'
import { IconTrophy } from 'components/Icons'
import Link from 'next/link'
import { prettyTruncate } from 'utils/common'

const rankImage = [
	'bafkreibbkbosvw6fg6t2g3zc43ehbxuctojlx6icpgra2flfpiad6lxrsa',
	'bafkreia5hodwsn7tkycevvvzvvhbr5i5h6mhh2mwkeskj3w6hwkim4u6ry',
	'bafkreidz44zrozu6a6wkt6yfwllubpgyddde2e4rpd44m5mbav4l6kundi',
]

const LeaderboardColumn = ({ data, idx }) => {
	return (
		<div
			className={clsx(
				'flex flex-nowrap md:grid md:grid-cols-12 text-white text-sm text-center my-1 p-2 py-3 rounded-lg font-bold min-h-[36px] w-[250%] md:w-auto',
				idx % 2 === 0 && 'bg-[#2A1C57]'
			)}
		>
			<div className="flex-shrink-0 w-1/12 md:w-auto flex items-center justify-center">
				{idx < 3 ? (
					<img
						className="w-9 h-9 -my-1"
						src={`https://paras-cdn.imgix.net/${rankImage[idx]}?w=48&h=48`}
					/>
				) : (
					<p>{idx + 1}</p>
				)}
			</div>
			<div className="flex-shrink-0 w-3/12 md:w-auto md:col-span-3 text-left flex items-center">
				<Link href={`/${data.account_id}`}>
					<a>{prettyTruncate(data.account_id, 15, 'address')}</a>
				</Link>
			</div>
			<div className="flex-shrink-0 w-2/12 md:w-auto col-span-2 flex items-center justify-center">
				<p>
					{data.locked_amount ? `${(data.locked_amount / 10 ** 18).toLocaleString('en-US')} ℗` : ''}
				</p>
			</div>
			<div className="flex-shrink-0 w-2/12 md:w-auto col-span-2">
				<p className="flex items-center justify-center">
					{data.locked_duration ? `${data.locked_duration} days` : ''}
				</p>
			</div>
			<div className="flex-shrink-0 w-2/12 md:w-auto col-span-2 font-normal flex items-center gap-1 justify-center">
				{data.duration_points ? (
					<>
						<p>{data.duration_points?.toLocaleString('en-US')}</p>
						<IconTrophy size={12} />
					</>
				) : null}
			</div>
			<div className="flex-shrink-0 w-2/12 md:w-auto col-span-2 flex items-center gap-1 justify-center">
				{data.total_points ? (
					<>
						<p>{data.total_points?.toLocaleString('en-US')}</p>
						<IconTrophy size={12} />
					</>
				) : null}
			</div>
		</div>
	)
}

export default LeaderboardColumn
