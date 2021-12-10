import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share'
import cachios from 'cachios'

import Card from 'components/Card/Card'
import LinkToProfile from 'components/LinkToProfile'
import Modal from 'components/Modal'

import { parseImgUrl, timeAgo } from 'utils/common'
import TokenSeriesDetailModal from 'components/TokenSeries/TokenSeriesDetailModal'
import TokenDetailModal from 'components/Token/TokenDetailModal'
import { useRouter } from 'next/router'
import CopyLink from 'components/Common/CopyLink'
import { useIntl } from 'hooks/useIntl'
import { formatNearAmount } from 'near-api-js/lib/utils/format'

export const descriptionMaker = (activity) => {
	const type = activity.type

	if (type === 'add_market_data' || type === 'update_market_data') {
		return `${activity.msg.params.owner_id} put on sale put on sale for ${formatNearAmount(
			activity.msg.params.price
		)} Ⓝ`
	}

	if (type === 'delete_market_data') {
		return `${activity.msg.params.owner_id} remove from sale`
	}

	if (type === 'nft_transfer' && activity.from === null) {
		const [, edition_id] = activity.msg.params.token_id.split(':')

		if (activity.price) {
			return `${activity.to} bought #${
				edition_id || activity.msg.params.token_id
			} for ${formatNearAmount(activity.price)} Ⓝ`
		}

		if (activity.to === activity.creator_id) {
			return `${activity.to} minted #${edition_id || activity.msg.params.token_id}`
		}

		return `${activity.creator_id} minted #${edition_id || activity.msg.params.token_id} ${
			activity.to
		}`
	}

	if (type === 'nft_transfer' && activity.to === null) {
		const [, edition_id] = activity.msg.params.token_id.split(':')

		return `${activity.from} burned #${edition_id || 1}`
	}

	if (type === 'nft_transfer' || type === 'resolve_purchase') {
		if (activity.price) {
			if (activity.is_offer) {
				return `${activity.from} ${'accepted offer from'} ${activity.to} for ${formatNearAmount(
					activity.msg.params.price
				)} Ⓝ`
			}
			return `${activity.to} bought from ${activity.from}`
		}
		return `${activity.from} transferred to ${activity.to}`
	}

	if (type === 'nft_create_series') {
		return `series created by ${activity.msg.params.creator_id}`
	}

	if (type === 'nft_set_series_price') {
		if (!activity.msg.params.price) {
			return `put the series to not for sale`
		}
		return `put the series on sale for ${formatNearAmount(activity.msg.params.price)} Ⓝ`
	}

	if (type === 'nft_set_series_non_mintable') {
		return `put the series to non-mintable`
	}

	if (type === 'nft_decrease_series_copies') {
		return `decrease the series copies to ${activity.msg.params.copies}`
	}

	if (type === 'add_offer') {
		return `${activity.from} 'added offer for' ${formatNearAmount(activity.msg.params.price)} Ⓝ}`
	}

	if (type === 'delete_offer') {
		return `${activity.from} 'removed offer' ${formatNearAmount(activity.msg.params.price)} Ⓝ`
	}

	return ``
}

