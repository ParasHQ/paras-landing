import { IconX } from 'components/Icons'
import { useToast } from 'hooks/useToast'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import { trackUpdateListingToken } from 'lib/ga'
import { sentryCaptureException } from 'lib/sentry'
import { useEffect, useState } from 'react'
import Button from 'components/Common/Button'
import IconInfoSecond from 'components/Icons/component/IconInfoSecond'
import Link from 'next/link'
import Modal from 'components/Common/Modal'
import JSBI from 'jsbi'
import { GAS_FEE, STORAGE_ADD_MARKET_FEE } from 'config/constants'
import { useIntl } from 'hooks/useIntl'
import useStore from 'lib/store'
import { useWalletSelector } from 'components/Common/WalletSelector'
import { InputText } from 'components/Common/form'
import { parseImgUrl, prettyTruncate, prettyBalance } from 'utils/common'
import Media from 'components/Common/Media'
import { useForm } from 'react-hook-form'

const ExpirationDateEnum = {
	ONE_DAY: '1 day',
	THREE_DAY: '3 days',
	SEVEN_DAY: '7 days',
	ONE_MONTH: '1 month',
	CUSTOM_DATE: 'Custom Date',
}

const TokenAuctionModal = ({ data, show, onClose }) => {
	const toast = useToast()
	const store = useStore()
	const { localeLn } = useIntl()
	const { errors, register, handleSubmit, watch, setValue } = useForm()
	const { signAndSendTransactions, viewFunction } = useWalletSelector()
	const { currentUser, userBalance, setTransactionRes } = useStore((state) => ({
		currentUser: state.currentUser,
		userBalance: state.userBalance,
		setTransactionRes: state.setTransactionRes,
	}))

	const [showDate, setShowDate] = useState(false)
	const [startingBid, setStartingBid] = useState(0)
	const [expirationDateAuction, setExpirationDateAuction] = useState()
	const [needDeposit, setNeedDeposit] = useState(false)
	const [isGreaterTime, setIsGreaterTime] = useState(false)
	const [isProcessing, setIsProcessing] = useState(false)
	const [customDate, setCustomDate] = useState(ExpirationDateEnum.CUSTOM_DATE)

	useEffect(() => {
		parseTimeExpirationDate()
		minimumTimeExpirationDate()
	}, [watch, expirationDateAuction])

	useEffect(() => {
		if (currentUser) {
			setTimeout(() => {
				checkStorageBalance()
			}, 250)
		}
	}, [currentUser])

	useEffect(() => {
		const now = new Date()
		now.setTime(now.getTime() + 10 * 60000)
		setValue(
			'expirationDate',
			`${now.toISOString().split('T')[0]}T${('0' + now.getUTCHours()).slice(-2)}:${(
				'0' + now.getUTCMinutes()
			).slice(-2)}`
		)
	}, [])

	const onCreatingAuction = async () => {
		if (!currentUser) {
			return
		}
		setIsProcessing(true)
		trackUpdateListingToken(data.token_id)

		parseTimeExpirationDate()

		try {
			const txs = []

			if (needDeposit) {
				txs.push({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					actions: [
						{
							type: 'FunctionCall',
							params: {
								methodName: 'storage_deposit',
								args: { receiver_id: currentUser },
								deposit: STORAGE_ADD_MARKET_FEE,
								gas: GAS_FEE,
							},
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
				actions: [
					{
						type: 'FunctionCall',
						params: {
							methodName: `nft_approve`,
							args: params,
							gas: GAS_FEE,
							deposit: '440000000000000000000',
						},
					},
				],
			})

			const res = await signAndSendTransactions({ transactions: txs })

			if (res) {
				onClose()
				setTransactionRes(res)
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">{`Successfully create auction`}</div>
					),
					type: 'success',
					duration: 2500,
				})
			}
			setIsProcessing(false)
		} catch (err) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{err.message || localeLn('SomethingWentWrong')}
					</div>
				),
				type: 'error',
				duration: 2500,
			})

			sentryCaptureException(err)
			setIsProcessing(false)
		}
	}

	const parseCustomDateToInputDate = (customDateLocal) => {
		const now = new Date()
		if (customDateLocal === ExpirationDateEnum.ONE_DAY) {
			now.setUTCDate(now.getUTCDate() + 1)
			setValue(
				'expirationDate',
				`${now.toISOString().split('T')[0]}T${('0' + now.getUTCHours()).slice(-2)}:${(
					'0' + now.getUTCMinutes()
				).slice(-2)}`
			)
		} else if (customDateLocal === ExpirationDateEnum.THREE_DAY) {
			now.setUTCDate(now.getUTCDate() + 3)
			setValue(
				'expirationDate',
				`${now.toISOString().split('T')[0]}T${('0' + now.getUTCHours()).slice(-2)}:${(
					'0' + now.getUTCMinutes()
				).slice(-2)}`
			)
		} else if (customDateLocal === ExpirationDateEnum.SEVEN_DAY) {
			now.setUTCDate(now.getUTCDate() + 7)
			setValue(
				'expirationDate',
				`${now.toISOString().split('T')[0]}T${('0' + now.getUTCHours()).slice(-2)}:${(
					'0' + now.getUTCMinutes()
				).slice(-2)}`
			)
		} else if (customDateLocal === ExpirationDateEnum.ONE_MONTH) {
			now.setUTCDate(now.getUTCDate() + 30)
			setValue(
				'expirationDate',
				`${now.toISOString().split('T')[0]}T${('0' + now.getUTCHours()).slice(-2)}:${(
					'0' + now.getUTCMinutes()
				).slice(-2)}`
			)
		} else {
			now.setTime(now.getTime() + 10 * 60000)
			setValue(
				'expirationDate',
				`${now.toISOString().split('T')[0]}T${('0' + now.getUTCHours()).slice(-2)}:${(
					'0' + now.getUTCMinutes()
				).slice(-2)}`
			)
		}
	}

	const minimumTimeExpirationDate = () => {
		const now = new Date()
		const currentUTC = new Date(now.toUTCString())
		const currentDate = `${currentUTC.getTime()}000000`
		const result = expirationDateAuction > currentDate
		setIsGreaterTime(result)
	}

	const checkStorageBalance = async () => {
		try {
			const currentStorage = await viewFunction({
				methodName: 'storage_balance_of',
				receiverId: process.env.MARKETPLACE_CONTRACT_ID,
				args: { account_id: currentUser },
			})

			const supplyPerOwner = await viewFunction({
				methodName: 'get_supply_by_owner_id',
				receiverId: process.env.MARKETPLACE_CONTRACT_ID,
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
		if (!watch('expirationDate')) {
			return null
		}

		let hours
		let minutes
		let endedTime = String(watch('expirationDate'))

		if (endedTime !== '') {
			const time = endedTime.split('T')[1]
			hours = time.split(':')[0]
			minutes = time.split(':')[1]
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

		addExpirationDate(watch('expirationDate').split('T')[0], parseInt(hours), parseInt(minutes))
	}

	const distanceExpirationDate = (type) => {
		const currentDate = new Date()
		if (type === 'min') {
			const currentDateWithSecond = currentDate.toISOString().split('.')[0]
			const currentDateWithoutSecond = `${currentDateWithSecond.split(':')[0]}:${
				currentDateWithSecond.split(':')[1]
			}`
			return `${currentDateWithoutSecond}`
		} else if (type === 'max') {
			let days = currentDate.getDate()
			currentDate.setDate(days + 31)
			const currentDateWithSecond = currentDate.toISOString().split('.')[0]
			const currentDateWithoutSecond = `${currentDateWithSecond.split(':')[0]}:${
				currentDateWithSecond.split(':')[1]
			}`
			return `${currentDateWithoutSecond}`
		}
	}

	return (
		<>
			<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
				<div className="max-w-[504px] w-full bg-neutral-03 text-white rounded-lg mx-auto p-6">
					<form onSubmit={handleSubmit(() => onCreatingAuction())}>
						<div className="relative mb-5">
							<p className="text-sm font-bold text-center">Create Auction</p>
							<button
								className="absolute bg-neutral-05 rounded-md right-0 -top-2"
								onClick={onClose}
							>
								<IconX className={'ml-1 mt-1'} />
							</button>
						</div>

						<div className="bg-neutral-02 rounded-lg p-4 mb-4">
							<p className="text-sm font-bold p-1">Item</p>
							<div className="border-b border-b-neutral-05 mx-1"></div>

							<div>
								<div className="flex flex-row justify-between items-center p-2">
									<div className="inline-flex items-center w-16">
										<Media
											className="rounded-lg"
											url={parseImgUrl(data?.metadata.media, null, {
												width: `30`,
												useOriginal: process.env.APP_ENV === 'production' ? false : true,
												isMediaCdn: data?.isMediaCdn,
											})}
											videoControls={false}
											videoLoop={true}
											videoMuted={true}
											autoPlay={false}
											playVideoButton={false}
										/>
										<div className="flex flex-col justify-between items-stretch ml-2">
											<p className="text-xs font-thin mb-2">Collection</p>
											<Link
												href={`/collection/${data.metadata?.collection_id || data.contract_id}`}
											>
												<a className="text-sm font-bold truncate">
													{prettyTruncate(data.metadata?.collection || data.contract_id, 20)}
												</a>
											</Link>
										</div>
									</div>
								</div>
							</div>

							<div className="flex flex-row justify-between items-center pl-2 mb-2">
								<p className="text-sm text-neutral-10">Starting Bid</p>
								<InputText
									name="startingBid"
									step="any"
									ref={register({
										required: true,
										min: 0,
									})}
									onChange={(e) => setStartingBid(e.target.value)}
									className="w-2/3 bg-neutral-04 border border-neutral-06 hover:bg-neutral-05 hover:border-color-06 focus:bg-neutral-04 focus:border-neutral-08 py-2 text-right"
									placeholder="Place your starting bid"
								/>
							</div>

							<p className="text-sm text-neutral-10 pl-2">Expiration Date</p>
							<div className="grid grid-cols-3 gap-x-2 pl-2">
								<div
									className="bg-neutral-05 rounded-lg px-4 py-2 cursor-pointer text-center"
									onClick={() => setShowDate(!showDate)}
								>
									{customDate}
								</div>
								<div className="col-span-2">
									<InputText
										name="expirationDate"
										type="datetime-local"
										defaultValue={`${
											new Date().toISOString().split('T')[0]
										}T${new Date().getUTCHours()}:${new Date().getUTCMinutes()}`}
										min={distanceExpirationDate('min')}
										max={distanceExpirationDate('max')}
										ref={register({
											required: true,
											min: distanceExpirationDate('min'),
											max: distanceExpirationDate('max'),
										})}
										value={watch('expirationDate')}
										className={`${
											errors.expirationDate && 'error'
										} bg-neutral-04 focus:bg-neutral-01 border border-neutral-07 focus:border-neutral-10 rounded-lg text-sm text-right text-neutral-10`}
									/>
								</div>
								<div className="mt-2 text-sm text-red-500 text-right">
									{errors.expirationDate?.type === 'required' && `Expiration date is required`}
									{errors.expirationDate?.type === 'min' &&
										`Minimum date is ${distanceExpirationDate('min').slice(8, 10)}`}
									{errors.expirationDate?.type === 'max' &&
										`Maximum date is ${distanceExpirationDate('max').slice(8, 10)}`}
								</div>
							</div>
							<div className="relative inline-flex justify-between gap-x-2">
								{showDate && (
									<div className="absolute left-0 -top-5 bg-neutral-01 border border-neutral-10 rounded-lg w-36 z-10 p-3">
										{Object.keys(ExpirationDateEnum).map((x) => (
											<div
												key={x}
												onClick={() => {
													setCustomDate(ExpirationDateEnum[x])
													setShowDate(!showDate)
													parseCustomDateToInputDate(ExpirationDateEnum[x])
												}}
												className={`${
													customDate === ExpirationDateEnum[x] && 'bg-neutral-05'
												} hover:bg-neutral-03 p-2 rounded-lg hover:border hover:border-neutral-05 text-sm text-neutral-10 cursor-pointer`}
											>
												{ExpirationDateEnum[x]}
											</div>
										))}
									</div>
								)}
							</div>
							<div className="bg-neutral-04 border border-neutral-05 rounded-xl p-4 ml-2 mb-2">
								<p className="text-sm font-bold">Auction Summary</p>
								<div className="border-b border-b-neutral-05 mb-4"></div>

								<div className="flex flex-row justify-between items-center mb-3">
									<p className="text-sm">Starting Bid</p>
									<div className="inline-flex">
										<p className="text-sm text-neutral-10 truncate">{startingBid} Ⓝ</p>
										<div className="text-[10px] text-gray-400 truncate ml-2">
											(~${startingBid * store.nearUsdPrice})
										</div>
									</div>
								</div>
								<div className="flex flex-row justify-between items-center">
									<p className="text-sm">Expiration Date</p>
									<div className="inline-flex">
										<p className="text-sm text-neutral-10">
											{watch('expirationDate') && watch('expirationDate').replace('T', ' ')} (UTC)
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-row justify-between items-center mb-2">
							<p className="text-sm">Your Balance</p>
							<div className="inline-flex">
								<p className="text-sm text-neutral-10 font-bold truncate p-1">{`${prettyBalance(
									userBalance.available,
									24,
									4
								)} Ⓝ`}</p>
								{userBalance.available && store.nearUsdPrice !== 0 && (
									<div className="text-[10px] text-gray-400 truncate ml-2">
										(~$
										{prettyBalance(JSBI.BigInt(userBalance.available) * store.nearUsdPrice, 24, 2)})
									</div>
								)}
							</div>
						</div>

						<div className="flex flex-row justify-between items-center mb-6">
							<p className="text-sm">Payment Method</p>
							<div className="inline-flex items-center">
								<p className="text-sm text-white">Near Wallet</p>
								<IconInfoSecond size={18} color={'#F9F9F9'} className={'ml-2 mb-1'} />
							</div>
						</div>

						<div className="grid grid-cols-2 gap-x-4">
							<div>
								<Button variant="second" className={'text-sm'} onClick={onClose}>
									Cancel
								</Button>
							</div>
							<div>
								<Button
									variant="primary"
									className={'text-sm w-full pl-10 text-center'}
									isDisabled={isProcessing || startingBid <= 0 || !isGreaterTime}
									isLoading={isProcessing}
									type="submit"
								>
									Complete Auction
								</Button>
							</div>
						</div>
					</form>
				</div>
			</Modal>
		</>
	)
}

export default TokenAuctionModal
