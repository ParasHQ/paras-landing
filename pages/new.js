import axios from 'axios'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { Suspense, useEffect, useRef, useState } from 'react'
import Card from 'components/Card/Card'
import ImgCrop from 'components/ImgCrop'
import Nav from 'components/Nav'
import useStore from 'lib/store'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import Modal from 'components/Modal'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useToast } from 'hooks/useToast'
import Footer from 'components/Footer'
import { parseDate, parseImgUrl, prettyBalance, readFileAsUrl } from 'utils/common'
import { encodeImageToBlurhash } from 'lib/blurhash'
import { GAS_FEE, MAX_FILE_SIZE, STORAGE_CREATE_SERIES_FEE } from 'config/constants'
import Button from 'components/Common/Button'
import { InputText, InputTextarea, InputTextAuto } from 'components/Common/form'
import CreateCollectionModal from 'components/Collection/CreateCollectionModal'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import Scrollbars from 'react-custom-scrollbars'
import getConfig from 'config/near'
import Tooltip from 'components/Common/Tooltip'
import { Icon3D, IconIframe, IconInfo, IconLoader, IconX } from 'components/Icons'
import WalletHelper from 'lib/WalletHelper'
import AudioPlayer from 'components/Common/AudioPlayer'
import { Canvas } from '@react-three/fiber'
import { Model1 } from 'components/Model3D/ThreeDModel'
import FileType from 'file-type/browser'
import retry from 'async-retry'
import IconV from 'components/Icons/component/IconV'
import FilterAddCollection from 'components/Filter/FilterAddCollection'

const LIMIT = 16

const calcRoyalties = (royalties) => {
	return royalties
		.filter((x) => !isNaN(parseFloat(x.value)))
		.reduce((a, b) => {
			return a + parseFloat(b.value)
		}, 0)
}

const RoyaltyWatch = ({ control, append }) => {
	const { localeLn } = useIntl()

	const royalties = useWatch({
		control,
		name: 'royalties',
		defaultValue: [],
	})

	return (
		<div className="flex items-center justify-between mb-1">
			<label className="block text-sm">
				<span className="pr-1">{localeLn('Royalty')}</span>
				{calcRoyalties(royalties) > 90 ? (
					<span className="text-red-500 text-semibold">{calcRoyalties(royalties)}%</span>
				) : (
					<span className="text-semibold">{calcRoyalties(royalties)}%</span>
				)}
			</label>
			<button
				className="flex items-center"
				disabled={royalties.length >= 10 || calcRoyalties(royalties) >= 90}
				onClick={() => append({ accountId: '', value: '' })}
			>
				<span className="text-sm pr-2">Add</span>
				<IconX style={{ transform: 'rotate(45deg)' }} className="cursor-pointer" size={20} />
			</button>
		</div>
	)
}

