import { useToast } from 'hooks/useToast'
import {
	GAS_FEE,
	ACCEPT_GAS_FEE,
	GAS_FEE_150,
	GAS_FEE_200,
	STORAGE_APPROVE_FEE,
	STORAGE_MINT_FEE,
} from 'config/constants'
import useToken from 'hooks/useToken'
import { sentryCaptureException } from 'lib/sentry'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import JSBI from 'jsbi'
import cachios from 'cachios'
import { useWalletSelector } from 'components/Common/WalletSelector'
import useStore from 'lib/store'
import { useIntl } from 'hooks/useIntl'
import ProfileImageBadge from 'components/Common/ProfileImageBadge'
import { prettyBalance, prettyTruncate, TabEnum, ModalEnum, timeAgo } from 'utils/common'
import Button from 'components/Common/Button'
import TokenOfferModal from 'components/Modal/TokenOfferModal'
import IconEmptyOffer from 'components/Icons/component/IconEmptyOffer'

const FETCH_TOKENS_LIMIT = 12

const TabOffersSecond = ({ localToken }) => {
	const store = useStore()
	const { currentUser } = useStore()

	const [page, setPage] = useState(0)
	const [offers, setOffers] = useState([])
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)
	const [isOwned, setIsOwned] = useState(false)
	const [storageFee, setStorageFee] = useState(STORAGE_APPROVE_FEE)

	useEffect(() => {
		if (localToken.token_series_id) {
			fetchOffers(true)
		}
	}, [localToken])

	useEffect(() => {
		if (offers.length > 0 && store.userProfile.accountId) {
			fetchOwnership()
		}
	}, [offers, store.userProfile])

	const fetchOffers = async (fromStart = false) => {
		setIsFetching(true)

		const _hasMore = fromStart ? true : hasMore
		const _page = fromStart ? 0 : page
		const _offers = fromStart ? [] : offers

		if (!_hasMore || isFetching) {
			return
		}

		const params = {
			__skip: _page * FETCH_TOKENS_LIMIT,
			__limit: FETCH_TOKENS_LIMIT,
		}

		if (localToken.token_id) {
			params.token_id = localToken.token_id
			params.contract_id = localToken.contract_id
		} else {
			params.token_series_id = localToken.token_series_id
			params.contract_id = localToken.contract_id
		}

		const resp = await cachios.get(`${process.env.V2_API_URL}/offers`, {
			params: params,
			ttl: 30,
			force: fromStart,
		})

		const newData = resp.data.data

		const newOffers = [...(_offers || []), ...newData.results]
		const hasMoretoFetch = newData.results.length < FETCH_TOKENS_LIMIT ? false : true

		setOffers(newOffers)
		setPage(_page + 1)
		setHasMore(hasMoretoFetch)

		setIsFetching(false)
	}

	const fetchOwnership = async () => {
		setIsFetching(true)

		// check ownership by token
		if (localToken.token_id) {
			const ownershipResp = await cachios.get(`${process.env.V2_API_URL}/token`, {
				params: {
					token_id: localToken.token_id,
					contract_id: localToken.contract_id,
					owner_id: store.userProfile.accountId,
					__limit: 1,
				},
				ttl: 30,
			})
			if (ownershipResp.data.data.results[0]) {
				setIsOwned(`owner::token::${localToken.token_id}`)
				setStorageFee(STORAGE_APPROVE_FEE)
			}
		}
		// check ownership by series
		else {
			const ownershipResp = await cachios.get(`${process.env.V2_API_URL}/token`, {
				params: {
					token_series_id: localToken.token_series_id,
					contract_id: localToken.contract_id,
					owner_id: store.userProfile.accountId,
					__limit: 1,
				},
				ttl: 30,
			})

			const creatorId = localToken.metadata.creator_id || localToken.contract_id

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

		setIsFetching(false)
	}

	if (!isFetching && offers.length <= 0) {
		return <IconEmptyOffer size={150} className="mx-auto my-16" />
	}

	return (
		<div>
			{currentUser === localToken.owner_id ? (
				<div className="grid grid-cols-4 py-2 px-4 mt-1">
					<p className="text-xs text-neutral-10">Offered by</p>
					<p className="text-xs text-neutral-10">Price</p>
					<p className="text-xs text-neutral-10">Offer Date</p>
					<p className="text-xs text-neutral-10">Reject All</p>
					<div className="col-span-4 border-b border-b-neutral-03 my-1"></div>
					{offers.map((offer) => (
						<OfferOwner key={offer.buyer_id} offer={offer} />
					))}
				</div>
			) : (
				<div className="grid grid-cols-4 py-2 px-4 mt-1">
					<p className="text-xs text-neutral-10 col-span-2">Offered by</p>
					<p className="text-xs text-neutral-10">Price</p>
					<p className="text-xs text-neutral-10">Offer Date</p>
					<div className="col-span-4 border-b border-b-neutral-03 my-1"></div>
					{offers.map((offer) => (
						<Offer key={offer.buyer_id} offer={offer} fetchOffer={fetchOffers} />
					))}
				</div>
			)}
		</div>
	)
}

