import axios from 'axios'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import Card from '../../components/Card'
import Nav from '../../components/Nav'
import Modal from '../../components/Modal'
import near from '../../lib/near'
import useStore from '../../store'
import { parseImgUrl, prettyBalance } from '../../utils/common'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import JSBI from 'jsbi'
import Head from 'next/head'

const TokenDetail = ({ token }) => {
	const store = useStore()
	const router = useRouter()
	const copyLinkRef = useRef()
	const { errors, register, handleSubmit, watch, getValues } = useForm({
		defaultValues: {
			buyQuantity: 1,
		},
	})

	const [activeTab, setActiveTab] = useState('owners')
	const [showModal, setShowModal] = useState('')
	const [isComponentMounted, setIsComponentMounted] = useState(false)

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [chosenSeller, setChosenSeller] = useState(null)
	const [isCopied, setIsCopied] = useState(false)

	useEffect(() => setIsComponentMounted(true), [])

	const _buy = async (data) => {
		//   ownerId: AccountId,
		// tokenId: TokenId,
		// quantity: u128
		const params = {
			ownerId: chosenSeller.ownerId,
			tokenId: chosenSeller.tokenId,
			quantity: data.buyQuantity,
		}

		const attachedDeposit = JSBI.multiply(
			JSBI.BigInt(data.buyQuantity),
			JSBI.BigInt(chosenSeller.marketData.amount)
		)

		try {
			await near.contract.buy(
				params,
				'30000000000000',
				attachedDeposit.toString()
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

	const _removePrice = async () => {
		// 	 export function updateMarketData(
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

	const _copyLink = () => {
		const copyText = copyLinkRef.current
		copyText.select()
		copyText.setSelectionRange(0, 99999)
		document.execCommand('copy')

		setIsCopied(true)

		setTimeout(() => {
			setShowModal(false)
			setIsCopied(false)
		}, 1500)
	}

	return (
		<div
			className="min-h-screen bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Head>
				<title>{`${token.metadata.name} — Paras`}</title>
				<meta
					name="description"
					content={token.metadata.description}
				/>

				<meta name="twitter:title" content={`${token.metadata.name} — Paras`} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta
					name="twitter:description"
					content={token.metadata.description}
				/>
				<meta
					name="twitter:image"
					content={parseImgUrl(token.metadata.image)}
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`${token.metadata.name} - Paras`} />
				<meta
					property="og:site_name"
					content={`${token.metadata.name} — Paras`}
				/>
				<meta
					property="og:description"
					content={token.metadata.description}
				/>
				<meta
					property="og:image"
					content={parseImgUrl(token.metadata.image)}
				/>
			</Head>
			<Nav />
			{isComponentMounted && (
				<div
					className="absolute z-0 opacity-0"
					style={{
						top: `-1000`,
					}}
				>
					<input
						ref={copyLinkRef}
						readOnly
						type="text"
						value={window.location.href}
					/>
				</div>
			)}
			{showModal === 'options' && (
				<Modal close={(_) => setShowModal('')}>
					<div className="max-w-sm w-full px-4 py-2 bg-white m-auto rounded-md">
						<div className="py-2 cursor-pointer" onClick={(_) => _copyLink()}>
							{isCopied ? `Copied` : `Copy Link`}
						</div>
						{_getUserOwnership(store.currentUser) &&
							_getUserOwnership(store.currentUser).quantity > 0 && (
								<div
									className="py-2 cursor-pointer"
									onClick={(_) => setShowModal('addUpdateListing')}
								>
									Update My Listing
								</div>
							)}
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
									<p className="text-sm mt-2">
										Receive:{' '}
										{parseFloat(
											Number(getValues('amount', 0) * 0.95)
												.toPrecision(4)
												.toString()
										)}{' '}
										Ⓝ (~$
										{parseFloat(
											Number(store.nearUsdPrice * getValues('amount', 0) * 0.95)
												.toPrecision(4)
												.toString()
										)}
										)
									</p>
									<p className="text-sm">
										Fee:{' '}
										{parseFloat(
											Number(getValues('amount', 0) * 0.05)
												.toPrecision(4)
												.toString()
										)}{' '}
										Ⓝ (~$
										{parseFloat(
											Number(store.nearUsdPrice * getValues('amount', 0) * 0.05)
												.toPrecision(4)
												.toString()
										)}
										)
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
			{showModal === 'confirmBuy' && (
				<Modal
					close={(_) => setShowModal('')}
					closeOnBgClick={false}
					closeOnEscape={false}
				>
					<div className="max-w-sm w-full p-4 bg-white m-auto rounded-md">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 tracking-tight">
								Confirm Buy
							</h1>
							<form onSubmit={handleSubmit(_buy)}>
								<div className="mt-4">
									<label className="block text-sm">
										Buy quantity (Available: {chosenSeller.marketData.quantity})
									</label>
									<input
										type="number"
										name="buyQuantity"
										ref={register({
											required: true,
											min: 1,
											max: chosenSeller.marketData.quantity,
										})}
										className={`${errors.buyQuantity && 'error'}`}
										placeholder="Number of card(s) to buy"
									/>
									<div className="mt-2 text-sm text-red-500">
										{errors.buyQuantity?.type === 'required' &&
											`Buy quantity is required`}
										{errors.buyQuantity?.type === 'min' && `Minimum 1`}
										{errors.buyQuantity?.type === 'max' &&
											`Must be less than available`}
									</div>
								</div>
								<div className="mt-4 text-center">
									<p className="text-gray-800 text-xs">Total</p>
									<div className="text-2xl">
										<p>
											{prettyBalance(
												chosenSeller.marketData.amount *
													watch('buyQuantity' || 0),
												24,
												6
											)}{' '}
											Ⓝ
										</p>
									</div>
									<p className="text-sm">
										~$
										{prettyBalance(
											store.nearUsdPrice *
												chosenSeller.marketData.amount *
												watch('buyQuantity' || 0),
											24,
											6
										)}
									</p>
								</div>
								<p className="mt-4 text-sm text-center">
									You will be redirected to NEAR Web Wallet to confirm your
									transaction
								</p>
								<div className="">
									<button
										className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-white"
										type="submit"
									>
										Buy
									</button>
									<button
										disabled={isSubmitting}
										className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary text-primary"
										onClick={(_) => {
											setChosenSeller(null)
											setShowModal(false)
										}}
									>
										Cancel
									</button>
								</div>
							</form>
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
							imgUrl={parseImgUrl(token.metadata.image)}
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
						<div
							className="cursor-pointer"
							onClick={(_) => setShowModal('options')}
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M20 12C20 13.1046 19.1046 14 18 14C16.8954 14 16 13.1046 16 12C16 10.8954 16.8954 10 18 10C19.1046 10 20 10.8954 20 12Z"
									fill="black"
								/>
								<path
									d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
									fill="black"
								/>
								<path
									d="M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12Z"
									fill="black"
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

												<button
													onClick={(_) => {
														setChosenSeller(ownership)
														setShowModal('confirmBuy')
													}}
												>
													Buy
												</button>
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