const NewPage = () => {
	const { localeLn } = useIntl()
	const scrollBar = useRef()
	const royaltyScrollBar = useRef()
	const store = useStore()
	const router = useRouter()
	const toast = useToast()
	const [formInput, setFormInput] = useState({})
	const { errors, control, register, handleSubmit, watch, setValue, getValues } = useForm()
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'attributes',
	})
	const {
		fields: royaltyFields,
		append: royaltyAppend,
		remove: royaltyRemove,
	} = useFieldArray({
		control,
		name: 'royalties',
	})
	const { category_name, category_id } = router.query

	const [threeDFile, setThreeDFile] = useState('')
	const [threeDUrl, setThreeDUrl] = useState('')
	const [show3dFile, setShow3dFile] = useState(false)
	const [isUpload3DFile, setIsUpload3DFile] = useState(false)
	const uploaded3DRef = useRef(null)
	const [showImgCrop, setShowImgCrop] = useState(false)
	const [isLoading, setIsLoading] = useState(null)
	const [imgFile, setImgFile] = useState('')
	const [imgUrl, setImgUrl] = useState('')
	const [audioFile, setAudioFile] = useState('')
	const [audioUrl, setAudioUrl] = useState('')
	const uploadedAudioRef = useRef(null)
	const [thumbnailFile, setThumbnailFile] = useState('')
	const [thumbnailUrl, setThumbnailUrl] = useState('')
	const [step, setStep] = useState(0)
	const [isUploading, setIsUploading] = useState(false)
	const [isCreating, setIsCreating] = useState(false)
	const [showConfirmModal, setShowConfirmModal] = useState(false)
	const [showCreatingModal, setShowCreatingModal] = useState(false)
	const [showThumbnailModal, setShowThumbnailModal] = useState(false)
	const [showCreateColl, setShowCreateColl] = useState(false)

	const [showAlertErr, setShowAlertErr] = useState(false)
	const [choosenCollection, setChoosenCollection] = useState({})

	const [collectionList, setCollectionList] = useState([])
	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)

	const [blurhash, setBlurhash] = useState('')
	const [isOnSale, setIsOnSale] = useState(false)

	const [mediaHash, setMediaHash] = useState(null)
	const [referenceHash, setReferenceHash] = useState(null)
	const [fileType, setFileType] = useState(null)
	const [attributeKey, setAttributeKey] = useState([])
	const [attributeValue, setAttributeValue] = useState({})
	const [txFee, setTxFee] = useState(null)
	const [showMoreFile, setShowMoreFile] = useState(false)
	const [iframeInput, setIframeInput] = useState('')
	const [iframeUrl, setIframeUrl] = useState('')
	const [showIframeFile, setShowIframeFile] = useState(false)

	const watchRoyalties = watch(`royalties`)
	const showTooltipTxFee = (txFee?.next_fee || 0) > (txFee?.current_fee || 0)
	const tooltipTxFeeText = localeLn('DynamicTxFee', {
		date: parseDate((txFee?.start_time || 0) * 1000),
		fee: (txFee?.current_fee || 0) / 100,
	})

	const uploadAudioFile = async () => {
		const formDataAudio = new FormData()
		formDataAudio.append(`files`, audioFile)
		const respAudioUpload = await axios.post(`${process.env.V2_API_URL}/uploads`, formDataAudio, {
			headers: {
				'Content-Type': 'multipart/form-data',
				authorization: await WalletHelper.authToken(),
			},
		})
		uploadedAudioRef.current = respAudioUpload.data.data[0]?.split('://')[1]
	}

	const upload3DFile = async () => {
		const formData3D = new FormData()
		formData3D.append(`files`, threeDFile)
		const resp3DUpload = await axios.post(`${process.env.V2_API_URL}/uploads`, formData3D, {
			headers: {
				'Content-Type': 'multipart/form-data',
				authorization: await WalletHelper.authToken(),
			},
		})
		uploaded3DRef.current = resp3DUpload.data.data[0]?.split('://')[1]
	}

	const uploadImageMetadata = async () => {
		setIsUploading(true)
		setShowCreatingModal(true)

		if (audioUrl) {
			await uploadAudioFile()
		}
		if (threeDUrl) {
			await upload3DFile()
		}

		const reference = JSON.stringify({
			description: formInput.description,
			collection: choosenCollection.collection,
			collection_id: choosenCollection.collection_id,
			creator_id: store.currentUser,
			attributes: formInput.attributes,
			blurhash: blurhash,
			mime_type: fileType,
			animation_url: uploadedAudioRef.current
				? uploadedAudioRef.current
				: uploaded3DRef.current
				? uploaded3DRef.current
				: iframeUrl,
		})
		const blob = new Blob([reference], { type: 'text/plain' })

		const formData = new FormData()
		formData.append('files', imgFile)
		formData.append('files', blob)

		let resp
		try {
			resp = await axios.post(`${process.env.V2_API_URL}/uploads`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					authorization: await WalletHelper.authToken(),
				},
			})
			setMediaHash(resp.data.data[0].split('://')[1])
			setReferenceHash(resp.data.data[1].split('://')[1])

			setIsUploading('success')

			if (store.selectedCategory !== '' && WalletHelper.activeWallet !== 'sender') {
				window.sessionStorage.setItem(`categoryToken`, store.selectedCategory)
			}
		} catch (err) {
			sentryCaptureException(err)
			const msg = err.response?.data?.message || `Something went wrong, try again later`
			toast.show({
				text: <div className="font-semibold text-center text-sm">{msg}</div>,
				type: 'error',
				duration: 2500,
			})
			setIsUploading('fail')
			return
		}
	}

	const createSeriesNFT = async () => {
		setIsCreating(true)
		try {
			let params = {
				creator_id: store.currentUser,
				token_metadata: {
					title: formInput.name,
					media: mediaHash,
					reference: referenceHash,
					copies: parseFloat(formInput.supply),
				},
				price: parseNearAmount(formInput.amount || 0),
			}

			if (formInput.royalties?.length > 0) {
				let formattedRoyalties = {}

				formInput.royalties.forEach((r) => {
					formattedRoyalties[r.accountId] = parseInt(parseFloat(r.value) * 100)
				})

				params = {
					...params,
					royalty: formattedRoyalties,
				}
			}

			const res = await WalletHelper.callFunction({
				contractId: process.env.NFT_CONTRACT_ID,
				methodName: `nft_create_series`,
				args: params,
				gas: GAS_FEE,
				deposit: STORAGE_CREATE_SERIES_FEE,
			})

			setIsCreating(false)
			if (res?.response) {
				if (store.selectedCategory !== '') {
					await submitCategoryCard(res)
				}
				setTimeout(() => {
					router.push('/market')
					store.setTransactionRes(res?.response)
				}, 2000)
			}
		} catch (err) {
			sentryCaptureException(err)
			const msg = err.response?.data?.message || `Something went wrong, try again later`
			toast.show({
				text: <div className="font-semibold text-center text-sm">{msg}</div>,
				type: 'error',
				duration: 2500,
			})
			setIsUploading(false)
		}
	}

	useEffect(() => {
		if (router.query.transactionHashes) {
			router.push('/market', {
				pathname: '/market',
				query: router.query,
			})
		}
	}, [router.query.transactionHashes])

	useEffect(() => {
		setValue('name', formInput.name)
		setValue('collection', formInput.collection)
		setValue('description', formInput.description)
		setValue('supply', formInput.supply)
		setValue('quantity', formInput.quantity)
		setValue('amount', formInput.amount)
		setValue('attributes', formInput.attributes)
		setValue('royalties', formInput.royalties)

		if (step === 2) {
			const getAttributeKeys = async () => {
				const res = await axios.get(`${process.env.V2_API_URL}/collection-attributes`, {
					params: {
						collection_id: choosenCollection.collection_id,
					},
				})
				const attributes = await res.data.data.results
				const newAttribute = Object.keys(attributes)
				setAttributeValue(attributes)
				setAttributeKey(newAttribute)
			}
			getAttributeKeys()
		}
	}, [step])

	useEffect(() => {
		if (category_id) {
			store.setSelectedCategory(category_id)
		} else {
			store.setSelectedCategory('')
		}
	}, [])

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
		if (data.attributes) {
			data.attributes.map((trait) => {
				trait.trait_type = trait.trait_type.trim()
				trait.value = trait.value.trim()
			})
		}
		const newFormInput = {
			...formInput,
			...data,
		}
		setFormInput(newFormInput)
		_updateValues()
		setStep(step + 1)
	}

	const _handleSubmitStep2 = async (data) => {
		setIsLoading(3)

		try {
			const totalRoyalties = data.royalties
				?.map((r) => {
					return {
						accountId: r.accountId.trim(),
						value: r.value,
					}
				})
				.reduce((a, b) => {
					return parseFloat(a) + parseFloat(b.value)
				}, 0)

			// check account id in royalties
			if (data.royalties?.length > 0) {
				for (const r of data.royalties) {
					try {
						const nearConfig = getConfig(process.env.APP_ENV || 'development')
						const resp = await axios.post(nearConfig.nodeUrl, {
							jsonrpc: '2.0',
							id: 'dontcare',
							method: 'query',
							params: {
								request_type: 'view_account',
								finality: 'final',
								account_id: r.accountId,
							},
						})
						if (resp.data.error) {
							throw new Error(`Account ${r.accountId} not exist`)
						}
					} catch (err) {
						const message = err.message || 'Something went wrong, try again later'
						toast.show({
							text: <div className="font-semibold text-center text-sm">{message}</div>,
							type: 'error',
							duration: 2500,
						})

						setIsLoading(null)
						return
					}
				}
			}

			if (totalRoyalties > 90) {
				setShowAlertErr('Maximum royalty is 90%')
				return
			} else if (data.royalties?.length > 10) {
				setShowAlertErr('Maximum 10 accounts for royalty split')
				return
			} else {
				const newFormInput = {
					...formInput,
					...data,
				}
				setIsLoading(null)
				setFormInput(newFormInput)
				setShowConfirmModal(true)
			}
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const _setFile = async (e) => {
		if (e.target.files[0]) {
			if (e.target.files[0].size > MAX_FILE_SIZE) {
				setShowAlertErr('Maximum file size is 30MB')
				return
			} else {
				setAudioUrl('')
				setAudioFile('')
				setImgUrl('')
				setImgFile('')
				setThreeDUrl('')
				setThreeDFile('')
				setIframeInput('')
				setIframeUrl('')
				setThumbnailFile('')
				setThumbnailUrl('')
				if (e.target.files[0].type?.includes('audio')) {
					const _audioUrl = URL.createObjectURL(e.target.files[0])
					setAudioFile(e.target.files[0])
					setAudioUrl(_audioUrl)
					setFileType(e.target.files[0].type)
					setShowThumbnailModal(true)
				} else if (e.target.files[0].name?.includes('glb')) {
					setIsUpload3DFile(true)
					const threeDUrl = URL.createObjectURL(e.target.files[0])
					setThreeDUrl(threeDUrl)
					setThreeDFile(e.target.files[0])
					const _fileType = await FileType.fromBlob(e.target.files[0])
					setFileType(_fileType?.mime)
					setShowThumbnailModal(true)
					setIsUpload3DFile(false)
				} else {
					const newImgUrl = await readFileAsUrl(e.target.files[0])
					setImgFile(e.target.files[0])
					setImgUrl(newImgUrl)
					setFileType(e.target.files[0].type)
					encodeBlurhash(newImgUrl)
				}
			}
		}
	}

	const _setMoreFile = async () => {
		setThumbnailFile('')
		setThumbnailUrl('')
		setImgFile('')
		setImgUrl('')
		setThreeDUrl('')
		setThreeDFile('')
		setAudioUrl('')
		setAudioFile('')
		if (iframeInput) {
			setIframeUrl(iframeInput)
			setShowThumbnailModal(true)
			setFileType('iframe')
		}
	}

	const _setThumbnailFile = async (e) => {
		if (e.target.files[0]) {
			if (e.target.files[0].size > MAX_FILE_SIZE) {
				setShowAlertErr('Maximum file size is 30MB')
				return
			} else {
				const newThumbUrl = URL.createObjectURL(e.target.files[0])
				setThumbnailFile(e.target.files[0])
				setThumbnailUrl(newThumbUrl)
				encodeBlurhash(newThumbUrl)
			}
		}
	}

	const encodeBlurhash = async (imgUrl) => {
		const _blurhash = await encodeImageToBlurhash(imgUrl)
		setBlurhash(_blurhash)
	}

	useEffect(() => {
		if (store.initialized && store.currentUser) {
			fetchCollectionUser()
		}
	}, [store.initialized])

	useEffect(() => {
		const getTxFee = async () => {
			const txFeeContract = await WalletHelper.viewFunction({
				methodName: 'get_transaction_fee',
				contractId: process.env.NFT_CONTRACT_ID,
			})
			setTxFee(txFeeContract)
		}
		if (store.initialized) {
			getTxFee()
		}
	}, [store.initialized])

	const fetchCollectionUser = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios.get(`${process.env.V2_API_URL}/collections`, {
			params: {
				creator_id: store.currentUser,
				__skip: page * LIMIT,
				__limit: LIMIT,
			},
		})
		const newData = await res.data.data
		const newCollections = [...collectionList, ...newData.results]
		setCollectionList(newCollections)
		setPage(page + 1)
		if (newData.results.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	const formatCategoryId = (categoryId) => {
		const capitalize = (str) => {
			return str.charAt(0).toUpperCase() + str.slice(1)
		}

		if (categoryId) {
			return categoryId.split('-').map(capitalize).join(' ')
		}
	}

	const submitCategoryCard = async (res) => {
		const txLast = res?.response[res?.response.length - 1]
		const resFromTxLast = txLast.receipts_outcome[0].outcome.logs[0]
		const resOutcome = await JSON.parse(`${resFromTxLast}`)
		await retry(
			async () => {
				const res = await axios.post(
					`${process.env.V2_API_URL}/categories/tokens`,
					{
						account_id: store.currentUser,
						contract_id: txLast?.transaction?.receiver_id,
						token_series_id: resOutcome?.params?.token_series_id,
						category_id: store.selectedCategory,
						storeToSheet: store.selectedCategory === 'art-competition' ? 'true' : 'false',
					},
					{
						headers: {
							authorization: await WalletHelper.authToken(),
						},
					}
				)
				if (res.status === 403 || res.status === 400) {
					sentryCaptureException(res.data?.message || `Token series still haven't exist`)
					return
				}
				window.sessionStorage.removeItem('categoryToken')
			},
			{
				retries: 20,
				factor: 2,
			}
		)
	}

	return (
		<div className="min-h-screen bg-black">
			<div
				className="fixed inset-0 opacity-75"
				style={{
					zIndex: 0,
					backgroundImage: `url('/bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			></div>
			<Head>
				<title>{localeLn('CreateNewCardParas')}</title>
				<meta
					name="description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>

				<meta name="twitter:title" content="Market — Paras" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
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
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>
			<Nav />
			{showAlertErr && (
				<Modal close={() => setShowAlertErr(false)}>
					<div className="w-full max-w-xs p-4 m-auto bg-gray-800 rounded-md overflow-y-auto max-h-screen">
						<div>
							<div className="w-full text-white">{showAlertErr}</div>
							<div>
								<button
									className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
									onClick={() => setShowAlertErr(false)}
								>
									{localeLn('OK')}
								</button>
							</div>
						</div>
					</div>
				</Modal>
			)}
			{showConfirmModal && (
				<Modal
					close={() => setShowConfirmModal(false)}
					closeOnEscape={false}
					closeOnBgClick={false}
				>
					<div className="w-full flex flex-wrap max-w-xl p-4 m-auto bg-gray-800 rounded-md overflow-x-hidden overflow-y-auto max-h-full">
						<div className="w-full md:w-1/2 px-4">
							<div className="w-full bg-dark-primary-2 rounded-md">
								<Card
									imgWidth={640}
									imgHeight={890}
									imgBlur={blurhash}
									imgUrl={parseImgUrl(imgUrl)}
									audioUrl={audioUrl}
									token={{
										title: formInput.name,
										collection: choosenCollection.collection,
										creatorId: store.currentUser,
										copies: formInput.supply,
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
								<h1 className="mt-4 text-2xl font-bold text-white tracking-tight">
									{localeLn('MarketData')}
								</h1>
								<div className="text-white">
									{isOnSale && (
										<>
											<div className="flex items-center justify-between text-sm mt-2 opacity-80">
												<span>Price: </span>
												<span>
													{prettyBalance(
														Number(getValues('amount', 0)).toPrecision(4).toString(),
														0,
														6
													)}{' '}
													Ⓝ
													{store.nearUsdPrice !== 0 && (
														<>
															{' '}
															(~$
															{prettyBalance(
																Number(store.nearUsdPrice * getValues('amount', 0))
																	.toPrecision(4)
																	.toString(),
																0,
																6
															)}
															)
														</>
													)}
												</span>
											</div>
											<div className="flex items-center justify-between text-sm opacity-80">
												<span>{localeLn('Receive')}: </span>
												<span>
													{prettyBalance(
														Number(
															getValues('amount', 0) *
																((95 - (calcRoyalties(watchRoyalties) || 0)) / 100)
														)
															.toPrecision(4)
															.toString(),
														0,
														6
													)}{' '}
													Ⓝ
													{store.nearUsdPrice !== 0 && (
														<>
															{' '}
															(~$
															{prettyBalance(
																Number(
																	store.nearUsdPrice *
																		getValues('amount', 0) *
																		((95 - (calcRoyalties(watchRoyalties) || 0)) / 100)
																)
																	.toPrecision(4)
																	.toString(),
																0,
																6
															)}
															)
														</>
													)}
												</span>
											</div>
											{watchRoyalties.length > 0 && (
												<div className="flex items-center justify-between text-sm">
													<span>{localeLn('Royalty')}: </span>
													<span>
														{prettyBalance(
															Number(getValues('amount', 0) * (calcRoyalties(watchRoyalties) / 100))
																.toPrecision(4)
																.toString(),
															0,
															6
														)}{' '}
														Ⓝ
														{store.nearUsdPrice !== 0 && (
															<>
																{' '}
																(~$
																{prettyBalance(
																	Number(
																		store.nearUsdPrice *
																			getValues('amount', 0) *
																			(calcRoyalties(watchRoyalties) / 100)
																	)
																		.toPrecision(4)
																		.toString(),
																	0,
																	6
																)}
																)
															</>
														)}
													</span>
												</div>
											)}
											<div
												className={`flex items-center justify-between text-sm ${
													showTooltipTxFee ? 'font-bold' : 'opacity-80'
												}`}
											>
												<Tooltip
													id="text-fee"
													show={showTooltipTxFee}
													text={tooltipTxFeeText}
													className="font-normal"
												>
													<span>
														{localeLn('Fee')}
														{showTooltipTxFee && <IconInfo size={10} color="#ffffff" />}:
													</span>
												</Tooltip>
												<span>
													{prettyBalance(
														Number((getValues('amount', 0) * (txFee?.current_fee || 0)) / 10000)
															.toPrecision(4)
															.toString(),
														0,
														6
													)}{' '}
													Ⓝ
													{store.nearUsdPrice !== 0 && (
														<>
															{' '}
															(~$
															{prettyBalance(
																Number(store.nearUsdPrice * getValues('amount', 0) * 0.05)
																	.toPrecision(4)
																	.toString(),
																0,
																6
															)}
															)
														</>
													)}
												</span>
											</div>
										</>
									)}
								</div>
								<div className="mt-2 text-white opacity-80">
									<p>{localeLn('ConfirmCardCreation')}?</p>
								</div>
								<div className="">
									<Button className="mt-4" onClick={uploadImageMetadata} isFullWidth>
										{localeLn('Create')}
									</Button>
									<Button
										variant="ghost"
										isFullWidth
										className="mt-4"
										onClick={() => setShowConfirmModal(false)}
									>
										{localeLn('Cancel')}
									</Button>
								</div>
							</div>
						</div>
					</div>
				</Modal>
			)}
			{showCreatingModal && (
				<Modal closeOnEscape={false} closeOnBgClick={false}>
					<div className="max-w-xs m-auto p-4 bg-gray-800 rounded-md">
						<div className="font-bold text-2xl mb-4 text-white">{localeLn('CreatingCard')}</div>
						<div>
							<p className="text-gray-200 font-bold text-lg">{localeLn('Upload')}</p>
							<p className="text-gray-200 text-sm mb-2">{localeLn('UploadingImageMeta')}</p>
							<Button
								isFullWidth
								size="md"
								isDisabled={!(isUploading === 'fail')}
								onClick={uploadImageMetadata}
								className="mb-6"
							>
								{isUploading === true
									? 'In progress...'
									: isUploading === 'success'
									? 'Success'
									: 'Try Again'}
							</Button>
						</div>
						<div>
							<p className="text-gray-200 font-bold text-lg">{localeLn('Confirmation')}</p>
							<p className="text-gray-200 text-sm">
								{localeLn('Confirm your transaction on Near Wallet')}
							</p>
							<p className="text-gray-200 text-sm mb-2">
								{localeLn('SmallTransactionFee')} 0.00854 Ⓝ
							</p>
							<Button
								isDisabled={!(isUploading === 'success')}
								isLoading={isCreating}
								isFullWidth
								size="md"
								onClick={createSeriesNFT}
							>
								Confirm
							</Button>
							<Button
								isFullWidth
								size="md"
								variant="ghost"
								className="mt-3"
								onClick={() => {
									setShowCreatingModal(false)
									setIsUploading(false)
								}}
							>
								{localeLn('Cancel')}
							</Button>
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
					left={() => {
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
			{showThumbnailModal && (
				<Modal
					close={() => setShowThumbnailModal(false)}
					closeOnBgClick={false}
					closeOnEscape={false}
				>
					<div className="max-w-sm m-auto p-4 bg-gray-800 rounded-md w-full relative">
						<div className="absolute right-0 top-0 pr-4 pt-4">
							<div
								className="cursor-pointer"
								onClick={() => {
									setAudioFile('')
									setAudioUrl('')
									setThreeDFile('')
									setThreeDUrl('')
									setThumbnailUrl('')
									setThumbnailFile('')
									setImgFile('')
									setImgUrl('')
									setIframeInput('')
									setIframeUrl('')
									setShowThumbnailModal(false)
								}}
							>
								<IconX />
							</div>
						</div>
						<h1 className="mt-5 text-base font-bold text-white text-center tracking-tight">
							Thumbnail Image for Audio, 3D, and iframe
						</h1>
						<div className="px-2 flex items-center justify-center mt-4">
							{thumbnailFile ? (
								<img src={thumbnailUrl} className="object-contain w-9/12 h-80" alt="" />
							) : (
								<div className="bg-gray-500 bg-opacity-60 hover:bg-opacity-30 transition-all cursor-pointer rounded-md w-9/12 h-80 flex items-center justify-center relative">
									<input
										type="file"
										accept="image/*"
										className="cursor-pointer w-full opacity-0 absolute inset-0"
										onChange={_setThumbnailFile}
									/>
									<div className="text-white">+ Add</div>
								</div>
							)}
						</div>
						<div className="mt-5 flex items-center">
							<button
								disabled={isUpload3DFile}
								className="px-4 py-2 w-full rounded-md bg-primary text-white hover:bg-opacity-30 transition-all cursor-pointer text-center font-semibold"
								onClick={async () => {
									if (thumbnailUrl) {
										setImgUrl(thumbnailUrl)
										setImgFile(thumbnailFile)
										setShowThumbnailModal(false)
									}
								}}
							>
								{isUpload3DFile ? <IconLoader /> : `Submit`}
							</button>
						</div>
					</div>
				</Modal>
			)}
			<CreateCollectionModal
				show={showCreateColl}
				onClose={() => setShowCreateColl(!showCreateColl)}
				onFinishCreate={(res) => {
					setCollectionList([res, ...collectionList])
					setShowCreateColl(false)
				}}
			/>
			<div className="relative max-w-6xl m-auto py-12 px-4 text-white">
				<div className="flex flex-wrap rounded-md overflow-hidden">
					<div
						className="w-full lg:w-2/3 py-16 px-8 flex justify-center items-center bg-dark-primary-2 relative"
						style={{ background: '#202124' }}
					>
						<div
							className="w-full"
							style={{
								height: `60vh`,
							}}
						>
							{(threeDUrl && show3dFile) || (iframeUrl && showIframeFile) ? (
								<>
									{threeDUrl && show3dFile && (
										<>
											<Suspense fallback={null}>
												<Canvas>
													<Model1 threeDUrl={threeDUrl} />
												</Canvas>
											</Suspense>
										</>
									)}
									{iframeUrl && showIframeFile && (
										<iframe
											src={iframeUrl}
											sandbox="allow-scripts"
											className="object-contain w-full h-full"
										/>
									)}
								</>
							) : (
								<>
									<Card
										imgWidth={640}
										imgHeight={890}
										imgUrl={parseImgUrl(imgUrl)}
										imgBlur={blurhash}
										token={{
											title: watch('name', formInput.name) || 'Name',
											collection: choosenCollection.collection || 'Collection',
											creatorId: store.currentUser,
											copies: watch('supply', formInput.supply),
										}}
										initialRotate={{
											x: 0,
											y: 0,
										}}
									/>
									{audioUrl && (
										<div className="my-3 flex items-center justify-center w-full">
											<AudioPlayer showForwardBackward={true} audioSrc={audioUrl} />
										</div>
									)}
								</>
							)}
						</div>
						{threeDUrl && (
							<div className="absolute top-5 right-5">
								<div
									className={`py-1 px-2 text-white rounded-full flex items-center bg-gray-700 hover:bg-gray-900 transition-all cursor-pointer ${
										show3dFile && `border border-white`
									}`}
									onClick={() => {
										setShow3dFile(!show3dFile)
									}}
								>
									<Icon3D size={25} color={`#fff`} />
									3D
								</div>
							</div>
						)}
						{iframeUrl && (
							<div className="absolute top-5 right-5">
								<div
									className={`py-1 px-2 text-white rounded-full flex items-center bg-gray-700 hover:bg-gray-900 transition-all cursor-pointer ${
										showIframeFile && `border border-white`
									}`}
									onClick={() => {
										setShowIframeFile(!showIframeFile)
									}}
								>
									<IconIframe size={25} color={`#fff`} />
									Iframe
								</div>
							</div>
						)}
					</div>
					<div className="w-full -mt-20 pb-80 md:pb-0 md:mt-0 lg:w-1/3 bg-gray-700 p-4 relative">
						{router.query.categoryId && (
							<div
								className="w-full bg-primary px-4 py-1 text-center -m-4 mb-4 shadow-md"
								style={{ width: 'calc(100% + 2rem)' }}
							>
								<div className="block text-sm text-white">
									<span>{localeLn('WillSubmitCardTo')} </span>
									<span className="font-bold">{formatCategoryId(router.query.categoryId)}</span>
								</div>
							</div>
						)}
						<div>
							<h1 className="text-2xl font-bold text-white tracking-tight">
								{localeLn('CardCreation')}
							</h1>
							{step === 1 && (
								<p className="text-xs font-thin text-white text-opacity-80">
									Supported file types: PNG,JPG,GIF,MP3,MP4,GLB
								</p>
							)}
						</div>
						{step === 0 && (
							<div className="h-60">
								<div className="text-sm mt-2">Choose Collection</div>
								<div
									onClick={() => setShowCreateColl(!showCreateColl)}
									className="bg-gray-800 mt-2 flex items-center rounded-md overflow-hidden cursor-pointer border-2 border-gray-800"
								>
									<div className="h-10 w-full flex items-center justify-center flex-shrink-0 text-sm text-center font-medium">
										+ {localeLn('CreateNewCollection')}
									</div>
								</div>
								<FilterAddCollection
									collections={collectionList}
									fetchCollectionUser={fetchCollectionUser}
									hasMore={hasMore}
									choosenCollection={choosenCollection}
									setChoosenCollection={(e) => setChoosenCollection(e)}
									currentUser={store.currentUser}
								/>
								{category_id && category_name && (
									<div className="text-xs lg:text-sm mt-3 mb-1 text-opacity-30 flex justify-between items-center">
										<p className="font-semibold">Choosen category:</p>
										<div className="p-1 lg:p-2 bg-gray-800 bg-opacity-80 rounded-md font-thin border border-white">
											{category_name}
										</div>
									</div>
								)}
								<div className="flex justify-between px-4 pb-4 absolute bottom-0 right-0 left-0">
									<button disabled={step === 0} onClick={_handleBack}>
										{localeLn('Back')}
									</button>
									<div>{step + 1}/4</div>
									<button
										disabled={!choosenCollection.collection_id}
										onClick={() => setStep(step + 1)}
									>
										{localeLn('Next')}
									</button>
								</div>
							</div>
						)}
						{step === 1 && (
							<div className="pb-12">
								<div className="mt-4 relative border-2 h-56 border-dashed rounded-md cursor-pointer overflow-hidden border-gray-400">
									<input
										className="cursor-pointer w-full opacity-0 absolute inset-0"
										type="file"
										accept="image/*,video/*,audio/*,.glb"
										onClick={(e) => {
											e.target.value = null
										}}
										onChange={_setFile}
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
														fill="rgba(229, 231, 235, 0.5)"
													/>
												</svg>
												<p className="text-gray-200 mt-4 truncate text-center">
													{audioFile || threeDFile
														? audioFile
															? audioFile.name
															: threeDFile.name
														: imgFile.name}
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
														fill="rgba(229, 231, 235, 0.5)"
													/>
												</svg>
												<p className="text-sm text-gray-200 mt-2 opacity-50">
													{localeLn('Maximum30MB')}
												</p>
												<p className="text-sm text-gray-200 opacity-50">
													Supported image, video, audio, and 3D file
												</p>
											</div>
										)}
									</div>
								</div>
								<div
									className="flex items-center cursor-pointer mt-3"
									onClick={() => setShowMoreFile(!showMoreFile)}
								>
									<p className="text-gray-400 text-sm font-semibold mr-1 hover:text-gray-300">
										More
									</p>
									<div>
										<IconV size={18} />
									</div>
								</div>
								{showMoreFile && (
									<div>
										<div className="mt-2">
											<label className="block text-sm text-gray-100 mb-1">Playable In-frame</label>
											<div className="flex h-full space-x-1">
												<div className={`${iframeUrl ? `w-full` : `w-10/12`}`}>
													<input
														type="text"
														name="iframe"
														value={iframeInput}
														onChange={(e) => setIframeInput(e.target.value)}
														className={`focus:border-gray-600 bg-white bg-opacity-10 text-xs focus:bg-white focus:bg-opacity-10`}
														placeholder="Iframe URL"
													/>
												</div>
												<div
													className={`w-2/12 p-1 border-2 border-dashed border-gray-400 hover:text-opacity-30 transition-all text-white rounded-md text-xs cursor-pointer max-h-full flex items-center justify-center`}
													onClick={_setMoreFile}
												>
													Submit
												</div>
											</div>
										</div>
									</div>
								)}
								<div>
									<div className="flex justify-between p-4 absolute bottom-0 right-0 left-0">
										<button onClick={_handleBack}>{localeLn('Back')}</button>
										<div>{step + 1}/4</div>
										<button disabled={!imgFile && !imgUrl} onClick={() => setStep(step + 1)}>
											{localeLn('Next')}
										</button>
									</div>
								</div>
							</div>
						)}
						{step === 2 && (
							<form onSubmit={handleSubmit(_handleSubmitStep1)}>
								<div className="min-h-[60vh] pb-8">
									<div className="mt-2">
										<label className="block text-sm">{localeLn('Name')}</label>
										<InputText
											autoComplete="off"
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
										<div className="flex items-center justify-between">
											<label className="block text-sm">{localeLn('Description')}</label>
											<div className={`${watch('description')?.length >= 600 && 'text-red-500'}`}>
												<p className="text-sm">{watch('description')?.length || 0}/600</p>
											</div>
										</div>
										<InputTextarea
											type="text"
											name="description"
											ref={register({
												required: true,
												maxLength: 600,
											})}
											className={`${errors.description && 'error'} resize-none h-24`}
											placeholder="Card description"
										/>
										<div className="text-sm text-red-500">
											{errors.description?.type === 'required' && 'Description is required'}
										</div>
										<div className="text-sm text-red-500">
											{errors.description?.type === 'maxLength' &&
												'Description must be less than 600 characters'}
										</div>
									</div>
									<div className="mt-4">
										<label className="block text-sm">{localeLn('NumberOfCopies')}</label>
										<InputText
											type="number"
											name="supply"
											ref={register({
												required: true,
												min: 1,
												validate: (value) => Number.isInteger(Number(value)),
											})}
											className={`${errors.supply && 'error'}`}
											placeholder="Number of copies"
										/>
										<div className="mt-2 text-sm text-red-500">
											{errors.supply?.type === 'required' && 'Number of copies is required'}
										</div>
										<div className="mt-2 text-sm text-red-500">
											{errors.supply?.type === 'min' && 'Minimum 1 copy'}
										</div>
										<div className="mt-2 text-sm text-red-500">
											{errors.supply?.type === 'validate' && 'Only use rounded number'}
										</div>
									</div>
									<div className="mt-4">
										<div className="flex items-center justify-between mb-1">
											<label className="block text-sm">{localeLn('Attributes')}</label>
											<IconX
												className="cursor-pointer"
												onClick={() => append({ trait_type: '', value: '' })}
												size={20}
												style={{ transform: 'rotate(45deg)' }}
											/>
										</div>
										<Scrollbars ref={scrollBar} autoHeight={false} style={{ height: '200px' }}>
											{fields.map((attr, idx) => (
												<div key={attr.id} className="flex space-x-2 items-start mb-2">
													<InputTextAuto
														control={control}
														name={`attributes.${idx}.trait_type`}
														className={`${
															errors.attributes && errors.attributes[idx]?.trait_type && 'error'
														}`}
														defaultValue={formInput.attributes?.[idx]?.trait_type || ''}
														placeholder="Type"
														suggestionList={attributeKey}
													/>
													<InputTextAuto
														control={control}
														name={`attributes.${idx}.value`}
														className={`${
															errors.attributes && errors.attributes[idx]?.value && 'error'
														}`}
														defaultValue={formInput.attributes?.[idx]?.value || ''}
														placeholder="Value"
														suggestionList={Object.keys(
															attributeValue[watch(`attributes`)[idx]?.trait_type] || {}
														)}
													/>
													<div className="cursor-pointer self-center" onClick={() => remove(idx)}>
														<IconX className="relative z-10" size={20} />
													</div>
												</div>
											))}
										</Scrollbars>
									</div>
									<div className="flex justify-between p-4 absolute bottom-0 right-0 left-0">
										<button onClick={_handleBack}>Back</button>
										<div>{step + 1}/4</div>
										<button type="submit" onClick={handleSubmit(_handleSubmitStep1)}>
											{localeLn('Next')}
										</button>
									</div>
								</div>
							</form>
						)}
						{step === 3 && (
							<form onSubmit={handleSubmit(_handleSubmitStep2)} className="pb-12">
								<div className="mt-2">
									<div>
										<RoyaltyWatch control={control} fields={royaltyFields} append={royaltyAppend} />
										<Scrollbars ref={royaltyScrollBar} autoHeight autoHide>
											{royaltyFields.map((attr, idx) => (
												<div key={attr.id} className="flex space-x-2 items-center mb-2">
													<InputText
														ref={register({ required: true })}
														name={`royalties.${idx}.accountId`}
														className={`${
															errors.royalties && errors.royalties[idx]?.accountId && 'error'
														}`}
														defaultValue={formInput.royalties?.[idx]?.accountId || ''}
														placeholder="Account ID"
													/>
													<InputText
														ref={register({ required: true })}
														name={`royalties.${idx}.value`}
														type="number"
														className={`${
															errors.royalties && errors.royalties[idx]?.value && 'error'
														}`}
														defaultValue={formInput.royalties?.[idx]?.value || ''}
														placeholder="Value (10, 20, 30)"
													/>
													<div className="cursor-pointer" onClick={() => royaltyRemove(idx)}>
														<IconX className="relative z-10" size={20} />
													</div>
												</div>
											))}
										</Scrollbars>
									</div>
								</div>
								<div className="mt-4">
									<div className="flex items-center mb-2">
										<div className="pr-2">
											<input
												id="put-marketplace"
												className="w-auto"
												type="checkbox"
												defaultChecked={isOnSale}
												onChange={() => {
													setIsOnSale(!isOnSale)
												}}
											/>
										</div>
										<label htmlFor="put-marketplace" className="block text-sm">
											{localeLn('PutOnMarketplace')}
										</label>
									</div>
									{isOnSale && (
										<>
											<label className="block text-sm">{localeLn('SalePrice')}</label>
											<div className="relative">
												<InputText
													type="number"
													name="amount"
													ref={register({
														required: true,
														min: 0,
														max: 999999999,
													})}
													className={errors.amount && 'error'}
													placeholder="Card price per pcs"
												/>
												<div className="font-bold absolute right-0 top-0 bottom-0 flex items-center justify-center">
													<div className="pr-4">Ⓝ</div>
												</div>
											</div>
											{store.nearUsdPrice !== 0 && (
												<p>
													~$
													{prettyBalance(store.nearUsdPrice * watch('amount'), 0, 6)}
												</p>
											)}
											<div className="mt-2 text-sm text-red-500">
												{errors.amount?.type === 'required' && `Sale price is required`}
												{errors.amount?.type === 'min' && `Minimum 0`}
												{errors.amount?.type === 'max' && `Maximum 999,999,999 Ⓝ`}
											</div>
										</>
									)}
								</div>
								<div className="flex justify-between p-4 absolute bottom-0 right-0 left-0">
									<button onClick={_handleBack}>Back</button>
									<div>{step + 1}/4</div>
									<button
										disabled={isLoading === 3}
										type="submit"
										onClick={handleSubmit(_handleSubmitStep2)}
									>
										{localeLn('Next')}
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default NewPage
