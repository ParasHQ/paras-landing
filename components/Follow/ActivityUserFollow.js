import Card from 'components/Card/Card'
import Button from 'components/Common/Button'
import CountdownSimple from 'components/Common/CountdownSimple'
import TokenDetailModal from 'components/Token/TokenDetailModal'
import TokenSeriesDetailModal from 'components/TokenSeries/TokenSeriesDetailModal'
import useProfileData from 'hooks/useProfileData'
import useTokenOrTokenSeries from 'hooks/useTokenOrTokenSeries'
import useStore from 'lib/store'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { parseImgUrl, prettyTruncate, timeAgo } from 'utils/common'

const ActivityUserFollow = ({ activity }) => {
	const currentUser = useStore((state) => state.currentUser)
	const router = useRouter()
	const { token, mutate } = useTokenOrTokenSeries({
		key: `${activity.contract_id}::${
			activity.token_series_id ? activity.token_series_id : activity.token_id.split(':')[0]
		}${activity.token_id ? `/${activity.token_id}` : ''}`,
		params: {
			lookup_likes: true,
			liked_by: currentUser,
		},
	})
	const accountId = activity.msg?.params?.owner_id || activity.msg?.params?.creator_id
	const profile = useProfileData(accountId)

	const onClickToSeeDetails = () => {
		mutate()
		router.push(
			{
				pathname: router.pathname,
				query: {
					...router.query,
					...(activity.token_id
						? { tokenId: token?.token_id }
						: { tokenSeriesId: token?.token_series_id }),
					contractId: token?.contract_id,
				},
			},
			`/token/${token?.contract_id}::${token?.token_series_id}${
				activity.token_id ? `/${token?.token_id}` : ''
			}`,
			{
				shallow: true,
				scroll: false,
			}
		)
	}

	const descriptionTop = () => {
		if (activity.type === 'add_market_data' || activity.type === 'update_market_data') {
			return (
				<>
					<span>{activity.msg.params.is_auction ? 'Auctioned ' : 'Listed '} </span>
					<span className="font-bold cursor-pointer hover:underline" onClick={onClickToSeeDetails}>
						{token?.metadata.title}
					</span>
					<span> for </span>
					<span className="font-bold">{formatNearAmount(activity.msg.params.price)} Ⓝ</span>
				</>
			)
		} else if (activity.type === 'nft_create_series') {
			return (
				<>
					<span>Created </span>
					<span className="font-bold cursor-pointer hover:underline" onClick={onClickToSeeDetails}>
						{token?.metadata.title}
					</span>
					<span> series</span>
				</>
			)
		}
		return null
	}

	const descriptionCenter = () => {
		if (activity.type === 'add_market_data') {
			return (
				<div>
					<p className="text-gray-300 text-xs">
						{activity.msg.params.is_auction ? 'Starting Price' : 'Current Price'}
					</p>
					<p className="text-white text-2xl font-bold">
						{formatNearAmount(activity.msg.params.price)} Ⓝ
					</p>
				</div>
			)
		} else if (activity.type === 'nft_create_series' && activity.msg.params.price) {
			return (
				<div>
					<p className="text-gray-300 text-xs">Current Price</p>
					<p className="text-white text-2xl font-bold">
						{formatNearAmount(activity.msg.params.price)} Ⓝ
					</p>
				</div>
			)
		}
		return null
	}

	const descriptionBottom = () => {
		if (
			(activity.type === 'add_market_data' || activity.type === 'update_market_data') &&
			!activity.msg.params.is_auction
		) {
			return (
				<div>
					<p className="text-xs text-gray-400">
						Minted {timeAgo.format(new Date(activity.msg.datetime))}
					</p>
				</div>
			)
		} else if (activity.type === 'add_market_data' && activity.msg.params.is_auction) {
			return (
				<div>
					<CountdownSimple endedDate={activity.msg.params.ended_at} />
				</div>
			)
		}
		return null
	}

	return (
		<div className="border border-gray-600 rounded-xl mb-8 mx-4">
			<TokenSeriesDetailModal tokens={[token]} />
			<TokenDetailModal tokens={[token]} />
			<div className="md:flex md:space-x-6 p-4">
				<div className="w-2/5 m-auto mb-4 md:mb-0 h-full">
					<div>
						<Card
							imgUrl={parseImgUrl(token?.metadata.media, null, {
								width: `600`,
								useOriginal: process.env.APP_ENV === 'production' ? false : true,
								isMediaCdn: token?.isMediaCdn,
							})}
							audioUrl={
								token?.metadata.mime_type &&
								token?.metadata.mime_type.includes('audio') &&
								token?.metadata.animation_url
							}
							threeDUrl={
								token?.metadata.mime_type &&
								token?.metadata.mime_type.includes('model') &&
								token?.metadata.animation_url
							}
							iframeUrl={
								token?.metadata.mime_type &&
								token?.metadata.mime_type.includes('iframe') &&
								token?.metadata.animation_url
							}
							imgBlur={token?.metadata.blurhash}
							token={{
								title: token?.metadata.title,
								collection: token?.metadata.collection || token?.contract_id,
								copies: token?.metadata.copies,
								creatorId: token?.metadata.creator_id || token?.contract_id,
								is_creator: token?.is_creator,
								description: token?.metadata.description,
								royalty: token?.royalty,
								attributes: token?.metadata.attributes,
								_is_the_reference_merged: token?._is_the_reference_merged,
								mime_type: token?.metadata.mime_type,
								is_auction: token?.is_auction,
								started_at: token?.started_at,
								ended_at: token?.ended_at,
								has_auction: token?.has_auction,
								animation_url: token?.animation_url,
							}}
							onClick={onClickToSeeDetails}
						/>
					</div>
				</div>
				<div className="flex flex-col space-y-4 justify-between w-full">
					<div className="flex space-x-2">
						<Link href={`/${accountId}`}>
							<a
								className={`w-10 h-10 overflow-hidden ${
									!profile?.imgUrl ? 'bg-primary' : 'bg-dark-primary-2'
								} rounded-full cursor-pointer`}
							>
								<img
									src={parseImgUrl(profile?.imgUrl, null, { width: `300` })}
									className="w-full object-cover rounded-full cursor-pointer"
								/>
							</a>
						</Link>
						<div>
							<div className="flex gap-3 items-baseline">
								<Link href={`/${accountId}`}>
									<a className="text-white text-sm hover:underline">
										{prettyTruncate(accountId, 15, 'address')}
									</a>
								</Link>
								<p className="text-gray-400 text-xs">
									{timeAgo.format(new Date(activity.msg.datetime))}
								</p>
							</div>
							<p className="text-white text-sm">{descriptionTop()}</p>
						</div>
					</div>
					{descriptionCenter()}
					<div>
						<hr className="border-gray-600 mb-3" />
						<div className="flex items-end justify-between flex-row-reverse">
							<Button size="md" className="px-8" onClick={onClickToSeeDetails}>
								See Details
							</Button>
							{descriptionBottom()}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ActivityUserFollow
