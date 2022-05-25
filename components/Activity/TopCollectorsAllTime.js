import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { parseImgUrl } from 'utils/common'
import LinkToProfile from '../LinkToProfile'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'

const TopCollectorsAllTime = ({ className }) => {
	const { localeLn } = useIntl()
	const [data, setData] = useState([])

	useEffect(() => {
		const fetchCollectors = async () => {
			try {
				const res = await axios('https://whales.apollo42.app/api/paras')
				setData(res.data.data)
			} catch (error) {
				sentryCaptureException(error)
			}
		}
		fetchCollectors()
	}, [])

	return (
		<div className={className}>
			<div className="flex justify-between items-baseline">
				<div className="flex space-x-2">
					<h1 className="text-xl font-semibold text-gray-100 capitalize">{`Top Collectors All Time`}</h1>
				</div>
				<a
					className="text-gray-400 hover:text-white cursor-pointer font-semibold flex items-center"
					href="https://paras.apollo42.app/"
					target="_blank"
					rel="noreferrer"
				>
					<span>{localeLn('More')}</span>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="fill-current pl-1"
					>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M17.5858 13.0001H3V11.0001H17.5858L11.2929 4.70718L12.7071 3.29297L21.4142 12.0001L12.7071 20.7072L11.2929 19.293L17.5858 13.0001Z"
						/>
					</svg>
				</a>
			</div>
			<div className="block md:flex md:flex-col">
				{data?.map((user, idx) => (
					<TopCollector key={idx} user={user} idx={idx} />
				))}
				<h4 className="text-white text-opacity-80 italic text-sm">
					*Data provided by{' '}
					<a href="https://whales.apollo42.app" className="underline">
						Apollo
					</a>
				</h4>
			</div>
		</div>
	)
}

const TopCollector = ({ user, idx }) => {
	return (
		<div className="my-3 flex items-center">
			<p className="text-base text-gray-100 opacity-50 mr-3">{idx + 1}</p>
			<Link href={`/${user.address}`}>
				<div className="cursor-pointer w-12 h-12 rounded-full overflow-hidden bg-primary">
					<img src={parseImgUrl(user.img, null, { width: `300` })} className="object-cover" />
				</div>
			</Link>
			<div className="ml-3">
				<LinkToProfile
					accountId={user.address}
					len={16}
					className="text-gray-100 hover:border-gray-100 font-semibold text-lg"
				/>
				<p className="text-base text-gray-400">{parseInt(user.profit).toFixed(0)} Ⓝ</p>
			</div>
		</div>
	)
}

export default TopCollectorsAllTime
