import axios from 'axios'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { useEffect, useState } from 'react'
import Card from '../components/Card'
import ImgCrop from '../components/ImgCrop'
import Nav from '../components/Nav'
import useStore from '../store'
import { useForm } from 'react-hook-form'
import Modal from '../components/Modal'
import { useRouter } from 'next/router'
import near from '../lib/near'
import Head from 'next/head'

const NewPage = () => {
	const store = useStore()
	const router = useRouter()
	const [formInput, setFormInput] = useState({})
	const {
		errors,
		register,
		handleSubmit,
		watch,
		setValue,
		getValues,
	} = useForm()

	const [showImgCrop, setShowImgCrop] = useState(false)
	const [imgFile, setImgFile] = useState('')
	const [imgUrl, setImgUrl] = useState('')
	const [step, setStep] = useState(0)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [showConfirmModal, setShowConfirmModal] = useState(false)
	const [showFront, setShowFront] = useState(true)
	const [showAlertErr, setShowAlertErr] = useState(false)

	const _submit = async () => {
		setIsSubmitting(true)

		const formData = new FormData()
		formData.append('file', imgFile)
		formData.append('ownerId', store.currentUser)
		formData.append('supply', formInput.supply)
		formData.append('quantity', formInput.quantity)
		formData.append('amount', parseNearAmount(formInput.amount))
		formData.append('name', formInput.name)
		formData.append('description', formInput.description)
		formData.append('collection', formInput.collection)

		try {
			await axios.post(`http://localhost:9090/tokens`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					authorization: await near.authToken(),
				},
			})
			router.push('/market')
		} catch (err) {
			console.log(err)
		}

		setIsSubmitting(false)
	}

	useEffect(() => {
		setValue('name', formInput.name)
		setValue('collection', formInput.collection)
		setValue('description', formInput.description)
		setValue('supply', formInput.supply)
		setValue('quantity', formInput.quantity)
		setValue('amount', formInput.amount)

		if (step === 0 || step === 2) {
			setShowFront(true)
		}

		if (step === 1) {
			setShowFront(false)
		}
	}, [step])

	const _updateValues = () => {
		const values = { ...getValues() }

		const newFormInput = {
			...formInput,
			...values,
		}
		setFormInput(newFormInput)
	}

	const _handleBack = () => {
		_updateValues()
		setStep(step - 1)
	}

	const _handleSubmitStep1 = (data) => {
		const newFormInput = {
			...formInput,
			...data,
		}
		setFormInput(newFormInput)
		_updateValues()
		setStep(step + 1)
	}

	const _handleSubmitStep2 = (data) => {
		const newFormInput = {
			...formInput,
			...data,
		}
		setFormInput(newFormInput)
		setShowConfirmModal(true)
	}

	const _setImg = async (e) => {
		if (e.target.files[0]) {
			if (e.target.files[0].size > 5 * 1024 * 1024) {
				setShowAlertErr('Maximum file size is 5 Mb')
				return
			}
			setImgFile(e.target.files[0])
			setShowImgCrop(true)
		}
	}

	return (
		<div
			className="min-h-screen bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Head>
				<title>Market — Paras</title>
				<meta
					name="description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>

				<meta name="twitter:title" content="Market — Paras" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Market — Paras" />
				<meta property="og:site_name" content="Market — Paras" />
				<meta
					property="og:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>
			<Nav />
			{showAlertErr && (
				<Modal close={(_) => setShowAlertErr(false)}>
					<div className="w-full max-w-xs p-4 m-auto bg-gray-100 rounded-md overflow-y-auto max-h-screen">
						<div>
							<div className="w-full">{showAlertErr}</div>
							<div>
								<button
									className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
									onClick={(_) => setShowAlertErr(false)}
								>
									OK
								</button>
							</div>
						</div>
					</div>
				</Modal>
			)}
			{showConfirmModal && (
				<Modal close={(_) => setShowConfirmModal(false)}>
					<div className="w-full flex flex-wrap max-w-lg p-4 m-auto bg-gray-100 rounded-md overflow-x-hidden overflow-y-auto max-h-full">
						<div className="w-full md:w-1/2 px-4">
							<div className="w-full">
								<Card
									imgWidth={640}
									imgHeight={890}
									imgUrl={imgUrl}
									token={{
										name: formInput.name,
										collection: formInput.collection,
										description: formInput.description,
										creatorId: store.currentUser,
										supply: formInput.supply,
										tokenId: 'ID',
										createdAt: new Date().getTime(),
									}}
									initialRotate={{
										x: 0,
										y: 0,
									}}
								/>
							</div>
						</div>
						<div className="w-full md:w-1/2 pl-0 md:pl-2 flex items-center">
							<div className="w-full">
								<h1 className="text-2xl font-bold text-gray-900 tracking-tight">
									Market Data
								</h1>
								<p className="text-sm mt-2">
									Price:{' '}
									{parseFloat(
										Number(getValues('amount', 0)).toPrecision(4).toString()
									)}{' '}
									Ⓝ (~$
									{parseFloat(
										Number(store.nearUsdPrice * getValues('amount', 0))
											.toPrecision(4)
											.toString()
									)}
									)
								</p>
								<p className="text-sm">
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
								<div className="mt-2">
									<p>Confirm card creation?</p>
								</div>
								<div className="">
									<button
										disabled={isSubmitting}
										className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
										onClick={_submit}
									>
										{!isSubmitting ? 'Create' : 'Creating...'}
									</button>
									<button
										className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary text-primary"
										onClick={(_) => setShowConfirmModal(false)}
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					</div>
				</Modal>
			)}
			{showImgCrop && (
				<ImgCrop
					input={imgFile}
					size={{
						width: 640 * 2,
						height: 890 * 2,
					}}
					left={(_) => {
						setImgFile(null)
						setShowImgCrop(false)
					}}
					right={(res) => {
						setImgUrl(res.payload.imgUrl)
						setImgFile(res.payload.imgFile)
						setShowImgCrop(false)
					}}
				/>
			)}
			<div className="max-w-6xl m-auto py-12 px-4">
				<div className="flex flex-wrap rounded-md overflow-hidden">
					<div className="w-full lg:w-2/3 py-16 px-4 flex justify-center items-center bg-dark-primary-2 ">
						<div
							className="w-full"
							style={{
								height: `60vh`,
							}}
						>
							<Card
								imgWidth={640}
								imgHeight={890}
								imgUrl={imgUrl}
								token={{
									name: watch('name', ''),
									collection: watch('collection', ''),
									description: watch('description', ''),
									creatorId: store.currentUser,
									supply: watch('supply', ''),
									tokenId: 'ID',
									createdAt: new Date().getTime(),
								}}
								initialRotate={{
									x: 0,
									y: 0,
								}}
								isShowFront={showFront}
								setIsShowFront={setShowFront}
							/>
						</div>
					</div>
					<div className="w-full lg:w-1/3 bg-gray-100 p-4">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 tracking-tight">
								Card Creation
							</h1>
						</div>
						{step === 0 && (
							<div>
								<div>
									<div className="flex justify-between py-2">
										<button disabled={step === 0} onClick={_handleBack}>
											Back
										</button>
										<div>{step + 1}/3</div>
										{step === 0 && (
											<button
												disabled={!imgFile}
												onClick={(_) => setStep(step + 1)}
											>
												Next
											</button>
										)}
										{step === 1 && (
											<button
												disabled={
													err.name ||
													err.collection ||
													err.description ||
													err.supply
												}
												onClick={(_) => setStep(step + 1)}
											>
												Next
											</button>
										)}
										{step === 2 && (
											<button onClick={(_) => _submit()}>Submit</button>
										)}
									</div>
								</div>
								<div className="mt-4 relative border-2 h-56 border-dashed rounded-md cursor-pointer overflow-hidden">
									<input
										className="cursor-pointer w-full opacity-0 absolute inset-0"
										type="file"
										accept="image/*"
										onClick={(e) => {
											e.target.value = null
										}}
										onChange={_setImg}
									/>
									<div className="flex items-center justify-center h-full">
										{imgFile ? (
											<div className="w-32">
												<svg
													className="m-auto"
													width="48"
													height="48"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														fillRule="evenodd"
														clipRule="evenodd"
														d="M4 2H20C21.1046 2 22 2.89543 22 4V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V4C2 2.89543 2.89543 2 4 2ZM4 4V15.5858L8 11.5858L11.5 15.0858L18 8.58579L20 10.5858V4H4ZM4 20V18.4142L8 14.4142L13.5858 20H4ZM20 20H16.4142L12.9142 16.5L18 11.4142L20 13.4142V20ZM14 8C14 6.34315 12.6569 5 11 5C9.34315 5 8 6.34315 8 8C8 9.65685 9.34315 11 11 11C12.6569 11 14 9.65685 14 8ZM10 8C10 7.44772 10.4477 7 11 7C11.5523 7 12 7.44772 12 8C12 8.55228 11.5523 9 11 9C10.4477 9 10 8.55228 10 8Z"
														fill="black"
													/>
												</svg>
												<p className="text-gray-700 mt-4 truncate">
													{imgFile.name}
												</p>
											</div>
										) : (
											<div className="text-center">
												<svg
													className="m-auto"
													width="48"
													height="48"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														fillRule="evenodd"
														clipRule="evenodd"
														d="M4 2H20C21.1046 2 22 2.89543 22 4V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V4C2 2.89543 2.89543 2 4 2ZM4 4V15.5858L8 11.5858L11.5 15.0858L18 8.58579L20 10.5858V4H4ZM4 20V18.4142L8 14.4142L13.5858 20H4ZM20 20H16.4142L12.9142 16.5L18 11.4142L20 13.4142V20ZM14 8C14 6.34315 12.6569 5 11 5C9.34315 5 8 6.34315 8 8C8 9.65685 9.34315 11 11 11C12.6569 11 14 9.65685 14 8ZM10 8C10 7.44772 10.4477 7 11 7C11.5523 7 12 7.44772 12 8C12 8.55228 11.5523 9 11 9C10.4477 9 10 8.55228 10 8Z"
														fill="rgba(0,0,0,0.8)"
													/>
												</svg>
												<p className="text-gray-700 mt-4">
													Recommended ratio 64 : 89
												</p>
												<p className="text-gray-700 mt-2">Maximum size 5mb</p>
											</div>
										)}
									</div>
								</div>
							</div>
						)}
						{step === 1 && (
							<form onSubmit={handleSubmit(_handleSubmitStep1)}>
								<div>
									<div className="flex justify-between py-2">
										<button disabled={step === 0} onClick={_handleBack}>
											Back
										</button>
										<div>{step + 1}/3</div>
										<button
											type="submit"
											onClick={handleSubmit(_handleSubmitStep1)}
										>
											Next
										</button>
									</div>
									<div>
										<label className="block text-sm">Name</label>
										<input
											type="text"
											name="name"
											ref={register({
												required: true,
											})}
											className={`${errors.name && 'error'}`}
											placeholder="Card name"
										/>
										<div className="mt-2 text-sm text-red-500">
											{errors.name && 'Name is required'}
										</div>
									</div>
									<div className="mt-4">
										<label className="block text-sm">Collection</label>
										<input
											type="text"
											name="collection"
											ref={register({
												required: true,
											})}
											className={`${errors.collection && 'error'}`}
											placeholder="Card collection"
										/>
										<div className="mt-2 text-sm text-red-500">
											{errors.collection && 'Collection is required'}
										</div>
									</div>
									<div className="mt-4">
										<label className="block text-sm">Description</label>
										<textarea
											type="text"
											name="description"
											ref={register({
												required: true,
											})}
											className={`${
												errors.description && 'error'
											} resize-none h-24`}
											placeholder="Card description"
										></textarea>
										<div className="text-sm text-red-500">
											{errors.description && 'Description is required'}
										</div>
									</div>
									<div className="mt-4">
										<label className="block text-sm">Number of copies</label>
										<input
											type="number"
											name="supply"
											ref={register({
												required: true,
												min: 1,
											})}
											className={`${errors.supply && 'error'}`}
											placeholder="Number of copies"
										/>
										<div className="mt-2 text-sm text-red-500">
											{errors.supply && 'Minimum 1 copy'}
										</div>
									</div>
								</div>
							</form>
						)}
						{step === 2 && (
							<form onSubmit={handleSubmit(_handleSubmitStep2)}>
								<div className="flex justify-between py-2">
									<button disabled={step === 0} onClick={_handleBack}>
										Back
									</button>
									<div>{step + 1}/3</div>
									<button
										type="submit"
										onClick={handleSubmit(_handleSubmitStep2)}
									>
										Next
									</button>
								</div>
								<div>
									<label className="block text-sm">Sale quantity</label>
									<input
										type="number"
										name="quantity"
										ref={register({
											required: true,
											min: 0,
											max: formInput.supply,
										})}
										className={`${errors.quantity && 'error'}`}
										placeholder="Number of card on sale"
									/>
									<div className="mt-2 text-sm text-red-500">
										{errors.quantity?.type === 'required' &&
											`Sale quantity is required`}
										{errors.quantity?.type === 'min' && `Minimum 0`}
										{errors.quantity?.type === 'max' &&
											`Must be less than number of copies`}
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
										{Number(store.nearUsdPrice * watch('amount')).toPrecision(
											6
										)}
									</p>
									<div className="mt-2 text-sm text-red-500">
										{errors.amount?.type === 'required' &&
											`Sale price is required`}
										{errors.amount?.type === 'min' && `Minimum 0`}
									</div>
								</div>
							</form>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default NewPage
