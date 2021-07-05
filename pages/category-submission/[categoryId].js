import Axios from 'axios'
import Link from 'next/link'
import router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Card from '../../components/Card'
import CardDetailModal from '../../components/CardDetailModal'
import Footer from '../../components/Footer'
import Modal from '../../components/Modal'
import Nav from '../../components/Nav'
import { useToast } from '../../hooks/useToast'
import near from '../../lib/near'
import useStore from '../../store'
import { parseImgUrl, timeAgo } from '../../utils/common'

const CategorySubmission = () => {
	const [submissions, setSubmissions] = useState(null)
	const { categoryId } = useRouter().query
	const currentUser = useStore((state) => state.currentUser)
	const toast = useToast()

	useEffect(() => {
		getCategorySubmission()
	}, [])

	useEffect(() => {
		if (currentUser) {
			getCategorySubmission()
		}
	}, [categoryId, currentUser])

	const getCategorySubmission = async () => {
		const auth = await near.authToken()
		if (categoryId) {
			try {
				const res = await Axios.get(
					`${process.env.API_URL}/categories/tokens/submission`,
					{
						params: {
							categoryId: categoryId,
							status: 'pending',
						},
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							authorization: auth,
						},
					}
				)
				setSubmissions(res.data.data.results)
			} catch (error) {
				if (error.response.status === 401) {
					toast.show({
						text: (
							<div className="font-semibold text-center text-sm">
								You dont have permission
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

	const updateSubmissionData = (id) => {
		const updatedData = submissions.filter((sbm) => sbm.id !== id)
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
				<div className="text-white text-2xl mt-8">Category submission</div>
				<div className="text-white font-bold text-4xl mb-8 capitalize">
					{categoryId && categoryId.split('-').join(' ')}
				</div>
				{submissions && submissions.length !== 0 ? (
					<div className="md:grid md:grid-cols-2 md:gap-4">
						{submissions.map((submission) => (
							<div key={submission.id} className="text-white">
								<SubmissionDetail
									tokenId={submission.tokenId}
									submission={submission}
									updateData={updateSubmissionData}
								/>
							</div>
						))}
					</div>
				) : (
					<div className="md:w-1/2 text-gray-100 border-2 border-dashed border-gray-800 rounded-md p-4 h-40 flex items-center justify-center">
						<p>No Card Submission Found</p>
					</div>
				)}
			</div>
			<Footer />
		</div>
	)
}

export default CategorySubmission

const SubmissionDetail = ({ tokenId, submission, updateData }) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [showModal, setShowModal] = useState('')

	const fetcher = async (key) => {
		const resp = await Axios.get(`${process.env.API_URL}/${key}`)
		if (resp.data.data.results.length > 0) {
			return resp.data.data.results[0]
		} else {
			return {}
		}
	}

	const onSubmitSubmission = async (type) => {
		const query = {
			categoryId: submission.categoryId,
			tokenId: tokenId,
			msg: 'ok',
		}

		setIsLoading(true)

		try {
			await Axios.put(
				`${process.env.API_URL}/categories/tokens/${type}`,
				query,
				{
					headers: {
						authorization: await near.authToken(),
					},
				}
			)
			setShowModal('')
			updateData(submission.id)
		} catch (error) {
			console.log(error.response)
		}

		setIsLoading(false)
	}

	const { data: localToken } = useSWR(`tokens?tokenId=${tokenId}`, fetcher)

	return (
		<>
			{showModal === 'accept' && (
				<Modal
					close={() => setShowModal('')}
					closeOnEscape={true}
					closeOnBgClick={true}
				>
					<div className="bg-dark-primary-1 w-full max-w-xs p-4 m-auto rounded-md text-center">
						<div className="font-bold text-2xl mb-4">Accept the card</div>
						<div className="mb-6 m-auto text-gray-400">
							<span>You are going to accept </span>
							<span className="font-bold text-white">
								{localToken.metadata.name}
							</span>
							<span> to {submission.categoryId} category</span>
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
				<Modal
					close={() => setShowModal('')}
					closeOnEscape={true}
					closeOnBgClick={true}
				>
					<div className="bg-dark-primary-1 w-full max-w-xs p-4 m-auto rounded-md text-center">
						<div className="font-bold text-2xl mb-4">Reject the card</div>
						<div className="mb-6 m-auto text-gray-400">
							<span>You are going to reject </span>
							<span className="font-bold text-white">
								{localToken.metadata.name}
							</span>
							<span> from {submission.categoryId} category</span>
						</div>
						<button
							disabled={isLoading}
							className="w-full outline-none rounded-md bg-transparent text-sm font-semibold border-2 px-16 py-2 border-red-600 bg-red-600 text-gray-100"
							onClick={() => onSubmitSubmission('reject')}
							type="button"
						>
							{isLoading ? 'Loading' : 'Reject'}
						</button>
					</div>
				</Modal>
			)}
			<div className="text-black">
				<CardDetailModal tokens={[localToken]} />
			</div>
			<div className="flex flex-wrap border-2 border-dashed border-gray-800 p-4 md:p-8 rounded-md items-center">
				<div className="w-40 md:mr-6">
					<Card
						imgUrl={parseImgUrl(localToken?.metadata?.image)}
						imgBlur={localToken?.metadata?.blurhash}
						token={{
							name: localToken?.metadata?.name,
							collection: localToken?.metadata?.collection,
							description: localToken?.metadata?.description,
							creatorId: localToken?.creatorId,
							supply: localToken?.supply,
							tokenId: localToken?.tokenId,
							createdAt: localToken?.createdAt,
						}}
						initialRotate={{
							x: 0,
							y: 0,
						}}
						disableFlip={true}
					/>
				</div>
				<div className="mt-4">
					<div className="overflow-hidden truncate">
						<Link
							href={{
								pathname: router.pathname,
								query: {
									...router.query,
									...{ tokenId: localToken?.tokenId },
									...{ prevAs: router.asPath },
								},
							}}
							as={`/token/${localToken?.tokenId}`}
							scroll={false}
							shallow
						>
							<a
								title={localToken?.metadata?.name}
								className="text-2xl font-bold border-b-2 border-transparent hover:border-gray-100"
							>
								{localToken?.metadata?.name}
							</a>
						</Link>
					</div>
					<p className="opacity-75 truncate mb-4">
						{localToken?.metadata?.collection}
					</p>
					<p className="mt-2 text-sm opacity-50 mb-8">
						{timeAgo.format(submission.createdAt)}
					</p>
					<div className="space-x-4">
						<button
							className="font-semibold w-32 rounded-md border-2 border-primary bg-primary text-gray-100"
							onClick={() => setShowModal('accept')}
							type="button"
						>
							Accept
						</button>
						<button
							className="font-semibold w-32 rounded-md border-2 bg-red-600 text-white border-red-600 mb-2"
							onClick={() => setShowModal('reject')}
							type="button"
						>
							Reject
						</button>
					</div>
				</div>
			</div>
		</>
	)
}
