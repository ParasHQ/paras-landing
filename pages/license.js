import Head from 'next/head'
import { useState } from 'react'

const { default: Footer } = require('../components/Footer')
const { default: Nav } = require('../components/Nav')

const LicenseOverview = () => {
	return (
		<div>
			<div className="opacity-75">
				<p className="mt-2">
					The NFT License helps define the rights of both owners or collectors
					of the non-fungible tokens (NFTs) as well as artists working with
					NFTs. The NFT License is designed to balance two concerns:
				</p>
				<ul className="list-disc mt-2 pl-4">
					<li>Protecting the hard work and ingenuity of creators</li>
					<li>
						Granting owners or collectors the freedom and flexibility to fully
						enjoy their non-fungible tokens
					</li>
				</ul>
				<p className="mt-2">Any NFT project can use this license.</p>
			</div>
			<p className="font-medium mt-4">
				What am I allowed to do with the art associated with my NFT?
			</p>
			<p className="mt-2 opacity-75">
				You have broad rights to use the art associated with your NFT. In the
				case of a Digital Art Card (DAC), you can do any of the following:
			</p>
			<ul className="list-disc mt-2 opacity-75 pl-4">
				<li>Use the DAC for your own personal, non-commercial use;</li>
				<li>
					Use the DAC when you’re on a marketplace that allows the purchase and
					sale of your card, so long as the marketplace cryptographically
					verifies that you are the owner;
				</li>
				<li>
					Use the DAC when you’re on a third-party website or app that allows
					the inclusion, involvement, or participation of your card so long as
					the website/app cryptographically verifies that you are the owner, and
					the DAC doesn’t stay on the website/app after you’ve left; and
				</li>
				<li>Use the DAC to commercialize your own merchandise.</li>
			</ul>
			<p className="font-medium mt-4">
				What am I NOT allowed to do with the art associated with my NFT?
			</p>
			<p className="mt-2 opacity-75">
				There are a few things that aren’t appropriate uses for your NFT art.
				They include:
			</p>
			<ul className="list-disc mt-2 opacity-75 pl-4">
				<li>Modifying the art;</li>
				<li>Using the art to market or sell third-party products;</li>
				<li>
					Using the art in connection with images of hatred, violence, or other
					inappropriate behavior; or
				</li>
				<li>
					Trying to trademark your art, or otherwise acquire intellectual
					property rights in it.
				</li>
			</ul>
		</div>
	)
}

