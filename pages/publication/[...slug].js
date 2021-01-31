import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { EditorState, convertFromRaw } from 'draft-js'
import { createEditorStateWithText } from '@draft-js-plugins/editor'
import {
	FacebookIcon,
	FacebookShareButton,
	TwitterIcon,
	TwitterShareButton,
} from 'react-share'
import { useRouter } from 'next/router'

import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import Error from '../404'
import TextEditor from '../../components/TextEditor'
import LinkToProfile from '../../components/LinkToProfile'
import { parseDate, parseImgUrl } from '../../utils/common'
import Modal from '../../components/Modal'
import useStore from '../../store'
import Card from '../../components/Card'
import near from '../../lib/near'

const PublicationDetailPage = ({ errorCode, pubDetail, userProfile }) => {
	const store = useStore()
	const router = useRouter()
	const textAreaRef = useRef(null)
	const [showModal, setShowModal] = useState('')
	const [isCopied, setIsCopied] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [isComponentMounted, setIsComponentMounted] = useState(false)

	useEffect(() => {
		setIsComponentMounted(true)
	}, [])

	if (errorCode) {
		return <Error />
	}

	const headMeta = {
		title: `${pubDetail.title} — Paras`,
		description: pubDetail.description,
		// image: `${process.env.API_URL}/socialCard/${token.tokenId}`,
	}

	const _copyLink = () => {
		textAreaRef.current.select()
		document.execCommand('copy')

		setIsCopied(true)

		setTimeout(() => {
			setShowModal(false)
			setIsCopied(false)
		}, 1500)
	}

	const _deletePublication = async () => {
		setIsDeleting(true)
		try {
			await axios.delete(
				`${process.env.API_URL}/publications/${pubDetail._id}`,
				{
					headers: {
						authorization: await near.authToken(),
					},
				}
			)
			setTimeout(() => {
				router.push('/publication/community')
			}, 1000)
		} catch (err) {
			const msg =
				err.response?.data?.message || `Something went wrong, try again later`
			setIsDeleting(false)
		}
	}

	return (
		<div>
			<div
				className="min-h-screen bg-dark-primary-1"
				style={{
					backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
				}}
			>
				<Head>
					<title>{headMeta.title}</title>
					<meta name="description" content={headMeta.description} />

					<meta name="twitter:title" content={headMeta.title} />
					<meta name="twitter:card" content="summary_large_image" />
					<meta name="twitter:site" content="@ParasHQ" />
					<meta name="twitter:url" content="https://paras.id" />
					<meta name="twitter:description" content={headMeta.description} />
					{/* <meta name="twitter:image" content={headMeta.image} /> */}
					<meta property="og:type" content="website" />
					<meta property="og:title" content={headMeta.title} />
					<meta property="og:site_name" content={headMeta.title} />
					<meta property="og:description" content={headMeta.description} />
					<meta property="og:url" content="https://paras.id" />
					<meta property="og:image" content={headMeta.image} />
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
							ref={textAreaRef}
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
							<div
								className="py-2 cursor-pointer"
								onClick={(_) => {
									setShowModal('shareTo')
								}}
							>
								Share to...
							</div>
							{/* {store.currentUser === pubDetail.authorId && (
								<div
									className="py-2 cursor-pointer"
									onClick={(_) => setShowModal('confirmTransfer')}
								>
									Update my publication
								</div>
							)} */}
							{store.currentUser === pubDetail.authorId && (
								<div
									className="py-2 cursor-pointer"
									onClick={(_) => setShowModal('confirmDelete')}
								>
									Delete my publication
								</div>
							)}
						</div>
					</Modal>
				)}
				{showModal === 'confirmDelete' && (
					<Modal
						close={(_) => setShowModal('')}
						closeOnBgClick={true}
						closeOnEscape={true}
					>
						<div className="max-w-sm w-full p-4 bg-gray-100 m-auto rounded-md">
							<h1 className="text-2xl font-bold text-gray-900 tracking-tight">
								Confirm Delete
							</h1>
							<p className="text-gray-900 mt-2">
								You are about to delete <b>{pubDetail.title}</b>
							</p>
							<button
								className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
								type="submit"
								onClick={_deletePublication}
							>
								{isDeleting ? 'Deleting...' : 'Delete my publication'}
							</button>
						</div>
					</Modal>
				)}
				{showModal === 'shareTo' && (
					<Modal close={(_) => setShowModal('')}>
						<div className="max-w-sm w-full px-4 py-2 bg-gray-100 m-auto rounded-md">
							<div className="py-2 cursor-pointer">
								<TwitterShareButton
									title={`Read ${pubDetail.title} only at @ParasHQ\n\n#cryptoart #digitalart #tradingcards`}
									url={window.location.href}
									className="flex items-center w-full"
								>
									<TwitterIcon
										size={24}
										className="rounded-md"
										bgStyle={{
											fill: '#11111F',
										}}
									/>
									<p className="pl-2">Twitter</p>
								</TwitterShareButton>
							</div>
							<div className="py-2 cursor-pointer">
								<FacebookShareButton
									url={window.location.href}
									className="flex items-center w-full"
								>
									<FacebookIcon
										size={24}
										className="rounded-md"
										bgStyle={{
											fill: '#11111F',
										}}
									/>
									<p className="pl-2">Facebook</p>
								</FacebookShareButton>
							</div>
						</div>
					</Modal>
				)}
				<div className="max-w-5xl relative m-auto py-12">
					<h1 className="titlePublication text-4xl font-bold pb-0 text-center px-4 md:px-0">
						{pubDetail.title}
					</h1>
					<div className="m-auto max-w-3xl">
						<div className="p-4 pt-8 flex justify-between">
							<div className="flex space-x-4">
								<Link href={`/${pubDetail.authorId}`}>
									<div className="w-16 h-16 rounded-full overflow-hidden bg-primary cursor-pointer">
										<img
											src={parseImgUrl(userProfile.imgUrl)}
											className="object-cover"
										/>
									</div>
								</Link>
								<div className="m-auto">
									<LinkToProfile
										accountId={pubDetail.authorId}
										className="text-white font-bold hover:border-white text-xl"
									/>
									<p className="text-white m-auto text-sm">
										{parseDate(pubDetail.updatedAt)}
									</p>
								</div>
							</div>
							<div>
								<svg
									className="cursor-pointer m-auto"
									onClick={(_) => setShowModal('options')}
									width="24"
									height="24"
									viewBox="0 0 29 7"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<rect
										width="6.78723"
										height="6.78723"
										rx="2"
										transform="matrix(1 0 0 -1 0 6.78711)"
										fill="white"
									/>
									<rect
										width="6.78723"
										height="6.78723"
										rx="2"
										transform="matrix(1 0 0 -1 11.1064 6.78711)"
										fill="white"
									/>
									<rect
										width="6.78723"
										height="6.78723"
										rx="2"
										transform="matrix(1 0 0 -1 22.2126 6.78711)"
										fill="white"
									/>
								</svg>
							</div>
						</div>
						<TextEditor
							title={createEditorStateWithText(pubDetail.title)}
							hideTitle={true}
							content={EditorState.createWithContent(
								convertFromRaw(pubDetail.content)
							)}
							readOnly={true}
						/>
					</div>
					<div className="md:flex">
						{pubDetail.tokenIds?.map((tokenId) => (
							<EmbeddedCard key={tokenId} tokenId={tokenId} />
						))}
					</div>
				</div>
				<Footer />
			</div>
		</div>
	)
}

