import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { parseImgUrl } from 'utils/common'
import Slider from 'react-slick'
import LinkToProfile from 'components/LinkToProfile'
import HomeFeaturedLoader from 'components/Home/Loaders/Featured'
import HomePublicationLoader from 'components/Home/Loaders/PublicationList'
import { useIntl } from 'hooks/useIntl'
const FeaturedPost = ({ post = {} }) => {
	return (
		<div className="publication-card">
			<div className="bg-dark-primary-1 rounded-md overflow-hidden relative h-56 lg:h-64">
				<div className="h-full">
					<img
						src={parseImgUrl(post.image, null, {
							width: `800`,
							useOriginal: process.env.APP_ENV === 'production' ? false : true,
						})}
						className="object-cover h-full w-full publication-card-img"
					/>
				</div>
			</div>
			<div className="pt-4 h-40">
				<h1
					className="text-white font-bold text-2xl overflow-hidden"
					style={{
						maxHeight: `4.1rem`,
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
							<a key={idx} href={url.url} target="_blank" rel="noreferrer">
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

const PublicationList = ({ idx, data }) => {
	return (
		<div className="publication-card">
			<div
				className={`flex flex-wrap -mx-2 items-center border-gray-800 border-dashed ${
					idx !== 0 && 'border-t-2 pt-6 mt-6'
				}`}
			>
				<div className="w-full md:w-5/12 px-2">
					<Link href={`/publication/${data.slug}-${data._id}`}>
						<a>
							<div className="flex h-40 lg:h-32 overflow-hidden rounded-md">
								<div className="m-auto cursor-pointer">
									<img
										className="w-full h-40 lg:h-32 object-cover publication-card-img"
										src={parseImgUrl(data.thumbnail, null, {
											width: `400`,
											useOriginal: process.env.APP_ENV === 'production' ? false : true,
										})}
									/>
								</div>
							</div>
						</a>
					</Link>
				</div>
				<div className="w-full md:w-7/12 mt-2 lg:mt-0 px-2">
					<div className="mt-2 lg:mt-0">
						<LinkToProfile
							accountId={data.author_id}
							className="text-gray-100 hover:border-white font-semibold"
						/>
					</div>
					<div className="mt-2">
						<Link href={`/publication/${data.slug}-${data._id}`}>
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
						<Link href={`/publication?type=${data.type}`}>
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

export const HomePublicationList = () => {
	const sliderRef = useRef()
	const { localeLn } = useIntl()
	const [featuredSlideIdx, setFeaturedSlideIdx] = useState(0)
	const [featuredPostList, setFeaturedPostList] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [pubList, setPubList] = useState([])

	useEffect(() => {
		fetchPublication()
	}, [])

	const fetchPublication = async () => {
		await fetchFeaturedPost()
		await fetchPubPost()
		setIsLoading(false)
	}

	const fetchFeaturedPost = async () => {
		const resp = await axios.get(`${process.env.V2_API_URL}/features`)
		setFeaturedPostList(resp.data.data.results)
	}

	const fetchPubPost = async () => {
		const resp = await axios.get(`${process.env.V2_API_URL}/publications`, {
			params: {
				__limit: 3,
			},
		})
		setPubList(resp.data.data.results)
	}

	return (
		<div className="flex flex-wrap mt-8 -mx-4">
			<div className="w-full lg:w-7/12 px-4">
				<p className="text-white font-semibold text-3xl">{localeLn('Featured')}</p>
				<div className="mt-4 h-96 mb-24">
					{!isLoading ? (
						<div className="border-2 border-dashed border-gray-800 rounded-md">
							<Slider
								ref={sliderRef}
								beforeChange={(current, next) => setFeaturedSlideIdx(next)}
								dots={false}
								autoplay={true}
								autoplaySpeed={4000}
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
										<span className="text-3xl font-semibold">{featuredSlideIdx + 1}</span>
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
					) : (
						<HomeFeaturedLoader />
					)}
				</div>
			</div>
			<div className="w-full lg:w-5/12 mt-8 lg:mt-0 px-4">
				<div className="flex items-center justify-between">
					<p className="text-white font-semibold text-3xl">{localeLn('Latest')}</p>
					<Link href="/publication">
						<a className="text-gray-400 hover:text-white cursor-pointer font-semibold flex items-center">
							<span>{localeLn('More')}</span>
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
					{!isLoading ? (
						<div>
							{pubList.map((pub, idx) => {
								return (
									<div key={idx}>
										<PublicationList idx={idx} data={pub} />
									</div>
								)
							})}
						</div>
					) : (
						<HomePublicationLoader />
					)}
				</div>
			</div>
		</div>
	)
}
