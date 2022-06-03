import { useForm } from 'react-hook-form'
import useStore from 'lib/store'
import { useIntl } from 'hooks/useIntl'
import Button from 'components/Common/Button'
import { InputText } from 'components/Common/form'
import { sentryCaptureException } from 'lib/sentry'
import { GAS_FEE, STORAGE_ADD_MARKET_FEE } from 'config/constants'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import JSBI from 'jsbi'
import { useEffect, useState } from 'react'
import useProfileData from 'hooks/useProfileData'
import { flagColor, flagText } from 'constants/flag'
import WalletHelper from 'lib/WalletHelper'
import { trackUpdateListingToken } from 'lib/ga'
import { useToast } from 'hooks/useToast'
import { prettyBalance } from 'utils/common'

const TabCreateAuction = ({ data, onClose }) => {
	const [needDeposit, setNeedDeposit] = useState(false)
	const creatorData = useProfileData(data.metadata.creator_id)
	const { localeLn } = useIntl()
	const { errors, register, handleSubmit, watch, setValue } = useForm()
	const [isCreatingAuction, setIsCreatingPrice] = useState(false)
	const [expirationDateAuction, setExpirationDateAuction] = useState()
	const { currentUser, setTransactionRes } = useStore((state) => ({
		currentUser: state.currentUser,
		userBalance: state.userBalance,
		setTransactionRes: state.setTransactionRes,
	}))
	const [isGreaterTime, setIsGreaterTime] = useState(false)
	const toast = useToast()

	useEffect(() => {
		parseTimeExpirationDate()
		minimumTimeExpirationDate()
	}, [watch, expirationDateAuction])

	useEffect(() => {
		const now = new Date()
		now.setUTCMinutes(now.getUTCMinutes() + 10)
		setValue('timeExpirationDate', `${now.getUTCHours()}:${now.getUTCMinutes()}`)
	}, [])

	useEffect(() => {
		if (currentUser) {
			setTimeout(() => {
				checkStorageBalance()
			}, 250)
		}
	}, [currentUser])

	const checkStorageBalance = async () => {
		try {
			const currentStorage = await WalletHelper.viewFunction({
				methodName: 'storage_balance_of',
				contractId: process.env.MARKETPLACE_CONTRACT_ID,
				args: { account_id: currentUser },
			})

			const supplyPerOwner = await WalletHelper.viewFunction({
				methodName: 'get_supply_by_owner_id',
				contractId: process.env.MARKETPLACE_CONTRACT_ID,
				args: { account_id: currentUser },
			})

			const usedStorage = JSBI.multiply(
				JSBI.BigInt(parseInt(supplyPerOwner) + 1),
				JSBI.BigInt(STORAGE_ADD_MARKET_FEE)
			)

			if (JSBI.greaterThanOrEqual(JSBI.BigInt(currentStorage), usedStorage)) {
				setNeedDeposit(false)
			} else {
				setNeedDeposit(true)
			}
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const parseTimeExpirationDate = () => {
		let hours
		let minutes
		let endedTime = String(watch('timeExpirationDate'))

		if (endedTime !== '') {
			hours = endedTime.split(':')[0]
			minutes = endedTime.split(':')[1]
		}

		function addExpirationDate(days, hours, minutes) {
			const currentTime = new Date()
			let currentUTC = new Date(currentTime.toUTCString().slice(0, -4))

			const pickedExpirationDate = days
			const pickedDate = new Date(pickedExpirationDate)

			currentUTC.setUTCDate(pickedDate.getDate())
			currentUTC.setUTCMonth(pickedDate.getMonth())
			currentUTC.setUTCHours(hours)
			currentUTC.setUTCMinutes(minutes)

			const nanoSecTime = `${currentUTC.getTime()}000000`
			setExpirationDateAuction(nanoSecTime)
		}

		addExpirationDate(watch('expirationDate'), parseInt(hours), parseInt(minutes))
	}

	const onCreatingAuction = async () => {
		if (!currentUser) {
			return
		}
		setIsCreatingPrice(true)

		trackUpdateListingToken(data.token_id)

		try {
			const txs = []

			if (needDeposit) {
				txs.push({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					functionCalls: [
						{
							methodName: 'storage_deposit',
							contractId: process.env.MARKETPLACE_CONTRACT_ID,
							args: { receiver_id: currentUser },
							attachedDeposit: STORAGE_ADD_MARKET_FEE,
							gas: GAS_FEE,
						},
					],
				})
			}

			const params = {
				token_id: data.token_id,
				account_id: process.env.MARKETPLACE_CONTRACT_ID,
				msg: JSON.stringify({
					price: parseNearAmount(
						prettyBalance(formatNearAmount(parseNearAmount(watch('startingBid'))), 0, 2)
					),
					ft_token_id: 'near',
					market_type: 'sale',
					ended_at: expirationDateAuction,
					is_auction: true,
				}),
			}
			txs.push({
				receiverId: data.contract_id,
				functionCalls: [
					{
						methodName: `nft_approve`,
						args: params,
						gas: GAS_FEE,
						attachedDeposit: '440000000000000000000',
					},
				],
			})

			const res = await WalletHelper.multipleCallFunction(txs)

			if (res?.response.error) {
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							{res?.response.error.kind.ExecutionError}
						</div>
					),
					type: 'error',
					duration: 2500,
				})
			} else if (res) {
				onClose()
				setTransactionRes(res?.response)
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">{`Successfully create auction`}</div>
					),
					type: 'success',
					duration: 2500,
				})
			}
			setIsCreatingPrice(false)
		} catch (err) {
			sentryCaptureException(err)
			setIsCreatingPrice(false)
		}
	}

	const distanceExpirationDate = (type) => {
		const currentDate = new Date()
		if (type === 'min') {
			return `${currentDate.toISOString().split('T')[0]}`
		} else if (type === 'max') {
			let days = currentDate.getDate()
			currentDate.setDate(days + 4)
			return `${currentDate.toISOString().split('T')[0]}`
		}
	}
	const minimumTimeExpirationDate = () => {
		const now = new Date()
		const currentUTC = new Date(now.toUTCString())
		const currentDate = `${currentUTC.getTime()}000000`
		const result = expirationDateAuction > currentDate
		setIsGreaterTime(result)
	}

	return (
		<>
			<form
				onSubmit={handleSubmit((startingBid, reserveBid, expirationDate, timeExpirationDate) =>
					onCreatingAuction(startingBid, reserveBid, expirationDate, timeExpirationDate)
				)}
			>
				<div className="mt-4">
					<div className="flex justify-between items-center">
						<div className="text-white">
							<label className="block font-bold opacity-90">{localeLn('StartingBid')}</label>
							<p className="text-sm font-thin">{localeLn('DescStartingBid')}</p>
						</div>
						<InputText
							name="startingBid"
							type="number"
							step="any"
							ref={register({
								required: true,
								min: 0.1,
							})}
							placeHolder={'Ⓝ'}
							className={`${errors.startingBid && 'error'}`}
						/>
					</div>
					<div className="mt-2 text-sm text-red-500 text-right">
						{errors.startingBid?.type === 'required' && `Starting bid is required`}
						{errors.startingBid?.type === 'min' && `Minimum 0.1 Ⓝ`}
					</div>
				</div>
				<div className="mt-4">
					<div className="flex justify-between gap-4">
						<label className="text-white block font-bold opacity-90">
							{localeLn('ExpirationDate')}
							<p
								className="text-white text-sm font-thin text-justify"
								style={{ wordBreak: 'break-all' }}
							>
								{localeLn('DescExpirationDate')}
							</p>
						</label>
						<div>
							<InputText
								name="expirationDate"
								type="date"
								min={distanceExpirationDate('min')}
								max={distanceExpirationDate('max')}
								ref={register({
									required: true,
									min: distanceExpirationDate('min'),
									max: distanceExpirationDate('max'),
								})}
								value={watch('expirationDate')}
								className={`${errors.expirationDate && 'error'}`}
							/>
							<div className="mt-2 text-sm text-red-500 text-right">
								{errors.expirationDate?.type === 'required' && `Expiration date is required`}
								{errors.expirationDate?.type === 'min' &&
									`Minimum date is ${distanceExpirationDate('min').slice(8, 10)}`}
								{errors.expirationDate?.type === 'max' &&
									`Maximum date is ${distanceExpirationDate('max').slice(8, 10)}`}
							</div>

							<div className="mb-2 flex justify-end items-center gap-2">
								<p className="text-white text-sm mt-1">UTC</p>
								<InputText
									name="timeExpirationDate"
									type="time"
									step="any"
									ref={register({
										required: true,
									})}
									className={`${errors.timeExpirationDate && 'error'} w-auto`}
								/>
							</div>
							<div className="mt-2 text-sm text-red-500 text-right">
								{errors.timeExpirationDate?.type === 'required' &&
									`Time expiration date is required`}
							</div>
						</div>
					</div>
					<div className="mt-2 text-sm text-red-500 text-right">
						{!isGreaterTime && `Auction time must be greater than the current time`}
					</div>
				</div>
				{creatorData?.flag && (
					<div className="z-20 bottom-0 flex items-center justify-center px-4 mt-4 w-full">
						<p
							className={`text-white text-sm m-2 mt-2 p-1 font-bold w-full mx-auto px-4 text-center rounded-md ${
								flagColor[creatorData?.flag]
							}`}
						>
							{localeLn(flagText[creatorData?.flag])}
						</p>
					</div>
				)}
				<p className="text-white opacity-80 mt-4 text-sm text-center px-4">
					{localeLn('RedirectedToconfirm')}
				</p>
				<div className="">
					{isGreaterTime ? (
						<Button
							disabled={isCreatingAuction}
							isLoading={isCreatingAuction}
							className="mt-4"
							isFullWidth
							size="md"
							type="submit"
						>
							{localeLn('CreateAuction')}
						</Button>
					) : (
						<div className="bg-primary text-gray-400 mt-4 py-3 px-4 text-sm rounded-md text-center bg-opacity-20">
							{localeLn('CreateAuction')}
						</div>
					)}
					<Button variant="ghost" size="md" isFullWidth className="mt-4" onClick={onClose}>
						{localeLn('Cancel')}
					</Button>
				</div>
			</form>
		</>
	)
}

export default TabCreateAuction
