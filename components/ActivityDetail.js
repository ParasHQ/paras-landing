import JSBI from 'jsbi'
import useSWR from 'swr'
import { Fragment, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import {
	FacebookIcon,
	FacebookShareButton,
	TwitterIcon,
	TwitterShareButton,
} from 'react-share'

import Card from './Card'
import LinkToProfile from './LinkToProfile'
import Modal from './Modal'

import useStore from '../store'
import { parseImgUrl, prettyBalance, timeAgo } from '../utils/common'

export const descriptionMaker = (activity, token) => {
	if (activity.type === 'marketUpdate') {
		return `${activity.from} put ${
			token?.metadata.name
		} on sale for ${prettyBalance(activity.amount, 24, 4)} Ⓝ`
	}

	if (activity.type === 'marketDelete') {
		return `${activity.from} removed ${token?.metadata.name} from sale`
	}

	if (activity.type === 'marketBuy') {
		return `${activity.from} bought ${activity.quantity}pcs of ${
			token?.metadata.name
		} from ${activity.to} for ${prettyBalance(activity.amount, 24, 4)} Ⓝ`
	}

	if (activity.type === 'transfer' && activity.from === '') {
		return `${token?.metadata.name} created by ${activity.to} with supply of ${activity.quantity}pcs`
	}

	return `${activity.from} transferred ${activity.quantity}pcs of ${token?.metadata.name} to ${activity.to}`
}

const CopyLink = ({ children, link, afterCopy }) => {
	const [isComponentMounted, setIsComponentMounted] = useState(false)
	const copyLinkRef = useRef()

	useEffect(() => {
		setIsComponentMounted(true)
	}, [])

	const _copyLink = () => {
		const copyText = copyLinkRef.current
		copyText.select()
		copyText.setSelectionRange(0, 99999)
		document.execCommand('copy')

		afterCopy()
	}

	return (
		<div onClick={(_) => _copyLink()}>
			{isComponentMounted && (
				<div
					className="absolute z-0 opacity-0"
					style={{
						top: `-1000`,
					}}
				>
					<input ref={copyLinkRef} readOnly type="text" value={link} />
				</div>
			)}
			<div className="relative z-10">{children}</div>
		</div>
	)
}

const Activity = ({ activity }) => {
	const { nearUsdPrice } = useStore()

	if (activity.type === 'marketUpdate') {
		return (
			<div className="text-gray-300">
				<p>
					<LinkToProfile
						accountId={activity.from}
						className="text-gray-100 hover:border-gray-100"
					/>
					<span>
						{' '}
						put on sale for {prettyBalance(activity.amount, 24, 4)} Ⓝ
					</span>
					<span>
						{' '}
						($
						{prettyBalance(JSBI.BigInt(activity.amount * nearUsdPrice), 24, 4)})
					</span>
				</p>
			</div>
		)
	}

	if (activity.type === 'marketDelete') {
		return (
			<div className="text-gray-300">
				<p>
					<span>removed from sale by </span>
					<LinkToProfile
						accountId={activity.from}
						className="text-gray-100 hover:border-gray-100"
					/>
				</p>
			</div>
		)
	}

	if (activity.type === 'marketBuy') {
		return (
			<div className="text-gray-300">
				<p>
					<LinkToProfile
						accountId={activity.from}
						className="text-gray-100 hover:border-gray-100"
					/>
					<span> bought {activity.quantity}pcs from </span>
					<LinkToProfile
						accountId={activity.to}
						className="text-gray-100 hover:border-gray-100"
					/>
					<span> for </span>
					{prettyBalance(activity.amount, 24, 4)} Ⓝ
					<span>
						{' '}
						($
						{prettyBalance(JSBI.BigInt(activity.amount * nearUsdPrice), 24, 4)})
					</span>
				</p>
			</div>
		)
	}

	// mint
	if (activity.type === 'transfer' && activity.from === '') {
		return (
			<div className="text-gray-300">
				<span>created by </span>
				<span>
					<LinkToProfile
						accountId={activity.to}
						className="text-gray-100 hover:border-gray-100"
					/>
				</span>
				<span> with supply of {activity.quantity}pcs</span>
			</div>
		)
	}

	// burn
	if (activity.type === 'transfer' && activity.to === '') {
		return (
			<div className="text-gray-300">
				<span>burned {activity.quantity}pcs by </span>
				<span>
					<LinkToProfile
						accountId={activity.from}
						className="text-gray-100 hover:border-gray-100"
					/>
				</span>
			</div>
		)
	}

	return (
		<div className="text-gray-300">
			<p>
				<LinkToProfile
					accountId={activity.from}
					className="text-gray-100 hover:border-gray-100"
				/>
				<span> transfer {activity.quantity}pcs to </span>
				<LinkToProfile
					accountId={activity.to}
					className="text-gray-100 hover:border-gray-100"
				/>
			</p>
		</div>
	)
}

const ActivityDetail = ({ activity, token }) => {
	const [showModal, setShowModal] = useState(null)
	const [isCopied, setIsCopied] = useState(false)

	const shareLink = `${process.env.BASE_URL}/activity/${activity._id}`

	const fetcher = async (key) => {
		const resp = await axios.get(`${process.env.API_URL}/${key}`)
		if (resp.data.data.results.length > 0) {
			return resp.data.data.results[0]
		} else {
			return {}
		}
	}

	const { data: localToken } = useSWR(
		`tokens?tokenId=${activity.tokenId}`,
		fetcher,
		{
			initialData: token,
		}
	)

	const handleAfterCopy = () => {
		setIsCopied(true)

		setTimeout(() => {
			setShowModal(false)
			setIsCopied(false)
		}, 1500)
	}

	return (
		<Fragment>
			{showModal === 'options' && (
				<Modal close={(_) => setShowModal('')}>
					<div className="max-w-sm w-full px-4 py-2 bg-gray-100 m-auto rounded-md">
						<CopyLink link={shareLink} afterCopy={handleAfterCopy}>
							<div className="py-2 cursor-pointer flex items-center">
								<svg
									className="rounded-md"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<rect width="24" height="24" fill="#11111F" />
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M12.7147 14.4874L13.7399 15.5126L11.6894 17.5631C10.2738 18.9787 7.97871 18.9787 6.56313 17.5631C5.14755 16.1476 5.14755 13.8524 6.56313 12.4369L8.61364 10.3864L9.63889 11.4116L7.58839 13.4621C6.73904 14.3115 6.73904 15.6885 7.58839 16.5379C8.43773 17.3872 9.8148 17.3872 10.6641 16.5379L12.7147 14.4874ZM11.6894 9.36136L10.6641 8.3361L12.7146 6.2856C14.1302 4.87002 16.4253 4.87002 17.8409 6.2856C19.2565 7.70118 19.2565 9.99628 17.8409 11.4119L15.7904 13.4624L14.7651 12.4371L16.8156 10.3866C17.665 9.53726 17.665 8.1602 16.8156 7.31085C15.9663 6.4615 14.5892 6.4615 13.7399 7.31085L11.6894 9.36136ZM9.12499 13.9751L10.1502 15.0004L15.2765 9.87409L14.2513 8.84883L9.12499 13.9751Z"
										fill="white"
									/>
								</svg>
								<p className="pl-2">{isCopied ? `Copied` : `Copy Link`}</p>
							</div>
						</CopyLink>
						<div className="py-2 cursor-pointer">
							<TwitterShareButton
								title={`${descriptionMaker(
									activity,
									localToken
								)} via @ParasHQ\n\n#cryptoart #digitalart #tradingcards`}
								url={shareLink}
								className="flex items-center w-full"
							>
								<TwitterIcon
									size={24}
									className="rounded-md"
									bgStyle={{
										fill: '#11111F',
									}}
								></TwitterIcon>
								<p className="pl-2">Twitter</p>
							</TwitterShareButton>
						</div>
						<div className="py-2 cursor-pointer">
							<FacebookShareButton
								url={shareLink}
								className="flex items-center w-full"
							>
								<FacebookIcon
									size={24}
									className="rounded-md"
									bgStyle={{
										fill: '#11111F',
									}}
								></FacebookIcon>
								<p className="pl-2">Facebook</p>
							</FacebookShareButton>
						</div>
					</div>
				</Modal>
			)}
			<div className="flex flex-wrap border-2 border-dashed border-gray-800 p-4 rounded-md max-w-2xl mx-auto">
				<div className="w-full md:w-1/3">
					<div className="w-40 mx-auto">
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
								x: 15,
								y: 15,
							}}
							disableFlip={true}
						/>
					</div>
				</div>
				<div className="w-full md:w-2/3 text-gray-100 pt-4 pl-0 md:pt-0 md:pl-4">
					<div className="overflow-hidden">
						<div className="flex items-center justify-between">
							<div className="w-10/12 overflow-hidden truncate">
								<Link href={`/token/${localToken?.tokenId}`}>
									<a
										title={localToken?.metadata?.name}
										className="text-2xl font-bold border-b-2 border-transparent hover:border-gray-100"
									>
										{localToken?.metadata?.name}
									</a>
								</Link>
							</div>
							<div>
								<div
									onClick={(_) => setShowModal('options')}
									className="cursor-pointer w-8 h-8 rounded-full transition-all duration-200 hover:bg-dark-primary-4 flex items-center justify-center"
								>
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M12 2.79623V8.02302C5.45134 8.33141 2 11.7345 2 18V20.4142L3.70711 18.7071C5.95393 16.4603 8.69021 15.5189 12 15.8718V21.2038L22.5186 12L12 2.79623ZM14 10V7.20377L19.4814 12L14 16.7962V14.1529L13.1644 14.0136C9.74982 13.4445 6.74443 14.0145 4.20125 15.7165C4.94953 11.851 7.79936 10 13 10H14Z"
											fill="white"
										/>
									</svg>
								</div>
							</div>
						</div>
						<p className="opacity-75 truncate">
							{localToken?.metadata?.collection}
						</p>
						<div className="mt-4">
							<Activity activity={activity} />
							<p className="mt-2 text-sm opacity-50">
								{timeAgo.format(activity.createdAt)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	)
}

export default ActivityDetail
