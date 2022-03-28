import axios from 'axios'
import { IconLeft, IconRight } from 'components/Icons'
import { useRef, useState } from 'react'
import useSWR from 'swr'
import { parseImgUrl } from 'utils/common'
import HomeFeaturedLoader from './Loaders/Featured'

const HomeFeaturedBanner = () => {
	const [showLeftClick, setShowLeftClick] = useState(false)
	const [showRightClick, setShowRightClick] = useState(true)

	const fetchFeaturedPost = () =>
		axios.get(`${process.env.V2_API_URL}/features`).then((res) => res.data.data.results)

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
			<FeaturedOfficialParas data={FeaturedData[0]} className="md:hidden" />
			<div
				ref={ref}
				onScroll={onScroll}
				className="mb-8 mt-6 flex flex-nowrap overflow-scroll md:-mx-4 snap-x md:scroll-px-1 no-scrollbar"
			>
				<FeaturedOfficialParas data={FeaturedData[0]} className="hidden md:block" />
				{FeaturedData.slice(1).map((data, idx) => {
					if (idx % 2 == 0) return null
					return <FeaturedCommunity key={data._id} data={FeaturedData} idx={idx} />
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
	WebkitLineClamp: 3,
	lineClamp: 3,
	WebkitBoxOrient: 'vertical',
}

const FeaturedOfficialParas = ({ data, className }) => {
	return (
		<div
			className={`${className} w-full md:w-1/2 rounded-lg overflow-hidden flex-shrink-0 p-2 md:p-4 md:pr-2 snap-start cursor-pointer`}
			onClick={() => window.open(data.url)}
		>
			<div className="rounded-lg overflow-hidden shadow-xl drop-shadow-xl">
				<div className="w-full bg-primary aspect-[3/2]">
					<img
						src={parseImgUrl(data.image, null, {
							width: `800`,
							useOriginal: process.env.APP_ENV === 'production' ? false : true,
						})}
						className="object-cover h-full w-full publication-card-img"
					/>
				</div>
				<div className="w-full p-3 bg-gray-900 bg-opacity-50 h-[7.5rem]">
					<h1 className="text-white font-semibold text-2xl capitalize truncate">{data.title}</h1>
					<p className="text-gray-200 text-sm" style={clampStyle}>
						{data.description}
					</p>
				</div>
			</div>
		</div>
	)
}

const FeaturedCommunity = ({ data, idx }) => {
	return (
		<div className="w-full md:w-[30%] rounded-lg overflow-hidden flex-shrink-0 flex snap-start">
			<div className="w-full">
				<div className="pt-4 px-2 cursor-pointer" onClick={() => window.open(data[idx].url)}>
					<div className="rounded-md overflow-hidden shadow-xl drop-shadow-xl">
						<div className="w-full aspect-[2/1]">
							<img
								src={parseImgUrl(data[idx].image, null, {
									width: `400`,
									useOriginal: process.env.APP_ENV === 'production' ? false : true,
								})}
								className="object-cover h-full w-full publication-card-img"
							/>
						</div>
						<div className="w-full p-3 bg-gray-900 bg-opacity-50">
							<h1 className="text-white font-semibold text-lg capitalize truncate">
								{data[idx].title}
							</h1>
							<p className="text-gray-200 text-sm truncate">{data[idx].description}</p>
						</div>
					</div>
				</div>
				<div className="pt-4 px-2 cursor-pointer" onClick={() => window.open(data[idx + 1].url)}>
					<div className="rounded-md overflow-hidden shadow-xl drop-shadow-xl">
						<div className="w-full aspect-[2/1]">
							<img
								src={parseImgUrl(data[idx + 1].image, null, {
									width: `400`,
									useOriginal: process.env.APP_ENV === 'production' ? false : true,
								})}
								className="object-cover h-full w-full publication-card-img"
							/>
						</div>
						<div className="w-full p-3 bg-gray-900 bg-opacity-50">
							<h1 className="text-white font-semibold text-lg capitalize truncate">
								{data[idx + 1].title}
							</h1>
							<p className="text-gray-200 text-sm truncate">{data[idx + 1].description}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HomeFeaturedBanner
