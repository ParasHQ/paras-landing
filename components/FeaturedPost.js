import { useEffect, useRef, useState } from 'react'
import { parseImgUrl } from '../utils/common'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Link from 'next/link'

const FeaturedPostList = ({ post = [] }) => {
	const [showArrow, setShowArrow] = useState(false)
	const [numSlides, setNumSlides] = useState(null)

	useEffect(() => {
		if (window.innerWidth < 640) {
			setNumSlides(1)
		} else if (window.innerWidth < 768) {
			setNumSlides(2)
		} else {
			setNumSlides(3)
		}
	}, [])

	return (
		<>
			<h1 className="text-4xl font-bold text-gray-100 text-center">Featured</h1>
			<div
				className="border-2 border-dashed border-gray-800 rounded-md my-8 mt-4 m-4 p-6 md:p-8"
				onMouseEnter={() => setShowArrow(true)}
				onMouseLeave={() => setShowArrow(false)}
			>
				{numSlides !== null && post.length > 1 ? (
					<Slider
						dots={false}
						autoplay={false}
						infinite={false}
						slidesToShow={numSlides}
						slidesToScroll={1}
						swipe={false}
						arrows={showArrow}
						adaptiveHeight={true}
						responsive={[
							{
								breakpoint: 768,
								settings: {
									swipe: true,
									arrows: false,
								},
							},
							{
								breakpoint: 640,
								settings: {
									swipe: true,
									arrows: false,
								},
							},
						]}
					>
						{post.map((post) => (
							<div key={post._id} className="outline-none">
								<div className="w-11/12 m-auto">
									<FeaturedPost post={post} />
								</div>
							</div>
						))}
					</Slider>
				) : (
					post.map((post) => (
						<div className="w-1/3" key={post._id}>
							<div className="w-11/12 m-auto">
								<FeaturedPost post={post} />
							</div>
						</div>
					))
				)}
			</div>
		</>
	)
}

const FeaturedPost = ({ post }) => {
	const containerRef = useRef()
	const [dimension, setDimension] = useState({ width: 0, height: 0 })

	useEffect(() => {
		function updateSize() {
			const imgWidth = 800
			const imgHeight = 600

			let w = containerRef.current.parentNode.offsetWidth
			let h =
				containerRef.current.parentNode.offsetWidth * (imgHeight / imgWidth)

			if (
				containerRef.current.parentNode.offsetHeight !== 0 &&
				h > containerRef.current.parentNode.offsetHeight
			) {
				w =
					(imgWidth * containerRef.current.parentNode.offsetHeight) / imgHeight
				h = containerRef.current.parentNode.offsetHeight
			}

			setDimension({
				width: w,
				height: h,
			})
		}
		window.addEventListener('resize', updateSize)
		updateSize()
		return () => window.removeEventListener('resize', updateSize)
	}, [containerRef])

	return (
		<div
			ref={containerRef}
			style={{
				width: dimension.width,
				height: dimension.height,
			}}
			className="bg-dark-primary-1 rounded-md overflow-hidden relative"
		>
			{post.urlList ? (
				<div className="h-full">
					<div className="absolute w-full h-full bg-gradient-to-t from-gray-900 via-transparent" />
					<img
						src={parseImgUrl(post.image)}
						className="object-cover h-full w-full"
					/>
					<div className="p-4 absolute bottom-0">
						<h1 className="text-white font-bold text-2xl">{post.title}</h1>
						<p className="text-white whitespace-normal font-normal text-sm">
							{post.description}
						</p>
						<div className="mt-2 relative z-10">
							{post.urlList.map((url, idx) => {
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
			) : (
				<div className="h-full">
					{post.url.includes(process.env.BASE_URL) ? (
						<Link href={post.url}>
							<div className="h-full">
								<div className="absolute w-full h-full bg-gradient-to-t from-gray-900 via-transparent" />
								<img
									src={parseImgUrl(post.image)}
									className="object-cover h-full w-full"
								/>
								<div className="p-4 absolute bottom-0">
									<h1 className="text-white font-bold text-2xl">
										{post.title}
									</h1>
									<p className="text-white whitespace-normal font-normal text-sm">
										{post.description}
									</p>
								</div>
							</div>
						</Link>
					) : (
						<a href={post.url} target="_blank">
							<div className="absolute w-full h-full bg-gradient-to-t from-gray-900 via-transparent" />
							<img
								src={parseImgUrl(post.image)}
								className="object-cover h-full w-full"
							/>
							<div className="p-4 absolute bottom-0">
								<h1 className="text-white font-bold text-2xl">{post.title}</h1>
								<p className="text-white whitespace-normal font-normal text-sm">
									{post.description}
								</p>
							</div>
						</a>
					)}
				</div>
			)}
		</div>
	)
}

export default FeaturedPostList
