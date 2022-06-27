import axios from 'axios'
import { IconLeft, IconRight } from 'components/Icons'
import { trackFeatureBannerCommunity, trackFeatureBannerOfficial } from 'lib/ga'
import { useRouter } from 'next/router'
import { useRef, useState, useEffect } from 'react'
import { Carousel } from 'react-responsive-carousel'
import useSWR from 'swr'
import { parseImgUrl } from 'utils/common'
import HomeFeaturedLoader from './Loaders/Featured'

const HomeFeaturedBanner = () => {
	const [showLeftClick, setShowLeftClick] = useState(false)
	const [showRightClick, setShowRightClick] = useState(true)

	const fetchFeaturedPost = () =>
		axios.get(`${process.env.V2_API_URL}/featured-post`).then((res) => res.data.data)

	const { data: FeaturedData, isValidating } = useSWR('home-featured', fetchFeaturedPost)

	const ref = useRef(null)

	const scrollToRight = () => {
		if (showRightClick) {
			ref.current.scrollTo({
				left: ref.current.scrollLeft + 400,
				behavior: 'smooth',
			})
		}
	}

	const scrollToLeft = () => {
		if (showLeftClick) {
			ref.current.scrollTo({
				left: ref.current.scrollLeft - 400,
				behavior: 'smooth',
			})
		}
	}

	const onScroll = (e) => {
		if (e.target.scrollLeft === 0) {
			setShowLeftClick(false)
		} else if (ref.current.scrollWidth - ref.current.clientWidth <= e.target.scrollLeft) {
			setShowRightClick(false)
		} else {
			setShowLeftClick(true)
			setShowRightClick(true)
		}
	}

	if (!FeaturedData && isValidating) {
		return (
			<div className="md:flex mt-8">
				<div className="md:w-1/2 md:mr-4 mb-4 md:mb-0">
					<HomeFeaturedLoader />
				</div>
				<div className="md:w-1/2 grid grid-cols-2 grid-rows-2 gap-4">
					<HomeFeaturedLoader />
					<HomeFeaturedLoader />
					<HomeFeaturedLoader />
					<HomeFeaturedLoader />
				</div>
			</div>
		)
	}

	return (
		<div className="relative overflow-x-hidden group">
			<FeaturedOfficialParas list={FeaturedData.featured_big.results} className="md:hidden" />
			<div
				ref={ref}
				onScroll={onScroll}
				className="mb-8 mt-6 flex flex-nowrap overflow-scroll md:-mx-4 snap-x md:scroll-px-1 top-user-scroll"
			>
				<FeaturedOfficialParas
					list={FeaturedData.featured_big.results}
					className="hidden md:block"
				/>
				{FeaturedData.featured_small.results.map((data, idx) => {
					if (idx % 2 == 1) return null
					return (
						<FeaturedCommunity
							key={data._id}
							list={FeaturedData.featured_small.results}
							idx={idx}
						/>
					)
				})}
			</div>
			<div className="absolute left-0 top-0 bottom-0 gap-4 flex items-center">
				<div
					className={`transition ease-in-out duration-200 opacity-0 ${
						showLeftClick
							? 'text-gray-200 cursor-pointer group-hover:opacity-100'
							: 'hidden cursor-not-allowed opacity-0'
					}`}
					onClick={scrollToLeft}
				>
					<IconLeft className="w-10 h-10 text-white cursor-pointer" />
				</div>
			</div>
			<div className="absolute right-0 top-0 bottom-0 gap-4 flex items-center">
				<div
					className={`transition ease-in-out duration-200 opacity-0 ${
						showRightClick
							? 'text-gray-200 cursor-pointer group-hover:opacity-100'
							: 'hidden cursor-not-allowed opacity-0'
					}`}
					onClick={scrollToRight}
				>
					<IconRight className="w-10 h-10 text-white cursor-pointer" />
				</div>
			</div>
		</div>
	)
}

const clampStyle = {
	textOverflow: 'ellipsis',
	overflow: 'hidden',
	display: '-webkit-box',
	WebkitLineClamp: 2,
	lineClamp: 2,
	WebkitBoxOrient: 'vertical',
}

