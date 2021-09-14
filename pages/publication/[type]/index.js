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

import Nav from '../../../components/Nav'
import Footer from '../../../components/Footer'
import Error from '../../404'
import TextEditor from '../../../components/TextEditor'
import LinkToProfile from '../../../components/LinkToProfile'
import { parseDate, parseImgUrl } from '../../../utils/common'
import Modal from '../../../components/Modal'
import useStore from '../../../lib/store'
import near from '../../../lib/near'
import EmbeddedCard from '../../../components/EmbeddedCard'
import { useToast } from '../../../hooks/useToast'

const PublicationDetailPage = ({ errorCode, pubDetail, userProfile }) => {
	const store = useStore()
	const router = useRouter()
	const toast = useToast()
	const textAreaRef = useRef(null)
	const [content, setContent] = useState(
		EditorState.createWithContent(convertFromRaw(pubDetail.content))
	)
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
		title: `${pubDetail.title} — Paras Publication`,
		description: pubDetail.description,
		image: parseImgUrl(pubDetail.thumbnail),
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
				`${process.env.V2_API_URL}/publications/${pubDetail._id}`,
				{
					headers: {
						authorization: await near.authToken(),
					},
				}
			)
			setTimeout(() => {
				router.push('/publication')
			}, 1000)
		} catch (err) {
			const msg =
				err.response?.data?.message || `Something went wrong, try again later`
			toast.show({
				text: <div className="font-semibold text-center text-sm">{msg}</div>,
				type: 'error',
				duration: 2500,
			})
			setIsDeleting(false)
		}
	}

	return (
		<div>
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
					<title>{headMeta.title}</title>
					<meta name="description" content={headMeta.description} />

					<meta name="twitter:title" content={headMeta.title} />
					<meta name="twitter:card" content="summary_large_image" />
					<meta name="twitter:site" content="@ParasHQ" />
					<meta name="twitter:url" content="https://paras.id" />
					<meta name="twitter:description" content={headMeta.description} />
					<meta name="twitter:image" content={headMeta.image} />
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
					<Modal close={() => setShowModal('')}>
						<div className="max-w-sm w-full px-4 py-2 bg-gray-100 m-auto rounded-md">
							<div className="py-2 cursor-pointer" onClick={() => _copyLink()}>
								{isCopied ? `Copied` : `Copy Link`}
							</div>
							<div
								className="py-2 cursor-pointer"
								onClick={() => {
									setShowModal('shareTo')
								}}
							>
								Share to...
							</div>
							{store.currentUser === pubDetail.author_id && (
								<Link href={`/publication/edit/${pubDetail._id}`}>
									<div
										className="py-2 cursor-pointer"
										onClick={() => setShowModal('confirmTransfer')}
									>
										Update publication
									</div>
								</Link>
							)}
							{store.currentUser === pubDetail.author_id && (
								<div
									className="py-2 cursor-pointer"
									onClick={() => setShowModal('confirmDelete')}
								>
									Delete
								</div>
							)}
						</div>
					</Modal>
				)}
				{showModal === 'confirmDelete' && (
					<Modal
						close={() => setShowModal('')}
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
								disabled={isDeleting}
								onClick={_deletePublication}
							>
								{isDeleting ? 'Deleting...' : 'Delete my publication'}
							</button>
						</div>
					</Modal>
				)}
				{showModal === 'shareTo' && (
					<Modal close={() => setShowModal('')}>
						<div className="max-w-sm w-full px-4 py-2 bg-gray-100 m-auto rounded-md">
							<div className="py-2 cursor-pointer">
								<TwitterShareButton
									title={`Read ${pubDetail.title} only at @ParasHQ\n\n#card4card #cryptoart #digitalart #tradingcards`}
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
				<div className="max-w-5xl relative m-auto pb-12 pt-4">
					<p className="mb-8 px-4 max-w-3xl m-auto text-gray-400">
						<Link href={`/publication`}>
							<span className="cursor-pointer">Publication</span>
						</Link>
						{' > '}
						<Link href={`/publication?type=${pubDetail.type}`}>
							<span className="cursor-pointer capitalize">
								{pubDetail.type}
							</span>
						</Link>
						{' > '}
						<span className="font-semibold text-white">{pubDetail.title}</span>
					</p>
					<h1 className="titlePublication text-4xl font-bold pb-0 text-center px-4 md:px-0">
						{pubDetail.title}
					</h1>
					<div className="m-auto max-w-3xl px-4 pt-8">
						<div className="flex justify-between">
							<div className="flex space-x-4">
								<Link href={`/${pubDetail.author_id}`}>
									<div className="w-16 h-16 rounded-full overflow-hidden bg-primary cursor-pointer">
										<img
											src={parseImgUrl(userProfile?.imgUrl, null, {
												width: `800`,
											})}
											className="object-cover"
										/>
									</div>
								</Link>
								<div className="m-auto">
									<LinkToProfile
										accountId={pubDetail.author_id}
										className="text-white font-bold hover:border-white text-xl"
									/>
									<p className="text-white m-auto text-sm">
										{parseDate(pubDetail.updated_at)}
									</p>
								</div>
							</div>
							<div>
								<svg
									className="cursor-pointer m-auto"
									onClick={() => setShowModal('options')}
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
							content={content}
							setContent={setContent}
							readOnly={true}
						/>
					</div>
					{pubDetail.contract_token_ids &&
						pubDetail.contract_token_ids.length !== 0 && (
							<div className="max-w-4xl mx-auto px-4 pt-16">
								<div className=" border-2 border-dashed border-gray-800 rounded-md p-4 md:p-8">
									<h4 className="text-white font-semibold text-3xl md:mb-4 text-center">
										Digital Collectibles
									</h4>
									<div
										className={`flex flex-wrap ${
											pubDetail.contract_token_ids.length <= 3 &&
											'justify-center'
										}`}
									>
										{pubDetail.contract_token_ids?.map((tokenId, index) => (
											<div
												key={index}
												className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-8"
											>
												<EmbeddedCard tokenId={tokenId} />
											</div>
										))}
									</div>
								</div>
							</div>
						)}
				</div>
				<Footer />
			</div>
		</div>
	)
}

export async function getServerSideProps({ params }) {
	const { type } = params
	const id = type.split('-')
	const slugName = id.slice(0, id.length - 1).join('-')

	const resp = await axios(
		`${process.env.V2_API_URL}/publications?_id=${id[id.length - 1]}`
	)

	const pubDetail = (await resp.data?.data?.results[0]) || null

	const errorCode = pubDetail ? false : 404

	const profileRes = await axios(
		`${process.env.V2_API_URL}/profiles?accountId=${pubDetail?.author_id}`
	)
	const userProfile = (await profileRes.data.data.results[0]) || null

	return { props: { pubDetail, errorCode, userProfile, slugName } }
}

export default PublicationDetailPage
