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

const TokenDetail = ({ token }) => {
	const store = useStore()
	const router = useRouter()

	const [listingQuantity, setListingQuantity] = useState(0)
	const [listingPrice, setListingPrice] = useState('')
	const [activeTab, setActiveTab] = useState('owners')
	const [showModal, setShowModal] = useState('')

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

	const _updatePrice = async (ownership) => {
		// export function updateMarketData(
		//   ownerId: AccountId,
		//   tokenId: TokenId,
		//   quantity: u128,
		//   amount: u128
		const params = {
			ownerId: store.currentUser,
			tokenId: router.query.id,
			quantity: listingQuantity.toString(),
			amount: parseNearAmount(listingPrice),
		}

		try {
			await near.contract.updateMarketData(params)
		} catch (err) {
			console.log(err)
		}
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

	console.log(token)

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
							className="py-2"
							onClick={(_) => setShowModal('addUpdateListing')}
						>
							Add/Update listing
						</div>
						<div
							className="pb-2"
							onClick={(_) => setShowModal('removeListing')}
						>
							Remove listing
						</div>
					</div>
				</Modal>
			)}
			{showModal === 'addUpdateListing' && (
				<Modal close={(_) => setShowModal('')}>
					<div className="max-w-sm w-full px-4 bg-white m-auto rounded-md">
						<div>
							<p>Add/update listing</p>
							<div>
								<label>Quantity</label>
								<input
									type="number"
									value={listingQuantity}
									onChange={(e) => setListingQuantity(e.target.value)}
								/>
							</div>
							<div>
								<label>Price</label>
								<input
									type="string"
									value={listingPrice}
									onChange={(e) => setListingPrice(e.target.value)}
								/>
							</div>
							<button onClick={_updatePrice}>Update Listing</button>
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
									fill="#E2E2E2"
								/>
								<path
									d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
									fill="#E2E2E2"
								/>
								<path
									d="M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12Z"
									fill="#E2E2E2"
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