const EmbeddedCard = ({ tokenId }) => {
	const [localToken, setLocalToken] = useState(null)

	useEffect(() => {
		fetchToken()
	}, [])

	const fetchToken = async () => {
		const res = await axios(`${process.env.API_URL}/tokens?tokenId=${tokenId}`)
		const token = (await res.data.data.results[0]) || null
		setLocalToken(token)
	}

	return (
		<div className="inline-block p-4 rounded-md w-full md:max-w-lg">
			<div className="w-64 mx-auto">
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
				/>
			</div>
			<div className="text-gray-100 pt-4 text-center">
				<div>
					<Link href={`/token/${localToken?.tokenId}`}>
						<a
							title={localToken?.metadata?.name}
							className="text-2xl font-bold border-b-2 border-transparent"
						>
							{localToken?.metadata?.name}
						</a>
					</Link>
				</div>
				<p className="opacity-75 truncate">
					{localToken?.metadata?.collection}
				</p>
			</div>
		</div>
	)
}

export async function getServerSideProps({ params }) {
	const { slug } = params
	const id = slug[1].split('-')
	const slugName = id.slice(0, id.length - 1).join('-')

	const resp = await axios(
		`${process.env.API_URL}/publications?type=${slug[0]}&_id=${
			id[id.length - 1]
		}`
	)
	const pubDetail = (await resp.data?.data?.results[0]) || null
	const errorCode = pubDetail && slugName === pubDetail.slug ? false : 404

	const profileRes = await axios(
		`${process.env.API_URL}/profiles?accountId=${pubDetail?.authorId}`
	)
	const userProfile = (await profileRes.data.data.results[0]) || null

	return { props: { pubDetail, errorCode, userProfile, slugName } }
}

export default PublicationDetailPage
