/* eslint-disable react/no-unescaped-entities */
import Head from 'next/head'
import Nav from 'components/Nav'
import Footer from 'components/Footer'
import Card from 'components/Card/Card'
import { parseImgUrl } from 'utils/common'

export default function Loyalty() {
	return (
		<div className="min-h-screen relative bg-black">
			<Head>
				<title>Loyalty — Paras</title>
				<meta
					name="description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta
					name="keywords"
					content="paras, paras id, paras digital, nft, nft marketplace, near, near marketplace"
				/>

				<meta name="twitter:title" content="Loyalty — Paras" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Loyalty — Paras" />
				<meta property="og:site_name" content="Loyalty — Paras" />
				<meta
					property="og:description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>

			<div
				className="fixed inset-0 opacity-75"
				style={{
					zIndex: 0,
					backgroundImage: `url('/bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			></div>
			<Nav />
			<div className="max-w-6xl m-auto">
				<div className="relative mx-4 my-12 bg-[#20124D]">
					<div
						className="py-12"
						style={{ background: 'linear-gradient(180deg, #4E29AA 0%, #20124D 100%)' }}
					>
						<img
							className="w-1/2 mx-auto"
							src="https://paras-cdn.imgix.net/bafkreigxmtjfl6nsvb6ycpx3zvkdgqhtebbrq5ukf3lwyiigyycxhni6rq"
						/>
						<div className="flex items-center justify-center">
							<p className="text-[#20124D] font-bold text-2xl bg-[#F1C232] px-8 py-4 rounded-md">
								Join Paras Loyalty & Get Excellent Rewards!
							</p>
						</div>
					</div>

					<div className="bg-[#20124D] text-center py-8">
						<p className="text-white font-bold text-2xl mb-2">What is Paras Loyalty?</p>
						<p className="text-gray-200 text-xl w-2/3 m-auto">
							It is a special program created to appreciate $PARAS stakers by giving exclusive
							access to limited raffles.
						</p>
					</div>

					{/* Rewards */}
					<div className="m-6 bg-white pb-8 rounded-xl">
						<div>
							<p className="font-bold text-center text-2xl text-white py-4 bg-[#674EA7] rounded-xl">
								September's Rewards
							</p>
						</div>
						<div className="my-8">
							<p className="loyalty-mechanism-text text-center mx-16">
								NFTs from Paras Top 10 Collections
							</p>
							<div className="grid grid-cols-3 md:mx-32 my-4">
								{results.map((token) => (
									<div key={token._id} className="bg-black m-2 rounded-xl overflow-hidden">
										<div className="w-full p-2 bg-black border-4 border-[#351C75] rounded-xl">
											<div>
												<Card
													key={token._id}
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
													flippable
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
														animation_url: token?.metadata?.animation_url,
													}}
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
						<div className="my-8">
							<p className="loyalty-mechanism-text text-center mx-16">
								WL Spots & Free NFTs from New & Upcoming Projects
							</p>
						</div>
					</div>

					{/* Mechanism */}
					<div className="m-6 mt-16 bg-white pb-8 rounded-xl">
						<div>
							<p className="font-bold text-center text-2xl text-white py-4 bg-[#674EA7] rounded-xl">
								Loyalty Program Mechanism
							</p>
						</div>

						<div className="mx-16 my-6">
							<div className="my-6">
								<div className="flex">
									<p className="loyalty-mechanism-number">1</p>
									<p className="loyalty-mechanism-text">
										Loyalty level will be fetermined based on the amount of $PARAS locked.
									</p>
								</div>
								<div className="text-center my-4">
									<div>
										<img
											className="my-12 mx-auto"
											src="https://paras-cdn.imgix.net/bafkreigc23upnrqg6agxp5txv2xdqnwntngmmqv47vyixksyrvj4vvtoz4"
										/>
									</div>
									<p>
										Users who stake $PARAS without locking it will be considered as Bronze level.
									</p>
									<p>
										Learn more on how to do locked staking{' '}
										<a href="https://stake.paras.id" className="text-blue-700 underline">
											here
										</a>
										.
									</p>
								</div>
							</div>

							<div className="my-6">
								<div className="flex">
									<p className="loyalty-mechanism-number">2</p>
									<p className="loyalty-mechanism-text">
										On the 15th-18th day of every month, Silver, Gold, and Platinum members will
										have a chance to sign up and enter exclusive raffle.
									</p>
								</div>
								<div>
									<div className="text-center my-4">
										<img
											className="m-auto my-4"
											src="https://paras-cdn.imgix.net/bafkreigigsme75p5tnvvotbq3p5wgpq4vxtcgxucvpds32qyvkvg5dy5wa"
										/>
										<p>
											Silver, Gold, Platinum members can log in to{' '}
											<span>
												<a href="https://paras.id" className="text-blue-700 underline">
													Paras Marketplace
												</a>
											</span>
											, and sign up to the exclusive raffle through a whitelisted pop up banner that
											will appear on the home screen.
										</p>
									</div>
									<div className="text-center my-4">
										<img
											className="m-auto my-4"
											src="https://paras-cdn.imgix.net/bafkreihj2n5wlj2xuj7f45tx7mj4ybdhuz5pgm7gwgjtt65rpjgebn4g2e"
										/>
										<p>
											If you are a Silver, Gold, or Platinum member, and you can't find the pop up
											banner, you can check your notification box, look for the raffle announcement,
											and click 'Sign Up' to join the exclusive raffle.
										</p>
									</div>
								</div>
							</div>

							<div className="my-6">
								<div className="flex">
									<p className="loyalty-mechanism-number">3</p>
									<p className="loyalty-mechanism-text">
										All Silver, Gold, and Platinum members who has signed up for the raffle will be
										put into separate raffle pools.
									</p>
								</div>
								<div className="flex justify-center items-center mt-8">
									<img src="https://paras-cdn.imgix.net/bafkreihnolfcz3uxsw67bhfdq4hilg4axsqhzp5jirgz5iel5fyurnq5vi" />
									<img src="https://paras-cdn.imgix.net/bafkreiecmt6ab5az2yqfwn4au6o2xikuxphv2n5akvfrdpskmd5qosz7mi" />
									<img src="https://paras-cdn.imgix.net/bafkreib5somhf4ht7d4ygnon6tgls45ytxharnod7k3yldhxdvw2axnps4" />
								</div>
							</div>
							<div>
								<div className="flex">
									<p className="loyalty-mechanism-number">4</p>
									<p className="loyalty-mechanism-text">
										Each raffle pool will have different rewards.
									</p>
								</div>
								<div>
									<img
										className="my-12 mx-auto"
										src="https://paras-cdn.imgix.net/bafkreifu5bjpwp2n2pesjangyhc4h4q7prkmms2yal7o5zphh57ekl3gsi"
									/>
								</div>
							</div>

							<div className="my-6">
								<div className="flex">
									<p className="loyalty-mechanism-number">5</p>
									<p className="loyalty-mechanism-text">
										The monthly raffle period will be held as follows:
									</p>
								</div>
								<div>
									<img
										className="my-12 mx-auto"
										src="https://paras-cdn.imgix.net/bafkreiee7nrub2itrxlhz5mamvsnxdnr4izqt2dhytadiy435ssbep3c6m"
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="py-16 text-center">
						<p className="text-white text-2xl">Join Paras Loyalty & Grab Your Rewards!</p>
						<a
							href="https://stake.paras.id"
							className="inline-block p-3 bg-white text-primary font-bold border-[0.5rem] mt-4 border-primary rounded-xl text-xl"
						>
							Start Locked Staking
						</a>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	)
}
//temp
const results = [
	{
		_id: '62e39a766e2cdf40c3cfab53',
		contract_id: 'nfc.enleap.near',
		token_series_id: '656',
		creator_id: 'nfc.enleap.near',
		in_circulation: 1,
		is_creator: true,
		metadata: {
			title: '#656',
			media: 'https://nfc-reveal.enleap.app/storage/mainnet/656.png?reveal=1',
			media_hash: null,
			copies: null,
			issued_at: '1659849239028356432',
			expires_at: null,
			starts_at: null,
			updated_at: null,
			extra: null,
			reference: 'https://nfc-reveal.enleap.app/storage/mainnet/656.json?reveal=1',
			reference_hash: null,
			dna: 'a2513f21b27b1ed4a71694b407a7bdd4cc99ad624ea99d8485d9089e2a51f5e4',
			name: '#656',
			description:
				"Near Future is NEAR's only evolving Tribal RPG, built natively into Discord. Powered by a web3 collective, NF is a multi-year gaming project with a host of NFT collections on the NEAR blockchain.\n\n\tNFC is our 2nd Collection of Classical Nearbots\n",
			image: 'https://nfc-reveal.enleap.app/storage/mainnet//656.png',
			imageHash: '30d35c676c8553d874419db0d495b5cd11575a0b599ec862e3625849ed7df332',
			edition: 656,
			date: 1659048202431,
			attributes: [
				{
					trait_type: 'Tribe',
					value: 'Agra Orange',
					trait_description: 'This Nearbot is part of the Agra Tribe of Near Future',
					luck: '-',
				},
				{
					trait_type: 'Back Pauldron',
					value: 'Iron Halfdome Back Pauldron',
					trait_description: 'Halfdomed pauldron iron',
					luck: '1',
				},
				{
					trait_type: 'Neck',
					value: 'Neck',
					trait_description: 'Nearbot iron neck',
					luck: '1',
				},
				{
					trait_type: 'Body',
					value: 'Mummy Body',
					trait_description: 'Standard Body Mummy',
					luck: '1',
				},
				{
					trait_type: 'Clothes',
					value: 'Spartan Cloak',
					trait_description: 'Red Tunic (Centurion) with big gold button thing',
					luck: '3',
				},
				{
					trait_type: 'Item',
					value: 'Roman Sword',
					trait_description: 'Roman Sword (Gladius) ',
					luck: '3',
				},
				{
					trait_type: 'Back Headgear',
					value: 'No Back Headgear',
					trait_description: 'No Back Headgear',
					luck: '-',
				},
				{
					trait_type: 'Head',
					value: 'Mummy Head',
					trait_description: 'Mummy wrapped pillbox',
					luck: '1',
				},
				{
					trait_type: 'Eyes',
					value: 'Aurelian Mask',
					trait_description: 'Aurelian inspired eyes, cast bronze',
					luck: '3',
				},
				{
					trait_type: 'Jaw',
					value: 'Iron Jaw',
					trait_description: 'Standard Jaw Iron',
					luck: '1',
				},
				{
					trait_type: 'Front Headgear',
					value: 'Bucket Hat',
					trait_description: 'bucket hat w versace pattern',
					luck: '3',
				},
				{
					trait_type: 'Front Pauldron',
					value: 'Iron Plated Back Pauldron',
					trait_description: 'Straight plate pauldron Iron',
					luck: '1',
				},
				{
					trait_type: 'Class',
					value: 'Warrior',
					trait_description: 'Warrior of the Near Future',
					luck: '-',
				},
			],
			compiler: 'HashLips Art Engine - NFTChef fork',
			creator_id: 'nfc.enleap.near',
			score: 183.1177213961003,
			rank: 300,
		},
		price: null,
		royalty: {
			'pmint.near': 700,
		},
		isMediaCdn: true,
		has_rank: true,
		has_price: true,
		lowest_price: '12000000000000000000000000',
		updated_at: 1660038902844,
		categories: [],
		token: {
			_id: '62e39a766e2cdf40c3cfab1b',
			contract_id: 'nfc.enleap.near',
			token_id: '656',
			delisted: false,
			edition_id: null,
			is_creator: true,
			metadata: {
				title: '#656',
				media: 'https://nfc-reveal.enleap.app/storage/mainnet/656.png?reveal=1',
				media_hash: null,
				copies: null,
				issued_at: '1659849239028356432',
				expires_at: null,
				starts_at: null,
				updated_at: null,
				extra: null,
				reference: 'https://nfc-reveal.enleap.app/storage/mainnet/656.json?reveal=1',
				reference_hash: null,
				dna: 'a2513f21b27b1ed4a71694b407a7bdd4cc99ad624ea99d8485d9089e2a51f5e4',
				name: '#656',
				description:
					"Near Future is NEAR's only evolving Tribal RPG, built natively into Discord. Powered by a web3 collective, NF is a multi-year gaming project with a host of NFT collections on the NEAR blockchain.\n\n\tNFC is our 2nd Collection of Classical Nearbots\n",
				image: 'https://nfc-reveal.enleap.app/storage/mainnet//656.png',
				imageHash: '30d35c676c8553d874419db0d495b5cd11575a0b599ec862e3625849ed7df332',
				edition: 656,
				date: 1659048202431,
				attributes: [
					{
						trait_type: 'Tribe',
						value: 'Agra Orange',
						trait_description: 'This Nearbot is part of the Agra Tribe of Near Future',
						luck: '-',
					},
					{
						trait_type: 'Back Pauldron',
						value: 'Iron Halfdome Back Pauldron',
						trait_description: 'Halfdomed pauldron iron',
						luck: '1',
					},
					{
						trait_type: 'Neck',
						value: 'Neck',
						trait_description: 'Nearbot iron neck',
						luck: '1',
					},
					{
						trait_type: 'Body',
						value: 'Mummy Body',
						trait_description: 'Standard Body Mummy',
						luck: '1',
					},
					{
						trait_type: 'Clothes',
						value: 'Spartan Cloak',
						trait_description: 'Red Tunic (Centurion) with big gold button thing',
						luck: '3',
					},
					{
						trait_type: 'Item',
						value: 'Roman Sword',
						trait_description: 'Roman Sword (Gladius) ',
						luck: '3',
					},
					{
						trait_type: 'Back Headgear',
						value: 'No Back Headgear',
						trait_description: 'No Back Headgear',
						luck: '-',
					},
					{
						trait_type: 'Head',
						value: 'Mummy Head',
						trait_description: 'Mummy wrapped pillbox',
						luck: '1',
					},
					{
						trait_type: 'Eyes',
						value: 'Aurelian Mask',
						trait_description: 'Aurelian inspired eyes, cast bronze',
						luck: '3',
					},
					{
						trait_type: 'Jaw',
						value: 'Iron Jaw',
						trait_description: 'Standard Jaw Iron',
						luck: '1',
					},
					{
						trait_type: 'Front Headgear',
						value: 'Bucket Hat',
						trait_description: 'bucket hat w versace pattern',
						luck: '3',
					},
					{
						trait_type: 'Front Pauldron',
						value: 'Iron Plated Back Pauldron',
						trait_description: 'Straight plate pauldron Iron',
						luck: '1',
					},
					{
						trait_type: 'Class',
						value: 'Warrior',
						trait_description: 'Warrior of the Near Future',
						luck: '-',
					},
				],
				compiler: 'HashLips Art Engine - NFTChef fork',
				creator_id: 'nfc.enleap.near',
				score: 183.1177213961003,
				rank: 300,
			},
			owner_id: 'obaf.near',
			royalty: {
				'pmint.near': 700,
			},
			token_series_id: '656',
			isMediaCdn: true,
			has_rank: true,
			approval_id: 1,
			has_price: true,
			is_staked: false,
			price: {
				$numberDecimal: '12000000000000000000000000',
			},
			ft_token_id: 'near',
			transaction_fee: '200',
			view: 1,
		},
		view: 0,
	},
	{
		_id: '62b3ff360f79da7628b7e62a',
		contract_id: 'x.paras.near',
		token_series_id: '424850',
		creator_id: 'mimagrama.near',
		price: '1500000000000000000000000',
		lowest_price: '1500000000000000000000000',
		royalty: {
			'mimagrama.near': 1500,
		},
		metadata: {
			description: 'unique\nhand- drawn',
			collection: 'Bizarre ',
			collection_id: 'bizarre-by-mimagramanear',
			creator_id: 'mimagrama.near',
			blurhash: 'U28MO00KpcACHX.TMxt74SR4ozsC5kXTSgwJ',
			mime_type: 'image/jpeg',
			animation_url: '',
			copies: 1,
			expires_at: null,
			extra: null,
			media: 'bafybeic4a46pwjq42qetrmh2ozmic4dwbitzimhtmb4n43xlib4z5snxoq',
			media_hash: null,
			reference: 'bafkreiczujwsv7dxb6nvvnijsfxlswghxcqvx6vhunirhftjcbuheeaqhm',
			reference_hash: null,
			starts_at: null,
			title: 'Out of place#3',
			updated_at: null,
			score: 0,
		},
		in_circulation: 0,
		updated_at: 1660038830127,
		has_price: true,
		transaction_fee: '200',
		is_creator: true,
		category_ids: ['characters'],
		categories: [
			{
				name: 'Characters',
				description_short:
					"Character design can be bold, subtle, intriguing, mysterious, unique, etc. We're talking about character here, show us yours!",
				category_id: 'characters',
			},
		],
		view: 11,
	},
	{
		_id: '62b3fe3c0f79da7628b7e628',
		contract_id: 'x.paras.near',
		token_series_id: '424849',
		creator_id: 'mimagrama.near',
		price: '1500000000000000000000000',
		lowest_price: '1500000000000000000000000',
		royalty: {
			'mimagrama.near': 1500,
		},
		metadata: {
			description: 'unique \nhand- drawn',
			collection: 'Bizarre ',
			collection_id: 'bizarre-by-mimagramanear',
			creator_id: 'mimagrama.near',
			blurhash: 'U009jvj[azayayj@fQazayayfPfPj[fRfQj@',
			mime_type: 'image/jpeg',
			animation_url: '',
			copies: 1,
			expires_at: null,
			extra: null,
			media: 'bafybeihcd65q4dkxu73whlcktlrguuql2tht3vzuqx7wj5feugiyinuqu4',
			media_hash: null,
			reference: 'bafkreig5zyccifciiqs2n7qa66z2b36rrzqz4dwosavdwud4uxfxjadvea',
			reference_hash: null,
			starts_at: null,
			title: 'Out of place#2',
			updated_at: null,
			score: 0,
		},
		in_circulation: 0,
		updated_at: 1660038813749,
		has_price: true,
		transaction_fee: '200',
		is_creator: true,
		category_ids: ['characters'],
		categories: [
			{
				name: 'Characters',
				description_short:
					"Character design can be bold, subtle, intriguing, mysterious, unique, etc. We're talking about character here, show us yours!",
				category_id: 'characters',
			},
		],
		view: 9,
	},
	{
		_id: '62ed27ebac17d471e5164d23',
		contract_id: 'x.paras.near',
		token_series_id: '450490',
		creator_id: 'khunpolkaihom.near',
		price: '500000000000000000000000',
		lowest_price: '500000000000000000000000',
		royalty: {
			'khunpolkaihom.near': 1000,
		},
		metadata: {
			description: 'Meow Meow!! Collect ur coin.',
			collection: 'Maki-Cat  "The Money Cat"',
			collection_id: 'maki-cat-the-money-cat-by-khunpolkaihomnear',
			creator_id: 'khunpolkaihom.near',
			blurhash: 'U4Lg^b=^9F0000%3xuxu~W9sVuR%9EaOS1WB',
			mime_type: 'image/gif',
			animation_url: '',
			copies: 1,
			expires_at: null,
			extra: null,
			media: 'bafybeig34yq7d6h3pubx6mfa3bqcklakbodkqfnymdl7ybw3qcoieg5ptq',
			media_hash: null,
			reference: 'bafkreiehwu7ao33ovjo2jnytfmsfir32uvtiwiwwkmezkgb5pnmg2cvd5u',
			reference_hash: null,
			starts_at: null,
			title: 'Maki-Cat#104',
			updated_at: null,
		},
		in_circulation: 0,
		updated_at: 1660038593028,
		has_price: true,
		transaction_fee: '200',
		is_creator: true,
		categories: [],
		view: 2,
	},
	{
		_id: '62ed297bac17d471e5164d46',
		contract_id: 'x.paras.near',
		token_series_id: '450494',
		creator_id: 'yionautark.near',
		price: '2000000000000000000000000',
		lowest_price: '2000000000000000000000000',
		royalty: {
			'yionautark.near': 1000,
		},
		metadata: {
			description: 'Picasso Paint',
			collection: 'Picasso Paints',
			collection_id: 'picasso-paints-by-yionautarknear',
			creator_id: 'yionautark.near',
			blurhash: 'U9E-:Qu2%{mTyDZipDs*};ICIpVu*}NfTHxs',
			mime_type: 'image/jpeg',
			animation_url: '',
			copies: 1,
			expires_at: null,
			extra: null,
			media: 'bafybeidp75sxyzjkb7clwi4wlk4kv5vqtwyeienkc5xyhr6n2stbqsj32q',
			media_hash: null,
			reference: 'bafkreigmfcyd5ywd5efckrjvtmdi4lde6fahuwlzjdimpb5ezxbxccbpby',
			reference_hash: null,
			starts_at: null,
			title: 'Picasso Paint #2',
			updated_at: null,
		},
		in_circulation: 0,
		updated_at: 1660038565243,
		has_price: true,
		transaction_fee: '200',
		is_creator: true,
		total_likes: 2,
		categories: [],
		view: 4,
	},
]
