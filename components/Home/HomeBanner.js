import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

const HomeBanner = () => {
	return (
		<div className="rounded-xl overflow-hidden mb-12">
			<Carousel showStatus={false} showThumbs={false} autoPlay infiniteLoop>
				<div className="w-full aspect-[5/2] bg-white"></div>
				<div className="w-full aspect-[5/2] bg-green-100"></div>
				<div className="w-full aspect-[5/2] bg-green-200"></div>
				<div className="w-full aspect-[5/2] bg-green-300"></div>
				<div className="w-full aspect-[5/2] bg-green-400"></div>
				<div className="w-full aspect-[5/2] bg-green-500"></div>
			</Carousel>
		</div>
	)
}

export default HomeBanner
