import Axios from 'axios'
import { useState } from 'react'
import { useToast } from '../hooks/useToast'
import near from '../lib/near'
import useStore from '../store'
import { parseImgUrl } from '../utils/common'
import Card from './Card'
import Modal from './Modal'

const AddCategoryModal = ({ onClose, categoryName, categoryId, curators }) => {
	const [tokenId, setTokenId] = useState('')
	const [tokenData, setTokenData] = useState(null)
	const [page, setPage] = useState(1)
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()
	const store = useStore()

	const fetchToken = async () => {
		if (isLoading) {
			return
		}

		setIsLoading(true)
		const res = await Axios(`${process.env.API_URL}/tokens?tokenId=${tokenId}`)
		const token = res.data.data.results[0] || null
		if (token && tokenId !== '') {
			setTokenData(token)
			setPage(2)
		} else {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						Please enter correct Token ID
					</div>
				),
				type: 'error',
				duration: 2500,
			})
		}
		setIsLoading(false)
	}

	const submitCard = async () => {
		setIsLoading(true)
		if (
			store.currentUser !== tokenData.creatorId &&
			!curators.includes(store.currentUser)
		) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						You are not the creator of this card
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			setIsLoading(false)
			return
		}

		const query = {
			accountId: store.currentUser,
			tokenId: tokenId,
			categoryId: categoryId,
		}

		try {
			await Axios.post(`${process.env.API_URL}/categories/tokens`, query, {
				headers: {
					authorization: await near.authToken(),
				},
			})
			onClose()
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						<div>Thank you for your submission.</div>
						<div>Submit card succeed.</div>
					</div>
				),
				type: 'success',
				duration: 25000,
			})
			setIsLoading(false)
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

	return (
		<Modal close={onClose} closeOnBgClick={false} closeOnEscape={false}>
			<div className="max-w-xl w-full m-auto bg-dark-primary-1 p-4 text-gray-100 rounded-md relative">
				<div className="flex justify-between">
					<div className="font-bold text-2xl mb-4">
						Submit your card to {categoryName}
					</div>
					<div onClick={onClose}>
						<svg
							className="cursor-pointer"
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M8.00008 9.41423L3.70718 13.7071L2.29297 12.2929L6.58586 8.00001L2.29297 3.70712L3.70718 2.29291L8.00008 6.5858L12.293 2.29291L13.7072 3.70712L9.41429 8.00001L13.7072 12.2929L12.293 13.7071L8.00008 9.41423Z"
								fill="white"
							/>
						</svg>
					</div>
				</div>
				<div className="md:flex md:pl-2 md:space-x-4 md:space-x-6 pb-2 items-center">
					<div className="w-1/2 mb-4 md:mb-0 md:w-1/3 h-full text-black">
						<Card
							imgUrl={parseImgUrl(tokenData?.metadata?.image)}
							imgBlur={tokenData?.metadata?.blurhash || null}
							token={{
								name: tokenData?.metadata?.name || '',
								collection: tokenData?.metadata?.collection || '',
								description: tokenData?.metadata?.description || '',
								creatorId: tokenData?.creatorId || '',
								supply: tokenData?.supply || '',
								tokenId: tokenData?.tokenId || '',
								createdAt: tokenData?.createdAt || '',
							}}
							initialRotate={{
								x: 0,
								y: 0,
							}}
						/>
					</div>
					<div className="md:w-2/3">
						{page === 1 && (
							<div>
								<input
									type="text"
									name="Token"
									onChange={(e) => setTokenId(e.target.value)}
									value={tokenId}
									className={`resize-none h-auto focus:border-gray-100 mb-4 text-black`}
									placeholder="Token ID"
								/>
								<div className="opacity-75 mb-2 text-sm">
									*Curators will review your card submission, please make sure
									that the card is belong to this category.
								</div>
								<div className="opacity-75 mb-6 text-sm">
									*Only the creator that allowed to submit their card
								</div>
								<button
									type="button"
									className="flex justify-end items-center pr-2 float-right"
								>
									<div
										className="rounded-md py-1 font-bold text-lg mr-1"
										onClick={fetchToken}
									>
										Next
									</div>
								</button>
							</div>
						)}
						{page === 2 && (
							<div>
								<div className="text-2xl font-bold">
									{tokenData?.metadata.name}
								</div>
								<div className="mb-6">{tokenData?.metadata.collection}</div>
								<div className="mb-6">
									<span className="opacity-75">You will add </span>
									<span className="text-white font-bold opacity-100">
										{tokenData?.metadata.name}
									</span>
									<span> to </span>
									<span className="text-white font-bold opacity-100">
										{categoryName}
									</span>
								</div>
								<button
									className="rounded-md py-1 font-bold mr-1 w-32 border-2 border-primary bg-primary"
									disabled={isLoading}
									onClick={submitCard}
								>
									{isLoading ? 'Loading' : 'Submit'}
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default AddCategoryModal
