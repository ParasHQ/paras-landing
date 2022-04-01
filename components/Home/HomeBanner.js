import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import useSWR from 'swr'
import { parseImgUrl } from 'utils/common'

const HomeBanner = () => {
	const fetchFeaturedPost = () =>
		axios.get(`${process.env.V2_API_URL}/banner`).then((res) => res.data.result)

	const { data, isValidating } = useSWR('home-banner', fetchFeaturedPost)

	const [heightMobile, setHeightMobile] = useState(0)
	const [heightDesktop, setHeightDesktop] = useState(0)
	const refMobile = useRef()
	const refDesktop = useRef()

	useEffect(() => {
		if (refMobile.current && refMobile.current.clientWidth !== 0) {
			setHeightMobile(refMobile.current.clientWidth / 2)
		}
	}, [refMobile])

	useEffect(() => {
		if (refDesktop.current && refDesktop?.current?.clientWidth !== 0) {
			setHeightDesktop((refDesktop.current.clientWidth * 5) / 2)
		}
	}, [refDesktop])

	if ((!data && isValidating) || data.length === 0) {
		return null
	}

	return (
		<div className="rounded-xl overflow-hidden mb-12">
			<Carousel showStatus={false} showThumbs={false} autoPlay infiniteLoop>
				{data.map((item, idx) => (
					<a key={idx} href={`${item.openLink}`} target="_blank" rel="noreferrer">
						<div
							ref={refDesktop}
							className="hidden md:block w-full aspect-[2/1] md:aspect-[5/2]"
							style={{ height: heightDesktop }}
						>
							<img
								className="object-cover h-full focus:outline-none active:outline-none"
								src={parseImgUrl(item.bannerDesktop, null, {
									width: 1200,
								})}
							/>
						</div>
						<div
							ref={refMobile}
							className="md:hidden w-full aspect-[2/1] md:aspect-[5/2]"
							style={{ height: heightMobile }}
						>
							<img
								className="object-cover h-full focus:outline-none active:outline-none"
								src={parseImgUrl(item.bannerMobile, null, {
									width: 1200,
								})}
							/>
						</div>
					</a>
				))}
			</Carousel>
		</div>
	)
}

export default HomeBanner
