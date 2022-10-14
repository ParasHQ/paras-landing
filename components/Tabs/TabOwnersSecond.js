import { IconArrowSmall } from 'components/Icons'
import useToken from 'hooks/useToken'
import { sentryCaptureException } from 'lib/sentry'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import cachios from 'cachios'
import IconSort from 'components/Icons/component/IconSort'
import useStore from 'lib/store'
import { useIntl } from 'hooks/useIntl'
import ProfileImageBadge from 'components/Common/ProfileImageBadge'
import { prettyBalance, prettyTruncate, TabEnum, ModalEnum } from 'utils/common'
import Button from 'components/Common/Button'
import TokenOfferModal from 'components/Modal/TokenOfferModal'
import TokenBidModal from 'components/Modal/TokenBidModal'
import TokenBuyModalSecond from 'components/Modal/TokenBuyModalSecond'
import TokenUpdateListing from 'components/Modal/TokenUpdateListing'
import IconEmptyOwners from 'components/Icons/component/IconEmptyOwners'
import LoginModal from 'components/Modal/LoginModal'

const FETCH_TOKENS_LIMIT = 100
const OwnerSortEnum = [
	{ key: 'editionasc', title: 'Edition low to high' },
	{ key: 'editiondesc', title: 'Edition high to low' },
	{ key: 'nameasc', title: 'Name A to Z' },
	{ key: 'namedesc', title: 'Name Z to A' },
	{ key: 'priceasc', title: 'Price low to high' },
	{ key: 'pricedesc', title: 'Price high to low' },
]

