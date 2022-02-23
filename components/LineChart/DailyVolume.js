import { formatNearAmount } from 'near-api-js/lib/utils/format'
import {
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	LineChart,
	Line,
} from 'recharts'

const CustomTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-gray-900 text-white p-2 rounded-md">
				{payload.map((p, idx) => {
					return (
						<div key={idx}>
							<div className="grid grid-rows-3 grid-flow-row">
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
						<LineChart
							data={data}
							width={400}
							height={300}
							margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
						>
							<CartesianGrid strokeDasharray="3 5" horizontal={true} vertical={false} />
							<YAxis
								height={1}
								width={10}
								scale="auto"
								tickFormatter={(x) => {
									return formatNearAmount(x.volume)
								}}
							/>
							<XAxis
								axisLine={false}
								dataKey={`date`}
								interval={4}
								minTickGap={3}
								padding={{ left: 10, right: 10 }}
								stroke="rgba(255, 255, 255, 0.6)"
								tickLine={false}
								tickMargin={8}
								tickFormatter={(x) => {
									return `${new Date(x).getMonth() + 1}/${new Date(x).getDate()}`
								}}
								width={100}
								height={100}
							/>
							<Tooltip content={<CustomTooltip />} allowEscapeViewBox={{ x: true, y: true }} />
							<Line type="monotone" dataKey="volume" stroke="#FFF" />
						</LineChart>
					</ResponsiveContainer>
				</div>
			)}
		</div>
	)
}

export default DailyVolume
