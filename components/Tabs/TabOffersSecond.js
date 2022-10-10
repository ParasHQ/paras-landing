import { IconArrowSmall } from 'components/Icons'
import useToken from 'hooks/useToken'
import { sentryCaptureException } from 'lib/sentry'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import JSBI from 'jsbi'
import cachios from 'cachios'
import IconSort from 'components/Icons/component/IconSort'
import useStore from 'lib/store'
import { useIntl } from 'hooks/useIntl'
import ProfileImageBadge from 'components/Common/ProfileImageBadge'
import { prettyBalance, prettyTruncate, TabEnum, ModalEnum, timeAgo } from 'utils/common'
import Button from 'components/Common/Button'
import TokenOfferModal from 'components/Modal/TokenOfferModal'
import TokenBidModal from 'components/Modal/TokenBidModal'
import TokenBuyModalSecond from 'components/Modal/TokenBuyModalSecond'
import TokenUpdateListing from 'components/Modal/TokenUpdateListing'
import IconEmptyOwners from 'components/Icons/component/IconEmptyOwners'
import { STORAGE_APPROVE_FEE, STORAGE_MINT_FEE } from 'config/constants'
import IconEmptyOffer from 'components/Icons/component/IconEmptyOffer'

const FETCH_TOKENS_LIMIT = 12

const TabOffersSecond = ({ localToken }) => {
	const store = useStore()

	const [page, setPage] = useState(0)
	const [offers, setOffers] = useState([])
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)
	const [fetching, setFetching] = useState(null)
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
		const _hasMore = fromStart ? true : hasMore
		const _page = fromStart ? 0 : page
		const _offers = fromStart ? [] : offers

		if (!_hasMore || isFetching) {
			return
		}

		setFetching(TabEnum.OFFERS)

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

		setIsFetching(null)
	}

	const fetchOwnership = async () => {
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
	}

	if (fetching === null && offers.length <= 0) {
		return <IconEmptyOffer size={100} className="mx-auto my-4" />
	}

	return (
		<div>
			<div className="border-b border-b-neutral-05 -mt-1 mb-2 mx-2"></div>
			<div className="grid grid-cols-12 p-2">
				<p className="text-xs text-neutral-10 col-span-4">Offered by</p>
				<p className="text-xs text-neutral-10 col-span-2">Price</p>
				<p className="text-xs text-neutral-10 col-span-3">Offer Date</p>
				<p className="text-xs text-neutral-10 text-right col-span-3">Reject All</p>
				<div className="col-span-12 border-b border-b-neutral-04 my-1"></div>
				{offers.map((offer) => (
					<Offer key={offer.buyer_id} offer={offer} />
				))}
			</div>
		</div>
	)
}

const Offer = ({ offer }) => {
	const { currentUser } = useStore()
	const { localeLn } = useIntl()

	const [profile, setProfile] = useState([])

	return (
		<>
			<div className="col-span-4 inline-flex items-center w-full py-2">
				<ProfileImageBadge
					imgUrl={profile.imgUrl}
					level={profile?.level}
					className="w-8 h-8 rounded-lg"
				/>
				<div className="flex flex-col justify-between items-stretch ml-2">
					<p className="text-xs font-bold mb-2 text-neutral-10">
						{prettyTruncate(offer.owner_id, 24, 'address')}
					</p>
					<Link
						href={`/token/${offer.contract_id}::${encodeURIComponent(offer.token_series_id)}/${
							offer.token_id && encodeURIComponent(offer.token_id)
						}`}
					>
						<a className="text-sm font-thin text-neutral-10 truncate">
							`#${offer.token_series_id || offer.token_id}`
						</a>
					</Link>
				</div>
			</div>
			<div className="col-span-2 flex flex-col py-3">
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
			<div className="col-span-3 inline-flex py-4">
				<p className="text-xs text-neutral-10">{timeAgo.format(offer.issued_at)}</p>
			</div>
			<div className="col-span-3 inline-flex py-4 justify-end">
				<p className="underline text-neutral-10">Reject</p>
				<Button variant="second" size={'sm'}>
					Accept
				</Button>
			</div>
			<div className="col-span-12 border-b border-b-neutral-04 mb-2"></div>
		</>
	)
}

export default TabOffersSecond
