import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import axios from 'axios'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Modal from '../components/Modal'
import YouTube from 'react-youtube'
import Marquee from 'react-fast-marquee'
import Link from 'next/link'
import { parseImgUrl, prettyBalance } from '../utils/common'
import Slider from 'react-slick'
import LinkToProfile from '../components/LinkToProfile'
import CardList from '../components/CardList'
import Scrollbars from 'react-custom-scrollbars'

const renderThumb = ({ style, ...props }) => {
	return (
		<div
			{...props}
			style={{
				...style,
				cursor: 'pointer',
				borderRadius: 'inherit',
				backgroundColor: 'rgba(255, 255, 255, 0.1)',
			}}
		/>
	)
}

const FeaturedPost = ({ post = {} }) => {
	return (
		<div className="publication-card">
			<div className="bg-dark-primary-1 rounded-md overflow-hidden relative h-56 lg:h-64">
				<div className="h-full">
					<img
						src={parseImgUrl(post.image)}
						className="object-cover h-full w-full publication-card-img"
					/>
				</div>
			</div>
			<div className="pt-4 h-40">
				<h1
					className="text-white font-bold text-2xl overflow-hidden"
					style={{
						maxHeight: `4.8rem`,
					}}
				>
					{post.title}
				</h1>
				<p
					className="text-white whitespace-normal font-normal text-sm overflow-hidden"
					style={{
						maxHeight: `2.6rem`,
					}}
				>
					{post.description}
				</p>
				<div className="mt-4 relative z-10">
					{post?.urlList?.map((url, idx) => {
						return post.url.includes(process.env.BASE_URL) ? (
							<Link href={url.url}>
								<a
									key={idx}
									className={
										url.type === 'primary'
											? 'mr-2 outline-none rounded-md bg-transparent text-sm font-semibold border-2 p-2 text-gray-100 bg-primary border-primary leading-relaxed'
											: 'mr-2 text-gray-200 hover:text-white font-semibold border-b-2 cursor-pointer text-sm'
									}
								>
									{url.name}
								</a>
							</Link>
						) : (
							<a key={idx} href={url.url} target="_blank">
								{url.type === 'primary' && (
									<span className="mr-2 outline-none rounded-md bg-transparent text-sm font-semibold border-2 p-2 text-gray-100 bg-primary border-primary leading-relaxed">
										{url.name}
									</span>
								)}
								{url.type === 'secondary' && (
									<span className="mr-2 text-gray-200 hover:text-white font-semibold border-b-2 cursor-pointer text-sm">
										{url.name}
									</span>
								)}
							</a>
						)
					})}
				</div>
			</div>
		</div>
	)
}

const TopUser = ({ user, idx }) => {
	const [profile, setProfile] = useState({})

	useEffect(async () => {
		const res = await axios(
			`${process.env.API_URL}/profiles?accountId=${user._id}`
		)
		setProfile(res.data.data.results[0])
	}, [])

	return (
		<div className="my-3 flex items-center">
			<p className="text-base text-gray-100 opacity-50 mr-3">{idx + 1}</p>
			<Link href={`/${user._id}`}>
				<div className="flex-shrink-0 cursor-pointer w-12 h-12 rounded-full overflow-hidden bg-primary border-white border">
					<img src={parseImgUrl(profile?.imgUrl)} className="object-cover" />
				</div>
			</Link>
			<div className="ml-3">
				<LinkToProfile
					accountId={user._id}
					len={16}
					className="text-gray-100 hover:border-gray-100 font-semibold text-lg"
				/>
				<p className="text-base text-gray-400">
					{prettyBalance(user.total, 24, 6)} Ⓝ
				</p>
			</div>
		</div>
	)
}

