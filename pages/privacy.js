/* eslint-disable react/no-unescaped-entities */
import Footer from 'components/Footer'
import Nav from 'components/Nav'
import Head from 'next/head'

import privacyStyles from 'styles/privacy.module.css'

const Privacy = () => {
	return (
		<div className="min-h-screen relative bg-black text-white">
			<Head>
				<title>Privacy Policy - Paras</title>
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
			<Nav />
			<div className="md:max-w-4xl m-auto py-12 p-4">
				<h1 className="text-5xl font-bold mb-8">Privacy Policy</h1>
				<p className={privacyStyles.p}>Last updated: March 12, 2022</p>
				<p className={privacyStyles.p}>
					This Privacy Policy describes Our policies and procedures on the collection, use and
					disclosure of Your information when You use the Service and tells You about Your privacy
					rights and how the law protects You.
				</p>
				<p className={privacyStyles.p}>
					We use Your Personal data to provide and improve the Service. By using the Service, You
					agree to the collection and use of information in accordance with this Privacy Policy.
					This Privacy Policy has been created with the help of the{' '}
					<a
						href="https://www.termsfeed.com/blog/sample-privacy-policy-template/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Privacy Policy Template
					</a>
					.
				</p>
				<h1 className={privacyStyles.h1}>Interpretation and Definitions</h1>
				<h2 className={privacyStyles.h2}>Interpretation</h2>
				<p className={privacyStyles.p}>
					The words of which the initial letter is capitalized have meanings defined under the
					following conditions. The following definitions shall have the same meaning regardless of
					whether they appear in singular or in plural.
				</p>
				<h2 className={privacyStyles.h2}>Definitions</h2>
				<p className={privacyStyles.p}>For the purposes of this Privacy Policy:</p>
				<ul className={privacyStyles.ul}>
					<li className={privacyStyles.li}>
						<strong>Account</strong> means a unique account created for You to access our Service or
						parts of our Service.
					</li>
					<li className={privacyStyles.li}>
						<strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in
						this Agreement) refers to Paras Marketplace.
					</li>
					<li className={privacyStyles.li}>
						<strong>Cookies</strong> are small files that are placed on Your computer, mobile device
						or any other device by a website, containing the details of Your browsing history on
						that website among its many uses.
					</li>
					<li className={privacyStyles.li}>
						<strong>Device</strong> means any device that can access the Service such as a computer,
						a cell phone or a digital tablet.
					</li>
					<li className={privacyStyles.li}>
						<strong>Personal Data</strong> is any information that relates to an identified or
						identifiable individual.
					</li>
					<li className={privacyStyles.li}>
						<strong>Service</strong> refers to the Website.
					</li>
					<li className={privacyStyles.li}>
						<strong>Service Provider</strong> means any natural or legal person who processes the
						data on behalf of the Company. It refers to third-party companies or individuals
						employed by the Company to facilitate the Service, to provide the Service on behalf of
						the Company, to perform services related to the Service or to assist the Company in
						analyzing how the Service is used.
					</li>
					<li className={privacyStyles.li}>
						<strong>Usage Data</strong> refers to data collected automatically, either generated by
						the use of the Service or from the Service infrastructure itself (for example, the
						duration of a page visit).
					</li>
					<li className={privacyStyles.li}>
						<strong>Website</strong> refers to Paras Marketplace, accessible from{' '}
						<a href="https://paras.id/" target="_blank" rel="noopener noreferrer">
							<span styles="color: #0452a5;">https://paras.id/</span>
						</a>
					</li>
					<li className={privacyStyles.li}>
						<strong>You</strong> mean the individual accessing or using the Service, or the company,
						or other legal entity on behalf of which such individual is accessing or using the
						Service, as applicable.
					</li>
				</ul>
				<h1 className={privacyStyles.h1}>Collecting and Using Your Personal Data</h1>
				<h2 className={privacyStyles.h2}>Types of Data Collected</h2>
				<h3 className={privacyStyles.h3}>Personal Data</h3>
				<p className={privacyStyles.p}>
					While using Our Service, We may ask You to provide Us with certain personally identifiable
					information that can be used to contact or identify You. Personally identifiable
					information may include, but is not limited to:
				</p>
				<ul className={privacyStyles.ul}>
					<li className={privacyStyles.li}>Email address</li>
					<li className={privacyStyles.li}>Usage Data</li>
				</ul>
				<h3 className={privacyStyles.h3}>Usage Data</h3>
				<p className={privacyStyles.p}>
					Usage Data is collected automatically when using the Service.
				</p>
				<p className={privacyStyles.p}>
					Usage Data may include information such as Your Device's Internet Protocol address (e.g.
					IP address), browser type, browser version, the pages of our Service that You visit, the
					time and date of Your visit, the time spent on those pages, unique device identifiers and
					other diagnostic data.
				</p>
				<p className={privacyStyles.p}>
					When You access the Service by or through a mobile device, We may collect certain
					information automatically, including, but not limited to, the type of mobile device You
					use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile
					operating system, the type of mobile Internet browser You use, unique device identifiers
					and other diagnostic data.
				</p>
				<p className={privacyStyles.p}>
					We may also collect information that Your browser sends whenever You visit our Service or
					when You access the Service by or through a mobile device.
				</p>
				<h3 className={privacyStyles.h3}>Tracking Technologies and Cookies</h3>
				<p className={privacyStyles.p}>
					We use Cookies and similar tracking technologies to track the activity on Our Service and
					store certain information. Tracking technologies used are beacons, tags, and scripts to
					collect and track information and to improve and analyze Our Service. The technologies We
					use may include:
				</p>
				<ul className={privacyStyles.ul}>
					<li className={privacyStyles.li}>
						<strong>Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your
						Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie
						is being sent. However, if You do not accept Cookies, You may not be able to use some
						parts of our Service. Unless you have adjusted Your browser setting so that it will
						refuse Cookies, our Service may use Cookies.
					</li>
					<li className={privacyStyles.li}>
						<strong>Flash Cookies.</strong> Certain features of our Service may use local stored
						objects (or Flash Cookies) to collect and store information about Your preferences or
						Your activity on our Service. Flash Cookies are not managed by the same browser settings
						as those used for Browser Cookies. For more information on how You can delete Flash
						Cookies, please read "Where can I change the settings for disabling, or deleting local
						shared objects?" available at{' '}
						<a
							href="https://helpx.adobe.com/flash-player/kb/disable-local-shared-objects-flash.html#main_Where_can_I_change_the_settings_for_disabling__or_deleting_local_shared_objects_"
							target="_blank"
							rel="noopener noreferrer"
							className="break-all"
						>
							<span styles="color: #0452a5;">
								https://helpx.adobe.com/flash-player/kb/disable-local-shared-objects-flash.html#main_Where_can_I_change_the_settings_for_disabling__or_deleting_local_shared_objects_
							</span>
						</a>
					</li>
					<li className={privacyStyles.li}>
						<strong>Web Beacons.</strong> Certain sections of our Service and our emails may contain
						small electronic files known as web beacons (also referred to as clear gifs, pixel tags,
						and single-pixel gifs) that permit the Company, for example, to count users who have
						visited those pages or opened an email and for other related website statistics (for
						example, recording the popularity of a certain section and verifying system and server
						integrity).
					</li>
				</ul>
				<p className={privacyStyles.p}>
					Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on Your
					personal computer or mobile device when You go offline, while Session Cookies are deleted
					as soon as You close Your web browser. You can learn more about cookies here:{' '}
					<a
						href="https://www.termsfeed.com/privacy-policy-generator/#faq-8"
						target="_blank"
						rel="noopener noreferrer"
					>
						Cookies by TermsFeed Generator
					</a>
					.
				</p>
				<p className={privacyStyles.p}>
					We use both Session and Persistent Cookies for the purposes set out below:
				</p>
				<ul className={privacyStyles.ul}>
					<li className={privacyStyles.li}>
						<strong>Necessary / Essential Cookies</strong>Type: Session CookiesAdministered by:
						UsPurpose: These Cookies are essential to provide You with services available through
						the Website and to enable You to use some of its features. They help to authenticate
						users and prevent fraudulent use of user accounts. Without these Cookies, the services
						that You have asked for cannot be provided, and We only use these Cookies to provide You
						with those services.
					</li>
					<li className={privacyStyles.li}>
						<strong>Cookies Policy / Notice Acceptance Cookies</strong>Type: Persistent
						CookiesAdministered by: UsPurpose: These Cookies identify if users have accepted the use
						of cookies on the Website.
					</li>
					<li className={privacyStyles.li}>
						<strong>Functionality Cookies</strong>Type: Persistent CookiesAdministered by:
						UsPurpose: These Cookies allow us to remember choices You make when You use the Website,
						such as remembering your login details or language preference. The purpose of these
						Cookies is to provide You with a more personal experience and to avoid You having to
						re-enter your preferences every time You use the Website.
					</li>
				</ul>
				<p className={privacyStyles.p}>
					For more information about the cookies we use and your choices regarding cookies, please
					visit our Cookies Policy or the Cookies section of our Privacy Policy.
				</p>
				<h2 className={privacyStyles.h2}>Use of Your Personal Data</h2>
				<p className={privacyStyles.p}>
					The Company may use Personal Data for the following purposes:
				</p>
				<ul className={privacyStyles.ul}>
					<li className={privacyStyles.li}>
						<strong>To provide and maintain our Service</strong>, including to monitor the usage of
						our Service.
					</li>
					<li className={privacyStyles.li}>
						<strong>To manage Your Account:</strong> to manage Your registration as a user of the
						Service. The Personal Data You provide can give You access to different functionalities
						of the Service that are available to You as a registered user.
					</li>
					<li className={privacyStyles.li}>
						<strong>For the performance of a contract:</strong> the development, compliance and
						undertaking of the purchase contract for the products, items or services You have
						purchased or of any other contract with Us through the Service.
					</li>
					<li className={privacyStyles.li}>
						<strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other
						equivalent forms of electronic communication, such as a mobile application's push
						notifications regarding updates or informative communications related to the
						functionalities, products or contracted services, including the security updates, when
						necessary or reasonable for their implementation.
					</li>
					<li className={privacyStyles.li}>
						<strong>To provide You</strong> with news, special offers and general information about
						other goods, services and events which we offer that are similar to those that you have
						already purchased or enquired about unless You have opted not to receive such
						information.
					</li>
					<li className={privacyStyles.li}>
						<strong>To manage Your requests:</strong> To attend and manage Your requests to Us.
					</li>
					<li className={privacyStyles.li}>
						<strong>For business transfers:</strong> We may use Your information to evaluate or
						conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale
						or transfer of some or all of Our assets, whether as a going concern or as part of
						bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about
						our Service users is among the assets transferred.
					</li>
					<li className={privacyStyles.li}>
						<strong>For other purposes</strong>: We may use Your information for other purposes,
						such as data analysis, identifying usage trends, determining the effectiveness of our
						promotional campaigns and to evaluate and improve our Service, products, services,
						marketing and your experience.
					</li>
				</ul>
				<p className={privacyStyles.p}>
					We may share Your personal information in the following situations:
				</p>
				<ul className={privacyStyles.ul}>
					<li className={privacyStyles.li}>
						<strong>With Service Providers:</strong> We may share Your personal information with
						Service Providers to monitor and analyze the use of our Service, to contact You.
					</li>
					<li className={privacyStyles.li}>
						<strong>For business transfers:</strong> We may share or transfer Your personal
						information in connection with, or during negotiations of, any merger, sale of Company
						assets, financing, or acquisition of all or a portion of Our business to another
						company.
					</li>
					<li className={privacyStyles.li}>
						<strong>With Affiliates:</strong> We may share Your information with Our affiliates, in
						which case we will require those affiliates to honor this Privacy Policy. Affiliates
						include Our parent company and any other subsidiaries, joint venture partners or other
						companies that We control or that are under common control with Us.
					</li>
					<li className={privacyStyles.li}>
						<strong>With business partners:</strong> We may share Your information with Our business
						partners to offer You certain products, services or promotions.
					</li>
					<li className={privacyStyles.li}>
						<strong>With other users:</strong> when You share personal information or otherwise
						interact in the public areas with other users, such information may be viewed by all
						users and may be publicly distributed outside.
					</li>
					<li className={privacyStyles.li}>
						<strong>With Your consent</strong>: We may disclose Your personal information for any
						other purpose with Your consent.
					</li>
				</ul>
				<h2 className={privacyStyles.h2}>Retention of Your Personal Data</h2>
				<p className={privacyStyles.p}>
					The Company will retain Your Personal Data only for as long as is necessary for the
					purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the
					extent necessary to comply with our legal obligations (for example, if we are required to
					retain your data to comply with applicable laws), resolve disputes, and enforce our legal
					agreements and policies.
				</p>
				<p className={privacyStyles.p}>
					The Company will also retain Usage Data for internal analysis purposes. Usage Data is
					generally retained for a shorter period of time, except when this data is used to
					strengthen the security or to improve the functionality of Our Service, or We are legally
					obligated to retain this data for longer time periods.
				</p>
				<h2 className={privacyStyles.h2}>Transfer of Your Personal Data</h2>
				<p className={privacyStyles.p}>
					Your information, including Personal Data, is processed at the Company's operating offices
					and in any other places where the parties involved in the processing are located. It means
					that this information may be transferred to &mdash; and maintained on &mdash; computers
					located outside of Your state, province, country or other governmental jurisdiction where
					the data protection laws may differ from those from Your jurisdiction.
				</p>
				<p className={privacyStyles.p}>
					Your consent to this Privacy Policy followed by Your submission of such information
					represents Your agreement to that transfer.
				</p>
				<p className={privacyStyles.p}>
					The Company will take all steps reasonably necessary to ensure that Your data is treated
					securely and in accordance with this Privacy Policy and no transfer of Your Personal Data
					will take place to an organization or a country unless there are adequate controls in
					place including the security of Your data and other personal information.
				</p>
				<h2 className={privacyStyles.h2}>Disclosure of Your Personal Data</h2>
				<h3 className={privacyStyles.h3}>Business Transactions</h3>
				<p className={privacyStyles.p}>
					If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may
					be transferred. We will provide notice before Your Personal Data is transferred and
					becomes subject to a different Privacy Policy.
				</p>
				<h3 className={privacyStyles.h3}>Law enforcement</h3>
				<p className={privacyStyles.p}>
					Under certain circumstances, the Company may be required to disclose Your Personal Data if
					required to do so by law or in response to valid requests by public authorities (e.g. a
					court or a government agency).
				</p>
				<h3 className={privacyStyles.h3}>Other legal requirements</h3>
				<p className={privacyStyles.p}>
					The Company may disclose Your Personal Data in the good faith belief that such action is
					necessary to:
				</p>
				<ul className={privacyStyles.ul}>
					<li className={privacyStyles.li}>Comply with a legal obligation</li>
					<li className={privacyStyles.li}>
						Protect and defend the rights or property of the Company
					</li>
					<li className={privacyStyles.li}>
						Prevent or investigate possible wrongdoing in connection with the Service
					</li>
					<li className={privacyStyles.li}>
						Protect the personal safety of Users of the Service or the public
					</li>
					<li className={privacyStyles.li}>Protect against legal liability</li>
				</ul>
				<h2 className={privacyStyles.h2}>Security of Your Personal Data</h2>
				<p className={privacyStyles.p}>
					The security of Your Personal Data is important to Us, but remember that no method of
					transmission over the Internet, or method of electronic storage is 100% secure. While We
					strive to use commercially acceptable means to protect Your Personal Data, We cannot
					guarantee its absolute security.
				</p>
				<h1 className={privacyStyles.h1}>Children's Privacy</h1>
				<p className={privacyStyles.p}>
					Our Service does not address anyone under the age of 13. We do not knowingly collect
					personally identifiable information from anyone under the age of 13. If You are a parent
					or guardian and You are aware that Your child has provided Us with Personal Data, please
					contact Us. If We become aware that We have collected Personal Data from anyone under the
					age of 13 without verification of parental consent, We take steps to remove that
					information from Our servers.
				</p>
				<p className={privacyStyles.p}>
					If We need to rely on consent as a legal basis for processing Your information and Your
					country requires consent from a parent, We may require Your parent's consent before We
					collect and use that information.
				</p>
				<h1 className={privacyStyles.h1}>Links to Other Websites</h1>
				<p className={privacyStyles.p}>
					Our Service may contain links to other websites that are not operated by Us. If You click
					on a third party link, You will be directed to that third party's site. We strongly advise
					You to review the Privacy Policy of every site You visit.
				</p>
				<p className={privacyStyles.p}>
					We have no control over and assume no responsibility for the content, privacy policies or
					practices of any third party sites or services.
				</p>
				<h1 className={privacyStyles.h1}>Changes to this Privacy Policy</h1>
				<p className={privacyStyles.p}>
					We may update Our Privacy Policy from time to time. We will notify You of any changes by
					posting the new Privacy Policy on this page.
				</p>
				<p className={privacyStyles.p}>
					We will let You know via email and/or a prominent notice on Our Service, prior to the
					change becoming effective and update the "Last updated" date at the top of this Privacy
					Policy.
				</p>
				<p className={privacyStyles.p}>
					You are advised to review this Privacy Policy periodically for any changes. Changes to
					this Privacy Policy are effective when they are posted on this page.
				</p>
				<h1 className={privacyStyles.h1}>Contact Us</h1>
				<p className={privacyStyles.p}>
					If you have any questions about this Privacy Policy, You can find us:
				</p>
				<ul className={privacyStyles.ul}>
					<li className={privacyStyles.li}>
						On Twitter:{' '}
						<a href="https://twitter.com/ParasHQ" target="_blank" rel="noopener noreferrer">
							https://twitter.com/ParasHQ
						</a>
					</li>
					<li className={privacyStyles.li}>
						On Instagram:{' '}
						<a href="https://www.instagram.com/paras.hq/" target="_blank" rel="noopener noreferrer">
							https://www.instagram.com/paras.hq/
						</a>
					</li>
					<li className={privacyStyles.li}>
						On Telegram:{' '}
						<a href="https://t.me/parashq" target="_blank" rel="noopener noreferrer">
							https://t.me/parashq
						</a>
					</li>
					<li className={privacyStyles.li}>
						On Discord:{' '}
						<a
							href="https://discord.com/invite/vWR2XBNupg"
							target="_blank"
							rel="noopener noreferrer"
						>
							https://discord.com/invite/vWR2XBNupg
						</a>
					</li>
				</ul>
			</div>
			<Footer />
		</div>
	)
}

export default Privacy