const TabOwnersSecond = ({ localToken }) => {
	const { currentUser } = useStore()

	const [owners, setOwners] = useState([])
	const [showModal, setShowModal] = useState(null)
	const [showOwnerSortModal, setShowOwnerSortModal] = useState(false)
	const [ownerSortBy, setOwnerSortBy] = useState(OwnerSortEnum[4])
	const [fetching, setFetching] = useState(null)
	const [showLoginModal, setShowLoginModal] = useState(false)

	useEffect(() => {
		fetchOwners([], null)
	}, [])

	useEffect(() => {
		changeSortBy(ownerSortBy)
	}, [ownerSortBy])

	const changeSortBy = (sortby) => {
		let tempTokens = owners.slice()

		if (sortby.key === 'nameasc') {
			tempTokens.sort((a, b) => a.owner_id?.localeCompare(b.owner_id))
		} else if (sortby.key === 'namedesc') {
			tempTokens.sort((a, b) => b.owner_id?.localeCompare(a.owner_id))
		} else if (sortby.key === 'editionasc') {
			tempTokens.sort((a, b) => parseInt(a.edition_id) - parseInt(b.edition_id))
		} else if (sortby.key === 'editiondesc') {
			tempTokens.sort((a, b) => parseInt(b.edition_id) - parseInt(a.edition_id))
		} else if (sortby.key === 'priceasc') {
			let saleOwner = owners.filter((token) => token.price)
			let nonSaleOwner = owners.filter((token) => !token.price)
			saleOwner = saleOwner.sort((a, b) => a.price - b.price)
			tempTokens = [...saleOwner, ...nonSaleOwner]
		} else if (sortby.key === 'pricedesc') {
			let saleOwner = owners.filter((token) => token.price)
			let nonSaleOwner = owners.filter((token) => !token.price)
			saleOwner = saleOwner.sort((a, b) => b.price - a.price)
			tempTokens = [...saleOwner, ...nonSaleOwner]
		}

		setOwners(tempTokens)
	}

	const onCloseModal = () => {
		setShowModal(null)
	}

	const fetchOwners = async (owners, idNext) => {
		if (!localToken.token_series_id) return

		setFetching(TabEnum.OWNERS)

		const resp = await cachios.get(`${process.env.V2_API_URL}/token`, {
			params: {
				token_series_id: localToken.token_series_id,
				contract_id: localToken.contract_id,
				_id_next: idNext,
				__limit: FETCH_TOKENS_LIMIT,
				__sort: 'price::1',
			},
			ttl: 120,
		})

		let respData = resp.data.data.results
		const newOwners = [...owners, ...respData]
		setOwners(newOwners)

		if (respData.length === FETCH_TOKENS_LIMIT) {
			fetchOwners(newOwners, respData[respData.length - 1]._id)
		} else {
			setFetching(null)
		}

		setFetching(null)
	}

	if (fetching === null && owners.length <= 0) {
		return <IconEmptyOwners size={150} className="mx-auto my-16" />
	}

	return (
		<div className="bg-neutral-01 border border-neutral-05 rounded-lg p-1">
			<div className="flex flex-row justify-between items-center p-1">
				<div className="inline-flex items-center">
					<IconSort size={20} stroke={'#F9F9F9'} className="mb-1" />
					<p className="text-xs text-neutral-10">Filter & Sort</p>
				</div>
				<div className="relative inline-flex gap-x-6">
					<div className="flex flex-row items-center gap-x-2">
						<input
							type="checkbox"
							className="w-auto border-neutral-10 rounded-lg"
							style={{ backgroundColor: '#151719' }}
						/>
						<p className="text-xs text-neutral-10">Buy</p>
					</div>
					<div className="flex flex-row items-center gap-x-2">
						<input
							type="checkbox"
							className="w-auto border-neutral-10 rounded-lg"
							style={{ backgroundColor: '#151719' }}
						/>
						<p className="text-xs text-neutral-10">Offer</p>
					</div>
					<div
						className="relative flex flex-row justify-between items-center bg-neutral-01 border border-neutral-05 rounded-lg p-2 cursor-pointer"
						onClick={() => setShowOwnerSortModal(!showOwnerSortModal)}
					>
						<p className="text-neutral-10 text-xs mr-4">{ownerSortBy.title}</p>
						<IconArrowSmall size={20} className="rotate-90" />
					</div>
				</div>
			</div>
			<div className="border-b border-b-neutral-05 -mt-1 mb-2 mx-2"></div>
			<div className="grid grid-cols-12 p-2">
				<p className="text-xs text-neutral-10 col-span-4">Owner</p>
				<p className="text-xs text-neutral-10 col-span-2">Price</p>
				<p className="text-xs text-neutral-10 col-span-3">Owned Date</p>
				<p className="text-xs text-neutral-10 text-right col-span-3"></p>
				<div className="col-span-12 border-b border-b-neutral-04 my-1"></div>
				{owners.map((owner) => (
					<Owner
						key={owner._id}
						initial={owner}
						onShowBuyModal={() => {
							currentUser ? setShowModal(ModalEnum.BUY) : setShowLoginModal(true)
						}}
						onShowBidModal={() => {
							currentUser ? setShowModal(ModalEnum.BID) : setShowLoginModal(true)
						}}
						onShowOfferModal={() => {
							currentUser ? setShowModal(ModalEnum.OFFER) : setShowLoginModal(true)
						}}
						onShowUpdateListingModal={() => {
							currentUser ? setShowModal(ModalEnum.UPDATE_LISTING) : setShowLoginModal(true)
						}}
					/>
				))}
			</div>
			{showOwnerSortModal && (
				<div className="w-36 absolute grid grid-cols-1 z-10 top-52 right-6 bg-neutral-01 border border-neutral-10 rounded-lg p-2 shadow-lg">
					{OwnerSortEnum.map((sort) => (
						<button
							key={sort.key}
							className="text-neutral-10 text-xs p-2 hover:bg-neutral-05 rounded-lg"
							onClick={() => {
								setOwnerSortBy(sort)
								setShowOwnerSortModal(false)
							}}
						>
							{sort.title}
						</button>
					))}
				</div>
			)}

			<TokenBidModal show={showModal === ModalEnum.BID} data={localToken} onClose={onCloseModal} />
			<TokenBuyModalSecond
				show={showModal === ModalEnum.BUY}
				data={localToken}
				onClose={onCloseModal}
			/>
			<TokenOfferModal
				show={showModal === ModalEnum.OFFER}
				data={localToken}
				onClose={onCloseModal}
			/>
			<TokenUpdateListing
				show={showModal === ModalEnum.UPDATE_LISTING}
				data={localToken}
				onClose={onCloseModal}
			/>

			<LoginModal onClose={() => setShowLoginModal(false)} show={showLoginModal} />
		</div>
	)
}