const PublicationList = ({ idx, data }) => {
	return (
		<div className="publication-card">
			<div
				className={`flex flex-wrap -mx-2 items-center border-gray-800 border-dashed ${
					idx !== 0 && 'border-t-2 pt-6 mt-6'
				}`}
			>
				<div className="w-full md:w-5/12 px-2">
					<Link href={`/publication/${data.type}/${data.slug}-${data._id}`}>
						<a>
							<div className="flex h-40 lg:h-32 overflow-hidden rounded-md">
								<div className="m-auto cursor-pointer">
									<img
										className="w-full h-40 lg:h-32 object-cover publication-card-img"
										src={parseImgUrl(data.thumbnail)}
									/>
								</div>
							</div>
						</a>
					</Link>
				</div>
				<div className="w-full md:w-7/12 mt-2 lg:mt-0 px-2">
					<div className="mt-2 lg:mt-0">
						<LinkToProfile
							accountId={data.authorId}
							className="text-gray-100 hover:border-white font-semibold"
						/>
					</div>
					<div className="mt-2">
						<Link href={`/publication/${data.type}/${data.slug}-${data._id}`}>
							<a className="">
								<div
									className="cursor-pointer overflow-hidden"
									style={{
										maxHeight: `3.75rem`,
									}}
								>
									<h1 className="text-white text-xl font-bold hover:underline line-clamp-2">
										{data.title}
									</h1>
								</div>
							</a>
						</Link>
					</div>
					<div className="mt-2">
						<Link href={`/publication/${data.type}`}>
							<a className="capitalize text-sm text-gray-300 font-semibold hover:border-white border-b-2 border-transparent">
								{data.type}
							</a>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

const ActivityMarquee = ({ activity }) => {
	return (
		<div
			className=""
			style={{
				padding: '0.15rem 0rem',
			}}
		>
			<Link href={`/token/${activity.tokenId}`}>
				<a>
					<div className="bg-primary">
						<div className="flex items-center px-2 py-1 border-0 border-r-2 border-white">
							<div>
								<p className="text-white font-semibold">{activity.tokenName}</p>
							</div>
							<div className="pl-2 text-gray-300">
								<span>{prettyBalance(activity.amount, 24, 8)}</span> Ⓝ
							</div>
						</div>
					</div>
				</a>
			</Link>
		</div>
	)
}

export default function Home({
	marqueeList = [],
	featuredPostList = [],
	pubList = [],
	tokenList = [],
	topUserList = [],
}) {
	const sliderRef = useRef()
	const [showVideoModal, setShowVideoModal] = useState(false)
	const [featuredSlideIdx, setFeaturedSlideIdx] = useState(0)

	return (
		<div className="min-h-screen relative bg-black">
			<Head>
				<title>Paras — Digital Art Cards Market</title>
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
			{showVideoModal && (
				<Modal close={(_) => setShowVideoModal(false)}>
					<div className="max-w-3xl w-full mx-auto p-4 relative">
						<div className="absolute z-10 top-0 right-0">
							<div
								className="bg-gray-300 p-2 rounded-full cursor-pointer"
								onClick={(_) => setShowVideoModal(false)}
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
					backgroundImage: `url('./bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			></div>
			<Nav />
			<div className="max-w-6xl m-auto">
				<div className="relative px-4 pb-24">
					<div className="mt-4 flex items-center">
						<div className="flex-shrink-0 w-auto text-white">
							<div
								className="bg-white"
								style={{
									padding: '0.15rem 0rem',
								}}
							>
								<div className="">
									<div className="text-center py-1 px-4">
										<p className="text-primary font-bold">Last Sold</p>
									</div>
								</div>
							</div>
						</div>
						<Marquee
							className="w-auto"
							style={{
								background: 'white',
							}}
							pauseOnHover={true}
							gradient={false}
							speed={40}
						>
							{marqueeList.map((activity) => {
								return (
									<div className="bg-white" key={activity._id}>
										<ActivityMarquee activity={activity} />
									</div>
								)
							})}
						</Marquee>
					</div>
					<div className="flex flex-wrap mt-8 -mx-4">
						<div className="w-full lg:w-7/12 px-4">
							<p className="text-white font-semibold text-3xl">Featured</p>
							<div className="mt-4 border-2 border-dashed border-gray-800 rounded-md">
								<Slider
									ref={sliderRef}
									beforeChange={(current, next) => setFeaturedSlideIdx(next)}
									dots={false}
									autoplay={false}
									infinite={true}
									slidesToShow={1}
									slidesToScroll={1}
									swipe={true}
									arrows={false}
								>
									{featuredPostList.map((post) => {
										return (
											<div key={post._id} className="outline-none p-4">
												{post?.urlList ? (
													<FeaturedPost post={post} />
												) : (
													<Link href={post.url}>
														<a>
															<FeaturedPost post={post} />
														</a>
													</Link>
												)}
											</div>
										)
									})}
								</Slider>
								<div className="flex items-center justify-between p-4 pt-0">
									<div>
										<p className="text-white">
											<span className="text-3xl font-semibold">
												{featuredSlideIdx + 1}
											</span>
											<span className="px-2">/</span>
											<span>{featuredPostList.length}</span>
										</p>
									</div>
									<div className="flex items-center">
										<div
											className="text-white px-1 cursor-pointer hover:opacity-75"
											onClick={() => {
												sliderRef.current.slickGoTo(featuredSlideIdx - 1)
											}}
										>
											<svg
												width="40"
												height="40"
												viewBox="0 0 40 40"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<rect
													width="40"
													height="40"
													rx="3"
													transform="matrix(-1 0 0 1 40 0)"
													fill="#1300BA"
												/>
												<path
													d="M29 9.76619L11.9437 20L29 30.2338V9.76619Z"
													stroke="white"
													strokeWidth="2"
												/>
											</svg>
										</div>
										<div
											className="text-white px-1 cursor-pointer hover:opacity-75"
											onClick={() => {
												sliderRef.current.slickGoTo(featuredSlideIdx + 1)
											}}
										>
											<svg
												width="40"
												height="40"
												viewBox="0 0 40 40"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<rect width="40" height="40" rx="3" fill="#1300BA" />
												<path
													d="M11 9.76619L28.0563 20L11 30.2338V9.76619Z"
													stroke="white"
													strokeWidth="2"
												/>
											</svg>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="w-full lg:w-5/12 mt-8 lg:mt-0 px-4">
							<div className="flex items-center justify-between">
								<p className="text-white font-semibold text-3xl">Latest</p>
								<Link href="/publication">
									<a className="text-gray-400 hover:text-white cursor-pointer font-semibold flex items-center">
										<span>More</span>
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											className="fill-current pl-1"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M17.5858 13.0001H3V11.0001H17.5858L11.2929 4.70718L12.7071 3.29297L21.4142 12.0001L12.7071 20.7072L11.2929 19.293L17.5858 13.0001Z"
											/>
										</svg>
									</a>
								</Link>
							</div>
							<div className="mt-4">
								{pubList.map((pub, idx) => {
									return (
										<div key={idx}>
											<PublicationList idx={idx} data={pub} />
										</div>
									)
								})}
							</div>
						</div>
					</div>
					<div className="w-full mt-8">
						<div className="flex items-center justify-between">
							<p className="text-white font-semibold text-3xl">Top Buyers</p>
							<Link href="/activity/top-buyers">
								<a className="text-gray-400 hover:text-white cursor-pointer font-semibold flex items-center">
									<span>More</span>
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="fill-current pl-1"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M17.5858 13.0001H3V11.0001H17.5858L11.2929 4.70718L12.7071 3.29297L21.4142 12.0001L12.7071 20.7072L11.2929 19.293L17.5858 13.0001Z"
										/>
									</svg>
								</a>
							</Link>
						</div>
						<Scrollbars
							renderThumbHorizontal={renderThumb}
							autoHeight={true}
							universal={true}
							width={100}
						>
							<div className="w-full flex -mx-4 py-2 pb-4">
								{topUserList.buyers.map((user, idx) => {
									return (
										<div
											key={idx}
											style={{
												width: `18rem`,
											}}
											className="flex-shrink-0 flex-grow px-4"
										>
											<TopUser user={user} idx={idx} />
										</div>
									)
								})}
							</div>
						</Scrollbars>
					</div>
					<div className="w-full mt-8">
						<div className="flex items-center justify-between">
							<p className="text-white font-semibold text-3xl">Top Sellers</p>
							<Link href="/activity/top-sellers">
								<a className="text-gray-400 hover:text-white cursor-pointer font-semibold flex items-center">
									<span>More</span>
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="fill-current pl-1"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M17.5858 13.0001H3V11.0001H17.5858L11.2929 4.70718L12.7071 3.29297L21.4142 12.0001L12.7071 20.7072L11.2929 19.293L17.5858 13.0001Z"
										/>
									</svg>
								</a>
							</Link>
						</div>
						<Scrollbars
							renderThumbHorizontal={renderThumb}
							autoHeight={true}
							universal={true}
							width={100}
						>
							<div className="w-full flex -mx-4 py-2 pb-4">
								{topUserList.sellers.map((user, idx) => {
									return (
										<div
											key={idx}
											style={{
												width: `18rem`,
											}}
											className="flex-shrink-0 flex-grow px-4"
										>
											<TopUser user={user} idx={idx} />
										</div>
									)
								})}
							</div>
						</Scrollbars>
					</div>
					<div className="mt-8 w-full">
						<div className="flex items-center justify-between">
							<p className="text-white font-semibold text-3xl">Newest Cards</p>
							<Link href="/market">
								<a className="text-gray-400 hover:text-white cursor-pointer font-semibold flex items-center">
									<span>More</span>
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className="fill-current pl-1"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M17.5858 13.0001H3V11.0001H17.5858L11.2929 4.70718L12.7071 3.29297L21.4142 12.0001L12.7071 20.7072L11.2929 19.293L17.5858 13.0001Z"
										/>
									</svg>
								</a>
							</Link>
						</div>
						<div className="mt-4">
							<CardList tokens={tokenList} />
						</div>
					</div>
					<div className="mt-8 w-full flex flex-wrap"></div>
					<div className="mt-8">
						<p className="text-white font-semibold text-3xl">How it Works</p>
						<div className="flex flex-wrap -mx-4">
							<div className="w-full lg:w-2/3 relative mt-4 px-4">
								<div className="absolute inset-0 flex items-center justify-center">
									<div
										className="p-2 rounded-full overflow-hidden cursor-pointer relative"
										onClick={(_) => setShowVideoModal(true)}
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
								<img
									className="rounded-md overflow-hidden"
									src="/thumbnail.jpg"
								/>
							</div>
							<div className="w-full lg:w-1/3 px-4">
								<div className="w-full mt-8 lg:mt-4">
									<h2 className="text-white font-bold text-2xl text-gradient">
										For Collectors
									</h2>
									<p className="mt-4 text-gray-400">
										Discover beautiful art cards and collect them on a
										blockchain-based technology that prevents forgery and
										provides provable ownership.
									</p>
									<div className="mt-4 flex items-center">
										<Link href="/market">
											<a className="flex text-gray-200 hover:text-white font-semibold border-b-2 cursor-pointer ">
												Explore Paras
											</a>
										</Link>
									</div>
								</div>
								<div className="mt-8">
									<h2 className="text-white font-bold text-2xl text-gradient">
										For Artists
									</h2>
									<p className="mt-4 text-gray-400">
										Create your digital art cards and sell them on the
										marketplace in just a few clicks. Start earning with your
										digital creation.
									</p>
									<div className="mt-4 flex items-center">
										<a
											href="https://forms.gle/QsZHqa2MKXpjckj98"
											target="_blank"
											className="flex text-gray-200 hover:text-white font-semibold border-b-2 cursor-pointer "
										>
											Apply as an Artist
											<svg
												width="12"
												height="12"
												viewBox="0 0 16 16"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												className="ml-1"
											>
												<path
													fillRule="evenodd"
													clipRule="evenodd"
													d="M7.70421 9.70711L13.9971 3.41421V7H15.9971V0H8.9971V2H12.5829L6.28999 8.29289L7.70421 9.70711ZM15 14V10H13V14H2V3H6V1H2C0.89543 1 0 1.89543 0 3V14C0 15.1046 0.89543 16 2 16H13C14.1046 16 15 15.1046 15 14Z"
													fill="white"
												/>
											</svg>
										</a>
									</div>
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

export async function getServerSideProps() {
	const homeResp = await axios(`${process.env.API_URL}/home`)
	const homeData = homeResp.data.data

	return {
		props: {
			marqueeList: homeData.marqueeList,
			featuredPostList: homeData.featuredPostList,
			pubList: homeData.pubList,
			topUserList: homeData.topUserList,
			tokenList: homeData.tokenList,
		},
	}
}
