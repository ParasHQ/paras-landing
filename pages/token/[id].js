import axios from 'axios'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Card from '../../components/Card'
import Nav from '../../components/Nav'
import Modal from '../../components/Modal'
import near from '../../lib/near'
import useStore from '../../store'
import { prettyBalance } from '../../utils/common'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

const TokenDetail = ({ token }) => {
	const store = useStore()
	const router = useRouter()
	const {
		errors,
		register,
		handleSubmit,
		watch,
		setValue,
		getValues,
	} = useForm()

	const [listingQuantity, setListingQuantity] = useState(0)
	const [listingPrice, setListingPrice] = useState('')
	const [activeTab, setActiveTab] = useState('owners')
	const [showModal, setShowModal] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const _buy = async (ownership) => {
		//   ownerId: AccountId,
		// tokenId: TokenId,
		// quantity: u128
		const params = {
			ownerId: ownership.ownerId,
			tokenId: ownership.tokenId,
			quantity: '1',
		}

		try {
			await near.contract.buy(
				params,
				'30000000000000',
				ownership.marketData.amount
			)
		} catch (err) {
			console.log(err)
		}
	}

	const _updatePrice = async () => {
		// export function updateMarketData(
		//   ownerId: AccountId,
		//   tokenId: TokenId,
		//   quantity: u128,
		//   amount: u128

		setIsSubmitting(true)

		const params = {
			ownerId: store.currentUser,
			tokenId: router.query.id,
			quantity: getValues('quantity'),
			amount: parseNearAmount(getValues('amount')),
		}

		try {
			await near.contract.updateMarketData(params)
			setShowModal(false)
		} catch (err) {
			console.log(err)
		}

		setIsSubmitting(false)
	}

	const _removePrice = async (ownership) => {
		// export function updateMarketData(
		//   ownerId: AccountId,
		//   tokenId: TokenId,
		//   quantity: u128,
		//   amount: u128
		const params = {
			ownerId: store.currentUser,
			tokenId: router.query.id,
		}

		try {
			await near.contract.deleteMarketData(params)
		} catch (err) {
			console.log(err)
		}
	}

	const _getUserOwnership = (userId) => {
		const ownership = token.ownerships.find(
			(ownership) => ownership.ownerId === userId
		)
		return ownership
	}

	return (
		<div
			className="min-h-screen bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Nav />
			{showModal === 'options' && (
				<Modal close={(_) => setShowModal('')}>
					<div className="max-w-sm w-full px-4 bg-white m-auto rounded-md">
						<div
							className="py-2 cursor-pointer"
							// onClick={(_) => setShowModal('addUpdateListing')}
						>
							Copy Link
						</div>
						<div
							className="py-2 cursor-pointer"
							// onClick={(_) => setShowModal('addUpdateListing')}
						>
							Buy
						</div>
						<div
							className="py-2 cursor-pointer"
							onClick={(_) => setShowModal('addUpdateListing')}
						>
							Sell
						</div>
					</div>
				</Modal>
			)}
			{showModal === 'addUpdateListing' && (
				<Modal
					close={(_) => setShowModal('')}
					closeOnBgClick={false}
					closeOnEscape={false}
				>
					<div className="max-w-sm w-full p-4 bg-white m-auto rounded-md">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 tracking-tight">
								Card Listing
							</h1>
							<form onSubmit={handleSubmit(_updatePrice)}>
								<div className="mt-4">
									<label className="block text-sm">
										Sale quantity (Owned:{' '}
										{_getUserOwnership(store.currentUser)
											? _getUserOwnership(store.currentUser).quantity
											: 0}
										)
									</label>
									<input
										type="number"
										name="quantity"
										ref={register({
											required: true,
											min: 0,
											max: _getUserOwnership(store.currentUser)
												? _getUserOwnership(store.currentUser).quantity
												: 0,
										})}
										className={`${errors.quantity && 'error'}`}
										placeholder="Number of card on sale"
									/>
									<div className="mt-2 text-sm text-red-500">
										{errors.quantity?.type === 'required' &&
											`Sale quantity is required`}
										{errors.quantity?.type === 'min' && `Minimum 0`}
										{errors.quantity?.type === 'max' &&
											`Must be less than owned`}
									</div>
								</div>
								<div className="mt-4">
									<label className="block text-sm">Sale price</label>
									<div
										className={`flex justify-between bg-gray-300 p-2 rounded-md focus:bg-gray-100 border-2 border-transparent focus:border-dark-primary-1 w-full ${
											errors.amount && 'error'
										}`}
									>
										<input
											type="number"
											name="amount"
											ref={register({
												required: true,
												min: 0,
											})}
											className="clear pr-2"
											placeholder="Card price per pcs"
										/>
										<div className="inline-block">Ⓝ</div>
									</div>
									<p>
										~$
										{Number(
											store.nearUsdPrice * (watch('amount') || 0)
										).toPrecision(6)}
									</p>
									<div className="mt-2 text-sm text-red-500">
										{errors.amount?.type === 'required' &&
											`Sale price is required`}
										{errors.amount?.type === 'min' && `Minimum 0`}
									</div>
								</div>
								<div className="">
									<button
										disabled={isSubmitting}
										className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-white"
										type="submit"
									>
										{!isSubmitting ? 'Create' : 'Creating...'}
									</button>
									<button
										disabled={isSubmitting}
										className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary text-primary"
										onClick={(_) => setShowModal(false)}
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</Modal>
			)}
			{showModal === 'removeListing' && (
				<Modal close={(_) => setShowModal('')}>
					<div className="max-w-sm w-full px-4 bg-white m-auto rounded-md">
						<div>
							<button onClick={_removePrice}>Remove Listing</button>
						</div>
					</div>
				</Modal>
			)}
			<div className="flex flex-wrap ">
				<div className="w-full h-full lg:w-2/3 px-4 bg-dark-primary-1 p-8">
					<div
						style={{
							height: `80vh`,
						}}
					>
						<Card
							imgUrl={token.metadata.image}
							imgBlur={token.metadata.blurhash}
							token={{
								name: token.metadata.name,
								collection: token.metadata.collection,
								description: token.metadata.description,
								creatorId: token.creatorId,
								supply: token.supply,
								tokenId: token.tokenId,
								createdAt: token.createdAt,
							}}
							initialRotate={{
								x: 15,
								y: 15,
							}}
						/>
					</div>
				</div>
				<div className="w-full lg:w-1/3 bg-white p-4">
					<div className="flex justify-between">
						<p className="text-xl">{token.metadata.name}</p>
						<div onClick={(_) => setShowModal('options')}>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M20 12C20 13.1046 19.1046 14 18 14C16.8954 14 16 13.1046 16 12C16 10.8954 16.8954 10 18 10C19.1046 10 20 10.8954 20 12Z"
									fill="rbg(0,0,0)"
								/>
								<path
									d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
									fill="rbg(0,0,0)"
								/>
								<path
									d="M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12Z"
									fill="rbg(0,0,0)"
								/>
							</svg>
						</div>
					</div>

					<div className="flex -mx-4">
						<div className="px-4">
							<p
								className="cursor-pointer"
								onClick={(_) => setActiveTab('info')}
							>
								Info
							</p>
						</div>
						<div className="px-4">
							<p onClick={(_) => setActiveTab('owners')}>Owners</p>
						</div>
						<div className="px-4">
							<p onClick={(_) => setActiveTab('history')}>History</p>
						</div>
					</div>

					{activeTab === 'info' && (
						<div>
							<p className="text-sm">Collection</p>
							<p className="text">{token.metadata.collection}</p>

							<p className="text-sm">Description</p>
							<p className="text">{token.metadata.description}</p>
						</div>
					)}

					{activeTab === 'owners' && (
						<div>
							{token.ownerships.map((ownership, idx) => {
								return (
									<div className="mt-4">
										<div>
											<Link href={`/${ownership.ownerId}`}>
												{ownership.ownerId}
											</Link>
											have
											{ownership.quantity}
										</div>
										{ownership.marketData && (
											<div>
												<p>
													is selling for{' '}
													{prettyBalance(ownership.marketData.amount, 24, 4)}
												</p>
												<p>Available {ownership.marketData.quantity}</p>

												<button onClick={(_) => _buy(ownership)}>Buy</button>
											</div>
										)}
									</div>
								)
							})}
						</div>
					)}

					{activeTab === 'history' && (
						<div>
							{token.transactions.map((tx) => {
								console.log(tx)
								return (
									<div>
										{tx.buyer} bought {tx.quantity} from {tx.owner} for{' '}
										{prettyBalance(tx.amount, 24, 4)}
									</div>
								)
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export async function getServerSideProps({ params }) {
	const res = await axios(`http://localhost:9090/tokens?tokenId=${params.id}`)
	const token = await res.data.data.results[0]

	return { props: { token } }
}

export default TokenDetail
