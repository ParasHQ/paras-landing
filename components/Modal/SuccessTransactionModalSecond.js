import ParasRequest from 'lib/ParasRequest'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import { IconX } from 'components/Icons'
import getConfig from 'config/near'
import { useToast } from 'hooks/useToast'
import IconTrade from 'components/Icons/component/IconTrade'
import useStore from 'lib/store'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { sentryCaptureException } from 'lib/sentry'
import {
	FacebookIcon,
	FacebookShareButton,
	TelegramIcon,
	TelegramShareButton,
	TwitterIcon,
	TwitterShareButton,
} from 'react-share'
import { mutate } from 'swr'
import { parseImgUrl, decodeBase64 } from 'utils/common'
import retry from 'async-retry'
import { providers } from 'near-api-js'
import Card from 'components/Card/Card'

const SuccessTransactionModalSecond = () => {
	const toast = useToast()
	const router = useRouter()
	const { currentUser, transactionRes, setTransactionRes } = useStore()

	const [showModal, setShowModal] = useState(false)
	const [txDetail, setTxDetail] = useState(null)
	const [token, setToken] = useState(null)
	const [tradedToken, setTradedToken] = useState(null)

	useEffect(() => {
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

	const explorerUrl = (txhash) =>
		getConfig(process.env.APP_ENV || 'development').explorerUrl + '/transactions/' + txhash

	const processTransactionError = (err) => {
		toast.show({
			text: <div className="font-semibold text-center text-sm">{err}</div>,
			type: 'error',
			duration: null,
		})
	}

	const submitCategoryCard = async (res) => {
		const _categoryId = window.sessionStorage.getItem(`categoryToken`)
		const txLast = res
		const resFromTxLast = txLast.receipts_outcome[0].outcome.logs[0]
		const resOutcome = await JSON.parse(`${resFromTxLast}`)
		await retry(
			async () => {
				const res = await ParasRequest.post(`${process.env.V2_API_URL}/categories/tokens`, {
					account_id: currentUser,
					contract_id: txLast?.transaction?.receiver_id,
					token_series_id: resOutcome?.params?.token_series_id,
					category_id: _categoryId,
					storeToSheet: _categoryId === 'art-competition' ? `true` : `false`,
				})
				if (res.status === 403 || res.status === 400) {
					sentryCaptureException(res.data?.message || `Token series still haven't exist`)
					return
				}
				window.sessionStorage.removeItem('categoryToken')
			},
			{
				retries: 20,
				factor: 2,
			}
		)
	}

	const onCloseModal = () => {
		const key = `${token.contract_id}::${token.token_series_id}${
			token.token_id ? `/${token.token_id}` : ''
		}`
		mutate(key)
		setShowModal(false)
		setToken(null)
		setTransactionRes(null)
		removeTxHash()
	}

	const getTransactionStatus = ({ accountId, txHash }) => {
		const nearConfig = getConfig(process.env.APP_ENV || 'development')
		return new providers.JsonRpcProvider({ url: nearConfig.nodeUrl }).txStatus(txHash, accountId)
	}

	const checkTxStatus = async () => {
		const txHash = router.query.transactionHashes.split(',')
		const txStatus = await getTransactionStatus({
			accountId: currentUser,
			txHash: txHash[txHash.length - 1],
		})
		if (window.sessionStorage.getItem('categoryToken')) {
			await submitCategoryCard(txStatus)
		}
		await processTransaction(txStatus)
	}

	const processTransaction = async (txStatus) => {
		if (txStatus?.status?.SuccessValue !== undefined) {
			const { receipts_outcome } = txStatus
			const { actions, receiver_id } = txStatus.transaction

			for (const action of actions) {
				const { FunctionCall } = action
				const args = JSON.parse(decodeBase64(FunctionCall.args))

				if (FunctionCall.method_name === 'nft_buy') {
					const res = await ParasRequest.get(`${process.env.V2_API_URL}/token-series`, {
						params: {
							contract_id: receiver_id,
							token_series_id: args.token_series_id,
						},
					})
					setToken(res.data.data.results[0])
					setTxDetail({ ...FunctionCall, args })
					setShowModal(true)
				} else if (FunctionCall.method_name === 'buy') {
					const res = await ParasRequest.get(`${process.env.V2_API_URL}/token`, {
						params: {
							contract_id: args.nft_contract_id,
							token_id: args.token_id,
						},
					})
					setToken(res.data.data.results[0])
					setTxDetail({ ...FunctionCall, args })
					setShowModal(true)
				} else if (FunctionCall.method_name === 'add_offer') {
					const res = await ParasRequest.get(
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
					const res = await ParasRequest.get(`${process.env.V2_API_URL}/token`, {
						params: {
							contract_id: args.nft_contract_id,
							token_id: args.token_id,
						},
					})
					setToken(res.data.data.results[0])
					setTxDetail({ ...FunctionCall, args })
					setShowModal(true)
				} else if (FunctionCall.method_name === 'cancel_bid') {
					const res = await ParasRequest.get(`${process.env.V2_API_URL}/token`, {
						params: {
							contract_id: args.nft_contract_id,
							token_id: args.token_id,
						},
					})
					setToken(res.data.data.results[0])
					setTxDetail({ ...FunctionCall, args })
					setShowModal(true)
				} else if (FunctionCall.method_name === 'accept_bid') {
					const res = await ParasRequest.get(`${process.env.V2_API_URL}/token`, {
						params: {
							contract_id: args.nft_contract_id,
							token_id: args.token_id,
						},
					})
					setToken(res.data.data.results[0])
					setTxDetail({ ...FunctionCall, args })
					setShowModal(true)
				} else if (FunctionCall.method_name === 'cancel_auction') {
					const res = await ParasRequest.get(`${process.env.V2_API_URL}/token`, {
						params: {
							contract_id: args.nft_contract_id,
							token_id: args.token_id,
						},
					})
					setToken(res.data.data.results[0])
					setTxDetail({ ...FunctionCall, args })
					setShowModal(true)
				} else if (FunctionCall.method_name === 'nft_set_series_price') {
					const res = await ParasRequest.get(`${process.env.V2_API_URL}/token-series`, {
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
					let logs = []
					receipts_outcome
						.filter((receipt) => receipt.outcome.logs.length !== 0)
						.forEach((receipt) => (logs = [...logs, ...receipt.outcome.logs]))

					if (logs.some((log) => log.includes('Insufficient storage paid'))) {
						processTransactionError('Insufficient storage paid')
						return
					}

					if (msgParse.market_type === 'add_trade') {
						const resTradedToken = await ParasRequest.get(`${process.env.V2_API_URL}/token`, {
							params: {
								contract_id: msgParse.seller_nft_contract_id,
								token_id: msgParse.seller_token_id,
							},
						})

						setTradedToken(resTradedToken.data.data.results[0])
					}

					const res = await ParasRequest.get(`${process.env.V2_API_URL}/token`, {
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
					const res = await ParasRequest.get(`${process.env.V2_API_URL}/token`, {
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
					const res = await ParasRequest.get(`${process.env.V2_API_URL}/token-series`, {
						params: {
							contract_id: receiver_id,
							token_series_id: logs.params.token_series_id,
						},
					})
					setToken(res.data.data.results[0])
					setTxDetail({ ...FunctionCall, args, logs })
					setShowModal(true)
				} else if (FunctionCall.method_name === 'nft_transfer') {
					const res = await ParasRequest.get(`${process.env.V2_API_URL}/token`, {
						params: {
							contract_id: args.nft_contract_id,
							token_id: args.token_id,
						},
					})
					setToken(res.data.data.results[0])
					setTxDetail({ ...FunctionCall, args })
					setShowModal(true)
				}
			}
		}
	}

	if (!showModal || !token) return null

	const removeTxHash = () => {
		const query = router.query
		delete query.transactionHashes
		router.replace({ pathname: router.pathname, query }, undefined, { shallow: true })
	}

	const onClickSeeToken = () => {
		const url = `/token/${token.contract_id}::${encodeURIComponent(token.token_series_id)}${
			token.token_id ? `/${encodeURIComponent(token.token_id)}` : ''
		}${txDetail.method_name === 'add_offer' ? '?tab=offers' : ''}`
		router.push(url)
		onCloseModal()
	}

	const titleText = () => {
		if (txDetail.method_name === 'add_offer') {
			return 'Offer Success'
		} else if (txDetail.method_name === 'add_bid') {
			return 'Place Bid Success'
		} else if (txDetail.method_name === 'cancel_bid') {
			return 'Success Remove Bid'
		} else if (txDetail.method_name === 'accept_bid') {
			return 'Accept Bid Success'
		} else if (txDetail.method_name === 'nft_buy' || txDetail.method_name === 'buy') {
			return 'Purchase Success'
		} else if (txDetail.method_name === 'nft_set_series_price') {
			return 'Update Price Success'
		} else if (txDetail.method_name === 'nft_approve') {
			const msg = JSON.parse(txDetail.args.msg)
			if (msg.market_type === 'sale' && !msg.is_auction) {
				return 'Update Listing Success'
			} else if (
				msg.market_type === 'accept_offer' ||
				msg.market_type === 'accept_offer_paras_series'
			) {
				return 'Accept Offer Success'
			} else if (msg.market_type === 'add_trade') {
				return 'Add Trade Success'
			} else if (msg.is_auction) {
				return 'Create Auction Success'
			} else if (
				msg.market_type === 'accept_trade' ||
				msg.market_type === 'accept_trade_paras_series'
			) {
				return 'Accept Trade Success'
			}
		} else if (txDetail.method_name === 'delete_market_data') {
			const args = txDetail.args
			if (args.is_auction) {
				return 'Remove Auction Success'
			}
			return 'Remove Listing Success'
		} else if (txDetail.method_name === 'nft_create_series') {
			return 'Create Card Success'
		} else if (txDetail.method_name === 'nft_transfer') {
			return 'Transfer Success'
		} else {
			return 'Transaction Success'
		}
	}
	const tokenUrl = `${window.location.hostname}/token/${token.contract_id}::${encodeURIComponent(
		token.token_series_id
	)}${token.token_id ? `/${encodeURIComponent(token.token_id)}` : ''}`

	return (
		<Modal isShow={showModal} close={onCloseModal} className="p-8">
			<div className="min-w-[504px] min-h-[616px] p-4 bg-neutral-03 md:m-auto rounded-md relative">
				<div className="mt-4 mb-5">
					<h1 className="text-md mx-auto font-bold text-neutral-10 text-center tracking-tight">
						{titleText()}
					</h1>
					<div className="absolute right-0 top-2 pr-4 pt-4">
						<div
							className="bg-neutral-05 p-1 pl-2 rounded-md cursor-pointer"
							onClick={onCloseModal}
						>
							<IconX />
						</div>
					</div>
				</div>
				<div className="w-[440px] h-[444px] bg-neutral-02 rounded-lg mx-auto p-2">
					<div className="inline-flex rounded-lg border border-neutral-05 p-2 mt-4 mb-6 mx-auto">
						<p className="text-xs text-neutral-10 text-center">
							<span className="text-green-500">Successful!</span> Share with your community to get a
							bigger audience.
						</p>
					</div>
					{tradedToken ? (
						<div className="mb-4">
							<div className="w-1/2 m-auto h-56">
								<Card
									imgUrl={parseImgUrl(token?.metadata.media, null, {
										width: `600`,
										useOriginal: process.env.APP_ENV === 'production' ? false : true,
										isMediaCdn: token.isMediaCdn,
									})}
									audioUrl={
										token.metadata.mime_type &&
										token.metadata.mime_type.includes('audio') &&
										token.metadata?.animation_url
									}
									threeDUrl={
										token.metadata.mime_type &&
										token.metadata.mime_type.includes('model') &&
										token.metadata.animation_url
									}
									iframeUrl={
										token.metadata.mime_type &&
										token.metadata.mime_type.includes('iframe') &&
										token.metadata.animation_url
									}
									imgBlur={token.metadata.blurhash}
									token={{
										title: token.metadata.title,
										collection: token.metadata.collection || token.contract_id,
										copies: token.metadata.copies,
										creatorId: token.metadata.creator_id || token.contract_id,
										is_creator: token.is_creator,
										mime_type: token.metadata.mime_type,
									}}
									isNewDesign={true}
								/>
							</div>
							{/* <div>
								<IconTrade size={30} />
							</div> */}
							{/* <div className="w-1/2 m-auto h-56">
								<Card
									imgUrl={parseImgUrl(tradedToken?.metadata.media, null, {
										width: `600`,
										useOriginal: process.env.APP_ENV === 'production' ? false : true,
										isMediaCdn: tradedToken.isMediaCdn,
									})}
									audioUrl={
										tradedToken.metadata.mime_type &&
										tradedToken.metadata.mime_type.includes('audio') &&
										tradedToken.metadata?.animation_url
									}
									threeDUrl={
										tradedToken.metadata.mime_type &&
										tradedToken.metadata.mime_type.includes('model') &&
										tradedToken.metadata.animation_url
									}
									iframeUrl={
										tradedToken.metadata.mime_type &&
										tradedToken.metadata.mime_type.includes('iframe') &&
										tradedToken.metadata.animation_url
									}
									imgBlur={tradedToken.metadata.blurhash}
									token={{
										title: tradedToken.metadata.title,
										collection: tradedToken.metadata.collection || tradedToken.contract_id,
										copies: tradedToken.metadata.copies,
										creatorId: tradedToken.metadata.creator_id || tradedToken.contract_id,
										is_creator: tradedToken.is_creator,
										mime_type: tradedToken.metadata.mime_type,
									}}
									isNewDesign={true}
								/>
							</div> */}
						</div>
					) : (
						<div className="mb-4">
							<div className="w-1/2 m-auto h-56">
								<Card
									imgUrl={parseImgUrl(token?.metadata.media, null, {
										width: `600`,
										useOriginal: process.env.APP_ENV === 'production' ? false : true,
										isMediaCdn: token.isMediaCdn,
									})}
									audioUrl={
										token.metadata.mime_type &&
										token.metadata.mime_type.includes('audio') &&
										token.metadata?.animation_url
									}
									threeDUrl={
										token.metadata.mime_type &&
										token.metadata.mime_type.includes('model') &&
										token.metadata.animation_url
									}
									iframeUrl={
										token.metadata.mime_type &&
										token.metadata.mime_type.includes('iframe') &&
										token.metadata.animation_url
									}
									imgBlur={token.metadata.blurhash}
									token={{
										title: token.metadata.title,
										collection: token.metadata.collection || token.contract_id,
										copies: token.metadata.copies,
										creatorId: token.metadata.creator_id || token.contract_id,
										is_creator: token.is_creator,
										mime_type: token.metadata.mime_type,
									}}
									isNewDesign={true}
								/>
							</div>
						</div>
					)}
					{router.query.transactionHashes && (
						<>
							<p className="text-neutral-10 text-sm">Transaction Hash</p>
							<div className="p-3 bg-neutral-05 rounded-md mt-2 mb-4">
								{router.query.transactionHashes.split(',').map((txhash) => (
									<a href={explorerUrl(txhash)} key={txhash} target="_blank" rel="noreferrer">
										<p className="font-light text-neutral-10 hover:underline cursor-pointer overflow-hidden">
											{txhash}
										</p>
									</a>
								))}
							</div>
						</>
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
					<Button variant="second" isFullWidth onClick={onCloseModal}>
						Close
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export default SuccessTransactionModalSecond