const Activity = ({ activity }) => {
	const { localeLn } = useIntl()
	const type = activity.type

	if (type === 'add_market_data' || type === 'update_market_data') {
		return (
			<p>
				<LinkToProfile
					className="text-gray-100 hover:border-gray-100"
					accountId={activity.msg.params.owner_id}
				/>
				<span>
					{' '}
					{localeLn('PutOnSaleFor')} {formatNearAmount(activity.msg.params.price)} Ⓝ
				</span>
			</p>
		)
	}

	if (type === 'delete_market_data') {
		return (
			<p>
				<LinkToProfile
					className="text-gray-100 hover:border-gray-100"
					accountId={activity.msg.params.owner_id}
				/>
				<span> {localeLn('RemoveFromSale')}</span>
			</p>
		)
	}

	if (type === 'nft_transfer' && activity.from === null) {
		const [, edition_id] = activity.msg.params.token_id.split(':')

		if (activity.price) {
			return (
				<p>
					<LinkToProfile className="text-gray-100 hover:border-gray-100" accountId={activity.to} />
					<span>
						{' '}
						bought{' '}
						<span className="font-semibold">
							#{edition_id || activity.msg.params.token_id}
						</span> for{' '}
					</span>
					{formatNearAmount(activity.msg.params.price)} Ⓝ
				</p>
			)
		}

		return (
			<p>
				<span>
					minted{' '}
					<span className="font-semibold">#{edition_id || activity.msg.params.token_id}</span> by{' '}
				</span>
				<LinkToProfile className="text-gray-100 hover:border-gray-100" accountId={activity.to} />
			</p>
		)
	}

	if (type === 'nft_transfer' && activity.to === null) {
		const [, edition_id] = activity.msg.params.token_id.split(':')

		return (
			<p>
				<LinkToProfile className="text-gray-100 hover:border-gray-100" accountId={activity.from} />
				<span>
					{' '}
					burned{' '}
					<span className="font-semibold">#{edition_id || activity.msg.params.token_id}</span>
				</span>
			</p>
		)
	}

	if (type === 'nft_transfer' || type === 'resolve_purchase') {
		if (activity.price) {
			if (activity.is_offer) {
				return (
					<p>
						<LinkToProfile
							className="text-gray-100 hover:border-gray-100"
							accountId={activity.from}
						/>
						<span> {localeLn('accepted offer from')} </span>
						<LinkToProfile
							className="text-gray-100 hover:border-gray-100"
							accountId={activity.to}
						/>{' '}
						<span>
							{' '}
							{localeLn('for')} {formatNearAmount(activity.msg.params.price)} Ⓝ
						</span>
					</p>
				)
			}
			return (
				<p>
					<LinkToProfile className="text-gray-100 hover:border-gray-100" accountId={activity.to} />
					<span> bought from </span>
					<LinkToProfile
						className="text-gray-100 hover:border-gray-100"
						accountId={activity.from}
					/>
					<span> {localeLn('for')} </span>
					{formatNearAmount(activity.msg.params.price) === '0'
						? 'free'
						: `${formatNearAmount(activity.msg.params.price)} Ⓝ`}
				</p>
			)
		}
		return (
			<p>
				<LinkToProfile className="text-gray-100 hover:border-gray-100" accountId={activity.from} />
				<span> transferred to </span>
				<LinkToProfile className="text-gray-100 hover:border-gray-100" accountId={activity.to} />
			</p>
		)
	}

	if (type === 'nft_create_series') {
		return (
			<p>
				<span>series created by </span>
				<LinkToProfile
					className="text-gray-100 hover:border-gray-100"
					accountId={activity.msg.params.creator_id}
				/>
			</p>
		)
	}

	if (type === 'nft_set_series_price') {
		if (!activity.msg.params.price) {
			return (
				<p>
					<span>put the series to not for sale</span>
				</p>
			)
		}
		return (
			<p>
				<span>put the series on sale for {formatNearAmount(activity.msg.params.price)} Ⓝ</span>
			</p>
		)
	}

	if (type === 'nft_set_series_non_mintable') {
		return (
			<p>
				<span> put the series to non-mintable </span>
			</p>
		)
	}

	if (type === 'nft_decrease_series_copies') {
		return (
			<p>
				<span> decrease the series copies to {activity.msg.params.copies} </span>
			</p>
		)
	}

	if (type === 'add_offer') {
		return (
			<p>
				<span>
					<LinkToProfile
						className="text-gray-100 hover:border-gray-100"
						accountId={activity.from}
					/>
				</span>
				<span> {localeLn('add offer for')}</span>
				<span> {formatNearAmount(activity.msg.params.price)} Ⓝ</span>
			</p>
		)
	}

	if (type === 'delete_offer') {
		return (
			<p>
				<span>
					<span>
						<LinkToProfile
							className="text-gray-100 hover:border-gray-100"
							accountId={activity.from}
						/>
					</span>
					<span> {localeLn('removed offer')}</span>
				</span>
			</p>
		)
	}

	return null
}

