import { InputText } from 'components/Common/form'
import ActivityUserFollow from 'components/Follow/ActivityUserFollow'
import RecommendationUserFollow from 'components/Follow/RecommendationUserFollow'
import Footer from 'components/Footer'
import Nav from 'components/Nav'
import Head from 'next/head'

const Following = () => {
	return (
		<div className="min-h-screen relative bg-black">
			<Head>
				<title>Following - Paras</title>
				<meta
					name="description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta
					name="keywords"
					content="paras, paras id, paras digital, nft, nft marketplace, near, near marketplace"
				/>

				<meta
					name="twitter:title"
					content="Paras - NFT Marketplace for Digital Collectibles on NEAR"
				/>
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
				<meta
					property="og:title"
					content="Paras - NFT Marketplace for Digital Collectibles on NEAR"
				/>
				<meta
					property="og:site_name"
					content="Paras - NFT Marketplace for Digital Collectibles on NEAR"
				/>
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
			/>
			<Nav />
			<div className="max-w-6xl m-auto">
				<div className="relative px-4 pb-24">
					<div className="max-w-5xl m-auto py-12 md:flex md:flex-col">
						<div className="w-full relative">
							<p className="text-4xl font-bold text-gray-100 mb-8 md:mb-16 mr-2 capitalize">
								Following
							</p>
							<div className="flex items-center justify-center">
								<p className="text-gray-200 text-center font-bold mb-8 md:w-1/3">
									Follow at least total of artists to build your Following page...
								</p>
							</div>
							<div className="flex items-center justify-center">
								<div className="md:w-2/3">
									<input
										placeholder="Search artist by their name or their collections"
										className="bg-transparent border-gray-600 border border-opacity-40 focus:bg-transparent text-white px-4 py-2.5 text-sm placeholder:text-gray-600"
									/>
								</div>
							</div>
						</div>
						{/* <div className="w-full grid md:grid-cols-4 gap-4 mt-8">
							<RecommendationUserFollow />
							<RecommendationUserFollow />
							<RecommendationUserFollow />
							<RecommendationUserFollow />
							<RecommendationUserFollow />
						</div> */}
						<div className="mt-8 max-w-4xl w-full m-auto">
							<ActivityUserFollow />
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	)
}

export default Following

