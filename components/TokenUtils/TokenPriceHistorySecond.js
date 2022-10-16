import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { prettyBalance } from 'utils/common'
import {
	Area,
	AreaChart,
	CartesianGrid,
	Label,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { useEffect, useState } from 'react'
import JSBI from 'jsbi'
import useStore from 'lib/store'
import ParasRequest from 'lib/ParasRequest'
import IconEmptyPriceHistory from 'components/Icons/component/IconEmptyPriceHistory'

const ChartCurrencyEnum = {
	NEAR: 'Near',
	USD: 'USD',
}

const ChartFilterEnum = {
	ONE_DAY: '1 D',
	SEVEN_DAY: '7 D',
	ONE_MONTH: '1 M',
	THREE_MONTH: '3 M',
	SIX_MONTH: '6 M',
	ONE_YEAR: '1 Y',
	ALL_TIME: 'All Time',
}

const TokenPriceHistorySecond = ({ localToken }) => {
	const store = useStore()

	const [activities, setActivities] = useState([])
	const [chartFilter, setChartFilter] = useState(ChartFilterEnum.ALL_TIME)
	const [chartCurrency, setChartCurrency] = useState(ChartCurrencyEnum.NEAR)

	useEffect(() => {
		fetchDataActivities()
	}, [localToken, chartFilter])

	const fetchDataActivities = async () => {
		const params = {
			days: parseDays(),
			contract_id: localToken.contract_id,
		}

		if (localToken.token_id) {
			params.token_id = localToken.token_id
		} else {
			params.token_series_id = localToken.token_series_id
		}

		const res = await ParasRequest.get(`${process.env.V2_API_URL}/price-history`, {
			params: params,
		})

		const newData = res.data.data.results
		if (!newData) {
			setActivities([])
			return
		}

		const parseData = Object.keys(newData)
			.map((data) => {
				const dataSplit = data.split(' ')
				const key =
					chartFilter === ChartFilterEnum.ONE_DAY
						? `${dataSplit[2]}, ${dataSplit[1]} ${dataSplit[3]}, ${dataSplit[4]}`
						: `${dataSplit[2]}, ${dataSplit[1]} ${dataSplit[3]}`
				newData[data].key = key
				return newData[data]
			})
			.sort((a, b) => a.issued_at - b.issued_at)

		setActivities(parseData)
	}

	const parseDays = () => {
		switch (chartFilter) {
			case ChartFilterEnum.ALL_TIME:
				return null
			case ChartFilterEnum.ONE_YEAR:
				return 365
			case ChartFilterEnum.SIX_MONTH:
				return 180
			case ChartFilterEnum.THREE_MONTH:
				return 90
			case ChartFilterEnum.ONE_MONTH:
				return 30
			case ChartFilterEnum.SEVEN_DAY:
				return 7
			case ChartFilterEnum.ONE_DAY:
				return 1
		}
	}

	return (
		<div className="bg-neutral-04 border border-neutral-05 rounded-lg my-6 px-5 pt-6 pb-7">
			<div className="mb-6">
				<p className="font-bold text-xl text-neutral-10">Price History</p>
				<p className="font-normal text-xs text-neutral-10 mt-2">
					Observe how the NFT price is moving. The price might fluctuate for specific NFTs.
				</p>
			</div>

			<div className="flex flex-row justify-between items-center mb-2">
				<div className="grid grid-cols-2 bg-neutral-01 border border-neutral-05 rounded-lg p-1">
					{Object.keys(ChartCurrencyEnum).map((curr) => (
						<button
							key={curr}
							className={`${
								chartCurrency === ChartCurrencyEnum[curr] &&
								'bg-neutral-03 border border-neutral-05'
							} rounded-md text-neutral-10 text-xs text-center px-1 py-2`}
							onClick={() => setChartCurrency(ChartCurrencyEnum[curr])}
						>
							{ChartCurrencyEnum[curr]}
						</button>
					))}
				</div>
				<div className="grid grid-cols-7 bg-neutral-01 border border-neutral-05 rounded-lg p-1">
					{Object.keys(ChartFilterEnum).map((filter) => (
						<button
							key={filter}
							className={`${
								chartFilter === ChartFilterEnum[filter] && 'bg-neutral-03 border border-neutral-05'
							} rounded-md text-neutral-10 text-xs text-center p-1`}
							onClick={() => setChartFilter(ChartFilterEnum[filter])}
						>
							{ChartFilterEnum[filter]}
						</button>
					))}
				</div>
			</div>

			<div className="h-[390px] bg-neutral-01 border border-neutral-05 rounded-lg py-6">
				<TokenPriceTracker data={activities} chartCurrency={chartCurrency} store={store} />
			</div>
		</div>
	)
}

const TokenPriceTracker = ({ data, chartCurrency, store }) => {
	return (
		<div className="mt-10">
			{data.length <= 0 ? (
				<IconEmptyPriceHistory size={150} className="mx-auto my-16" />
			) : (
				<div className="max-h-full">
					<ResponsiveContainer width="100%" height={300}>
						<AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 35 }}>
							<defs>
								<linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#9185FF" stopOpacity={0.25} />
									<stop offset="100%" stopColor="#9185FF" stopOpacity={0} />
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="3 3" stroke="#3A4251" />
							<YAxis
								domain={[0, 'auto']}
								axisLine={true}
								tickLine={false}
								tickMargin={2}
								stroke="#F9F9F9"
								fontSize={12}
								tickFormatter={(x) => {
									return chartCurrency === ChartCurrencyEnum.NEAR
										? prettyBalance(x / 10 ** 24, 0)
										: prettyBalance(JSBI.BigInt(x) * store.nearUsdPrice, 24, 0)
								}}
							>
								<Label
									value={'Price'}
									position="insideLeft"
									angle={-90}
									fill={'#F9F9F9'}
									style={{ fontSize: 15, marginLeft: 50 }}
								/>
							</YAxis>
							<XAxis
								dataKey="key"
								interval={0}
								axisLine={true}
								tickLine={false}
								tickMargin={8}
								stroke="#F9F9F9"
								fontSize={12}
								width={10}
							>
								<Label
									value={'Time Period'}
									position="bottom"
									fill={'#F9F9F9'}
									style={{ fontSize: 15, left: 100 }}
								/>
							</XAxis>
							<Tooltip content={<CustomTooltip chartCurrency={chartCurrency} store={store} />} />
							<Area
								type="natural"
								stackId="1"
								dataKey="average_price"
								dot={{ strokeWidth: 1 }}
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

const CustomTooltip = ({ active, payload, chartCurrency, store }) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-[#1300ba80] border border-[#9185FF] text-neutral-10 p-2 rounded-md">
				{payload.map((p, idx) => {
					return (
						<div key={idx}>
							<div>
								<p className="font-bold text-xs text-center">{p.payload.key}</p>
							</div>
							<div>
								<span className="capitalize text-xs">Highest Price</span>
								{' : '}
								<span className="font-bold text-sm">
									{chartCurrency === ChartCurrencyEnum.NEAR
										? formatNearAmount(p.payload.highest_price, 2) + ' Ⓝ'
										: '$ ' +
										  prettyBalance(
												JSBI.BigInt(p.payload.highest_price) * store.nearUsdPrice,
												24,
												0
										  )}
								</span>
							</div>
							<div>
								<span className="capitalize text-xs">Average Price</span>
								{' : '}
								<span className="font-bold text-sm">
									{chartCurrency === ChartCurrencyEnum.NEAR
										? formatNearAmount(p.payload.average_price, 2) + ' Ⓝ'
										: '$ ' +
										  prettyBalance(
												JSBI.BigInt(p.payload.average_price) * store.nearUsdPrice,
												24,
												0
										  )}
								</span>
							</div>
							<div>
								<span className="capitalize text-xs">Lowest Price</span>
								{' : '}
								<span className="font-bold text-sm">
									{chartCurrency === ChartCurrencyEnum.NEAR
										? formatNearAmount(p.payload.lowest_price, 2) + ' Ⓝ'
										: '$ ' +
										  prettyBalance(
												JSBI.BigInt(p.payload.lowest_price) * store.nearUsdPrice,
												24,
												0
										  )}
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