const LicenseDetail = () => {
	return (
		<div>
			<p className="font-medium">Version 1.0</p>
			<p className="font-medium mt-4">1. Definitions.</p>
			<p className="mt-2 opacity-75">
				“Art” means any art, design, and drawings that may be associated with an
				NFT that you Own.
			</p>
			<p className="mt-2 opacity-75">
				"NFT" means any blockchain-tracked, non-fungible token.
			</p>
			<p className="mt-2 opacity-75">
				“Own” means, concerning an NFT, an NFT that you have purchased or
				otherwise rightfully acquired from a legitimate source, where proof of
				such purchase is recorded on the relevant blockchain. “Purchased NFT”
				means an NFT that you Own. “Third Party IP” means any third party patent
				rights (including, without limitation, patent applications and
				disclosures), copyrights, trade secrets, trademarks, know-how, or any
				other intellectual property rights recognized in any country or
				jurisdiction in the world.
			</p>
			<p className="mt-2 opacity-75">
				“Purchased NFT” means an NFT that you Own. “Third Party IP” means any
				third party patent rights (including, without limitation, patent
				applications and disclosures), copyrights, trade secrets, trademarks,
				know-how, or any other intellectual property rights recognized in any
				country or jurisdiction in the world.
			</p>
			<p className="mt-2 opacity-75">
				“Third Party IP” means any third party patent rights (including, without
				limitation, patent applications and disclosures), copyrights, trade
				secrets, trademarks, know-how, or any other intellectual property rights
				recognized in any country or jurisdiction in the world.
			</p>
			<p className="font-medium mt-4">2. Ownership.</p>
			<p className="mt-2 opacity-75">
				You acknowledge and agree that the Artist (or, as applicable, its
				licensors) owns all legal right, title, and interest in and to the Art,
				and all intellectual property rights therein. The rights that you have
				in and to the Art are limited to those described in this License. The
				artist reserves all rights in and to the Art not expressly granted to
				you in this License.
			</p>
			<p className="font-medium mt-4">3. License.</p>
			<ul
				className="mt-2 opacity-75 pl-4"
				style={{
					listStyleType: `lower-alpha	`,
				}}
			>
				<li>
					General Use. Subject to your continued compliance with the terms of
					this License, Artist grants you a worldwide, non-exclusive,
					non-transferable, royalty-free license to use, copy, and display the
					Art for your Purchased NFTs, solely for the following purposes:
					<ul
						className="pl-8"
						style={{
							listStyleType: `lower-roman`,
						}}
					>
						<li>for your own personal, non-commercial use;</li>
						<li>
							as part of a marketplace that permits the purchase and sale of
							your NFTs, provided that the marketplace cryptographically
							verifies each NFT owner’s rights to display the Art for their
							Purchased NFTs to ensure that only the actual owner can display
							the Art; or{' '}
						</li>
						<li>
							as part of a third-party website or application that permits the
							inclusion, involvement, or participation of your NFTs, provided
							that the website/application cryptographically verifies each NFT
							owner’s rights to display the Art for their Purchased NFTs to
							ensure that only the actual owner can display the Art, and
							provided that the Art is no longer visible once the owner of the
							Purchased NFT leaves the website/application.
						</li>
					</ul>
				</li>
				<li>
					Commercial Use. Subject to your continued compliance with the terms of
					this License, Artist grants you a limited, worldwide, non-exclusive,
					non-transferable license to use, copy, and display the Art for your
					Purchased NFTs to commercialize your own merchandise that includes,
					contains or consists of the Art for your Purchased NFTs .
				</li>
			</ul>
			<p className="font-medium mt-4">4. Restrictions.</p>
			<p className="mt-2 opacity-75">
				You agree that you may not, nor permit any third party to do or attempt
				to do any of the foregoing without Artist’s express prior written
				consent in each case:(i) use the Art for your Purchased NFTs in
				connection with images, videos, or other forms of media that depict
				hatred, intolerance, violence, cruelty, or anything else that could
				reasonably be found to constitute hate speech or otherwise infringe upon
				the rights of others; To the extent that Art associated with your
				Purchased NFTs contains Third Party IP (e.g., licensed intellectual
				property from a celebrity, athlete, or other public figures), you
				understand and agree as follows:
			</p>
			<ol
				className="pl-8 opacity-75"
				style={{
					listStyleType: `lower-alpha`,
				}}
				start="23"
			>
				<li>
					that you will not have the right to use such Third Party IP in any way
					except as incorporated in the Art, and subject to the license and
					restrictions contained herein;{' '}
				</li>
				<li>
					that the Commercial Use license in Section 3(b) above will not apply;
				</li>
				<li>
					that, depending on the nature of the license granted from the owner of
					the Third Party IP, Artist may need to pass through additional
					restrictions on your ability to use the Complete Art; and
				</li>
				<li>
					to the extent that the Artist informs you of such additional
					restrictions in writing (email is permissible), you will be
					responsible for complying with all such restrictions from the date
					that you receive the notice, and that failure to do so will be deemed
					a breach of this license. The restriction in Section 4 will survive
					the expiration or termination of this License.
				</li>
			</ol>

			<p className="font-medium mt-4">5. Terms of License.</p>
			<p className="mt-2 opacity-75">
				The license granted in Section 3 above applies only to the extent that
				you continue to Own the applicable Purchased NFT. If at any time you
				sell, trade, donate, give away, transfer, or otherwise dispose of your
				Purchased NFT for any reason, the license granted in Section 3 will
				immediately expire concerning those NFTs without the requirement of
				notice, and you will have no further rights in or to the Art for those
				NFTs.
			</p>
		</div>
	)
}

const License = () => {
	const [activeTab, setActiveTab] = useState('overview')

	return (
		<div
			className="min-h-screen relative bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Head>
				<title>License — Paras</title>
				<meta
					name="description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>

				<meta name="twitter:title" content="Paras — Digital Art Cards Market" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Paras — Digital Art Cards Market" />
				<meta
					property="og:site_name"
					content="Paras — Digital Art Cards Market"
				/>
				<meta
					property="og:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>
			<div>
				<Nav />
				<div className="py-16 max-w-4xl mx-auto text-gray-100 px-4">
					<h2 className="font-bold text-4xl text-center">NFT License</h2>
					<div className="flex mt-6 justify-between items-center">
						<div className="w-1/2 text-center">
							<h3
								onClick={(_) => setActiveTab('overview')}
								className={`cursor-pointer font-bold text-2xl ${
									activeTab !== 'overview' && 'opacity-75'
								}`}
							>
								Overview
							</h3>
						</div>
						<div className="w-1/2 text-center">
							<h3
								onClick={(_) => setActiveTab('detail')}
								className={`cursor-pointer font-bold text-2xl ${
									activeTab !== 'detail' && 'opacity-75'
								}`}
							>
								License
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