const OfferOwner = ({ offer }) => {
	const { token } = useToken({
		key: `${offer.contract_id}::${offer.token_series_id}/${offer.token_id}`,
		initialData: offer,
	})

	const { currentUser } = useStore()
	const { localeLn } = useIntl()

	const [profile, setProfile] = useState([])

	useEffect(() => {
		if (token.owner_id) {
			fetchOwnerProfile()
		}
	}, [token.owner_id])

	const fetchOwnerProfile = async () => {
		try {
			const resp = await cachios.get(`${process.env.V2_API_URL}/profiles`, {
				params: {
					accountId: token.owner_id,
				},
				ttl: 60,
			})
			const newData = resp.data.data.results[0] || {}
			setProfile(newData)
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	return (
		<>
			<div className="inline-flex items-center w-full py-2">
				<ProfileImageBadge
					imgUrl={profile.imgUrl}
					level={profile?.level}
					className="w-8 h-8 rounded-lg"
				/>
				<div className="flex flex-col justify-between items-stretch ml-2">
					<p className="text-xs font-bold mb-2 text-neutral-10">
						{prettyTruncate(offer.buyer_id, 24, 'address')}
					</p>
					<Link
						href={`/token/${offer.contract_id}::${encodeURIComponent(offer.token_series_id)}/${
							offer.token_id && encodeURIComponent(offer.token_id)
						}`}
					>
						<a className="text-xs font-thin text-neutral-10 truncate">
							#{prettyTruncate(offer.token_series_id || offer.token_id, 5)}
						</a>
					</Link>
				</div>
			</div>
			<div className="flex flex-col py-3">
				{offer.price ? (
					<p className="text-md text-left text-neutral-10 font-bold">
						{prettyBalance(offer.price, 24, 2)} Ⓝ
					</p>
				) : (
					<div className="line-through text-red-600">
						<p className="text-lg font-bold text-gray-100">{localeLn('SALE')}</p>
					</div>
				)}
			</div>
			<div className="inline-flex py-4">
				<p className="text-xs text-neutral-10">{timeAgo.format(offer.issued_at)}</p>
			</div>
			<div className="inline-flex py-4 justify-end items-center">
				<p className="underline text-neutral-10 text-sm mr-4 font-bold">Reject</p>
				<Button variant="second" size={'xs'}>
					<p className="text-xs p-1">Accept</p>
				</Button>
			</div>
			<div className="col-span-4 border-b border-b-neutral-04 mb-2"></div>
		</>
	)
}

const Offer = ({ offer, fetchOffer }) => {
	const { token } = useToken({
		key: `${offer.contract_id}::${offer.token_series_id}/${offer.token_id}`,
		initialData: offer,
	})

	const toast = useToast()
	const { signAndSendTransaction } = useWalletSelector()
	const isNFTTraded = offer?.type && offer?.type === 'trade'
	const { currentUser } = useStore()
	const { localeLn } = useIntl()

	const [profile, setProfile] = useState([])
	const [showOfferModal, setShowOfferModal] = useState(false)

	useEffect(() => {
		if (token.owner_id) {
			fetchOwnerProfile()
		}
	}, [token.owner_id])

	const fetchOwnerProfile = async () => {
		try {
			const resp = await cachios.get(`${process.env.V2_API_URL}/profiles`, {
				params: {
					accountId: token.owner_id,
				},
				ttl: 60,
			})
			const newData = resp.data.data.results[0] || {}
			setProfile(newData)
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const deleteOffer = async () => {
		const params = isNFTTraded
			? {
					nft_contract_id: offer.contract_id,
					...(offer.token_id
						? { token_id: offer.token_id }
						: { token_series_id: offer.token_series_id }),
					buyer_nft_contract_id: offer.buyer_nft_contract_id,
					buyer_token_id: offer.buyer_token_id,
			  }
			: {
					nft_contract_id: offer.contract_id,
					...(offer.token_id
						? { token_id: offer.token_id }
						: { token_series_id: offer.token_series_id }),
			  }

		try {
			if (isNFTTraded) {
				const res = await signAndSendTransaction({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					actions: [
						{
							type: 'FunctionCall',
							params: {
								methodName: `delete_trade`,
								args: params,
								gas: GAS_FEE,
								deposit: '1',
							},
						},
					],
				})
				if (res) {
					toast.show({
						text: (
							<div className="font-semibold text-center text-sm">{`Successfully delete trade`}</div>
						),
						type: 'success',
						duration: 2500,
					})
					setTimeout(fetchOffer, 2500)
				}
			} else {
				const res = await signAndSendTransaction({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					actions: [
						{
							type: 'FunctionCall',
							params: {
								methodName: `delete_offer`,
								args: params,
								gas: GAS_FEE,
								deposit: '1',
							},
						},
					],
				})
				if (res) {
					toast.show({
						text: (
							<div className="font-semibold text-center text-sm">{`Successfully delete offer`}</div>
						),
						type: 'success',
						duration: 2500,
					})
					setTimeout(fetchOffer, 2500)
				}
			}
		} catch (error) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{error.message || localeLn('SomethingWentWrong')}
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			sentryCaptureException(error)
		}
	}

	return (
		<>
			<div className="inline-flex items-center w-full py-2 col-span-2">
				<ProfileImageBadge
					imgUrl={profile.imgUrl}
					level={profile?.level}
					className="w-8 h-8 rounded-lg"
				/>
				<div className="flex flex-col justify-between items-stretch ml-2">
					<p className="text-xs font-bold mb-2 text-neutral-10">
						{prettyTruncate(offer.buyer_id, 24, 'address')}
					</p>
					<Link
						href={`/token/${offer.contract_id}::${encodeURIComponent(offer.token_series_id)}/${
							offer.token_id && encodeURIComponent(offer.token_id)
						}`}
					>
						<a className="text-xs font-thin text-neutral-10 truncate">
							#{prettyTruncate(offer.token_series_id || offer.token_id, 5)}
						</a>
					</Link>
				</div>
			</div>
			<div className="flex flex-col py-3">
				{offer.price ? (
					<p className="text-md text-left text-neutral-10 font-bold">
						{prettyBalance(offer.price, 24, 2)} Ⓝ
					</p>
				) : (
					<div className="line-through text-red-600">
						<p className="text-lg font-bold text-gray-100">{localeLn('SALE')}</p>
					</div>
				)}
			</div>
			<div className="inline-flex py-4">
				<p className="text-xs text-neutral-10">{timeAgo.format(offer.issued_at)}</p>
				{currentUser === offer.buyer_id && (
					<Button variant={'second'} size={'xs'} onClick={deleteOffer}>
						<p className="text-xs text-neutral-10 p-1">Delete</p>
					</Button>
				)}
			</div>
			<div className="col-span-4 border-b border-b-neutral-04 mb-2"></div>
		</>
	)
}

export default TabOffersSecond
