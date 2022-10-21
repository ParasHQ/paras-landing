import { IconEmptyCardSubmitCategory, IconX } from 'components/Icons'
import Modal from 'components/Modal'
import { useIntl } from 'hooks/useIntl'
import { useState } from 'react'
import { parseImgUrl } from 'utils/common'
import ParasRequest from 'lib/ParasRequest'
import useStore from 'lib/store'
import IconV from 'components/Icons/component/IconV'
import Link from 'next/link'
import clsx from 'clsx'
import { useEffect } from 'react'
import Button from 'components/Common/Button'
import useSWRImmutable from 'swr/immutable'
import { sentryCaptureException } from 'lib/sentry'
import { useToast } from 'hooks/useToast'

const AddExistCardCategoryModal = ({ onClose, categoryName, categoryId }) => {
	const currentUser = useStore((state) => state.currentUser)
	const { localeLn } = useIntl()
	const toast = useToast()
	const [filterCollection, setFilterCollection] = useState('All Collections')
	const [tooltipCollection, setTooltipCollection] = useState(false)
	const [tempSelectedTokens, setTempSelectedTokens] = useState({})
	const [selectedTokens, setSelectedTokens] = useState([])
	const [AllTokens, setAllTokens] = useState([])
	const [tokens, setTokens] = useState([])
	const [collections, setCollections] = useState([])
	const [agreement, setAgreement] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const fetchTokens = async (key) => {
		const res = await ParasRequest.get(
			`${process.env.V2_API_URL}/token-series/eligible-card4card`,
			{ params: key }
		)
		return res.data.data
	}

	const isDisabledSubmit = !agreement || selectedTokens.length === 0 || isSubmitting

	const { data: _tokens } = useSWRImmutable(
		currentUser ? { account_id: currentUser } : null,
		fetchTokens
	)

	const onSelected = () => {
		setSelectedTokens(
			selectedTokens.concat(
				tokens.filter((token) => {
					const tempArr = Object.keys(tempSelectedTokens)
					return tempSelectedTokens[token._id] === true && tempArr.includes(token._id)
				})
			)
		)
		setTokens((prev) =>
			prev.filter((token) => {
				const tempArr = Object.keys(tempSelectedTokens)
				return tempSelectedTokens[token._id] === false || !tempArr.includes(token._id)
			})
		)
		setTempSelectedTokens({})
	}

	const onRemoveSelected = (id) => {
		let temp = [...selectedTokens]
		temp = temp.filter((token) => token._id !== id)
		setSelectedTokens(temp)
		setTokens(tokens.concat(selectedTokens.filter((token) => token._id === id)))
	}

	const onToBeSelected = (_id) => {
		setTempSelectedTokens((prev) => ({
			...prev,
			[_id]: !prev[_id],
		}))
	}

	const handleSubmit = async () => {
		setIsSubmitting(true)
		const body = selectedTokens.map((token) => ({
			account_id: currentUser,
			contract_id: token.contract_id,
			token_series_id: token.token_series_id,
			category_id: categoryId,
			storeToSheet: categoryId === 'art-competition' ? 'true' : 'false',
		}))
		try {
			await ParasRequest.post(`${process.env.V2_API_URL}/categories/tokens/bulk`, body)
			onClose()
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						<div>{localeLn('ThankForsubmission')}</div>
						<div>{localeLn('SubmitSucceed')}</div>
					</div>
				),
				type: 'success',
				duration: 2000,
			})
			setIsSubmitting(false)
		} catch (err) {
			sentryCaptureException(err)
			const msg = err.response?.data?.message || 'Something went wrong, try again later.'
			toast.show({
				text: <div className="font-semibold text-center text-sm">{msg}</div>,
				type: 'error',
				duration: 2000,
			})
			setIsSubmitting(false)
		}
	}

	useEffect(() => {
		const tokenTemp = _tokens
			?.filter((data) => data.data.length > 0)
			.flatMap((data) => data?.data?.map((token) => token))
		const collTemp = _tokens?.map((data) => ({
			collection: data?.collection,
			collection_id: data?.collection_id,
		}))
		setTokens(tokenTemp || [])
		setAllTokens(tokenTemp || [])
		setCollections(collTemp || [])
	}, [_tokens])

	return (
		<Modal closeOnBgClick={false} close={onClose} closeOnEscape={false}>
			<div className="max-w-xl w-full m-auto bg-dark-primary-1 p-6 text-white rounded-lg relative">
				<div className="flex justify-between">
					<div className="font-bold text-2xl">
						{localeLn('SubmitCardTo')} {categoryName}
					</div>
					<div onClick={onClose}>
						<IconX className="cursor-pointer" />
					</div>
				</div>
				<div className="mt-2 text-opacity-75 text-[11px] md:text-sm">
					Curators will review your card submission. Only cards that meet the Card4Card requirements
					are displayed.
				</div>
				{selectedTokens.length > 0 && (
					<div className="mt-4 text-opacity-75 text-[11px] md:text-sm">
						<p>Your selected card(s)</p>
						<div className="grid grid-cols-4 md:grid-cols-5 border rounded-md p-2 gap-2 max-h-[160px] overflow-y-scroll">
							{selectedTokens.map((selected, index) => {
								return (
									<div key={index} className="w-16 h-16 mx-auto relative">
										<img
											src={parseImgUrl(selected.metadata.media)}
											alt=""
											className="object-contain w-16 h-16"
										/>
										<div
											className="absolute w-5 h-5 rounded-full bg-white bg-opacity-40 -top-1 -right-1 flex items-center justify-center pl-[2px] pt-[2px] cursor-pointer"
											onClick={() => onRemoveSelected(selected._id)}
										>
											<IconX size={18} color="white" />
										</div>
									</div>
								)
							})}
						</div>
					</div>
				)}
				<div className="mt-4 text-gray-100 text-opacity-75">
					<div className="flex items-center justify-between">
						{tooltipCollection && (
							<div className="fixed inset-0 z-10" onClick={() => setTooltipCollection(false)} />
						)}
						<div className="flex items-center cursor-pointer relative z-20">
							<div
								className="flex items-center justify-between space-x-2 min-w-[100px]"
								onClick={() => setTooltipCollection((prev) => !prev)}
							>
								{filterCollection}
								<IconV size={14} color="white" className="ml-1" />
							</div>
							{tooltipCollection && (
								<div
									id="filterCollections"
									className="absolute z-20 bg-cyan-blue-1 top-full mt-2 left-0 max-h-[200px] overflow-y-scroll rounded-md text-sm min-w-[180px]"
								>
									<div
										className="p-3 hover:bg-gray-500 cursor-pointer flex items-center whitespace-nowrap"
										onClick={() => {
											setTokens(
												AllTokens.filter(
													(token) => !selectedTokens.map((data) => data._id).includes(token._id)
												)
											)
											setFilterCollection('All Collections')
										}}
									>
										All Collections
									</div>
									{collections.length > 0 &&
										collections.map((coll, idx) => (
											<div
												key={idx}
												className={clsx(
													`p-3 hover:bg-gray-500 cursor-pointer flex items-center whitespace-nowrap`
												)}
												onClick={() => {
													setTokens(
														AllTokens.filter(
															(token) => !selectedTokens.map((data) => data._id).includes(token._id)
														)
													)
													setTokens((tokens) =>
														tokens.filter((token) => token.metadata.collection === coll.collection)
													)
													setFilterCollection(coll.collection)
												}}
											>
												{coll.collection}
											</div>
										))}
								</div>
							)}
						</div>
						{tokens?.length > 0 && (
							<div className="flex items-center underline cursor-pointer" onClick={onSelected}>
								Select
							</div>
						)}
					</div>
					{tokens?.length === 0 ? (
						<div className="flex items-center justify-center h-[200px] w-full text-xs">
							<div className="flex flex-col items-center">
								<IconEmptyCardSubmitCategory size={63} />
								{tokens.length === 0 ? (
									<>
										{tokens.filter((token) => token.metadata.collection === filterCollection)
											.length === 0 && (
											<p className="text-center mt-2 w-52">
												This Collection does not contain any cards that meets the{` `}
												<a href="">
													<span className="underline cursor-pointer">Card4Card requirements.</span>
												</a>
											</p>
										)}
									</>
								) : (
									<>
										<p className="text-center mt-2 w-52">
											You don&apos;t have a card that meets the{` `}
											<a href="">
												<span className="underline cursor-pointer">Card4Card requirements.</span>
											</a>
										</p>
										<Link href={`/new`}>
											<p className="mt-4 text-center underline cursor-pointer">Submit New Card?</p>
										</Link>
									</>
								)}
							</div>
						</div>
					) : (
						<div
							id="existingCardCategory"
							className="mt-2 grid grid-cols-3 md:grid-cols-5 gap-2 w-full max-h-[230px] overflow-y-scroll"
						>
							{tokens?.map((token, idx) => (
								<div
									key={idx}
									className="w-20 h-20 mx-auto relative cursor-pointer"
									onClick={() => onToBeSelected(token?._id)}
								>
									<img
										src={parseImgUrl(token?.metadata?.media)}
										alt=""
										className="w-20 h-20 object-contain rounded-lg"
									/>
									<div
										className={clsx(
											`w-4 h-4 rounded-full border border-white absolute top-1 right-1`,
											tempSelectedTokens[token?._id] ? `bg-primary` : ``
										)}
									/>
								</div>
							))}
						</div>
					)}
				</div>
				<div className="mt-4 text-gray-100 text-opacity-75 flex items-center space-x-4">
					<input
						id="agreement"
						type="checkbox"
						className="w-3 h-3"
						checked={agreement}
						onChange={() => setAgreement((prev) => !prev)}
					/>
					<label htmlFor="agreement">I agree with Card4Card Mechanism</label>
				</div>
				<div className="mt-6">
					<Button
						isFullWidth
						variant="primary"
						size="md"
						isDisabled={isDisabledSubmit}
						onClick={handleSubmit}
						isLoading={isSubmitting}
					>
						Submit
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export default AddExistCardCategoryModal
