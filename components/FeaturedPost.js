import { useEffect, useRef, useState } from 'react'
import { parseImgUrl } from '../utils/common'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const data = [
	{
		_id: '6040b4808e4b8108502c8ff6c8',
		image: 'ipfs://bafybeiaxl6ssrlgqig6ejhhgyhwfd6gr52ioe6gbycv3tjsb3qmvt6ohg4',
		title: 'test featured',
		description: 'this is the description',
		isPinned: true,
		url: 'https://paras.id/publication/editorial',
		createdAt: 1614851685048,
	},
	{
		_id: '6040b48b8e4b8108502c8asr6c9',
		image: 'ipfs://bafybeifuvycrsebpyvbfjovj44bhfyv3u5xevc2nfn4a7ahtkpr2aapjly',
		title: 'Lunar new year',
		description:
			'this is the description yang panjang banget pokoknya lalalallalalalalala iya bener panjang banget',
		isPinned: false,
		url: 'https://paras.id/publication/editorial',
		createdAt: 1614851685048,
	},
	{
		_id: '6040b4808e4b8108502c86csa8',
		image: 'ipfs://QmQogQo5534TGuRukhechFuiYH2WaXjAYtWTJaRsx3mQEV',
		title: 'test featured',
		description: 'this is the description',
		isPinned: true,
		url: 'https://paras.id/publication/editorial',
		createdAt: 1614851685048,
	},
	{
		_id: '6040b48b8e4b8108502c86c9123213',
		image: 'ipfs://QmQogQo5534TGuRukhechFuiYH2WaXjAYtWTJaRsx3mQEV',
		title: 'test featured',
		description: 'this is the description',
		isPinned: false,
		url: 'https://paras.id/publication/editorial',
		createdAt: 1614851685048,
	},
	{
		_id: '6040b4808e4b8108502c86c823',
		image: 'ipfs://QmQogQo5534TGuRukhechFuiYH2WaXjAYtWTJaRsx3mQEV',
		title: 'test featured',
		description: 'this is the description',
		isPinned: true,
		url: 'https://paras.id/publication/editorial',
		createdAt: 1614851685048,
	},
	{
		_id: '6040b48b8e4b8108502c86c92',
		image: 'ipfs://QmQogQo5534TGuRukhechFuiYH2WaXjAYtWTJaRsx3mQEV',
		title: 'test featured',
		description: 'this is the description',
		isPinned: false,
		url: 'https://paras.id/publication/editorial',
		createdAt: 1614851685048,
	},
]

const FeaturedPostList = ({ post = data }) => {
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
		<div
			className="border-2 border-dashed border-gray-800 rounded-md my-8 m-4 p-6 md:p-8"
			onMouseEnter={() => setShowArrow(true)}
			onMouseLeave={() => setShowArrow(false)}
		>
			{numSlides !== null && (
				<Slider
					dots={false}
					autoplay={false}
					infinite={true}
					slidesToShow={numSlides}
					slidesToScroll={1}
					swipe={false}
					arrows={showArrow}
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
					{data.map((post) => (
						<div key={post._id}>
							<div className="w-11/12 m-auto">
								<FeaturedPost post={post} />
							</div>
						</div>
					))}
				</Slider>
			)}
		</div>
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
				<img
					src={parseImgUrl(post.image)}
					className="object-cover h-full w-full"
				/>
				<div className="p-4 absolute bottom-0">
					<h1 className="text-white font-bold text-2xl">{post.title}</h1>
					<p className="text-white whitespace-normal">{post.description}</p>
				</div>
			</a>
		</div>
	)
}

export default FeaturedPostList
