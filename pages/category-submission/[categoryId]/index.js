import axios from 'axios'
import Link from 'next/link'
import router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Card from 'components/Card/Card'

import Footer from 'components/Footer'
import Modal from 'components/Modal'
import Nav from 'components/Nav'
import { useToast } from 'hooks/useToast'
import useStore from 'lib/store'
import { parseImgUrl, timeAgo } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import TokenSeriesDetailModal from 'components/TokenSeries/TokenSeriesDetailModal'
import WalletHelper from 'lib/WalletHelper'

const CategorySubmission = () => {
	const [submissions, setSubmissions] = useState(null)
	const { categoryId } = useRouter().query
	const currentUser = useStore((state) => state.currentUser)
	const toast = useToast()
	const { localeLn } = useIntl()
	useEffect(() => {
		getCategorySubmission()
	}, [])

	useEffect(() => {
		if (currentUser) {
			getCategorySubmission()
		}
	}, [categoryId, currentUser])

	const getCategorySubmission = async () => {
		const auth = await WalletHelper.authToken()
		if (categoryId) {
			try {
				const res = await axios.get(`${process.env.V2_API_URL}/categories/tokens/submission`, {
					params: {
						category_id: categoryId,
						status: 'pending',
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						authorization: auth,
					},
				})
				setSubmissions(res.data.data.results)
			} catch (error) {
				sentryCaptureException(error)
				if (error.response.status === 401) {
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
				}
			}
		}
	}

	const updateSubmissionData = (_id) => {
		const updatedData = submissions.filter((sbm) => sbm._id !== _id)
		setSubmissions(updatedData)
	}

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
			<div className="max-w-6xl relative m-auto p-4">
				<div className="text-white text-2xl mt-8">{localeLn('CategorySubmission')}</div>
				<div className="text-white font-bold text-4xl mb-8 capitalize">
					{categoryId && categoryId.split('-').join(' ')}
				</div>
				{submissions && submissions.length !== 0 ? (
					<div className="md:grid md:grid-cols-2 md:gap-4">
						{submissions.map((submission) => (
							<div key={submission._id} className="text-white">
								<SubmissionDetail submission={submission} updateData={updateSubmissionData} />
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

const SubmissionDetail = ({ submission, updateData }) => {
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
		const resp = await axios.get(`${process.env.V2_API_URL}/token-series`, {
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
			await axios.put(`${process.env.V2_API_URL}/categories/tokens/${type}`, params, {
				headers: {
					authorization: await WalletHelper.authToken(),
				},
			})
			setShowModal('')
			updateData(submission._id)
		} catch (error) {
			sentryCaptureException(error)
		}

		setIsLoading(false)
	}

	return (
		<>
			{showModal === 'accept' && (
				<Modal close={() => setShowModal('')} closeOnEscape={true} closeOnBgClick={true}>
					<div className="bg-dark-primary-1 w-full max-w-xs p-4 m-auto rounded-md text-center">
						<div className="font-bold text-2xl mb-4">Accept the card</div>
						<div className="mb-6 m-auto text-gray-400">
							<span>You are going to accept </span>
							<span className="font-bold text-white">{localToken?.metadata.title}</span>
							<span>
								{' '}
								{localeLn('To{categoryId}Category', {
									categoryId: submission.category_id,
								})}
							</span>
						</div>
						<button
							disabled={isLoading}
							className="w-full outline-none rounded-md bg-transparent text-sm font-semibold border-2 px-16 py-2 border-primary bg-primary text-gray-100"
							onClick={() => onSubmitSubmission('accept')}
							type="button"
						>
							{isLoading ? 'Loading' : 'Accept'}
						</button>
					</div>
				</Modal>
			)}
			{showModal === 'reject' && (
				<Modal close={() => setShowModal('')} closeOnEscape={true} closeOnBgClick={true}>
					<div className="bg-dark-primary-1 w-full max-w-xs p-4 m-auto rounded-md text-center">
						<div className="font-bold text-2xl mb-4">{localeLn('RejectTheCard')}</div>
						<div className="mb-6 m-auto text-gray-400">
							<span>{localeLn('GoingToReject')} </span>
							<span className="font-bold text-white">{localToken?.metadata.title}</span>
							<span>
								{' '}
								{localeLn('From{categoryId}Category', {
									categoryId: submission.category_id,
								})}
							</span>
						</div>
						<button
							disabled={isLoading}
							className="w-full outline-none rounded-md bg-transparent text-sm font-semibold border-2 px-16 py-2 border-red-600 bg-red-600 text-gray-100"
							onClick={() => onSubmitSubmission('reject')}
							type="button"
						>
							{isLoading ? localeLn('Loading') : localeLn('Reject')}
						</button>
					</div>
				</Modal>
			)}
			<div className="text-black">
				<TokenSeriesDetailModal tokens={[localToken]} />
			</div>
			<div className="flex flex-wrap border-2 border-dashed border-gray-800 p-4 md:p-8 rounded-md items-center">
				<div className="w-40 md:mr-6">
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
				<div className="mt-4">
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
							as={`/token/${localToken?.contract_id}::${localToken?.token_series_id}`}
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
						<button
							className="font-semibold w-32 rounded-md border-2 border-primary bg-primary text-gray-100"
							onClick={() => setShowModal('accept')}
							type="button"
						>
							{localeLn('Accept')}
						</button>
						<button
							className="font-semibold w-32 rounded-md border-2 bg-red-600 text-white border-red-600 mb-2"
							onClick={() => setShowModal('reject')}
							type="button"
						>
							{localeLn('Reject')}
						</button>
					</div>
				</div>
			</div>
		</>
	)
}
