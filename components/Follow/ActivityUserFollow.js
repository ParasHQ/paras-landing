import Card from 'components/Card/Card'
import Button from 'components/Common/Button'
import TokenDetailModal from 'components/Token/TokenDetailModal'
import TokenSeriesDetailModal from 'components/TokenSeries/TokenSeriesDetailModal'
import useTokenOrTokenSeries from 'hooks/useTokenOrTokenSeries'
import useStore from 'lib/store'
import { useRouter } from 'next/router'
import { parseImgUrl } from 'utils/common'

const ActivityUserFollow = () => {
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

	return (
		<div className="border border-gray-600 rounded-xl mb-8">
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
							onClick={() => {
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
							}}
						/>
					</div>
				</div>
				<div className="flex flex-col space-y-4 justify-between w-full">
					<div className="flex space-x-2">
						<div className="rounded-full bg-white h-10 w-10"></div>
						<div>
							<div className="flex gap-3 items-baseline">
								<p className="text-white text-sm">einherjars.near</p>
								<p className="text-gray-400 text-xs">Jun 26</p>
							</div>
							<p className="text-white text-sm font-bold">{token?.metadata.title} for 80 Ⓝ</p>
						</div>
					</div>
					<div>
						<p className="text-gray-300 text-xs">Current Price</p>
						<p className="text-white text-2xl font-bold">100 Ⓝ</p>
						<div className="flex items-center space-x-2">
							<div className="rounded-full w-8 h-8 bg-white"></div>
							<p className="text-gray-300 text-xs">ahnaf.near</p>
						</div>
					</div>
					<div>
						<hr className="border-gray-600 mb-3" />
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs text-gray-400">Auction ends in</p>
								<p className="text-white text-xl">23h 54m 5s</p>
							</div>
							<Button size="md" className="px-12">
								Buy now
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ActivityUserFollow

const activity = {
	_id: '62ab38968e207d09cef5e38d',
	contract_id: 'x.paras.near',
	type: 'resolve_purchase',
	from: 'eeedo.near',
	to: 'myself_art.near',
	token_id: '157370:31',
	token_series_id: '157370',
	price: {
		$numberDecimal: '110000000000000000000000',
	},
	ft_token_id: 'near',
	is_offer: false,
	is_auction: true,
	issued_at: 1655388306818,
	msg: {
		contract_id: 'marketplace.paras.near',
		block_height: 67849841,
		datetime: '2022-06-16T14:05:06.818436989+00:00',
		event_type: 'resolve_purchase',
		receipt_id: '8WBS3GAq339NNKPmdKYpRKNcfjv74jNEYbGe8DPLdZhM',
		params: {
			buyer_id: 'myself_art.near',
			ft_token_id: 'near',
			nft_contract_id: 'x.paras.near',
			owner_id: 'eeedo.near',
			price: '110000000000000000000000',
			token_id: '157370:31',
		},
	},
	transaction_hash: 'HUv8xr61Dn4WrHQTpFcphzqeEBvHncEFQ716no5VT4sh',
	creator_id: 'illustratuar.near',
	is_creator: true,
}
