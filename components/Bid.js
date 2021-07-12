import Axios from 'axios'
import JSBI from 'jsbi'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import AcceptBidModal from '../components/AcceptBidModal'
import Card from '../components/Card'
import CardDetailModal from '../components/CardDetailModal'
import Modal from '../components/Modal'
import PlaceBidModal from '../components/PlaceBidModal'
import { useToast } from '../hooks/useToast'
import near from '../lib/near'
import useStore from '../store'
import { parseImgUrl, prettyBalance, timeAgo } from '../utils/common'

const Bid = ({ tokenId, data, updateBidData }) => {
	const store = useStore()
	const toast = useToast()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [token, setToken] = useState(null)
	const [showModal, setShowModal] = useState('')

	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = async () => {
		const resp = await Axios.get(
			`${process.env.API_URL}/tokens?tokenId=${tokenId}`
		)
		setToken(resp.data.data.results[0])
	}

	const acceptBid = async () => {
		const userOwnership = getUserOwnership(store.currentUser)
		const quantity =
			data.bidMarketData.quantity > userOwnership.quantity
				? userOwnership.quantity.toString()
				: data.bidMarketData.quantity.toString()
		const params = {
			ownerId: data.accountId,
			tokenId: token.tokenId,
			quantity: quantity,
		}

		if (
			userOwnership.marketData &&
			quantity >
				userOwnership.quantity - parseInt(userOwnership.marketData.quantity)
		) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						Please make sure that your card is not on sale to accept the bid
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			return
		}

		setIsLoading(true)
		try {
			await near.contract.acceptBidMarketData(params, '50000000000000')
			const balance = await near.wallet.account().getAccountBalance()
			store.setUserBalance(balance)

			setIsLoading(false)
			setShowModal('')
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						You successfully accepted the bid from {data.accountId}.
					</div>
				),
				type: 'success',
				duration: 2500,
			})
			updateBidData(data.id)
		} catch (err) {
			const msg =
				err.response?.data?.message || 'Something went wrong, try again later.'

			toast.show({
				text: <div className="font-semibold text-center text-sm">{msg}</div>,
				type: 'error',
				duration: 2500,
			})
			setIsLoading(false)
		}
	}

	const updateBid = async (data) => {
		const params = {
			ownerId: store.currentUser,
			tokenId: token.tokenId,
			quantity: data.bidQuantity,
			amount: parseNearAmount(data.bidAmount),
		}

		const attachedDeposit = JSBI.add(
			JSBI.multiply(
				JSBI.BigInt(data.bidQuantity),
				JSBI.BigInt(parseNearAmount(data.bidAmount))
			),
			JSBI.BigInt(parseNearAmount('0.003'))
		)

		if (
			JSBI.lessThan(JSBI.BigInt(store.userBalance.available), attachedDeposit)
		) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						Insufficient Balance
						<p className="mt-2">
							Available {prettyBalance(store.userBalance.available, 24, 6)} Ⓝ
						</p>
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			setIsLoading(false)
			return
		}

		setIsLoading(true)
		await cancelBid(false)
		try {
			await near.contract.addBidMarketData(
				params,
				'50000000000000',
				attachedDeposit.toString()
			)
		} catch (err) {
			console.log(err)
		}
	}

	const cancelBid = async (updateData = true) => {
		const params = {
			ownerId: data.accountId,
			tokenId: token.tokenId,
		}
		setIsLoading(true)
		try {
			await near.contract.deleteBidMarketData(params, '50000000000000')
			updateData && setIsLoading(false)
			updateData && updateBidData(data.id)
			updateData &&
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							Your bid has been deleted
						</div>
					),
					type: 'success',
					duration: 2500,
				})
			const balance = await near.wallet.account().getAccountBalance()
			store.setUserBalance(balance)
		} catch (err) {
			const msg =
				err.response?.data?.message || 'Something went wrong, try again later.'
			toast.show({
				text: <div className="font-semibold text-center text-sm">{msg}</div>,
				type: 'error',
				duration: 2500,
			})
			setIsLoading(false)
		}
	}

	const getUserOwnership = (userId) => {
		if (token) {
			const ownership = token.ownerships.find(
				(ownership) => ownership.ownerId === userId
			)
			return ownership
		}
		return null
	}

	return (
		<>
			<CardDetailModal tokens={[token]} />
			{showModal === 'acceptBid' && (
				<AcceptBidModal
					data={data}
					isLoading={isLoading}
					onClose={() => setShowModal('')}
					onSubmitForm={acceptBid}
					token={token}
					userOwnership={getUserOwnership(store.currentUser)}
				/>
			)}
			{showModal === 'updateBid' && (
				<PlaceBidModal
					isUpdate={true}
					bidAmount={prettyBalance(data.bidMarketData.amount, 24, 4)}
					bidQuantity={data.bidMarketData.quantity}
					isSubmitting={isLoading}
					localToken={token}
					onCancel={() => setShowModal('')}
					onSubmitForm={updateBid}
				/>
			)}
			{showModal === 'cancelBid' && (
				<Modal
					close={() => setShowModal('')}
					closeOnBgClick={false}
					closeOnEscape={false}
				>
					<div className="w-full max-w-xs p-4 m-auto bg-gray-100 rounded-md overflow-y-auto max-h-screen">
						<div className="w-full">Are you sure to delete your bids?</div>
						<div className="flex space-x-4">
							<button
								disabled={isLoading}
								className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
								onClick={cancelBid}
							>
								{isLoading ? 'Deleting...' : 'Delete'}
							</button>
							<button
								disabled={isLoading}
								className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-white text-primary"
								onClick={() => setShowModal('')}
							>
								Cancel
							</button>
						</div>
					</div>
				</Modal>
			)}
			<div className="border-2 border-dashed my-4 p-4 md:py-6 md:px-8 rounded-md border-gray-800">
				<div className="flex items-center">
					<div className="w-40 h-full">
						<Card
							imgUrl={parseImgUrl(token?.metadata?.image)}
							imgBlur={token?.metadata?.blurhash}
							token={{
								name: token?.metadata?.name,
								collection: token?.metadata?.collection,
								description: token?.metadata?.description,
								creatorId: token?.creatorId,
								supply: token?.supply,
								tokenId: token?.tokenId,
								createdAt: token?.createdAt,
							}}
							initialRotate={{
								x: 0,
								y: 0,
							}}
							disableFlip={true}
						/>
					</div>
					<div className="flex-1 md:flex ml-4 md:ml-6 justify-between items-center">
						<div className="text-gray-100 truncate cursor-pointer">
							<Link
								href={{
									pathname: router.pathname,
									query: {
										...router.query,
										...{ tokenId: token?.tokenId },
										...{ prevAs: router.asPath },
									},
								}}
								as={`/token/${token?.tokenId}`}
								scroll={false}
								shallow
							>
								<div className="font-bold text-2xl">
									{token?.metadata?.name}
								</div>
							</Link>
							<p className="opacity-75">{token?.metadata?.collection}</p>
							<div className="mt-4 mb-6">
								{`Bid ${prettyBalance(
									data.bidMarketData.amount,
									24,
									4
								)} Ⓝ for ${data.bidMarketData.quantity} pcs`}
							</div>
							<p className="mt-2 text-sm opacity-50 mb-6 md:mb-0">
								{token && timeAgo.format(data.createdAt)}
							</p>
						</div>
						<div className="flex flex-col">
							{getUserOwnership(store.currentUser) &&
							store.currentUser !== data.accountId ? (
								<button
									onClick={() => setShowModal('acceptBid')}
									className="font-semibold w-32 rounded-md border-2 border-primary bg-primary text-white mb-2"
								>
									Accept
								</button>
							) : (
								<>
									<button
										onClick={() => setShowModal('updateBid')}
										className="font-semibold w-32 rounded-md border-2 border-primary bg-primary text-white mb-2"
									>
										Update
									</button>
									<button
										className="font-semibold w-32 rounded-md border-2 bg-red-600 text-white border-red-600 mb-2"
										onClick={() => setShowModal('cancelBid')}
									>
										Cancel
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
