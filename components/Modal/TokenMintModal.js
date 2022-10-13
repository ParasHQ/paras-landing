import { IconX } from 'components/Icons'
import { useToast } from 'hooks/useToast'
import axios from 'axios'
import getConfig from 'config/near'
import { InputText } from 'components/Common/form'
import { useState } from 'react'
import Button from 'components/Common/Button'
import Link from 'next/link'
import Modal from 'components/Common/Modal'
import JSBI from 'jsbi'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import LoginModal from './LoginModal'
import { GAS_FEE, STORAGE_MINT_FEE } from 'config/constants'
import { trackMintToken } from 'lib/ga'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import useStore from 'lib/store'
import { useWalletSelector } from 'components/Common/WalletSelector'
import { parseImgUrl, prettyTruncate, prettyBalance } from 'utils/common'
import Media from 'components/Common/Media'
import IconInfoSecond from 'components/Icons/component/IconInfoSecond'

const TokenMintModal = ({ data, show, onClose }) => {
	const store = useStore()
	const toast = useToast()
	const { signAndSendTransaction } = useWalletSelector()
	const { currentUser, userBalance } = useStore((state) => ({
		currentUser: state.currentUser,
		userBalance: state.userBalance,
		setTransactionRes: state.setTransactionRes,
	}))
	const { localeLn } = useIntl()

	const [receiverId, setReceiverId] = useState(null)
	const [isMinting, setIsMinting] = useState(false)
	const [isSelfMint, setIsSelfMint] = useState(true)
	const [showLogin, setShowLogin] = useState(false)
	const [errorMessage, setErrorMessage] = useState(null)

	const debounce = (func, timeout) => {
		let timer

		return function (...args) {
			const context = this
			if (timer) clearTimeout(timer)
			timer = setTimeout(() => {
				timer = null
				func.apply(context, args)
			}, timeout)
		}
	}

	const debounceOnChange = debounce((e) => {
		checkAccount(e)
	}, 500)

	const checkAccount = async (receiverId) => {
		try {
			const nearConfig = getConfig(process.env.APP_ENV || 'development')
			const resp = await axios.post(nearConfig.nodeUrl, {
				jsonrpc: '2.0',
				id: 'dontcare',
				method: 'query',
				params: {
					request_type: 'view_account',
					finality: 'final',
					account_id: receiverId,
				},
			})
			if (resp.data.error) {
				throw new Error(`Account ${receiverId} not exist`)
			}

			if (resp.status === 200) {
				setErrorMessage('')
			}

			setReceiverId(receiverId)
		} catch (err) {
			sentryCaptureException(err)
			const message = err.message || 'Something went wrong, try again later'
			setErrorMessage(message)
			setIsMinting(false)
			return
		}
	}

	const onTransfer = async () => {
		if (!currentUser) {
			setShowLogin(true)
			return
		}

		if (!isSelfMint && !receiverId) {
			setErrorMessage('Receiver Id cannot be null')
			return
		}

		setIsMinting(true)
		const params = {
			token_series_id: data.token_series_id,
			receiver_id: isSelfMint ? currentUser : receiverId,
		}

		trackMintToken(data.token_series_id)

		try {
			const res = await signAndSendTransaction({
				receiverId: data.contract_id,
				actions: [
					{
						type: 'FunctionCall',
						params: {
							methodName: `nft_mint`,
							args: params,
							gas: GAS_FEE,
							deposit: STORAGE_MINT_FEE,
						},
					},
				],
			})
			if (res) {
				onClose()
				setReceiverId('')
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							{`Successfully minted to ${isSelfMint ? currentUser : receiverId}`}
						</div>
					),
					type: 'success',
					duration: 2500,
				})
			}
			setIsMinting(false)
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
			setIsMinting(false)
		}
	}

	return (
		<>
			<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
				<div className="max-w-[504px] w-full bg-neutral-03 text-white rounded-lg mx-auto p-6">
					<div className="relative mb-5">
						<p className="text-sm font-bold text-center">Mint Confirmation</p>
						<button className="absolute bg-neutral-05 rounded-md right-0 -top-2" onClick={onClose}>
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
										<Link href={`/collection/${data.metadata?.collection_id || data.contract_id}`}>
											<a className="text-sm font-bold truncate">
												{prettyTruncate(data.metadata?.collection || data.contract_id, 20)}
											</a>
										</Link>
									</div>
								</div>
							</div>
						</div>

						{!isSelfMint && (
							<div>
								<p className="text-neutral-10 text-sm my-2">Mint NFT To</p>
								<InputText
									name="receiverId"
									type="text"
									step="any"
									onChange={(e) => debounceOnChange(e.target.value)}
									placeholder="Account ID"
									className="w-full bg-neutral-04 border border-neutral-06 hover:bg-neutral-05 focus:bg-neutral-04 focus:border-neutral-06 text-right"
								/>
								{errorMessage === null ? (
									<p className="text-xs mt-2">Please Enter Valid Account Id</p>
								) : errorMessage === '' ? (
									<p className="text-xs mt-2 text-[#64CC7F]">Valid Account Id</p>
								) : (
									<p className="text-xs mt-2 text-[#FF8E8E]">{errorMessage}</p>
								)}
							</div>
						)}

						<div className="flex flex-row justify-between items-center p-2">
							<div className="inline-flex ml-auto">
								<div className="pr-2">
									<input
										id="self-mint"
										className="w-auto"
										type="checkbox"
										defaultChecked={isSelfMint}
										onChange={() => {
											setErrorMessage(null)
											setIsSelfMint(!isSelfMint)
										}}
									/>
								</div>

								<p className="text-sm text-neutral-10 truncate">Mint to myself</p>
							</div>
						</div>

						<div className="border-b border-b-neutral-05 mb-4 mx-1"></div>

						<div className="bg-neutral-04 border border-neutral-05 rounded-xl p-4 mb-4">
							<p className="text-sm font-bold">Mint Summary</p>
							<div className="border-b border-b-neutral-05 mb-4"></div>

							<div className="flex flex-row justify-between items-center my-2">
								<p className="text-sm">Storage Fee</p>
								<div className="inline-flex">
									<p className="text-sm text-neutral-10 truncate">
										{formatNearAmount(STORAGE_MINT_FEE)} Ⓝ
									</p>
									{store.nearUsdPrice !== 0 && (
										<div className="text-[10px] text-gray-400 truncate ml-2">
											($
											{prettyBalance(JSBI.BigInt(STORAGE_MINT_FEE) * store.nearUsdPrice, 24, 2)})
										</div>
									)}
								</div>
							</div>
							<div className="border-b border-b-neutral-05 mt-4 mb-2"></div>
						</div>
					</div>

					<div className="flex flex-row justify-between items-center mb-2">
						<p className="text-sm">Your Balance</p>
						<div className="inline-flex">
							<p className="text-sm text-neutral-10 font-bold truncate p-1">
								{prettyBalance(userBalance.available, 24, 2)} Ⓝ
							</p>
							{userBalance.available && store.nearUsdPrice !== 0 && (
								<div className="text-[10px] text-gray-400 truncate ml-2">
									(~$
									{prettyBalance(JSBI.BigInt(userBalance.available) * store.nearUsdPrice, 24, 2)})
								</div>
							)}
						</div>
					</div>

					<div className="flex flex-row justify-between items-center mb-10">
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
								isDisabled={isMinting}
								isLoading={isMinting}
								className={'text-sm w-full pl-[52px] text-center'}
								onClick={onTransfer}
							>
								Complete Mint
							</Button>
						</div>
					</div>
				</div>
			</Modal>
			<LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
		</>
	)
}

export default TokenMintModal
