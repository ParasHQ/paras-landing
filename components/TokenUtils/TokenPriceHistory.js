import { useEffect, useState } from 'react'
import { capitalize, prettyBalance } from 'utils/common'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { IconChart, IconDownArrow } from 'components/Icons'
import InputDropdown from 'components/Common/form/components/InputDropdown'
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { trackClosePriceHistory, trackOpenPriceHistory } from 'lib/ga'
import ParasRequest from 'lib/ParasRequest'

const dataHistory = [
	{ id: 'last-7-days', label: 'Last 7 days' },
	{ id: 'last-14-days', label: 'Last 14 days' },
	{ id: 'last-30-days', label: 'Last 30 days' },
	{ id: 'all-time', label: 'All Time' },
]

const TokenPriceHistory = ({ localToken, className }) => {
	const [isDropDown, setIsDropDown] = useState(true)
	const [activities, setActivities] = useState([])
	const [avgPrice, setAvgPrice] = useState()
	const [selectPriceHistory, setSelectPriceHistory] = useState('all-time')

	useEffect(() => {
		fetchDataActivities()
	}, [localToken, selectPriceHistory])

	useEffect(() => {
		setSelectPriceHistory('all-time')
		setIsDropDown(false)
		setTimeout(() => setIsDropDown(true), 1)
	}, [localToken])

	const params = {
		__skip: 0,
		__limit: 12,
		token_id: localToken.token_id,
		contract_id: localToken.contract_id,
		type: 'market_sales',
	}

	const fetchDataActivities = async () => {
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
		<div className={className}>
			<div
				className={`text-white bg-cyan-blue-3 ${
					isDropDown ? 'rounded-t-xl' : 'rounded-xl'
				} hover:cursor-pointer mt-3`}
			>
				<div
					className="flex justify-between items-center pr-2 pl-6 hover:cursor-pointer"
					onClick={() => onCLickDropdown()}
				>
					<p className="text-xl py-3">Price History</p>
					<div className={`${!isDropDown && 'rotate-180'}`}>
						<IconDownArrow size={30} />
					</div>
				</div>
			</div>
			{isDropDown && (
				<>
					<div className="text-white bg-cyan-blue-1 rounded-b-xl px-6 text-center py-32">
						<div className="flex gap-4 -mt-24 md:px-2">
							<InputDropdown
								data={dataHistory}
								defaultValue="all-time"
								selectItem={setSelectPriceHistory}
								bgColor="bg-cyan-blue-1"
							/>
							{activities.length !== 0 && (
								<div className="text-left">
									<p className="text-xs md:text-sm">
										{selectPriceHistory.split('-').map(capitalize).join(' ')} avg. price
									</p>
									<p className="font-bold">{prettyBalance(avgPrice / 10 ** 24, 0)} Ⓝ</p>
								</div>
							)}
						</div>
						{activities.length !== 0 ? (
							<div className="mt-28">
								<TokenPriceTracker data={activities} />
							</div>
						) : (
							<div className="text-white bg-cyan-blue-1 rounded-b-xl px-6 text-center pt-[26px] md:pt-[27px]">
								<div className="text-center">
									<IconChart size={70} />
								</div>
								No item activity yet.
							</div>
						)}
					</div>
				</>
			)}
		</div>
	)
}

export default TokenPriceHistory

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

const TokenPriceTracker = ({ data }) => {
	return (
		<div>
			{data.length > 0 && (
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
