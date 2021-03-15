import { useEffect, useRef, useState } from 'react'
import { parseImgUrl } from '../utils/common'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const FeaturedPostList = ({ post = [] }) => {
	const [showArrow, setShowArrow] = useState(false)
	const [numSlides, setNumSlides] = useState(null)

	useEffect(() => {
		if (window.innerWidth < 640) {
			setNumSlides(1)
		} else if (window.innerWidth < 768) {
			setNumSlides(2)
		} else {
			setNumSlides(4)
		}
	}, [])

	return (
		<>
			<h1 className="text-4xl font-bold text-gray-100 text-center">
				Featured Post
			</h1>
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
							<div key={post._id}>
								<div className="w-11/12 m-auto">
									<FeaturedPost post={post} />
								</div>
							</div>
						))}
					</Slider>
				) : (
					post.map((post) => (
						<div className="w-1/4" key={post._id}>
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
		</div>
	)
}

export default FeaturedPostList
