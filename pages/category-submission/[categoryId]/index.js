import ParasRequest from 'lib/ParasRequest'
import Link from 'next/link'
import router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Card from 'components/Card/Card'

import Footer from 'components/Footer'
import Nav from 'components/Nav'
import { useToast } from 'hooks/useToast'
import { parseImgUrl, timeAgo } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import TokenSeriesDetailModal from 'components/TokenSeries/TokenSeriesDetailModal'
import SelectAllSubmission from 'components/Categories/Submission/SelectAllSubmission'
import SortBySubmission from 'components/Categories/Submission/SortBySubmission'
import SubmissionSubmitModal from 'components/Modal/SubmissionSubmitModal'
import Button from 'components/Common/Button'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import useSWRInfinite from 'swr/infinite'

const CategorySubmission = () => {
	const LIMIT = 8
	const [submissions, setSubmissions] = useState(null)
	const [selectedSubmissions, setSelectedSubmissions] = useState({})
	const [selectedAllSubmissions, setSelectedAllSubmissions] = useState(false)
	const [showMultipleModal, setShowMultipleModal] = useState('')
	const [isMultipleLoading, setIsMultipleLoading] = useState(false)
	const [sortAttributes, setSortAttributes] = useState('')
	const { categoryId } = useRouter().query
	const toast = useToast()
	const { localeLn } = useIntl()

	const getKeySubmissionData = (index, prevData) => {
		if (!categoryId) return
		if (prevData && prevData.length < LIMIT) return
		const params = {
			category_id: categoryId,
			status: 'pending',
			__limit: LIMIT,
			__skip: index * LIMIT,
			...(sortAttributes === 'recent' && { __sort: 'issued_at::-1' }),
			...(sortAttributes === 'latest' && { __sort: 'issued_at::1' }),
			...(sortAttributes === 'az' && { __sort: 'token.metadata.title::1' }),
			...(sortAttributes === 'za' && { __sort: 'token.metadata,title::-1' }),
			...(sortAttributes === 'lowest_price' && { __sort: 'token_series.price::1' }),
			...(sortAttributes === 'highest_price' && { __sort: 'token_series.price::-1' }),
			...(sortAttributes === 'lowest_amount' && { __sort: 'token.metadata.copies::1' }),
			...(sortAttributes === 'highest_amount' && { __sort: 'token.metadata.copies::-1' }),
		}
		if (index === 0) return params
		const lastData = prevData[prevData.length - 1]
		return {
			...params,
			_id_next: lastData._id,
			...((sortAttributes === 'recent' || sortAttributes === 'latest') && {
				issued_at_next: lastData.issued_at,
			}),
			...((sortAttributes === 'lowest_price' || sortAttributes === 'highest_price') && {
				token_series_price_next: lastData.token_series
					? lastData.token.token_series.price
						? lastData.token_series.price.$numberDecimal
						: null
					: null,
			}),
			...((sortAttributes === 'lowest_amount' || sortAttributes === 'highest_amount') && {
				token_metadata_copy_next: lastData.token_series
					? lastData.token_series.metadata.copies
					: null,
			}),
		}
	}

	const fetcherSubmissionData = async (key) => {
		try {
			const res = await ParasRequest.get(`${process.env.V2_API_URL}/categories/tokens/submission`, {
				params: key,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			})
			return res.data.data.results
		} catch (error) {
			const err = new Error('An 401 unauthorized error.')
			err.status = 401
			throw err
		}
	}

	const {
		data: _submissionsData,
		isValidating,
		size,
		setSize,
		mutate,
	} = useSWRInfinite(getKeySubmissionData, fetcherSubmissionData, {
		revalidateFirstPage: false,
		errorRetryCount: 2,
		onErrorRetry: (err, key, config, revalidate, { retryCount }) => {
			if (retryCount >= 10) return
			if (retryCount > 2) {
				sentryCaptureException('error unauthorized account to access submission category page')
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							{localeLn('DontHavePermission')}
						</div>
					),
					type: 'error',
					duration: 2500,
				})
				router.push('/')
				return
			}
			if (err) setTimeout(() => revalidate({ retryCount }), 200)
		},
	})

	const submissionsData = _submissionsData ? [].concat(..._submissionsData) : []
	const isEmpty = _submissionsData?.[0]?.length === 0
	const isReachingEnd =
		isEmpty || (_submissionsData && _submissionsData[_submissionsData.length - 1]?.length < LIMIT)

	const updateSubmissionData = (_id) => {
		const updatedData = submissions.filter((sbm) => sbm._id !== _id)
		setSubmissions(updatedData)
	}

	const onSubmitMultipleSubmission = async (type) => {
		setIsMultipleLoading(true)
		const params = submissionsData
			.filter((submission) => Object.keys(selectedSubmissions).includes(submission._id))
			.map((submission) => {
				return {
					contract_id: submission.contract_id,
					token_series_id: submission.token_series_id,
					category_id: submission.category_id,
					storeToSheet: submission.category_id === 'art-competition' ? 'true' : 'false',
					msg: 'ok',
				}
			})
		try {
			await ParasRequest.put(`${process.env.V2_API_URL}/categories/tokens/${type}/bulk`, params)
			mutate()
			setShowMultipleModal('')
		} catch (error) {
			sentryCaptureException(error)
		}
		setIsMultipleLoading(false)
	}

	useEffect(() => {
		if (window !== undefined)
			window.onscroll = () => {
				if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
					!isReachingEnd && !isValidating && setSize(size + 1)
				}
			}
	}, [submissionsData, size])

	return (
		<div className="min-h-screen bg-black">
			<Nav />
			<div
				className="fixed inset-0 opacity-75"
				style={{
					zIndex: 0,
					backgroundImage: `url('/bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			></div>
			{showMultipleModal === 'accept' && (
				<SubmissionSubmitModal
					type="accept"
					multiple
					onClose={() => setShowMultipleModal('')}
					categoryId={categoryId}
					isLoading={isMultipleLoading}
					onSubmitSubmission={onSubmitMultipleSubmission}
				/>
			)}
			{showMultipleModal === 'reject' && (
				<SubmissionSubmitModal
					type="reject"
					multiple
					onClose={() => setShowMultipleModal('')}
					categoryId={categoryId}
					isLoading={isMultipleLoading}
					onSubmitSubmission={onSubmitMultipleSubmission}
				/>
			)}
			<div className="max-w-6xl relative m-auto p-4">
				<div className="text-white text-2xl mt-8">{localeLn('CategorySubmission')}</div>
				<div className="text-white font-bold text-4xl mt-4 capitalize">
					{categoryId && categoryId.split('-').join(' ')}
				</div>
				<div className="flex items-center justify-end mt-4 space-x-2 flex-wrap">
					{(Object.keys(selectedSubmissions).some((selected) => selectedSubmissions[selected]) ||
						selectedAllSubmissions) && (
						<>
							<Button size="md" variant="primary" onClick={() => setShowMultipleModal('accept')}>
								{localeLn('Accept')}
							</Button>
							<Button size="md" variant="error" onClick={() => setShowMultipleModal('reject')}>
								{localeLn('Reject')}
							</Button>
						</>
					)}
					<SelectAllSubmission
						setSelectedSubmissions={setSelectedSubmissions}
						selectedAllSubmissions={selectedAllSubmissions}
						setSelectedAllSubmissions={setSelectedAllSubmissions}
					/>
					<SortBySubmission sortAttributes={sortAttributes} setSortAttributes={setSortAttributes} />
				</div>
				{submissionsData && submissionsData.length !== 0 ? (
					<div className="md:grid md:grid-cols-2 md:gap-4 mt-4">
						{submissionsData.map((submission) => (
							<div key={submission._id} className="text-white">
								<SubmissionDetail
									submission={submission}
									updateData={updateSubmissionData}
									selectedSubmissions={selectedSubmissions}
									setSelectedSubmissions={setSelectedSubmissions}
									selectedAllSubmissions={selectedAllSubmissions}
								/>
							</div>
						))}
					</div>
				) : (
					<div className="md:w-1/2 text-gray-100 border-2 border-dashed border-gray-800 rounded-md p-4 h-40 flex items-center justify-center">
						<p>{localeLn('NoCardSubmission')}</p>
					</div>
				)}
			</div>
			<Footer />
		</div>
	)
}

export default CategorySubmission

const SubmissionDetail = ({
	submission,
	updateData,
	selectedSubmissions,
	setSelectedSubmissions,
	selectedAllSubmissions,
}) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [showModal, setShowModal] = useState('')
	const [localToken, setLocalToken] = useState(null)
	const { localeLn } = useIntl()
	useEffect(() => {
		if (submission.contract_id && submission.token_series_id) {
			fetchTokenSeries()
		}
	}, [submission])

	const fetchTokenSeries = async () => {
		const resp = await ParasRequest.get(`${process.env.V2_API_URL}/token-series`, {
			params: {
				token_series_id: submission.token_series_id,
				contract_id: submission.contract_id,
				creator_id: submission.account_id,
			},
		})
		if (resp.data.data.results.length > 0) {
			setLocalToken(resp.data.data.results[0])
		}
	}

	const onSubmitSubmission = async (type) => {
		const params = {
			category_id: submission.category_id,
			token_series_id: submission.token_series_id,
			contract_id: submission.contract_id,
			storeToSheet: submission.category_id === 'art-competition' ? 'true' : 'false',
			msg: 'ok',
		}

		setIsLoading(true)

		try {
			await ParasRequest.put(`${process.env.V2_API_URL}/categories/tokens/${type}`, params)
			setShowModal('')
			updateData(submission._id)
		} catch (error) {
			sentryCaptureException(error)
		}

		setIsLoading(false)
	}

	const handleSelect = (_id) => {
		setSelectedSubmissions((prev) => ({
			...prev,
			[_id]: !prev[_id],
		}))
	}

	return (
		<>
			{showModal === 'accept' && (
				<SubmissionSubmitModal
					type="accept"
					onClose={() => setShowModal('')}
					categoryId={submission.category_id}
					isLoading={isLoading}
					onSubmitSubmission={onSubmitSubmission}
					token={localToken}
				/>
			)}
			{showModal === 'reject' && (
				<SubmissionSubmitModal
					type="reject"
					onClose={() => setShowModal('')}
					categoryId={submission.category_id}
					isLoading={isLoading}
					onSubmitSubmission={onSubmitSubmission}
					token={localToken}
				/>
			)}
			<div className="text-black">
				<TokenSeriesDetailModal tokens={[localToken]} />
			</div>
			<div className="flex flex-wrap border-2 border-dashed border-gray-800 p-4 md:p-8 rounded-md items-center">
				<div className="w-full flex items-center mb-4">
					<input
						type="checkbox"
						className="w-4 h-4 my-auto mr-1"
						onChange={() => handleSelect(submission._id)}
						checked={selectedAllSubmissions || selectedSubmissions[submission._id] === true}
					/>
				</div>
				<div className="w-full md:w-40 md:mr-6">
					<Card
						imgUrl={parseImgUrl(localToken?.metadata.media, null, {
							width: `600`,
							useOriginal: process.env.APP_ENV === 'production' ? false : true,
						})}
						imgBlur={localToken?.metadata.blurhash}
						token={{
							title: localToken?.metadata.title,
							edition_id: localToken?.edition_id,
							collection: localToken?.metadata.collection || localToken?.contract_id,
							copies: localToken?.metadata.copies,
							creatorId: localToken?.metadata.creator_id || localToken?.contract_id,
							is_creator: localToken?.is_creator,
						}}
					/>
				</div>
				<div className="mt-4 md:mt-0 flex flex-col justify-center">
					<div className="flex items-center space-x-2 mb-4">
						<div className="text-[10px] font-normal text-white bg-dark-primary-2 border border-dark-primary-8 rounded-md pt-1 py-1 px-2">
							{submission.token_series
								? `Edition of ${submission.token_series.metadata.copies}`
								: `Open Edition`}
						</div>
						<div className="text-[10px] font-normal text-white bg-dark-primary-2 border border-dark-primary-8 rounded-md pt-1 py-1 px-2">
							{submission.token_series
								? `Sale on ${formatNearAmount(
										submission.token_series.price ? submission.token_series.price.$numberDecimal : 0
								  )} Ⓝ`
								: `Not for sale`}
						</div>
					</div>
					<div className="overflow-hidden truncate">
						<Link
							href={{
								pathname: router.pathname,
								query: {
									...router.query,
									tokenSeriesId: localToken?.token_series_id,
									contractId: localToken?.contract_id,
								},
							}}
							as={`/token/${localToken?.contract_id}::${encodeURIComponent(
								localToken?.token_series_id
							)}`}
							scroll={false}
							shallow
						>
							<a
								title={localToken?.metadata?.title}
								className="text-2xl font-bold border-b-2 border-transparent hover:border-gray-100"
							>
								{localToken?.metadata?.title}
							</a>
						</Link>
					</div>
					<p className="opacity-75 truncate mb-4">{localToken?.metadata.collection}</p>
					<p className="mt-2 text-sm opacity-50 mb-8">{timeAgo.format(submission.issued_at)}</p>
					<div className="space-x-4">
						<Button size="md" variant="primary" onClick={() => setShowModal('accept')}>
							{localeLn('Accept')}
						</Button>
						<Button size="md" variant="error" onClick={() => setShowModal('reject')}>
							{localeLn('Reject')}
						</Button>
					</div>
				</div>
			</div>
		</>
	)
}
