import { useEffect, useState } from 'react'
import { useIntl } from 'hooks/useIntl'
import IconPriceTag from 'components/Icons/component/IconPriceTag'
import { prettyBalance, checkNextPriceBid, nanoSecToMiliSec } from 'utils/common'
import useStore from 'lib/store'
import JSBI from 'jsbi'
import Button from 'components/Common/Button'

const TokenPriceInfo = ({ localToken }) => {
	const { localeLn } = useIntl()
	const store = useStore()
	const [isEndedTime, setIsEndedTime] = useState(false)
	const [isEndedAuction, setIsEndedAuction] = useState(false)
	const [days, setDays] = useState('-')
	const [hours, setHours] = useState('-')
	const [mins, setMins] = useState('-')
	const [secs, setSecs] = useState('-')

	useEffect(() => {
		const endedDate = nanoSecToMiliSec(localToken.ended_at)

		const timer = setInterval(() => {
			const currentDate = new Date().getTime()

			if (!isEndedTime) {
				let distance = parseInt(endedDate) - parseInt(currentDate)

				let days = Math.floor(distance / (1000 * 60 * 60 * 24))
				let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
				let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
				let seconds = Math.floor((distance % (1000 * 60)) / 1000)

				setDays(days)
				setHours(hours)
				setMins(minutes)
				setSecs(seconds)

				if (distance < 0) {
					clearInterval(timer)
					setIsEndedTime(true)
					// setAuctionEnds(true)
				}
			}
		})
	}, [localToken])

	return (
		<div className="bg-neutral-04 border border-neutral-05 rounded-lg my-6 p-5">
			<div className="inline-flex">
				<IconPriceTag size={20} stroke={'#F9F9F9'} />
				<p className="text-white font-light ml-2">{localeLn('CurrentPrice')}</p>
			</div>
			<div className="flex flex-row items-center my-3">
				<p className="font-bold text-2xl text-neutral-10 truncate">{`${prettyBalance(
					checkNextPriceBid('near', localToken),
					0,
					4
				)} Ⓝ`}</p>
				{localToken?.price !== '0' && store.nearUsdPrice !== 0 && (
					<div className="text-[10px] text-gray-400 truncate ml-2">
						($
						{prettyBalance(JSBI.BigInt(checkNextPriceBid('usd')) * store.nearUsdPrice, 24, 2)})
					</div>
				)}
				{localToken?.price === '0' && localToken?.is_auction && !isEndedAuction && (
					<div className="text-[9px] text-gray-400 truncate mt-1 ml-2">
						~ $
						{prettyBalance(
							JSBI.BigInt(localToken?.amount ? localToken?.amount : localToken?.price) *
								store.nearUsdPrice,
							24,
							2
						)}
					</div>
				)}
			</div>
			<div className="md:grid grid-cols-2 gap-x-6 mt-10">
				<Button>Buy Now</Button>
				<Button variant="ghost">Make Offer</Button>
			</div>
		</div>
	)
}

export default TokenPriceInfo
