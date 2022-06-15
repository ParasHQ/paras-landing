import Head from 'next/head'
import { useState } from 'react'

import { useIntl } from 'hooks/useIntl'
import Footer from 'components/Footer'
import Nav from 'components/Nav'

const LicenseOverview = () => {
	const { localeLn } = useIntl()
	return (
		<div>
			<div className="opacity-75">
				<p className="mt-2">{localeLn('LicenseHelpsDefine')}</p>
				<ul className="list-disc mt-2 pl-4">
					<li>{localeLn('LicenseProtectingCreators')}</li>
					<li>{localeLn('LicenseGrantingOwners')}</li>
				</ul>
				<p className="mt-2">{localeLn('LicenseAnyNFT')}</p>
			</div>
			<p className="font-medium mt-4">{localeLn('LicenseContentIsYours')}</p>
			<p className="mt-2 opacity-75">{localeLn('LicenseArtistsOwnRights')}</p>
			<p className="mt-2 opacity-75">{localeLn('LicenseArtistsAreResponsible')}</p>
			<p className="font-medium mt-4">{localeLn('LicenseWhatAmI')}</p>
			<p className="mt-2 opacity-75">{localeLn('LicenseYouBroadRights')}</p>
			<ul className="list-disc mt-2 opacity-75 pl-4">
				<li>{localeLn('LicenseUseDAC')}</li>
				<li>{localeLn('LicenseUseDACWhen')}</li>
				<li>{localeLn('LicenseUseDACOn')}</li>
			</ul>
			<p className="font-medium mt-4">{localeLn('LicenseArtAssociated')}</p>
			<p className="mt-2 opacity-75">{localeLn('LicenseAreNotAppropriate')}</p>
			<ul className="list-disc mt-2 opacity-75 pl-4">
				<li>{localeLn('LicenseModifyingArt')}</li>
				<li>{localeLn('LicenseUsingForCommercialize')}</li>
				<li>{localeLn('LicenseSellThirdParty')}</li>
				<li>{localeLn('LicenseImagesHatred')}</li>
				<li>{localeLn('LicenseTryingTrademark')}</li>
			</ul>
		</div>
	)
}

const LicenseDetail = () => {
	const { localeLn } = useIntl()
	return (
		<div>
			<p className="font-medium">{localeLn('Version10')}</p>
			<p className="font-medium mt-4">{localeLn('LicenseDefinitions')}</p>
			<p className="mt-2 opacity-75">{localeLn('LicenseArtMeans')}</p>
			<p className="mt-2 opacity-75">{localeLn('LicenseNFTMeans')}</p>
			<p className="mt-2 opacity-75">{localeLn('LicenseConcerningAnNFT')}</p>
			<p className="mt-2 opacity-75">{localeLn('LicensePurchasedNFT')}</p>
			<p className="mt-2 opacity-75">{localeLn('LicenseThirdPartyIP')}</p>
			<p className="font-medium mt-4">{localeLn('LicenseOwnership')}</p>
			<p className="mt-2 opacity-75">{localeLn('LicenseYouAcknowledge')}</p>
			<p className="font-medium mt-4">{localeLn('LicenseLicense')}</p>
			<ul
				className="mt-2 opacity-75 pl-4"
				style={{
					listStyleType: `lower-alpha	`,
				}}
			>
				<li>
					{localeLn('LicenseGeneralUse')}
					<ul
						className="pl-8"
						style={{
							listStyleType: `lower-roman`,
						}}
					>
						<li>{localeLn('LicenseForYourPersonal')}</li>
						<li>{localeLn('LicenseAsPartMarketplace')} </li>
						<li>{localeLn('LicenseThirdPartyWebsite')}</li>
					</ul>
				</li>
				<li>{localeLn('LicenseCommercialUse')}</li>
			</ul>
			<p className="font-medium mt-4">{localeLn('LicenseRestrictions')}</p>
			<p className="mt-2 opacity-75">{localeLn('LicenseYouAgree')}</p>
			<ol
				className="pl-8 opacity-75"
				style={{
					listStyleType: `lower-alpha`,
				}}
				start="23"
			>
				<li>{localeLn('LicenseHaveRightTo')} </li>
				<li>{localeLn('LicenseInSection3')}</li>
				<li>{localeLn('LicenseDependingOn')}</li>
				<li>{localeLn('LicenseToTheExtent')}</li>
			</ol>

			<p className="font-medium mt-4">{localeLn('LicenseTermsOf')}</p>
			<p className="mt-2 opacity-75">{localeLn('LicenseTheLicenseGranted')}</p>
		</div>
	)
}

const License = () => {
	const [activeTab, setActiveTab] = useState('overview')
	const { localeLn } = useIntl()
	return (
		<div className="min-h-screen relative bg-black">
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
				<title>{localeLn('LicenseParas')}</title>
				<meta
					name="description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
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
			<div>
				<Nav />
				<div className="relative py-16 max-w-4xl mx-auto text-gray-100 px-4">
					<h2 className="font-bold text-4xl text-center">{localeLn('NFTLicense')}</h2>
					<div className="flex mt-6 justify-between items-center">
						<div className="w-1/2 text-center">
							<h3
								onClick={() => setActiveTab('overview')}
								className={`cursor-pointer font-bold text-2xl ${
									activeTab !== 'overview' && 'opacity-75'
								}`}
							>
								{localeLn('Overview')}
							</h3>
						</div>
						<div className="w-1/2 text-center">
							<h3
								onClick={() => setActiveTab('detail')}
								className={`cursor-pointer font-bold text-2xl ${
									activeTab !== 'detail' && 'opacity-75'
								}`}
							>
								{localeLn('License')}
							</h3>
						</div>
					</div>
					<div className="mt-8">
						{activeTab === 'overview' && <LicenseOverview />}
						{activeTab === 'detail' && <LicenseDetail />}
					</div>
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default License
