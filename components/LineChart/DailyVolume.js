import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { prettyBalance } from 'utils/common'
import {
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	AreaChart,
	Area,
} from 'recharts'

const CustomTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-gray-900 text-white p-2 rounded-md">
				{payload.map((p, idx) => {
					return (
						<div key={idx} className="grid grid-rows-4 grid-flow-row">
							<div>
								<p className="font-bold text-sm text-center">
									{new Date(p.payload.date)
										.toLocaleString('en-US', { month: 'long' })
										.substring(0, 3)}{' '}
									{`${new Date(p.payload.date).getDate()}, ${new Date(
										p.payload.date
									).getFullYear()}`}
								</p>
							</div>
							<div>
								<span className="capitalize text-sm">Volume</span>
								{' : '}
								<span className="font-bold">{formatNearAmount(p.payload.volume, 2)} Ⓝ</span>
							</div>
							<div>
								<span className="capitalize text-sm">Sales</span>
								{' : '}
								<span className="font-bold">{p.payload.sales}</span>
							</div>
							<div>
								<span className="capitalize text-sm">Avg. Price</span>
								{' : '}
								<span className="font-bold">{formatNearAmount(p.payload.avg_sale, 2)} Ⓝ</span>
							</div>
						</div>
					)
				})}
			</div>
		)
	}

	return null
}

const DailyVolume = ({ data }) => {
	return (
		<div>
			{data.length > 0 && (
				<div className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 35 }}>
							<defs>
								<linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#9996bc" stopOpacity={0.5} />
									<stop offset="50%" stopColor="#594fb2" stopOpacity={0.5} />
									<stop offset="75%" stopColor="#1300BA" stopOpacity={0.15} />
									<stop offset="100%" stopColor="#1300" stopOpacity={0} />
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="4 8" horizontal={false} />
							<YAxis
								axisLine={false}
								tickLine={false}
								tickMargin={8}
								stroke="rgba(255, 255, 255, 0.6)"
								tickFormatter={(x) => {
									return prettyBalance(x / 10 ** 24, 0)
								}}
							/>
							<XAxis
								interval={4}
								dataKey="date"
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
								type="monotone"
								stackId="1"
								dataKey="volume"
								dot={false}
								stroke="#3389ff"
								strokeWidth={2}
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

export default DailyVolume
