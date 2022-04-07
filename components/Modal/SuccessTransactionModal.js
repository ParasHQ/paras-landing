import axios from 'axios'
import Button from 'components/Common/Button'
import Media from 'components/Common/Media'
import Modal from 'components/Common/Modal'
import { IconX } from 'components/Icons'
import getConfig from 'config/near'
import { useToast } from 'hooks/useToast'
import near from 'lib/near'
import useStore from 'lib/store'
import WalletHelper, { walletType } from 'lib/WalletHelper'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
	FacebookIcon,
	FacebookShareButton,
	TelegramIcon,
	TelegramShareButton,
	TwitterIcon,
	TwitterShareButton,
} from 'react-share'
import { mutate } from 'swr'
import { decodeBase64 } from 'utils/common'

const SuccessTransactionModal = () => {
	const [showModal, setShowModal] = useState(false)
	const [token, setToken] = useState(null)
	const [txDetail, setTxDetail] = useState(null)
	const { currentUser, transactionRes, setTransactionRes } = useStore()
	const router = useRouter()
	const toast = useToast()

	useEffect(() => {
		const checkTxStatus = async () => {
			const txHash = router.query.transactionHashes.split(',')
			const txStatus = await near.getTransactionStatus({
				accountId: near.currentUser.accountId,
				txHash: txHash[txHash.length - 1],
			})
			await processTransaction(txStatus)
		}

		if (currentUser && router.query.transactionHashes) {
			checkTxStatus()
		}
	}, [currentUser, router.query.transactionHashes])

	useEffect(() => {
		if (transactionRes) {
			const txLast = transactionRes[transactionRes.length - 1]
			if (txLast) {
				processTransaction(txLast)
			} else if (transactionRes.error) {
				processTransactionError(transactionRes.error.kind.ExecutionError)
			}
		}
	}, [transactionRes])

	const processTransactionError = (err) => {
		toast.show({
			text: <div className="font-semibold text-center text-sm">{err}</div>,
			type: 'error',
			duration: null,
		})
	}

	const processTransaction = async (txStatus) => {
		if (txStatus?.status?.SuccessValue !== undefined) {
			const { receipts_outcome } = txStatus
			const { actions, receiver_id } = txStatus.transaction

			for (const action of actions) {
				const { FunctionCall } = action
				const args = JSON.parse(decodeBase64(FunctionCall.args))

				if (FunctionCall.method_name === 'nft_buy') {
					const res = await axios.get(`${process.env.V2_API_URL}/token-series`, {
						params: {
							contract_id: receiver_id,
							token_series_id: args.token_series_id,
						},
					})
					setToken(res.data.data.results[0])
					setTxDetail({ ...FunctionCall, args })
					setShowModal(true)
				} else if (FunctionCall.method_name === 'buy') {
					const res = await axios.get(`${process.env.V2_API_URL}/token`, {
						params: {
							contract_id: args.nft_contract_id,
							token_id: args.token_id,
						},
					})
					setToken(res.data.data.results[0])
					setTxDetail({ ...FunctionCall, args })
					setShowModal(true)
				} else if (FunctionCall.method_name === 'add_offer') {
					const res = await axios.get(
						`${process.env.V2_API_URL}/${args.token_id ? 'token' : 'token-series'}`,
						{
							params: {
								contract_id: args.nft_contract_id,
								token_id: args.token_id,
								token_series_id: args.token_series_id,
							},
						}
					)
					setToken(res.data.data.results[0])
					setTxDetail({ ...FunctionCall, args })
					setShowModal(true)
				} else if (FunctionCall.method_name === 'add_bid') {
					const res = await axios.get(`${process.env.V2_API_URL}/token`, {
						params: {
							contract_id: args.nft_contract_id,
							token_id: args.token_id,
						},
					})
					setToken(res.data.data.results[0])
					setTxDetail({ ...FunctionCall, args })
					setShowModal(true)
				} else if (FunctionCall.method_name === 'nft_set_series_price') {
					const res = await axios.get(`${process.env.V2_API_URL}/token-series`, {
						params: {
							contract_id: receiver_id,
							token_series_id: args.token_series_id,
						},
					})
					setToken(res.data.data.results[0])
					setTxDetail({ ...FunctionCall, args })
					setShowModal(true)
				} else if (FunctionCall.method_name === 'nft_approve') {
					const msgParse = JSON.parse(args?.msg)
					const res = await axios.get(`${process.env.V2_API_URL}/token`, {
						params: {
							contract_id:
								msgParse.market_type === 'accept_trade' ||
								msgParse.market_type === 'accept_trade_paras_series'
									? msgParse?.buyer_nft_contract_id
									: receiver_id,
							token_id:
								msgParse?.market_type === 'accept_trade' ||
								msgParse?.market_type === 'accept_trade_paras_series'
									? msgParse?.buyer_token_id
									: args.token_id,
						},
					})
					setToken(res.data.data.results[0])
					setTxDetail({ ...FunctionCall, args })
					setShowModal(true)
				} else if (FunctionCall.method_name === 'delete_market_data') {
					const res = await axios.get(`${process.env.V2_API_URL}/token`, {
						params: {
							contract_id: args.nft_contract_id,
							token_id: args.token_id,
						},
					})
					setToken(res.data.data.results[0])
					setTxDetail({ ...FunctionCall, args })
					setShowModal(true)
				} else if (FunctionCall.method_name === 'nft_create_series') {
					const logs = JSON.parse(receipts_outcome[0].outcome?.logs?.[0])
					const res = await axios.get(`${process.env.V2_API_URL}/token-series`, {
						params: {
							contract_id: receiver_id,
							token_series_id: logs.params.token_series_id,
						},
					})
					setToken(res.data.data.results[0])
					setTxDetail({ ...FunctionCall, args, logs })
					setShowModal(true)
				}
			}
		}
	}

	const onCloseModal = () => {
		const key = `${token.contract_id}::${token.token_series_id}${
			token.token_id ? `/${token.token_id}` : ''
		}`
		mutate(key)
		setShowModal(false)
		setToken(null)
		if (WalletHelper.activeWallet === walletType.sender) {
			setTransactionRes(null)
		} else {
			removeTxHash()
		}
	}

	const removeTxHash = () => {
		const query = router.query
		delete query.transactionHashes
		router.replace({ pathname: router.pathname, query }, undefined, { shallow: true })
	}

	if (!showModal || !token) return null

	const tokenUrl = `${window.location.hostname}/token/${token.contract_id}::${
		token.token_series_id
	}${token.token_id ? `/${token.token_id}` : ''}`

	const explorerUrl = (txhash) =>
		getConfig(process.env.APP_ENV || 'development').explorerUrl + '/transactions/' + txhash

	const onClickSeeToken = () => {
		const url = `/token/${token.contract_id}::${token.token_series_id}${
			token.token_id ? `/${token.token_id}` : ''
		}${txDetail.method_name === 'add_offer' ? '?tab=offers' : ''}`
		router.push(url)
		onCloseModal()
	}

	const titleText = () => {
		if (txDetail.method_name === 'add_offer') {
			return 'Offer Success'
		} else if (txDetail.method_name === 'add_bid') {
			return 'Place Bid Success'
		} else if (txDetail.method_name === 'nft_buy' || txDetail.method_name === 'buy') {
			return 'Purchase Success'
		} else if (txDetail.method_name === 'nft_set_series_price') {
			return 'Update Price Success'
		} else if (txDetail.method_name === 'nft_approve') {
			const msg = JSON.parse(txDetail.args.msg)
			if (msg.market_type === 'sale' && !token?.is_auction) {
				return 'Update Listing Success'
			} else if (msg.market_type === 'accept_offer') {
				return 'Accept Offer Success'
			} else if (msg.market_type === 'add_trade') {
				return 'Add Trade Success'
			} else if (token?.is_auction) {
				return 'Create Auction Success'
			} else if (
				msg.market_type === 'accept_trade' ||
				msg.market_type === 'accept_trade_paras_series'
			) {
				return 'Accept Trade Success'
			}
		} else if (txDetail.method_name === 'delete_market_data') {
			return 'Remove Listing Success'
		} else if (txDetail.method_name === 'nft_create_series') {
			return 'Create Card Success'
		} else {
			return 'Transaction Success'
		}
	}

	const descText = () => {
		if (txDetail.method_name === 'add_offer') {
			return (
				<>
					You successfully offer <b>{token.metadata.title}</b> for{' '}
					{formatNearAmount(txDetail.args.price)} Ⓝ
				</>
			)
		} else if (txDetail.method_name === 'add_bid') {
			return (
				<>
					You successfully bid of auction <b>{token.metadata.title}</b> for{' '}
					{formatNearAmount(txDetail.args.amount)} Ⓝ
				</>
			)
		} else if (txDetail.method_name === 'nft_buy' || txDetail.method_name === 'buy') {
			return (
				<>
					You successfully purchase <b>{token.metadata.title}</b>
				</>
			)
		} else if (txDetail.method_name === 'nft_set_series_price') {
			if (txDetail.args.price) {
				return (
					<>
						You successfully update <b>{token.metadata.title}</b> price to{' '}
						{formatNearAmount(txDetail.args.price)} Ⓝ
					</>
				)
			}
			return (
				<>
					You successfully remove the listing <b>{token.metadata.title}</b>
				</>
			)
		} else if (txDetail.method_name === 'nft_approve') {
			const msg = JSON.parse(txDetail.args.msg)
			if (msg.market_type === 'sale') {
				return (
					<>
						You successfully {token?.is_auction ? 'create auction' : 'update'}{' '}
						<b>{token.metadata.title}</b> price to {formatNearAmount(msg.price || 0)} Ⓝ
					</>
				)
			} else if (msg.market_type === 'accept_offer') {
				return (
					<>
						You successfully accept offer <b>{token.metadata.title}</b>
					</>
				)
			} else if (msg.market_type === 'add_trade') {
				return (
					<>
						You successfully trade your NFT <b>{token.metadata.title}</b>
					</>
				)
			} else if (
				msg.market_type === 'accept_trade' ||
				msg.market_type === 'accept_trade_paras_series'
			) {
				return (
					<>
						You successfully accept NFT <b>{token.metadata.title}</b>
					</>
				)
			}
		} else if (txDetail.method_name === 'delete_market_data') {
			return (
				<>
					You successfully remove the listing <b>{token.metadata.title}</b>
				</>
			)
		} else if (txDetail.method_name === 'nft_create_series') {
			return (
				<>
					You successfully create <b>{token.metadata.title}</b>
				</>
			)
		}
	}

	return (
		<Modal isShow={showModal} close={onCloseModal} className="p-8">
			<div className="max-w-sm w-full p-4 bg-gray-800 md:m-auto rounded-md relative">
				<div className="absolute right-0 top-0 pr-4 pt-4">
					<div className="cursor-pointer" onClick={onCloseModal}>
						<IconX />
					</div>
				</div>
				<div>
					<h1 className="text-2xl font-bold text-white tracking-tight">{titleText()}</h1>
					<p className="text-white mt-2">{descText()}</p>
					<div className="p-4">
						<div className="w-2/3 m-auto h-56">
							<Media
								className="rounded-lg overflow-hidden h-full w-full"
								url={token.metadata.media}
								videoControls={true}
								videoLoop={true}
								videoMuted={true}
								videoPadding={false}
							/>
						</div>
					</div>
					{router.query.transactionHashes && (
						<div className="p-3 bg-gray-700 rounded-md mt-2 mb-4">
							<p className="text-gray-300 text-sm">Transaction Hash</p>
							{router.query.transactionHashes.split(',').map((txhash) => (
								<a href={explorerUrl(txhash)} key={txhash} target="_blank" rel="noreferrer">
									<p className="text-white hover:underline cursor-pointer overflow-hidden text-ellipsis">
										{txhash}
									</p>
								</a>
							))}
						</div>
					)}
					<div className="flex justify-between px-1 mb-4">
						<p className="text-sm text-white">Share to:</p>
						<div className="flex gap-2">
							<FacebookShareButton url={tokenUrl} className="flex text-white">
								<FacebookIcon size={24} round />
							</FacebookShareButton>
							<TelegramShareButton url={tokenUrl} className="flex text-white">
								<TelegramIcon size={24} round />
							</TelegramShareButton>{' '}
							<TwitterShareButton
								title={`Checkout ${token.metadata.title} from collection ${token.metadata.collection} on @ParasHQ\n\n#paras #cryptoart #digitalart #tradingcards`}
								url={tokenUrl}
								className="flex text-white"
							>
								<TwitterIcon size={24} round />
							</TwitterShareButton>
						</div>
					</div>
					<Button size="md" isFullWidth onClick={onClickSeeToken}>
						See Token
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export default SuccessTransactionModal
