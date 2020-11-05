import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import Card from './Card'
import Modal from './Modal'
import near from '../lib/near'
import useStore from '../store'
import { parseDate, parseImgUrl, prettyBalance, timeAgo } from '../utils/common'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import JSBI from 'jsbi'
import axios from 'axios'
import { useToast } from '../hooks/useToast'

const Ownership = ({ ownership, onBuy, onUpdateListing }) => {
	const store = useStore()
	const [profile, setProfile] = useState({})

	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = async () => {
		try {
			const resp = await axios.get(
				`${process.env.API_URL}/profiles?accountId=${ownership.ownerId}`
			)
			if (resp.data.data.results.length > 0) {
				setProfile(resp.data.data.results[0])
			}
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div className="border-2 border-dashed mt-4 p-2 rounded-md">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<Link href={`/${ownership.ownerId}`}>
						<div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer bg-primary">
							<img className="object-cover" src={parseImgUrl(profile.imgUrl)} />
						</div>
					</Link>
					<div className="pl-2">
						<Link href={`/${ownership.ownerId}`}>
							<a className="flex text-gray-900 font-semibold cursor-pointer">
								{ownership.ownerId}
							</a>
						</Link>
					</div>
				</div>
				<div>
					<span className="text-sm text-gray-800">owns </span>
					{ownership.quantity}
				</div>
			</div>
			{ownership.marketData ? (
				<div className="flex justify-between mt-2 items-center">
					<div>
						<p className="flex items-center">
							On sale {prettyBalance(ownership.marketData.amount, 24, 4)} Ⓝ (
							<span>
								<span className="text-sm text-gray-800">Qty.</span>{' '}
								{ownership.marketData.quantity}
							</span>
							)
						</p>
					</div>
					<div>
						{store.currentUser && store.currentUser === ownership.ownerId ? (
							<button
								className="text-primary font-semibold"
								onClick={onUpdateListing}
							>
								Update
							</button>
						) : (
							<button
								disabled={
									store.currentUser === ownership.ownerId || !store.currentUser
								}
								className="text-primary font-semibold"
								onClick={onBuy}
							>
								Buy
							</button>
						)}
					</div>
				</div>
			) : (
				<div className="flex justify-between mt-2 items-center">
					<div>
						<p className="flex items-center">Not for sale</p>
					</div>
					{store.currentUser && store.currentUser === ownership.ownerId && (
						<button
							className="text-primary font-semibold"
							onClick={onUpdateListing}
						>
							Update
						</button>
					)}
				</div>
			)}
		</div>
	)
}

const CardDetail = ({ token }) => {
	const store = useStore()
	const router = useRouter()
	const toast = useToast()
	const copyLinkRef = useRef()
	const [localToken, setLocalToken] = useState(token)

	const { errors, register, handleSubmit, watch, getValues } = useForm({
		defaultValues: {
			buyQuantity: 1,
		},
	})

	const [activeTab, setActiveTab] = useState('info')
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

	const _transfer = async (data) => {
		// ownerId: AccountId,
		// newOwnerId: AccountId,
		// tokenId: TokenId,
		// quantity: u128

		setIsSubmitting(true)
		const params = {
			ownerId: store.currentUser,
			newOwnerId: data.newOwnerId,
			tokenId: router.query.id,
			quantity: data.transferQuantity,
		}

		try {
			await near.contract.transferFrom(params)

			// update local state
			const ownerIdx = localToken.ownerships.findIndex(
				(ownership) => ownership.ownerId === params.ownerId
			)
			const newOwnerIdx = localToken.ownerships.findIndex(
				(ownership) => ownership.ownerId === params.newOwnerId
			)
			const newLocalToken = { ...localToken }

			const ownerQuantity = parseInt(
				newLocalToken.ownerships[ownerIdx].quantity
			)

			newLocalToken.ownerships[ownerIdx].quantity =
				ownerQuantity - parseInt(params.quantity)

			// if owns 0, delete ownership
			if (newLocalToken.ownerships[ownerIdx].quantity === 0) {
				newLocalToken.ownerships.splice(ownerIdx, 1)
			}

			// if new owner already own some
			if (newOwnerIdx > -1) {
				const newOwnerQuantity = parseInt(
					newLocalToken.ownerships[newOwnerIdx].quantity
				)
				newLocalToken.ownerships[newOwnerIdx].quantity =
					newOwnerQuantity + parseInt(params.quantity)
			} else {
				newLocalToken.ownerships.push({
					createdAt: new Date().getTime(),
					updatedAt: new Date().getTime(),
					id: `${params.tokenId}::${params.newOwnerId}`,
					ownerId: params.newOwnerId,
					quantity: params.quantity,
					tokenId: params.tokenId,
				})
			}

			setLocalToken(newLocalToken)
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						Transfer success
					</div>
				),
				type: 'success',
				duration: 2500,
			})

			setShowModal(false)
		} catch (err) {
			console.log(err)
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						Something went wrong, try again later
					</div>
				),
				type: 'error',
				duration: 2500,
			})
		}

		setIsSubmitting(false)
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

			// update local state
			const idx = localToken.ownerships.findIndex(
				(ownership) => ownership.ownerId === store.currentUser
			)
			const newLocalToken = { ...localToken }

			if (params.quantity > 0) {
				newLocalToken.ownerships[idx].marketData = {
					quantity: params.quantity,
					amount: params.amount,
				}
			} else {
				delete newLocalToken.ownerships[idx].marketData
			}

			setLocalToken(newLocalToken)
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						Listing update success
					</div>
				),
				type: 'success',
				duration: 2500,
			})

			setShowModal(false)
		} catch (err) {
			console.log(err)
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						Something went wrong, try again later
					</div>
				),
				type: 'error',
				duration: 2500,
			})
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
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						Something went wrong, try again later
					</div>
				),
				type: 'error',
				duration: 2500,
			})
		}
	}

	const _getUserOwnership = (userId) => {
		const ownership = localToken.ownerships.find(
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
		<div className="w-full">
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
					<div className="max-w-sm w-full px-4 py-2 bg-gray-100 m-auto rounded-md">
						<div className="py-2 cursor-pointer" onClick={(_) => _copyLink()}>
							{isCopied ? `Copied` : `Copy Link`}
						</div>
						{_getUserOwnership(store.currentUser) &&
							_getUserOwnership(store.currentUser).quantity > 0 && (
								<div
									className="py-2 cursor-pointer"
									onClick={(_) => setShowModal('confirmTransfer')}
								>
									Transfer
								</div>
							)}
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
					<div className="max-w-sm w-full p-4 bg-gray-100 m-auto rounded-md">
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
											step="any"
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
											Number(watch('amount', 0) * 0.95)
												.toPrecision(4)
												.toString()
										)}{' '}
										Ⓝ (~$
										{parseFloat(
											Number(store.nearUsdPrice * watch('amount', 0) * 0.95)
												.toPrecision(4)
												.toString()
										)}
										)
									</p>
									<p className="text-sm">
										Fee:{' '}
										{parseFloat(
											Number(watch('amount', 0) * 0.05)
												.toPrecision(4)
												.toString()
										)}{' '}
										Ⓝ (~$
										{parseFloat(
											Number(store.nearUsdPrice * watch('amount', 0) * 0.05)
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
										className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
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
					<div className="max-w-sm w-full px-4 bg-gray-100 m-auto rounded-md">
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
					<div className="max-w-sm w-full p-4 bg-gray-100 m-auto rounded-md">
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
										className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
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
			{showModal === 'confirmTransfer' && (
				<Modal
					close={(_) => setShowModal('')}
					closeOnBgClick={false}
					closeOnEscape={false}
				>
					<div className="max-w-sm w-full p-4 bg-gray-100 m-auto rounded-md">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 tracking-tight">
								Confirm Transfer
							</h1>
							<form onSubmit={handleSubmit(_transfer)}>
								<div className="mt-4">
									<label className="block text-sm">Address (Account ID)</label>
									<input
										type="text"
										name="newOwnerId"
										ref={register({
											required: true,
										})}
										className={`${errors.newOwnerId && 'error'}`}
										placeholder="New Owner Address"
									/>
									<div className="mt-2 text-sm text-red-500">
										{errors.newOwnerId?.type === 'required' &&
											`Address is required`}
									</div>
								</div>
								<div className="mt-4">
									<label className="block text-sm">
										Quantity (Available:{' '}
										{_getUserOwnership(store.currentUser)
											? _getUserOwnership(store.currentUser).quantity -
											  (_getUserOwnership(store.currentUser).marketData
													?.quantity || 0)
											: 0}
										)
									</label>
									<input
										type="number"
										name="transferQuantity"
										ref={register({
											required: true,
											min: 1,
											max: _getUserOwnership(store.currentUser)
												? _getUserOwnership(store.currentUser).quantity -
												  (_getUserOwnership(store.currentUser).marketData
														?.quantity || 0)
												: 0,
										})}
										className={`${errors.transferQuantity && 'error'}`}
										placeholder="Number of card(s) to transfer"
									/>
									<div className="mt-2 text-sm text-red-500">
										{errors.transferQuantity?.type === 'required' &&
											`Quantity is required`}
										{errors.transferQuantity?.type === 'min' && `Minimum 1`}
										{errors.transferQuantity?.type === 'max' &&
											`Must be less than available`}
									</div>
								</div>
								<p className="mt-4 text-sm text-center">
									You will be transfering {watch('transferQuantity') || '-'}{' '}
									card(s) to {watch('newOwnerId') || '-'}
								</p>
								<div className="">
									<button
										disabled={isSubmitting}
										className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
										type="submit"
									>
										Transfer
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
			<div>
				<div
					className="flex flex-wrap h-full rounded-md overflow-hidden"
					style={{
						height: `90vh`,
					}}
				>
					<div className="w-full h-1/2 lg:h-full lg:w-2/3 bg-dark-primary-1 p-8 lg:p-12">
						<div className="h-full">
							<Card
								imgUrl={parseImgUrl(localToken.metadata.image)}
								imgBlur={localToken.metadata.blurhash}
								token={{
									name: localToken.metadata.name,
									collection: localToken.metadata.collection,
									description: localToken.metadata.description,
									creatorId: localToken.creatorId,
									supply: localToken.supply,
									tokenId: localToken.tokenId,
									createdAt: localToken.createdAt,
								}}
								initialRotate={{
									x: 15,
									y: 15,
								}}
							/>
						</div>
					</div>
					<div className="w-full h-1/2 lg:h-full lg:w-1/3 bg-gray-100 p-4 overflow-y-auto">
						<div className="flex justify-between">
							<div>
								<h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight pr-4 break-all">
									{localToken.metadata.name}
								</h1>
								<p className="text-sm">
									by{' '}
									<span className="font-semibold">
										<Link href={`/${localToken.creatorId}`}>
											{localToken.creatorId}
										</Link>
									</span>
								</p>
							</div>
							<div>
								<svg
									className="cursor-pointer"
									onClick={(_) => setShowModal('options')}
									width="18"
									height="18"
									viewBox="0 0 29 7"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<rect
										width="6.78723"
										height="6.78723"
										rx="2"
										transform="matrix(1 0 0 -1 0 6.78711)"
										fill="black"
									/>
									<rect
										width="6.78723"
										height="6.78723"
										rx="2"
										transform="matrix(1 0 0 -1 11.1064 6.78711)"
										fill="black"
									/>
									<rect
										width="6.78723"
										height="6.78723"
										rx="2"
										transform="matrix(1 0 0 -1 22.2126 6.78711)"
										fill="black"
									/>
								</svg>
							</div>
						</div>

						<div className="flex mt-2 -mx-4">
							<div className="px-4">
								<div
									className="cursor-pointer relative font-semibold"
									onClick={(_) => setActiveTab('info')}
								>
									Info
									{activeTab === 'info' && (
										<div
											className="absolute left-0 right-0"
											style={{
												bottom: `0`,
											}}
										>
											<div className="mx-auto w-4 h-1 bg-gray-900"></div>
										</div>
									)}
								</div>
							</div>
							<div className="px-4">
								<div
									className="cursor-pointer relative font-semibold"
									onClick={(_) => setActiveTab('owners')}
								>
									Owners
									{activeTab === 'owners' && (
										<div
											className="absolute left-0 right-0"
											style={{
												bottom: `0`,
											}}
										>
											<div className="mx-auto w-4 h-1 bg-gray-900"></div>
										</div>
									)}
								</div>
							</div>
							<div className="px-4">
								<div
									className="cursor-pointer relative font-semibold"
									onClick={(_) => setActiveTab('history')}
								>
									History
									{activeTab === 'history' && (
										<div
											className="absolute left-0 right-0"
											style={{
												bottom: `0`,
											}}
										>
											<div className="mx-auto w-4 h-1 bg-gray-900"></div>
										</div>
									)}
								</div>
							</div>
						</div>

						{activeTab === 'info' && (
							<div>
								<div className="border-2 border-dashed mt-4 p-2 rounded-md">
									<p className="text-sm text-gray-800">Collection</p>
									<p className="text">{localToken.metadata.collection}</p>
								</div>
								<div className="border-2 border-dashed mt-4 p-2 rounded-md">
									<p className="text-sm text-gray-800">Description</p>
									<p className="text">{localToken.metadata.description}</p>
								</div>
								<div className="border-2 border-dashed mt-4 p-2 rounded-md">
									<p className="text-sm text-gray-800">Created</p>
									<p className="text">
										{parseDate(localToken.metadata.createdAt)}
									</p>
								</div>
							</div>
						)}

						{activeTab === 'owners' && (
							<div>
								{localToken.ownerships.map((ownership, idx) => {
									return (
										<Ownership
											onUpdateListing={(_) => {
												setShowModal('addUpdateListing')
											}}
											onBuy={(_) => {
												setChosenSeller(ownership)
												setShowModal('confirmBuy')
											}}
											ownership={ownership}
											key={idx}
										/>
									)
								})}
							</div>
						)}

						{activeTab === 'history' && (
							<div>
								{localToken.transactions.length === 0 && (
									<div className="border-2 border-dashed mt-4 p-2 rounded-md text-center">
										<p className="text-gray-300 py-8">No Transactions</p>
									</div>
								)}
								{localToken.transactions.map((tx, idx) => {
									return (
										<div
											key={idx}
											className="border-2 border-dashed mt-4 p-2 rounded-md"
										>
											<p>
												<Link href={`/${tx.buyer}`}>
													<a className="font-semibold">{tx.buyer}</a>
												</Link>
												<span> bought {tx.quantity} from </span>
												<Link href={`/${tx.owner}`}>
													<a className="font-semibold">{tx.owner}</a>
												</Link>
												<span> for </span>
												{prettyBalance(tx.amount, 24, 4)} Ⓝ
											</p>
											<p className="mt-1 text-sm">
												{timeAgo.format(tx.createdAt)}
											</p>
										</div>
									)
								})}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default CardDetail
