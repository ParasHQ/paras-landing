import { useEffect, useState } from 'react'
import axios from 'axios'
import Marquee from 'react-fast-marquee'
import Link from 'next/link'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useIntl } from 'hooks/useIntl'
const ActivityMarquee = ({ token }) => {
	return (
		<div
			style={{
				padding: '0.15rem 0rem',
			}}
		>
			<Link href={`/token/${token.contract_id}::${token.token_series_id}/${token.token_id}`}>
				<a>
					<div className="bg-primary">
						<div className="flex items-center px-2 py-1 border-0 border-r-2 border-white">
							<div>
								<p className="text-white font-semibold">{token.title}</p>
							</div>
							<div className="pl-2 text-gray-300">
								<span>{formatNearAmount(token.price)}</span> Ⓝ
							</div>
						</div>
					</div>
				</a>
			</Link>
		</div>
	)
}

export const HomeMarqueeList = () => {
	const [marqueeList, setMarqueeList] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const { localeLn } = useIntl()
	useEffect(() => {
		fetchMarqueeList()
	}, [])

	const fetchMarqueeList = async () => {
		const resp = await axios.get(`${process.env.V2_API_URL}/activities/latest-transactions`)
		setMarqueeList(resp.data.data.latest)
		setIsLoading(false)
	}

	if (isLoading) {
		return null
	}

	return (
		<div className="mt-4 flex items-center">
			<div className="flex-shrink-0 w-auto text-white">
				<div
					className="bg-white"
					style={{
						padding: '0.15rem 0rem',
					}}
				>
					<div className="">
						<div className="text-center py-1 px-4">
							<p className="text-primary font-bold">{localeLn('LastSold')}</p>
						</div>
					</div>
				</div>
			</div>
			<Marquee
				className="w-auto"
				style={{
					background: 'white',
				}}
				pauseOnHover={true}
				gradient={false}
				speed={40}
			>
				{marqueeList.map((token) => {
					return (
						<div className="bg-white" key={`${token.contract_id}::${token.token_id}`}>
							<ActivityMarquee token={token} />
						</div>
					)
				})}
			</Marquee>
		</div>
	)
}