const Owner = ({
	initial = {},
	onShowBuyModal,
	onShowBidModal,
	onShowOfferModal,
	onShowUpdateListingModal,
}) => {
	const { token } = useToken({
		key: `${initial.contract_id}::${initial.token_series_id}/${initial.token_id}`,
		initialData: initial,
	})
	const { currentUser } = useStore()
	const { localeLn } = useIntl()

	const [profile, setProfile] = useState([])
	const [ownedDate, setOwnedDate] = useState(null)

	useEffect(() => {
		if (token.owner_id) {
			fetchOwnerProfile()
			fetchOwnedDate()
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

	const checkTokenPrice = () => {
		if (token && token.amount) {
			return prettyBalance(token.amount.$numberDecimal, 24, 2)
		} else if (token && token.price) {
			return prettyBalance(token.price, 24, 2)
		} else {
			return '---'
		}
	}

	const fetchOwnedDate = async () => {
		try {
			const resp = await cachios.get(`${process.env.V2_API_URL}/activities`, {
				params: {
					contract_id: token.contract_id,
					token_id: token.token_id,
					type: 'nft_transfer',
					to: token.owner_id,
					__limit: 1,
					__sort: '_id::-1',
				},
			})

			const newData = resp.data.data.results[0] || null
			setOwnedDate(newData.issued_at)
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	return (
		<>
			<div className="col-span-4 inline-flex items-center w-full py-2">
				<ProfileImageBadge
					imgUrl={profile.imgUrl}
					level={profile?.level}
					className="w-8 h-8 rounded-lg"
				/>
				<div className="flex flex-col justify-between items-stretch ml-2">
					<Link href={`/${token.owner_id}`}>
						<a>
							<p className="text-xs font-bold mb-2 text-neutral-10">
								{prettyTruncate(token.owner_id, 12, 'address')}
							</p>
						</a>
					</Link>
					<Link
						href={`/token/${token.contract_id}::${encodeURIComponent(token.token_series_id)}/${
							token.token_id && encodeURIComponent(token.token_id)
						}`}
					>
						<a className="text-xs font-thin text-neutral-10 truncate">
							{token.contract_id === process.env.NFT_CONTRACT_ID
								? `${localeLn('Edition')} #${token.edition_id}`
								: `${prettyTruncate(token.token_id, 5)}`}
						</a>
					</Link>
				</div>
			</div>
			<div className="col-span-2 flex flex-col py-3">
				{token.price ? (
					<p className="text-md text-left text-neutral-10 font-bold">
						{checkTokenPrice().toString()} Ⓝ
					</p>
				) : (
					<div className="line-through text-red-600">
						<p className="text-lg font-bold text-gray-100">{localeLn('SALE')}</p>
					</div>
				)}
			</div>
			<div className="col-span-3 inline-flex py-4">
				<p className="text-xs text-neutral-10">
					{new Date(ownedDate).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})}{' '}
				</p>
			</div>
			<div className="col-span-3 inline-flex py-4 justify-end">
				{currentUser !== token.owner_id && token.price && token.is_auction && (
					<Button variant="second" size={'sm'} onClick={onShowBidModal}>
						Bid
					</Button>
				)}
				{currentUser !== token.owner_id && !token.price && (
					<Button variant="second" size={'sm'} onClick={onShowOfferModal}>
						Offer
					</Button>
				)}
				{currentUser !== token.owner_id && token.price && (
					<Button variant="second" size={'sm'} onClick={onShowBuyModal}>
						Buy Now
					</Button>
				)}
				{currentUser === token.owner_id && (
					<Button variant="second" size={'sm'} onClick={onShowUpdateListingModal}>
						Update
					</Button>
				)}
			</div>
			<div className="col-span-12 border-b border-b-neutral-04 mb-2"></div>
		</>
	)
}

export default TabOwnersSecond
