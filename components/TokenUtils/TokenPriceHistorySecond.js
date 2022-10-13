import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { trackClosePriceHistory, trackOpenPriceHistory } from 'lib/ga'
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
	const [activities, setActivities] = useState([])
	const [isDropDown, setIsDropDown] = useState(true)
	const [avgPrice, setAvgPrice] = useState()
	const [chartFilter, setChartFilter] = useState(ChartFilterEnum.ALL_TIME)
	const [chartCurrency, setChartCurrency] = useState(ChartCurrencyEnum.NEAR)

	useEffect(() => {
		fetchDataActivities()
	}, [localToken, chartFilter])

	const fetchDataActivities = async () => {
		const params = {
			__skip: 0,
			__limit: 100,
			token_id: localToken.token_id,
			contract_id: localToken.contract_id,
			type: 'market_sales',
		}

		const res = await ParasRequest.get(`${process.env.V2_API_URL}/activities`, {
			params: params,
		})

		const newData = res.data.data.results

		switch (chartFilter) {
			case ChartFilterEnum.ALL_TIME:
				filterPriceHistory(newData, 0)
				return
			case ChartFilterEnum.ONE_YEAR:
				filterPriceHistory(newData, 365)
				return
			case ChartFilterEnum.SIX_MONTH:
				filterPriceHistory(newData, 180)
				return
			case ChartFilterEnum.THREE_MONTH:
				filterPriceHistory(newData, 90)
				return
			case ChartFilterEnum.ONE_MONTH:
				filterPriceHistory(newData, 30)
				return
			case ChartFilterEnum.SEVEN_DAY:
				filterPriceHistory(newData, 7)
				return
			case ChartFilterEnum.ONE_DAY:
				filterPriceHistory(newData, 1)
				return
		}
	}

	const filterAvgPrice = (data) => {
		var price = data.map((item) => parseFloat(item.price.$numberDecimal)),
			average =
				price.reduce(function (sum, value) {
					return sum + value
				}, 0) / price.length

		setAvgPrice(average.toFixed(2))
	}

	const filterPriceHistory = (data, days) => {
		const currentDate = new Date()
		const currentDateTime = currentDate.getTime()
		const selectHistoryDate = new Date(currentDate.setDate(currentDate.getDate() - days))
		const selectHistoryDateTime = selectHistoryDate.getTime()

		if (days === 0) {
			filterAvgPrice(data)
			setActivities(data.reverse())
			return
		}

		const results = data
			.filter((x) => {
				const elementDateTime = new Date(x.issued_at).getTime()
				if (elementDateTime <= currentDateTime && elementDateTime >= selectHistoryDateTime) {
					return true
				}
				return false
			})
			.sort((a, b) => {
				return a.issued_at - b.issued_at
			})

		filterAvgPrice(results)
		setActivities(results)
	}

	const onCLickDropdown = () => {
		setIsDropDown(!isDropDown)
		if (isDropDown) {
			trackOpenPriceHistory(localToken.token_id || localToken.token_series_id)
			return
		}
		trackClosePriceHistory(localToken.token_id || localToken.token_series_id)
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

			<div className="bg-neutral-01 border border-neutral-05 rounded-lg py-6">
				<TokenPriceTracker data={activities} />
			</div>
		</div>
	)
}

const TokenPriceTracker = ({ data }) => {
	return (
		<div className="mt-10">
			{data.length <= 0 ? (
				<IconEmptyPriceHistory size={100} className="mx-auto my-10" />
			) : (
				<div className="max-h-full">
					<ResponsiveContainer width="100%" height={300}>
						<AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 35 }}>
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
								tickFormatter={(x) => {
									return prettyBalance(x / 10 ** 24, 0)
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
								dataKey="issued_at"
								interval={1}
								axisLine={true}
								tickLine={false}
								tickMargin={8}
								stroke="#F9F9F9"
								tickFormatter={(x) => {
									return `${new Date(x).getHours().toString()}`
								}}
							>
								<Label
									value={'Time Period'}
									position="bottom"
									fill={'#F9F9F9'}
									style={{ fontSize: 15, left: 100 }}
								/>
							</XAxis>
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
			<div className="bg-[#1300ba80] border border-[#9185FF] text-neutral-10 p-2 rounded-md">
				{payload.map((p, idx) => {
					return (
						<div key={idx}>
							<div>
								<p className="font-bold text-xs text-center">
									{`${new Date(p.payload.issued_at).toLocaleDateString('en-US', {
										month: 'long',
									})} ${new Date(p.payload.issued_at).getDate()} ${new Date(
										p.payload.issued_at
									).getFullYear()}, ${new Date(p.payload.issued_at)
										.toTimeString()
										.split(':')
										.splice(0, 2)
										.join(':')}`}
								</p>
							</div>
							<div>
								<span className="capitalize text-xs">Price</span>
								{' : '}
								<span className="font-bold text-sm">
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
