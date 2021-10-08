import Head from 'next/head'
import { useState } from 'react'

const { default: Footer } = require('components/Footer')
const { default: Nav } = require('components/Nav')
import { useIntl } from 'hooks/useIntl'
const LicenseOverview = () => {
	const { localeLn } = useIntl()
	return (
		<div>
			<div className="opacity-75">
				<p className="mt-2">
					{localeLn(
						'License_Helps_Define'
					)}
				</p>
				<ul className="list-disc mt-2 pl-4">
					<li>{localeLn('License_Protecting_Creators')}</li>
					<li>
						{localeLn(
							'License_Granting_Owners'
						)}
					</li>
				</ul>
				<p className="mt-2">{localeLn('License_Any_NFT')}</p>
			</div>
			<p className="font-medium mt-4">{localeLn('License_Content_Is_Yours')}</p>
			<p className="mt-2 opacity-75">
				{localeLn(
					'License_Artists_Own_Rights'
				)}
			</p>
			<p className="mt-2 opacity-75">
				{localeLn(
					'License_Artists_Are_Responsible'
				)}
			</p>
			<p className="font-medium mt-4">
				{localeLn('License_What_Am_I')}
			</p>
			<p className="mt-2 opacity-75">
				{localeLn(
					'License_You_Broad_Rights'
				)}
			</p>
			<ul className="list-disc mt-2 opacity-75 pl-4">
				<li>{localeLn('License_Use_DAC')}</li>
				<li>
					{localeLn(
						'License_Use_DAC_When'
					)}
				</li>
				<li>
					{localeLn(
						'License_Use_DAC_On'
					)}
				</li>
			</ul>
			<p className="font-medium mt-4">
				{localeLn('License_Art_Associated')}
			</p>
			<p className="mt-2 opacity-75">
				{localeLn(
					'License_Are_Not_Appropriate'
				)}
			</p>
			<ul className="list-disc mt-2 opacity-75 pl-4">
				<li>{localeLn('License_Modifying_Art')}</li>
				<li>
					{localeLn(
						'License_Using_For_Commercialize'
					)}
				</li>
				<li>{localeLn('License_Sell_Third_Party')}</li>
				<li>
					{localeLn(
						'License_Images_Hatred'
					)}
				</li>
				<li>
					{localeLn(
						'License_Trying_Trademark'
					)}
				</li>
			</ul>
		</div>
	)
}

const LicenseDetail = () => {
	const { localeLn } = useIntl()
	return (
		<div>
			<p className="font-medium">{localeLn('Version_1_0')}</p>
			<p className="font-medium mt-4">{localeLn('License_Definitions')}</p>
			<p className="mt-2 opacity-75">
				{localeLn(
					'License_Art_Means'
				)}
			</p>
			<p className="mt-2 opacity-75">
				{localeLn('License_NFT_Means')}
			</p>
			<p className="mt-2 opacity-75">
				{localeLn(
					'License_Concerning_An_NFT'
				)}
			</p>
			<p className="mt-2 opacity-75">
				{localeLn(
					'License_Purchased_NFT'
				)}
			</p>
			<p className="mt-2 opacity-75">
				{localeLn(
					'License_Third_Party_IP'
				)}
			</p>
			<p className="font-medium mt-4">{localeLn('License_Ownership')}</p>
			<p className="mt-2 opacity-75">
				{localeLn(
					'License_You_Acknowledge'
				)}
			</p>
			<p className="font-medium mt-4">{localeLn('License_License')}</p>
			<ul
				className="mt-2 opacity-75 pl-4"
				style={{
					listStyleType: `lower-alpha	`,
				}}
			>
				<li>
					{localeLn(
						'License_General_Use'
					)}
					<ul
						className="pl-8"
						style={{
							listStyleType: `lower-roman`,
						}}
					>
						<li>{localeLn('License_For_Your_Personal')}</li>
						<li>
							{localeLn(
								'License_As_Part_Marketplace'
							)}{' '}
						</li>
						<li>
							{localeLn(
								'License_Third_Party_Website'
							)}
						</li>
					</ul>
				</li>
				<li>
					{localeLn(
						'License_Commercial_Use'
					)}
				</li>
			</ul>
			<p className="font-medium mt-4">{localeLn('License_Restrictions')}</p>
			<p className="mt-2 opacity-75">
				{localeLn(
					'License_You_Agree'
				)}
			</p>
			<ol
				className="pl-8 opacity-75"
				style={{
					listStyleType: `lower-alpha`,
				}}
				start="23"
			>
				<li>
					{localeLn(
						'License_Have_Right_To'
					)}{' '}
				</li>
				<li>{localeLn('License_In_Section_3')}</li>
				<li>
					{localeLn(
						'License_Depending_On'
					)}
				</li>
				<li>
					{localeLn(
						'License_To_The_Extent'
					)}
				</li>
			</ol>

			<p className="font-medium mt-4">{localeLn('License_Terms_Of')}</p>
			<p className="mt-2 opacity-75">
				{localeLn(
					'License_The_License_Granted'
				)}
			</p>
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
				<title>{localeLn('License_Paras')}</title>
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
				<meta property="og:site_name" content="Paras — Digital Art Cards Market" />
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
				<div className="relative py-16 max-w-4xl mx-auto text-gray-100 px-4">
					<h2 className="font-bold text-4xl text-center">{localeLn('NFT_License')}</h2>
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
