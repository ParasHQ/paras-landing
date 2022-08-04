import Card from 'components/Card/Card'
import TokenDetailModal from 'components/Token/TokenDetailModal'
import TokenSeriesDetailModal from 'components/TokenSeries/TokenSeriesDetailModal'
import useProfileData from 'hooks/useProfileData'
import useTokenOrTokenSeries from 'hooks/useTokenOrTokenSeries'
import { trackFollowingClick } from 'lib/ga'
import useStore from 'lib/store'
import { useRouter } from 'next/router'
import { parseImgUrl } from 'utils/common'
import ActivityDescriptionCenter from './ActivityUserFollow/ActivityDescriptionCenter'
import ActivityFollowingBottom from './ActivityUserFollow/ActivityFollowingBottom'
import ActivityFollowingTop from './ActivityUserFollow/ActivityFollowingTop'

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

	const getFollowingAccount = () => {
		if (activity.type === 'resolve_purchase') {
			if (activity.is_offer) {
				return activity.from
			}
			return activity.to
		} else if (activity.type === 'add_bid' || activity.type === 'add_offer') {
			return activity.from
		} else if (activity.type === 'nft_transfer') {
			return activity.to
		}

		return activity.msg?.params?.owner_id || activity.msg?.params?.creator_id
	}

	const accountId = getFollowingAccount()
	const profile = useProfileData(accountId)

	const onClickToSeeDetails = () => {
		mutate()
		trackFollowingClick('Following_click_see_details')
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

	const onClickToCollection = () => {
		router.push(`/collection/${token.metadata.collection_id || token.metadata.contract_id}`)
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
								royalty: token?.royalty || {},
								attributes: token?.metadata.attributes,
								_is_the_reference_merged: token?._is_the_reference_merged,
								mime_type: token?.metadata.mime_type,
								is_auction: token?.is_auction,
								started_at: token?.started_at,
								ended_at: token?.ended_at,
								has_auction: token?.has_auction,
								animation_url: token?.animation_url,
							}}
							flippable
							onClick={() => trackFollowingClick('Following_click_card')}
						/>
					</div>
				</div>
				<div className="flex flex-col space-y-4 justify-between w-full">
					<ActivityFollowingTop
						activity={activity}
						token={token}
						profile={profile}
						accountId={accountId}
						onClickToSeeDetails={onClickToSeeDetails}
						onClickToCollection={onClickToCollection}
					/>
					<ActivityDescriptionCenter activity={activity} />
					<ActivityFollowingBottom
						onClickToSeeDetails={onClickToSeeDetails}
						activity={activity}
						token={token}
					/>
				</div>
			</div>
		</div>
	)
}

export default ActivityUserFollow
