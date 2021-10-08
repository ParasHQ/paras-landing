import { useState } from 'react'
import Head from 'next/head'
import Nav from 'components/Nav'
import Footer from 'components/Footer'
import Modal from 'components/Modal'
import YouTube from 'react-youtube'
import { HomeMarqueeList } from 'components/Home/HomeMarqueeList'
import { HomePublicationList } from 'components/Home/HomePublicationList'
import { HomeTopUserList } from 'components/Home/HomeTopUserList'
import { HomeCardList } from 'components/Home/HomeCardList'
import { useIntl } from 'hooks/useIntl'

export default function Home() {
	const [showVideoModal, setShowVideoModal] = useState(false)
	const { localeLn } = useIntl()

	return (
		<div className="min-h-screen relative bg-black">
			<Head>
				<title>{localeLn('Paras — Digital Art Cards Market')}</title>
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
			{showVideoModal && (
				<Modal close={() => setShowVideoModal(false)}>
					<div className="max-w-3xl w-full mx-auto p-4 relative">
						<div className="absolute z-10 top-0 right-0">
							<div
								className="bg-gray-300 p-2 rounded-full cursor-pointer"
								onClick={() => setShowVideoModal(false)}
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M8.00008 9.41423L3.70718 13.7071L2.29297 12.2929L6.58586 8.00001L2.29297 3.70712L3.70718 2.29291L8.00008 6.5858L12.293 2.29291L13.7072 3.70712L9.41429 8.00001L13.7072 12.2929L12.293 13.7071L8.00008 9.41423Z"
										fill="black"
									/>
								</svg>
							</div>
						</div>
						<YouTube
							containerClassName="youtube-container"
							className="rounded-lg"
							videoId="keW4k5pF4MA"
							opts={{
								playerVars: {
									autoplay: 1,
								},
							}}
						/>
					</div>
				</Modal>
			)}
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
				<div className="relative px-4 pb-24">
					<HomeMarqueeList />
					<HomePublicationList />
					<HomeTopUserList />
					<HomeCardList />
					<div className="mt-8 w-full flex flex-wrap"></div>
					<div className="mt-8">
						<p className="text-white font-semibold text-3xl">{localeLn('How_Works')}</p>
						<div className="flex flex-wrap -mx-4">
							<div className="w-full lg:w-2/3 relative mt-4 px-4">
								<div className="absolute inset-0 flex items-center justify-center">
									<div
										className="p-2 rounded-full overflow-hidden cursor-pointer relative"
										onClick={() => setShowVideoModal(true)}
									>
										<div className="absolute z-0 inset-0 bg-gray-100 opacity-75"></div>
										<svg
											className="relative z-10"
											width="32"
											height="32"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M5 20.9999V2.99993C5 2.20876 5.87525 1.73092 6.54076 2.15875L20.5408 11.1587C21.1531 11.5524 21.1531 12.4475 20.5408 12.8411L6.54076 21.8411C5.87525 22.2689 5 21.7911 5 20.9999Z"
												fill="rgba(0,0,0,0.8)"
											/>
										</svg>
									</div>
								</div>
								<img className="rounded-md overflow-hidden" src="/thumbnail.jpg" />
							</div>
							<div className="w-full lg:w-1/3 px-4">
								<div className="w-full mt-8 lg:mt-4">
									<h2 className="text-white font-bold text-2xl text-gradient">
										{localeLn('For_Collectors')}
									</h2>
									<p className="mt-4 text-gray-400">
										{localeLn(
											'Discover_Beautiful_Cards'
										)}
									</p>
								</div>
								<div className="mt-8">
									<h2 className="text-white font-bold text-2xl text-gradient">
										{localeLn('For_Artists')}
									</h2>
									<p className="mt-4 text-gray-400">
										{localeLn(
											'Create_Digital_Cards'
										)}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	)
}