const ActivityDetail = ({ activity }) => {
	const { localeLn } = useIntl()
	const router = useRouter()
	const [showModal, setShowModal] = useState(null)
	const [isCopied, setIsCopied] = useState(false)
	const [localToken, setLocalToken] = useState(null)

	const shareLink = `${process.env.BASE_URL}/activity/${activity._id}`

	useEffect(() => {
		if (activity) {
			fetchData()
		}
	}, [activity])

	const fetchData = async () => {
		const url = activity.token_id
			? `${process.env.V2_API_URL}/token?token_id=${activity.token_id}&contract_id=${activity.contract_id}`
			: `${process.env.V2_API_URL}/token-series?token_series_id=${activity.token_series_id}&contract_id=${activity.contract_id}`

		const resp = await cachios.get(url, {
			ttl: 60,
		})

		setLocalToken(resp.data.data.results[0])
	}

	const handleAfterCopy = () => {
		setIsCopied(true)

		setTimeout(() => {
			setShowModal(false)
			setIsCopied(false)
		}, 1500)
	}

	if (activity.type === 'resolve_purchase_fail' || activity.type === 'notification_add_offer') {
		return null
	}

	return (
		<Fragment>
			<TokenSeriesDetailModal tokens={[localToken]} />
			<TokenDetailModal tokens={[localToken]} />
			{showModal === 'options' && (
				<Modal close={() => setShowModal('')}>
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
								)} via @ParasHQ\n\n#paras #cryptoart #digitalart #tradingcards`}
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
								<p className="pl-2">{localeLn('Twitter')}</p>
							</TwitterShareButton>
						</div>
						<div className="py-2 cursor-pointer">
							<FacebookShareButton url={shareLink} className="flex items-center w-full">
								<FacebookIcon
									size={24}
									className="rounded-md"
									bgStyle={{
										fill: '#11111F',
									}}
								></FacebookIcon>
								<p className="pl-2">{localeLn('Facebook')}</p>
							</FacebookShareButton>
						</div>
					</div>
				</Modal>
			)}
			<div className="flex flex-wrap border-2 border-dashed border-gray-800 p-4 rounded-md max-w-2xl mx-auto">
				<div className="w-full md:w-1/3">
					<div className="w-40 mx-auto">
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
							}}
						/>
					</div>
				</div>
				<div className="w-full md:w-2/3 text-gray-100 pt-4 pl-0 md:pt-0 md:pl-4">
					<div className="overflow-hidden">
						<div className="flex items-center justify-between">
							<div className="w-10/12 overflow-hidden truncate">
								<Link
									href={{
										pathname: router.pathname,
										query: activity.token_id
											? {
													...router.query,
													...{ tokenId: localToken?.token_id },
													...{ prevAs: router.asPath },
											  }
											: {
													...router.query,
													...{ tokenSeriesId: localToken?.token_series_id },
													...{ prevAs: router.asPath },
											  },
									}}
									as={`/token/${localToken?.contract_id}::${localToken?.token_series_id}${
										activity.token_id ? `/${localToken?.token_id}` : ''
									}`}
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
							<div>
								<div
									onClick={() => setShowModal('options')}
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
							{localToken?.metadata?.collection_id
								? localToken?.metadata.collection
								: localToken?.contract_id}
						</p>
						<div className="mt-4">
							<Activity activity={activity} />
							<p className="mt-2 text-sm opacity-50">
								{timeAgo.format(new Date(activity.msg.datetime))}
							</p>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	)
}

export default ActivityDetail