const FeaturedOfficialParas = ({ list, className }) => {
	const [height, setHeight] = useState(0)
	const ref = useRef()
	const router = useRouter()

	useEffect(() => {
		if (ref.current.clientWidth !== 0) {
			setHeight((ref.current.clientWidth * 2) / 3)
		}
	}, [ref])

	const onFeatureBannerOfficial = (data) => {
		trackFeatureBannerOfficial(data.url)
		router.push(data.url)
	}

	return (
		<div className={`md:w-1/2 p-2 md:p-4 md:pr-2 snap-start ${className}`}>
			<Carousel showStatus={false} showThumbs={false} autoPlay infiniteLoop showArrows={false}>
				{list.map((data) => (
					<div
						key={data._id}
						className="w-full rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
						onClick={() => onFeatureBannerOfficial(data)}
					>
						<a href={data.url} onClick={(e) => e.preventDefault()}>
							<div ref={ref} className="rounded-lg overflow-hidden shadow-xl drop-shadow-xl">
								<div className="w-full bg-primary aspect-[3/2]" style={{ height }}>
									<img
										src={parseImgUrl(data.image, null, {
											width: `800`,
											useOriginal: process.env.APP_ENV === 'production' ? false : true,
										})}
										className="object-cover h-full w-full publication-card-img"
									/>
								</div>
								<div className="w-full p-3 bg-gray-900 bg-opacity-50 h-[7.5rem] text-left">
									<h1 className="text-white font-semibold text-2xl capitalize truncate">
										{data.title}
									</h1>
									<p className="text-gray-200 text-sm" style={clampStyle}>
										{data.description}
									</p>
								</div>
							</div>
						</a>
					</div>
				))}
			</Carousel>
		</div>
	)
}

const FeaturedCommunity = ({ list, idx }) => {
	const [height, setHeight] = useState(0)
	const ref = useRef()
	const router = useRouter()

	useEffect(() => {
		if (ref.current.clientWidth !== 0) {
			setHeight(ref.current.clientWidth / 2)
		}
	}, [ref])

	const onFeatureBannerCommunity = (url) => {
		trackFeatureBannerCommunity(url)
		router.push(url)
	}

	return (
		<div className="w-full md:w-[30%] rounded-lg overflow-hidden flex-shrink-0 flex snap-start">
			<div className="w-full">
				<div
					className="pt-4 px-2 cursor-pointer"
					onClick={() => onFeatureBannerCommunity(list[idx].url)}
				>
					<a href={list[idx].url} onClick={(e) => e.preventDefault()}>
						<div className="rounded-md overflow-hidden shadow-xl drop-shadow-xl">
							<div ref={ref} className="w-full aspect-[2/1]" style={{ height }}>
								<img
									src={parseImgUrl(list[idx].image, null, {
										width: `400`,
										useOriginal: process.env.APP_ENV === 'production' ? false : true,
									})}
									className="object-cover h-full w-full publication-card-img"
								/>
							</div>
							<div className="w-full p-3 bg-gray-900 bg-opacity-50">
								<h1 className="text-white font-semibold text-lg capitalize truncate">
									{list[idx].title}
								</h1>
								<p className="text-gray-200 text-sm truncate">{list[idx].description}</p>
							</div>
						</div>
					</a>
				</div>
				<div
					className="pt-4 px-2 cursor-pointer"
					onClick={() => onFeatureBannerCommunity(list[idx + 1].url)}
				>
					<a href={list[idx + 1].url} onClick={(e) => e.preventDefault()}>
						<div className="rounded-md overflow-hidden shadow-xl drop-shadow-xl">
							<div className="w-full aspect-[2/1]" style={{ height }}>
								<img
									src={parseImgUrl(list[idx + 1].image, null, {
										width: `400`,
										useOriginal: process.env.APP_ENV === 'production' ? false : true,
									})}
									className="object-cover h-full w-full publication-card-img"
								/>
							</div>
							<div className="w-full p-3 bg-gray-900 bg-opacity-50">
								<h1 className="text-white font-semibold text-lg capitalize truncate">
									{list[idx + 1].title}
								</h1>
								<p className="text-gray-200 text-sm truncate">{list[idx + 1].description}</p>
							</div>
						</div>
					</a>
				</div>
			</div>
		</div>
	)
}

export default HomeFeaturedBanner
