import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { prettyBalance } from 'utils/common'
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { useEffect, useState } from 'react'
import ParasRequest from 'lib/ParasRequest'
import IconEmptyPriceHistory from 'components/Icons/component/IconEmptyPriceHistory'

const TokenPriceHistorySecond = ({ localToken }) => {
	const [activities, setActivities] = useState([])

	useEffect(() => {
		// TODO
	})

	const _fetchData = async () => {
		const params = {
			__skip: 0,
			__limit: 12,
			token_id: localToken.token_id,
			contract_id: localToken.contract_id,
			type: 'market_sales',
		}

		const res = await ParasRequest.get(`${process.env.V2_API_URL}/activities`, {
			params: params,
		})

		const newData = res.data.data.results
		setActivities(newData)
	}

	return (
		<div className="bg-neutral-04 border border-neutral-05 rounded-lg my-6 px-5 py-6">
			<div className="mb-6">
				<p className="font-bold text-xl text-neutral-10">Price History</p>
				<p className="font-normal text-xs text-neutral-10 mt-2">
					Observe how the NFT price is moving. The price might fluctuate for specific NFTs.
				</p>
			</div>

			<div className="flex flex-row justify-between items-center">
				<div className="grid grid-cols-2 bg-neutral-01 border border-neutral-05 rounded-lg p-1">
					<button className="bg-neutral-03 border border-neutral-05 rounded-md text-white text-xs text-center px-1 py-2">
						Near
					</button>
					<button className="bg-neutral-03 border border-neutral-05 rounded-md text-white text-xs text-center px-1 py-2">
						USD
					</button>
				</div>
				<div className="grid grid-cols-7 bg-neutral-01 border border-neutral-05 rounded-lg p-1">
					<button className="bg-neutral-03 border border-neutral-05 rounded-md text-white text-xs text-center p-1">
						1 D
					</button>

					<button className="bg-neutral-03 border border-neutral-05 rounded-md text-white text-xs text-center p-1">
						7 D
					</button>

					<button className="bg-neutral-03 border border-neutral-05 rounded-md text-white text-xs text-center p-1">
						1 M
					</button>

					<button className="bg-neutral-03 border border-neutral-05 rounded-md text-white text-xs text-center p-1">
						3 M
					</button>

					<button className="bg-neutral-03 border border-neutral-05 rounded-md text-white text-xs text-center p-1">
						6 M
					</button>

					<button className="bg-neutral-03 border border-neutral-05 rounded-md text-white text-xs text-center p-1">
						1 Y
					</button>

					<button className="bg-neutral-03 border border-neutral-05 rounded-md text-white text-xs text-center p-1">
						All Time
					</button>
				</div>
			</div>

			<TokenPriceTracker data={activities} />
		</div>
	)
}

const TokenPriceTracker = ({ data }) => {
	return (
		<div className="mt-4">
			{data.length <= 0 ? (
				<div className="bg-neutral-01 border border-neutral-05 rounded-lg py-10">
					<IconEmptyPriceHistory size={100} className="mx-auto" />
				</div>
			) : (
				<div className="h-80 -ml-10 -my-20 -mb-60">
					<ResponsiveContainer width="100%" height="50%" aspect={3}>
						<AreaChart data={data} margin={{ top: 5, right: 20, left: 35, bottom: 35 }}>
							<defs>
								<linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#9996bc" stopOpacity={0.5} />
									<stop offset="50%" stopColor="#594fb2" stopOpacity={0.5} />
									<stop offset="100%" stopColor="#1300BA" stopOpacity={0.15} />
									<stop offset="100%" stopColor="#1300" stopOpacity={0} />
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="4 8" horizontal={false} />
							<YAxis
								domain={[0, 2]}
								axisLine={false}
								tickLine={false}
								tickMargin={8}
								stroke="rgba(255, 255, 255, 0.6)"
								tickFormatter={(x) => {
									return prettyBalance(x / 10 ** 24, 0)
								}}
							/>
							<XAxis
								dataKey="msg.datetime"
								axisLine={false}
								tickLine={false}
								tickMargin={8}
								stroke="rgba(255, 255, 255, 0.6)"
								tickFormatter={(x) => {
									return `${new Date(x).getMonth() + 1}/${new Date(x).getDate()}`
								}}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Area
								type="linear"
								stackId="1"
								dataKey="price.$numberDecimal"
								dot={false}
								stroke="#3389ff"
								strokeWidth={3}
								fillOpacity={1}
								fill="url(#colorVolume)"
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			)}
		</div>
	)
}

const CustomTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-gray-900 text-white p-2 rounded-md">
				{payload.map((p, idx) => {
					return (
						<div key={idx}>
							<div>
								<p className="font-bold text-sm text-center">
									{new Date(p.payload.msg.datetime)
										.toLocaleString('en-US', { month: 'long' })
										.substring(0, 3)}{' '}
									{`${new Date(p.payload.msg.datetime).getDate()}, ${new Date(
										p.payload.msg.datetime
									).getFullYear()}`}
								</p>
							</div>
							<div>
								<span className="capitalize text-sm">Price</span>
								{' : '}
								<span className="font-bold">
									{formatNearAmount(p.payload.price.$numberDecimal)} Ⓝ
								</span>
							</div>
						</div>
					)
				})}
			</div>
		)
	}

	return null
}

export default TokenPriceHistorySecond