const sellersdata = [
	{
		contract_token_ids: [
			'x.paras.near::387423:278',
			'x.paras.near::387423:255',
			'x.paras.near::387427:782',
			'x.paras.near::387423:310',
			'x.paras.near::387427:752',
			'x.paras.near::387427:746',
			'x.paras.near::387423:324',
			'x.paras.near::387351:232',
			'x.paras.near::387423:342',
			'x.paras.near::387423:289',
			'x.paras.near::387427:745',
			'x.paras.near::387427:735',
			'x.paras.near::387423:275',
			'x.paras.near::387427:788',
			'x.paras.near::387427:734',
			'x.paras.near::387427:802',
			'x.paras.near::387423:347',
			'x.paras.near::387427:774',
			'x.paras.near::387427:733',
			'x.paras.near::387427:795',
			'x.paras.near::387427:815',
			'x.paras.near::387427:809',
			'x.paras.near::387427:764',
			'x.paras.near::387427:730',
			'x.paras.near::387427:727',
			'x.paras.near::387427:724',
			'x.paras.near::387427:805',
			'x.paras.near::387427:758',
			'x.paras.near::387427:721',
			'x.paras.near::387427:718',
			'x.paras.near::387427:738',
			'x.paras.near::387351:225',
			'x.paras.near::387423:326',
			'x.paras.near::387423:340',
			'x.paras.near::387423:308',
			'x.paras.near::387423:263',
			'x.paras.near::387423:254',
			'x.paras.near::387423:292',
			'x.paras.near::387427:804',
			'x.paras.near::387423:346',
			'x.paras.near::387427:792',
			'x.paras.near::387427:766',
			'x.paras.near::387423:332',
			'x.paras.near::387423:270',
			'x.paras.near::387427:740',
			'x.paras.near::387427:716',
			'x.paras.near::387427:810',
			'x.paras.near::387423:312',
			'x.paras.near::387427:789',
			'x.paras.near::387427:750',
			'x.paras.near::387427:796',
			'x.paras.near::387351:233',
			'x.paras.near::387423:344',
			'x.paras.near::387423:290',
			'x.paras.near::387423:296',
			'x.paras.near::387427:726',
			'x.paras.near::387423:250',
			'x.paras.near::387423:330',
			'x.paras.near::387427:736',
			'x.paras.near::387427:765',
			'x.paras.near::387351:230',
			'x.paras.near::387423:337',
			'x.paras.near::387423:299',
			'x.paras.near::387423:251',
			'x.paras.near::387423:256',
			'x.paras.near::387423:273',
			'x.paras.near::387427:742',
			'x.paras.near::387423:348',
			'x.paras.near::387423:269',
			'x.paras.near::387423:277',
			'x.paras.near::387423:345',
			'x.paras.near::387423:294',
			'x.paras.near::387427:813',
			'x.paras.near::387427:791',
			'x.paras.near::387423:339',
			'x.paras.near::387427:728',
			'x.paras.near::387423:272',
			'x.paras.near::387423:320',
			'x.paras.near::387423:282',
			'x.paras.near::387427:743',
			'x.paras.near::387423:280',
			'x.paras.near::387427:784',
			'x.paras.near::387351:228',
			'x.paras.near::387423:335',
			'x.paras.near::387423:257',
			'x.paras.near::387423:298',
			'x.paras.near::387427:787',
			'x.paras.near::387423:286',
			'x.paras.near::387427:759',
			'x.paras.near::387427:779',
			'x.paras.near::387427:731',
			'x.paras.near::387427:768',
			'x.paras.near::387427:744',
			'x.paras.near::387423:318',
			'x.paras.near::387427:729',
			'x.paras.near::387427:719',
			'x.paras.near::387427:717',
			'x.paras.near::387427:793',
			'x.paras.near::387423:331',
			'x.paras.near::387427:754',
			'x.paras.near::387423:276',
			'x.paras.near::387427:778',
			'x.paras.near::387423:264',
			'x.paras.near::387423:314',
			'x.paras.near::387427:781',
			'x.paras.near::387423:267',
			'x.paras.near::387427:723',
			'x.paras.near::387423:350',
			'x.paras.near::387423:325',
			'x.paras.near::387351:226',
			'x.paras.near::387427:747',
			'x.paras.near::387423:249',
			'x.paras.near::387423:328',
			'x.paras.near::387423:309',
			'x.paras.near::387351:227',
			'x.paras.near::387423:306',
			'x.paras.near::387423:279',
			'x.paras.near::387423:295',
			'x.paras.near::387423:265',
			'x.paras.near::387423:287',
			'x.paras.near::387427:757',
			'x.paras.near::387423:300',
			'x.paras.near::387427:748',
			'x.paras.near::387423:288',
			'x.paras.near::387427:767',
			'x.paras.near::387427:715',
			'x.paras.near::387427:780',
			'x.paras.near::387423:319',
			'x.paras.near::387423:353',
			'x.paras.near::387427:814',
			'x.paras.near::387423:355',
			'x.paras.near::387423:333',
			'x.paras.near::387423:316',
			'x.paras.near::387423:303',
			'x.paras.near::387423:311',
			'x.paras.near::387427:806',
			'x.paras.near::387423:291',
			'x.paras.near::387427:812',
			'x.paras.near::387423:283',
			'x.paras.near::387423:261',
			'x.paras.near::387351:229',
			'x.paras.near::387423:260',
			'x.paras.near::387427:756',
			'x.paras.near::387427:783',
			'x.paras.near::387427:732',
			'x.paras.near::387423:327',
			'x.paras.near::387423:258',
			'x.paras.near::387427:803',
			'x.paras.near::387423:313',
			'x.paras.near::387427:785',
			'x.paras.near::387427:777',
			'x.paras.near::387427:755',
			'x.paras.near::387427:763',
			'x.paras.near::387351:224',
			'x.paras.near::387427:762',
			'x.paras.near::387427:817',
			'x.paras.near::387427:722',
			'x.paras.near::387423:323',
			'x.paras.near::387427:775',
			'x.paras.near::387423:271',
			'x.paras.near::387423:302',
			'x.paras.near::387423:301',
			'x.paras.near::387427:769',
			'x.paras.near::387423:351',
			'x.paras.near::387427:749',
			'x.paras.near::387427:737',
			'x.paras.near::387427:725',
			'x.paras.near::387427:720',
			'x.paras.near::387423:268',
			'x.paras.near::387423:293',
			'x.paras.near::387427:773',
			'x.paras.near::387427:790',
			'x.paras.near::387423:315',
			'x.paras.near::387423:341',
			'x.paras.near::387423:338',
			'x.paras.near::387427:753',
			'x.paras.near::387423:336',
			'x.paras.near::387423:307',
			'x.paras.near::387423:266',
			'x.paras.near::387427:816',
			'x.paras.near::387423:334',
			'x.paras.near::387423:297',
			'x.paras.near::387423:274',
			'x.paras.near::387423:329',
			'x.paras.near::387427:801',
			'x.paras.near::387423:259',
			'x.paras.near::387423:354',
			'x.paras.near::387427:797',
			'x.paras.near::387427:794',
			'x.paras.near::387423:322',
			'x.paras.near::387423:253',
			'x.paras.near::387427:798',
			'x.paras.near::387427:772',
			'x.paras.near::387427:771',
			'x.paras.near::387427:760',
			'x.paras.near::387423:305',
			'x.paras.near::387423:252',
			'x.paras.near::387427:799',
			'x.paras.near::387427:808',
			'x.paras.near::387427:751',
			'x.paras.near::387423:281',
			'x.paras.near::387427:818',
			'x.paras.near::387423:285',
			'x.paras.near::387423:262',
			'x.paras.near::387427:800',
			'x.paras.near::387427:786',
			'x.paras.near::387427:776',
			'x.paras.near::387427:811',
			'x.paras.near::387427:819',
			'x.paras.near::387351:231',
			'x.paras.near::387423:317',
			'x.paras.near::387423:352',
			'x.paras.near::387423:343',
			'x.paras.near::387427:741',
			'x.paras.near::387423:284',
			'x.paras.near::387423:349',
			'x.paras.near::387423:304',
			'x.paras.near::387427:770',
			'x.paras.near::387427:761',
			'x.paras.near::387423:321',
			'x.paras.near::387427:739',
		],
		account_id: 'zomland.near',
		total_sum: '1822870000000000000000000000',
	},
	{
		contract_token_ids: [
			'nearnautnft.near::token-naut-16383707752440',
			'nearton_nft.near::2734',
			'futurenft.near::1571',
			'futurenft.near::1704',
			'undead.secretskelliessociety.near::4362',
			'cartelgen1.neartopia.near::386',
			'nft.goodfortunefelines.near::1199',
			'x.paras.near::190440:1',
			'nft.thedons.near::1934',
			'nearton_nft.near::355',
			'futurenft.near::362',
			'asac.near::3124',
			'nft.thedons.near::1860',
			'nft.thedons.near::2994',
			'nearton_nft.near::212',
			'classykangaroos1.near::504',
			'nearton_nft.near::140',
			'nft.thedons.near::898',
			'futurenft.near::2627',
			'mara-smartcontract.near::40',
			'nft.thedons.near::1984',
			'cartelgen1.neartopia.near::1142',
			'nearton-boosters.near::bird-46',
			'nft.thedons.near::1323',
		],
		account_id: 'ltlollipop.near',
		total_sum: '855580000000000000000000000',
	},
	{
		contract_token_ids: [
			'undead.secretskelliessociety.near::1039',
			'gen0.metafoxonry.near::760',
			'undead.secretskelliessociety.near::3661',
			'undead.secretskelliessociety.near::107',
			'undead.secretskelliessociety.near::2005',
			'undead.secretskelliessociety.near::1423',
			'undead.secretskelliessociety.near::1698',
			'friendlyturtles.nearocean.near::388',
			'babydragonnation.near::263',
			'gen0.metafoxonry.near::643',
			'babydragonnation.near::902',
			'asac.near::2246',
			'undead.secretskelliessociety.near::391',
			'babydragonnation.near::730',
			'gen0.metafoxonry.near::517',
			'mint.havendao.near::254',
			'babydragonnation.near::182',
			'secretskelliessociety.near::76',
			'mint.havendao.near::32',
			'nftreactor.near::475',
			'undead.secretskelliessociety.near::3378',
			'babydragonnation.near::232',
			'x.paras.near::160294:1',
		],
		account_id: 'nathann.near',
		total_sum: '751900000000000000000000000',
	},
	{
		contract_token_ids: [
			'asac.near::3047',
			'asac.near::1860',
			'nft.themunkymonkey.near::2709:1',
			'asac.near::1886',
			'asac.near::2143',
			'asac.near::2557',
		],
		account_id: 'd434ee580bd31331b4ff918eb7babced1b4acf1ceeee538bf13e262e2bbcc031',
		total_sum: '414500000000000000000000000',
	},
	{
		contract_token_ids: ['asac.near::450', 'x.paras.near::243707:1'],
		account_id: 'jsdr.near',
		total_sum: '386000000000000000000000000',
	},
	{
		contract_token_ids: ['asac.near::834'],
		account_id: 'kryll.near',
		total_sum: '370000000000000000000000000',
	},
	{
		contract_token_ids: ['asac.near::2863'],
		account_id: 'mycryptoalias.near',
		total_sum: '369000000000000000000000000',
	},
	{
		contract_token_ids: [
			'undead.secretskelliessociety.near::2042',
			'undead.secretskelliessociety.near::3359',
			'friendlyturtles.nearocean.near::346',
			'undead.secretskelliessociety.near::2175',
			'terraspaces.near::571',
			'undead.secretskelliessociety.near::3912',
			'undead.secretskelliessociety.near::2580',
			'623c2cd4294f600e58f46fa2.astrogenfunds.near::1423',
			'undead.secretskelliessociety.near::3659',
			'futurenft.near::1679',
			'weapons-exxaverse.near::w_katana_1_324',
			'undead.secretskelliessociety.near::3050',
			'undead.secretskelliessociety.near::1438',
			'undead.secretskelliessociety.near::596',
			'undead.secretskelliessociety.near::786',
			'undead.secretskelliessociety.near::4407',
			'undead.secretskelliessociety.near::2152',
			'undead.secretskelliessociety.near::547',
			'undead.secretskelliessociety.near::578',
			'futurenft.near::350',
			'weapons-exxaverse.near::w_flameberge_3_323',
			'undead.secretskelliessociety.near::3037',
			'undead.secretskelliessociety.near::3383',
			'623c2cd4294f600e58f46fa2.astrogenfunds.near::1090',
			'futurenft.near::3341',
			'futurenft.near::1141',
			'undead.secretskelliessociety.near::2457',
			'undead.secretskelliessociety.near::1431',
			'futurenft.near::1103',
			'undead.secretskelliessociety.near::351',
			'undead.secretskelliessociety.near::3716',
			'undead.secretskelliessociety.near::3115',
			'undead.secretskelliessociety.near::612',
			'undead.secretskelliessociety.near::2793',
			'623c2cd4294f600e58f46fa2.astrogenfunds.near::1017',
			'thebullishbulls.near::2350',
			'futurenft.near::2470',
			'futurenft.near::566',
			'undead.secretskelliessociety.near::3283',
			'x.paras.near::354453:1',
			'undead.secretskelliessociety.near::3771',
		],
		account_id: 'markoeth.near',
		total_sum: '312900000000000000000000000',
	},
	{
		contract_token_ids: [
			'nearton_nft.near::1676',
			'mara-smartcontract.near::655',
			'nft.thedons.near::1323',
			'nft.thedons.near::2035',
			'nearnautnft.near::token-naut-16383707752440',
			'mrbrownproject.near::684',
			'astropup.near::token-pups-16449097367180',
			'mrbrownproject.near::313',
			'nft.thedons.near::92',
			'mrbrownproject.near::951',
			'nft.thedons.near::898',
			'mara-smartcontract.near::507',
			'nft.thedons.near::2607',
			'nft.thedons.near::3060',
			'mrbrownproject.near::2534',
			'nearnautnft.near::token-naut-16398141521233',
			'nft.thedons.near::2994',
			'nft.thedons.near::1860',
			'mrbrownproject.near::3054',
			'mrbrownproject.near::4009',
		],
		account_id: 'dorayaki19.near',
		total_sum: '312800000000000000000000000',
	},
	{
		contract_token_ids: ['asac.near::1409'],
		account_id: '50iq.near',
		total_sum: '299000000000000000000000000',
	},
	{
		contract_token_ids: [
			'mint.havendao.near::82',
			'mint.havendao.near::22',
			'mint.havendao.near::18',
			'grimms.secretskelliessociety.near::477',
		],
		account_id: 'n0mn0m.near',
		total_sum: '270000000000000000000000000',
	},
	{
		contract_token_ids: [
			'mrbrownproject.near::734',
			'secretskelliessociety.near::620',
			'classykangaroos1.near::50',
		],
		account_id: 'thisiscrypto.near',
		total_sum: '265900000000000000000000000',
	},
	{
		contract_token_ids: ['secretskelliessociety.near::556', 'x.paras.near::174413:1'],
		account_id: 'peachynft.near',
		total_sum: '245000000000000000000000000',
	},
	{
		contract_token_ids: [
			'nearnautnft.near::token-naut-16383712595910',
			'gen0.metafoxonry.near::493',
			'thebullishbulls.near::2350',
			'nearnautnft.near::token-naut-16383707449460',
			'nearton_nft.near::482',
			'nearton_nft.near::2528',
			'misfits.tenk.near::1662',
			'astropup.near::token-pups-16449104162050',
			'thebullishbulls.near::1895',
		],
		account_id: 'humansarefucked.near',
		total_sum: '234350000000000000000000000',
	},
	{
		contract_token_ids: [
			'mint.havendao.near::44',
			'cartelgen1.neartopia.near::1203',
			'gen0.metafoxonry.near::493',
			'asac.near::82',
			'nft.thedons.near::2595',
			'mara-smartcontract.near::437',
		],
		account_id: 'dean3lr.near',
		total_sum: '206500000000000000000000000',
	},
	{
		contract_token_ids: [
			'x.paras.near::352765:1',
			'x.paras.near::264448:84',
			'x.paras.near::205163:1',
			'x.paras.near::396584:1',
			'x.paras.near::264448:83',
			'x.paras.near::264448:86',
			'x.paras.near::422815:1',
			'x.paras.near::388862:1',
			'x.paras.near::352756:1',
			'x.paras.near::389154:1',
			'x.paras.near::415379:1',
			'x.paras.near::264448:60',
			'x.paras.near::264448:85',
		],
		account_id: 'mahyar_mandala.near',
		total_sum: '201340000000000000000000000',
	},
	{
		contract_token_ids: [
			'mint.havendao.near::332',
			'mint.havendao.near::47',
			'mint.havendao.near::109',
		],
		account_id: 'betelgeuse.near',
		total_sum: '180690000000000000000000000',
	},
	{
		contract_token_ids: [
			'undead.secretskelliessociety.near::2645',
			'undead.secretskelliessociety.near::1389',
			'rocketbois.neartopia.near::1441',
			'rocketbois.neartopia.near::69',
			'grimms.secretskelliessociety.near::624',
		],
		account_id: 'sevenzen.near',
		total_sum: '166500000000000000000000000',
	},
	{
		contract_token_ids: [
			'mint.havendao.near::115',
			'undead.secretskelliessociety.near::2743',
			'mara-smartcontract.near::232',
			'undead.secretskelliessociety.near::2894',
			'undead.secretskelliessociety.near::1420',
			'undead.secretskelliessociety.near::856',
		],
		account_id: 'pluz.near',
		total_sum: '157070000000000000000000000',
	},
	{
		contract_token_ids: [
			'nearnautnft.near::token-naut-16416770781030',
			'anonymousfox.enleap.near::206',
			'nearnautnft.near::token-naut-16422589317911',
			'nft.alienbearcrew.near::455',
			'anonymousfox.enleap.near::163',
			'nearnautnft.near::token-naut-16426913006530',
		],
		account_id: 'kong_mufasa.near',
		total_sum: '137400000000000000000000000',
	},
	{
		contract_token_ids: [
			'mint.havendao.near::184',
			'mint.havendao.near::259',
			'tinkerunion_nft.enleap.near::2353',
			'tinkerunion_nft.enleap.near::652',
		],
		account_id: 'amnesiahaze.near',
		total_sum: '135340000000000000000000000',
	},
	{
		contract_token_ids: [
			'mara-smartcontract.near::313',
			'rocketbois.neartopia.near::1156',
			'rocketbois.neartopia.near::529',
			'mara-smartcontract.near::655',
		],
		account_id: 'zkittlez101.near',
		total_sum: '125170000000000000000000000',
	},
	{
		contract_token_ids: ['nft.goodfortunefelines.near::1097', 'asac.near::2482'],
		account_id: 'mint-burner.near',
		total_sum: '120250000000000000000000000',
	},
	{
		contract_token_ids: [
			'okami-gen0.near::6',
			'okami-gen0.near::81',
			'nearrobotics.near::1029',
			'nearrobotics.near::1153',
			'okami-gen0.near::41',
			'nearrobotics.near::1543',
			'okami-gen0.near::37',
		],
		account_id: 'e4a76f149644ac9dc382bd65b4d41a36388156e3d3779b8503a9ceb997005e2e',
		total_sum: '119600000000000000000000000',
	},
	{
		contract_token_ids: [
			'kaizofighters.tenk.near::3261',
			'kaizofighters.tenk.near::3887',
			'kaizofighters.tenk.near::2115',
			'kaizofighters.tenk.near::3232',
		],
		account_id: 'slifer.near',
		total_sum: '115200000000000000000000000',
	},
	{
		contract_token_ids: [
			'mrbrownproject.near::3156',
			'nearton_nft.near::1550',
			'mara-smartcontract.near::847',
			'thebullishbulls.near::1681',
			'nft.thedons.near::2003',
			'rocketbois.neartopia.near::80',
		],
		account_id: 'coffeeholic.near',
		total_sum: '111520000000000000000000000',
	},
	{
		contract_token_ids: ['rocketbois.neartopia.near::161'],
		account_id: 'julianyhalim.near',
		total_sum: '111000000000000000000000000',
	},
	{
		contract_token_ids: [
			'nearnautnft.near::token-naut-16426910867507',
			'nearnautnft.near::token-naut-16418135002662',
			'nearnautnft.near::token-naut-16426910867506',
		],
		account_id: 'nemenaza.near',
		total_sum: '110000000000000000000000000',
	},
	{
		contract_token_ids: [
			'undead.secretskelliessociety.near::4229',
			'grimms.secretskelliessociety.near::763',
			'undead.secretskelliessociety.near::4416',
		],
		account_id: 'malmz.near',
		total_sum: '110000000000000000000000000',
	},
	{
		contract_token_ids: [
			'nearton_nft.near::352',
			'x.paras.near::153998:57',
			'nft.thedons.near::1918',
			'asac.near::264',
		],
		account_id: 'notoriousbig.near',
		total_sum: '109900000000000000000000000',
	},
]
