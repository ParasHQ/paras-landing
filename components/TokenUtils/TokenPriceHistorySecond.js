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
	const [selectPriceHistory, setSelectPriceHistory] = useState('all-time')
	const [chartFilter, setChartFilter] = useState(ChartFilterEnum.ONE_DAY)
	const [chartCurrency, setChartCurrency] = useState(ChartCurrencyEnum.NEAR)

	useEffect(() => {
		fetchDataActivities()
	}, [localToken, selectPriceHistory])

	const fetchDataActivities = async () => {
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

		switch (selectPriceHistory) {
			case 'all-time':
				filterPriceHistory(newData, 0)
				return
			case 'last-30-days':
				filterPriceHistory(newData, 30)
				return
			case 'last-14-days':
				filterPriceHistory(newData, 14)
				return
			case 'last-7-days':
				filterPriceHistory(newData, 7)
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
				const elementDateTime = new Date(x.msg.datetime).getTime()
				if (elementDateTime <= currentDateTime && elementDateTime > selectHistoryDateTime) {
					return true
				}
				return false
			})
			.sort((a, b) => {
				return new Date(b.msg.datetime) - new Date(a.msg.datetime)
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
		<div className="bg-neutral-04 border border-neutral-05 rounded-lg my-6 px-5 py-6">
			<div className="mb-6">
				<p className="font-bold text-xl text-neutral-10">Price History</p>
				<p className="font-normal text-xs text-neutral-10 mt-2">
					Observe how the NFT price is moving. The price might fluctuate for specific NFTs.
				</p>
			</div>

			<div className="flex flex-row justify-between items-center">
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

			<TokenPriceTracker data={activities} />
		</div>
	)
}

const TokenPriceTracker = ({ data }) => {
	return (
		<div className="mt-10">
			{data.length <= 0 ? (
				<div className="bg-neutral-01 border border-neutral-05 rounded-lg py-10">
					<IconEmptyPriceHistory size={100} className="mx-auto" />
				</div>
			) : (
				<div className="max-h-full mt-10">
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
							<CartesianGrid strokeDasharray="3 3" />
							<YAxis
								domain={[0, 'auto']}
								axisLine={false}
								tickLine={true}
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
									style={{ fontSize: 15, left: 100 }}
								/>
							</YAxis>
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
			<div className="bg-gray-900 text-neutral-10 p-2 rounded-md">
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
