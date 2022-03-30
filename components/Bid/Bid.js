import JSBI from 'jsbi'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import AcceptBidModal from 'components/Modal/AcceptBidModal'
import Card from 'components/Card/Card'

import PlaceBidModal from 'components/Modal/PlaceBidModal'
import useStore from 'lib/store'
import { parseImgUrl, prettyBalance, timeAgo } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import TokenSeriesDetailModal from '../TokenSeries/TokenSeriesDetailModal'
import cachios from 'cachios'
import {
	GAS_FEE,
	GAS_FEE_150,
	GAS_FEE_200,
	STORAGE_APPROVE_FEE,
	STORAGE_MINT_FEE,
} from 'config/constants'
import CancelBid from 'components/Modal/CancelBid'
import TokenDetailModal from 'components/Token/TokenDetailModal'
import WalletHelper from 'lib/WalletHelper'
import { useToast } from 'hooks/useToast'

const Bid = ({ data, type, freshFetch }) => {
	const store = useStore()
	const router = useRouter()
	const [token, setToken] = useState(null)
	const [showModal, setShowModal] = useState('')

	const [isOwned, setIsOwned] = useState(false)
	const [storageFee, setStorageFee] = useState(STORAGE_APPROVE_FEE)
	const toast = useToast()

	const { localeLn } = useIntl()

	useEffect(() => {
		fetchTokenData()
	}, [data])

	useEffect(() => {
		// check user ownership
		if (type === 'receivedBids' && token) {
			fetchOwnership()
		}
	}, [token])

	const fetchTokenData = async () => {
		if (data.token_id) {
			const tokenData = await cachios.get(`${process.env.V2_API_URL}/token`, {
				params: {
					token_id: data.token_id,
					contract_id: data.contract_id,
					__limit: 1,
				},
				ttl: 30,
			})
			if (tokenData.data.data.results[0]) {
				setToken(tokenData.data.data.results[0])
			}
		} else {
			const tokenData = await cachios.get(`${process.env.V2_API_URL}/token-series`, {
				params: {
					token_series_id: data.token_series_id,
					contract_id: data.contract_id,
					__limit: 1,
				},
				ttl: 30,
			})
			if (tokenData.data.data.results[0]) {
				setToken(tokenData.data.data.results[0])
			}
		}
	}

	const fetchOwnership = async () => {
		// check ownership by token
		if (data.token_id) {
			const ownershipResp = await cachios.get(`${process.env.V2_API_URL}/token`, {
				params: {
					token_id: data.token_id,
					contract_id: data.contract_id,
					owner_id: store.userProfile.accountId,
					__limit: 1,
				},
				ttl: 30,
			})
			if (ownershipResp.data.data.results[0]) {
				setIsOwned(`owner::token::${data.token_id}`)
				setStorageFee(STORAGE_APPROVE_FEE)
			}
		}
		// check ownership by series
		else {
			const ownershipResp = await cachios.get(`${process.env.V2_API_URL}/token`, {
				params: {
					token_series_id: data.token_series_id,
					contract_id: data.contract_id,
					owner_id: store.userProfile.accountId,
					__limit: 1,
				},
				ttl: 30,
			})

			const creatorId = token.metadata.creator_id || token.contract_id

			if (ownershipResp.data.data.results[0]) {
				setIsOwned(`owner::series::${ownershipResp.data.data.results[0].token_id}`)
				setStorageFee(STORAGE_APPROVE_FEE)
			} else if (store.userProfile.accountId === creatorId) {
				setIsOwned('creator::series')
				setStorageFee(
					JSBI.add(JSBI.BigInt(STORAGE_APPROVE_FEE), JSBI.BigInt(STORAGE_MINT_FEE)).toString()
				)
			}
		}
	}

	const acceptOffer = async () => {
		try {
			const params = {
				account_id: process.env.MARKETPLACE_CONTRACT_ID,
			}

			const [userType, offerType, tokenId] = isOwned.split('::')

			if (offerType === 'token') {
				params.token_id = tokenId
				params.msg = JSON.stringify({
					market_type: 'accept_offer',
					buyer_id: data.buyer_id,
					price: data.price,
				})
			} else {
				params.token_series_id = data.token_series_id
				params.msg = JSON.stringify({
					market_type: 'accept_offer_paras_series',
					buyer_id: data.buyer_id,
					price: data.price,
				})
				if (tokenId) {
					params.token_id = tokenId
				}
			}

			let res
			// accept offer
			if (userType === 'owner') {
				res = await WalletHelper.callFunction({
					contractId: data.contract_id,
					methodName: `nft_approve`,
					args: params,
					gas: GAS_FEE_150,
					deposit: STORAGE_APPROVE_FEE,
				})
			}
			// batch tx -> mint & accept
			else {
				res = await WalletHelper.callFunction({
					contractId: data.contract_id,
					methodName: `nft_mint_and_approve`,
					args: params,
					gas: GAS_FEE_200,
					deposit: JSBI.add(
						JSBI.BigInt(STORAGE_APPROVE_FEE),
						JSBI.BigInt(STORAGE_MINT_FEE)
					).toString(),
				})
			}

			if (res?.response.error) {
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							{res.response.error.kind.ExecutionError}
						</div>
					),
					type: 'error',
					duration: 2500,
				})
			} else if (res) {
				setShowModal('')
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">{`Successfully accept offer`}</div>
					),
					type: 'success',
					duration: 2500,
				})
				setTimeout(freshFetch, 2500)
			}
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const deleteOffer = async () => {
		const params = {
			nft_contract_id: data.contract_id,
			...(data.token_id ? { token_id: data.token_id } : { token_series_id: data.token_series_id }),
		}

		try {
			const res = await WalletHelper.callFunction({
				contractId: process.env.MARKETPLACE_CONTRACT_ID,
				methodName: `delete_offer`,
				args: params,
				gas: GAS_FEE,
				deposit: '1',
			})

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
				setShowModal('')
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">{`Successfully delete offer`}</div>
					),
					type: 'success',
					duration: 2500,
				})
				setTimeout(freshFetch, 2500)
			}
		} catch (error) {
			sentryCaptureException(error)
		}
	}

	if (!token) return null

	return (
		<>
			<TokenSeriesDetailModal tokens={[token]} />
			<TokenDetailModal tokens={[token]} />
			{showModal === 'acceptBid' && (
				<AcceptBidModal
					data={data}
					onClose={() => setShowModal('')}
					token={token}
					storageFee={storageFee}
					onSubmitForm={acceptOffer}
				/>
			)}
			{showModal === 'updateBid' && (
				<PlaceBidModal
					show={showModal === 'updateBid'}
					data={token}
					onSuccess={() => setTimeout(freshFetch, 2500)}
					onClose={() => setShowModal('')}
				/>
			)}
			{showModal === 'cancelBid' && (
				<CancelBid
					onClose={() => setShowModal('')}
					show={showModal === 'cancelBid'}
					onDelete={deleteOffer}
				/>
			)}
			<div className="border-2 border-dashed my-4 p-4 md:py-6 md:px-8 rounded-md border-gray-800">
				<div className="flex items-center">
					<div className="w-40 h-full">
						<Card
							imgUrl={parseImgUrl(token.metadata.media, null, {
								width: `600`,
								useOriginal: process.env.APP_ENV === 'production' ? false : true,
								isMediaCdn: token.isMediaCdn,
							})}
							onClick={() => {
								router.push(
									{
										pathname: router.pathname,
										query: {
											...router.query,
											tokenSeriesId: token.token_series_id,
											tokenId: token.token_id,
											contractId: token.contract_id,
										},
									},
									token.token_id
										? `/token/${token.contract_id}::${token.token_series_id}/${token.token_id}`
										: `/token/${token.contract_id}::${token.token_series_id}`,
									{
										shallow: true,
										scroll: false,
									}
								)
							}}
							imgBlur={token.metadata.blurhash}
							token={{
								title: token.metadata.title,
								collection: token.metadata.collection || token.contract_id,
								copies: token.metadata.copies,
								creatorId: token.metadata.creator_id || token.contract_id,
								is_creator: token.is_creator,
							}}
						/>
					</div>
					<div className="flex-1 md:flex ml-4 md:ml-6 justify-between items-center">
						<div className="text-gray-100 truncate cursor-pointer">
							<Link
								href={{
									pathname: router.pathname,
									query: {
										...router.query,
										tokenSeriesId: token.token_series_id,
										tokenId: token.token_id,
										contractId: token.contract_id,
									},
								}}
								as={
									token.token_id
										? `/token/${token.contract_id}::${token.token_series_id}/${token.token_id}`
										: `/token/${token.contract_id}::${token.token_series_id}`
								}
								scroll={false}
								shallow
							>
								<div className="font-bold text-2xl">{token?.metadata?.title}</div>
							</Link>
							<p className="opacity-75">{token?.metadata?.collection}</p>
							<div className="mt-4 mb-6">
								{store.currentUser !== data.buyer_id
									? `You received ${prettyBalance(data.price, 24, 4)} Ⓝ offer from ${data.buyer_id}`
									: `You offer ${prettyBalance(data.price, 24, 4)} Ⓝ`}
							</div>
							<p className="mt-2 text-sm opacity-50 mb-6 md:mb-0">
								{token && timeAgo.format(data.issued_at)}
							</p>
						</div>
						<div className="flex flex-col">
							{store.currentUser !== data.buyer_id ? (
								<button
									onClick={() => setShowModal('acceptBid')}
									className="font-semibold w-32 rounded-md border-2 border-primary bg-primary text-white mb-2"
								>
									{localeLn('Accept')}
								</button>
							) : (
								<>
									<button
										onClick={() => setShowModal('updateBid')}
										className="font-semibold w-32 rounded-md border-2 border-primary bg-primary text-white mb-2"
									>
										{localeLn('Update')}
									</button>
									<button
										className="font-semibold w-32 rounded-md border-2 bg-red-600 text-white border-red-600 mb-2"
										onClick={() => setShowModal('cancelBid')}
									>
										{localeLn('Cancel')}
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Bid
