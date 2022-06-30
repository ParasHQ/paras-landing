import Card from 'components/Card/Card'
import Button from 'components/Common/Button'
import { parseImgUrl } from 'utils/common'

const ActivityUserFollow = () => {
	return (
		<div className="border border-gray-600 rounded-xl">
			<div className="flex space-x-6 p-4">
				<div className="w-2/5 h-full">
					<div>
						<Card
							imgUrl={parseImgUrl(token.metadata.media, null, {
								width: `600`,
								useOriginal: process.env.APP_ENV === 'production' ? false : true,
								isMediaCdn: token.isMediaCdn,
							})}
							audioUrl={
								token.metadata.mime_type &&
								token.metadata.mime_type.includes('audio') &&
								token.metadata.animation_url
							}
							threeDUrl={
								token.metadata.mime_type &&
								token.metadata.mime_type.includes('model') &&
								token.metadata.animation_url
							}
							iframeUrl={
								token.metadata.mime_type &&
								token.metadata.mime_type.includes('iframe') &&
								token.metadata.animation_url
							}
							imgBlur={token.metadata.blurhash}
							token={{
								title: token.metadata.title,
								collection: token.metadata.collection || token.contract_id,
								copies: token.metadata.copies,
								creatorId: token.metadata.creator_id || token.contract_id,
								is_creator: token.is_creator,
								description: token.metadata.description,
								royalty: token.royalty,
								attributes: token.metadata.attributes,
								_is_the_reference_merged: token._is_the_reference_merged,
								mime_type: token.metadata.mime_type,
								is_auction: token.token?.is_auction,
								started_at: token.token?.started_at,
								ended_at: token.token?.ended_at,
								has_auction: token?.has_auction,
								animation_url: token?.animation_url,
							}}
						/>
					</div>
				</div>
				<div className="flex flex-col justify-between w-full">
					<div className="flex space-x-2">
						<div className="rounded-full bg-white h-10 w-10"></div>
						<div>
							<div className="flex gap-3 items-baseline">
								<p className="text-white text-sm">einherjars.near</p>
								<p className="text-gray-400 text-xs">Jun 26</p>
							</div>
							<p className="text-white text-sm font-bold">{token.metadata.title} for 80 Ⓝ</p>
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

const token = {
	_id: '62ac77ffc3ac0e7bc191d5bd',
	contract_id: 'nearrobotics.near',
	token_id: '1029',
	edition_id: null,
	metadata: {
		title: 'NEAR Robotics #1030',
		media:
			'https://bafybeiafi3h3ntcyrnbahffsueh6gu6pg4b2lrdkxrjxrobilwv3in53n4.ipfs.dweb.link//1029.png',
		media_hash: null,
		copies: null,
		issued_at: '1655054230081385043',
		expires_at: null,
		starts_at: null,
		updated_at: null,
		extra: null,
		reference: '1029.json',
		reference_hash: null,
		symbol: 'ROBOT',
		description:
			'A collection of 3333 uniquely generated robots sent to protect the NEAR blockchain.',
		attributes: [
			{
				trait_type: 'Background',
				value: 'Retro Pink',
			},
			{
				trait_type: 'Core',
				value: 'V8 PI',
			},
			{
				trait_type: 'Pauldron',
				value: 'Shell Ys',
			},
			{
				trait_type: 'Helmet',
				value: 'Scout Fs 0X',
			},
			{
				trait_type: 'Faceplate',
				value: 'Ghast',
			},
			{
				trait_type: 'Reactor',
				value: 'Funkazan',
			},
		],
		creator_id: 'nearrobotics.near',
		score: 100.80967581108031,
	},
	owner_id: 'f21327ac1e45bfafed30572ff876412c8b4c91262694784ac0bbc299d5dc4e58',
	royalty: {
		'roboticgang.near': 210,
		'nrone.near': 210,
		'roboticgrowth.near': 280,
	},
	token_series_id: '1029',
	isMediaCdn: true,
	approval_id: null,
	ft_token_id: null,
	has_price: null,
	price: null,
	transaction_fee: '200',
	is_creator: true,
	total_likes: 2,
	likes: null,
	categories: [],
	view: 26,
}
