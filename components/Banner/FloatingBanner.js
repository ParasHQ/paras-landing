import { parseImgUrl } from 'utils/common'
import Link from 'next/link'
import ParasRequest from 'lib/ParasRequest'
import useSWR from 'swr'
import { Fragment, useEffect, useRef } from 'react'

const FloatingBanner = () => {
	const fetchFloatingBanner = () =>
		ParasRequest.get(`${process.env.V2_API_URL}/floating-banner`).then((res) => res.data.result[0])

	const bannerRef = useRef(null)
	const { data, isValidating } = useSWR('floating-banner', fetchFloatingBanner)

	useEffect(() => {
		window.addEventListener('scroll', (ev) => {
			if (ev.isTrusted) {
				bannerRef.current.style.setProperty('transform', 'translate(70px)')
				bannerRef.current.style.setProperty('transition-duration', '.5s')
				setTimeout(() => {
					bannerRef.current.style.setProperty('transform', 'translate(-50px)')
					bannerRef.current.style.setProperty('transition-duration', '.5s')
				}, 1000)
			}
		})
	}, [])

	if ((!data && isValidating) || data.length === 0) {
		return null
	}

	return (
		<>
			{data.is_active && (
				<Fragment>
					<div
						ref={bannerRef}
						className="block md:hidden h-36 w-24 p-4 md:m-auto z-20 fixed -right-8 md:right-36 bottom-5 transform -translate-x-1/2 md:left-auto md:transform-none cursor-pointer"
					>
						<Link href={`${data?.open_link}`}>
							<div className="absolute right-0">
								<div className="cursor-pointer">
									<img src={parseImgUrl(data.image)} />
								</div>
							</div>
						</Link>
					</div>
					<div className="hidden md:block h-36 w-24 p-4 md:m-auto z-20 fixed -right-8 md:right-36 bottom-5 transform -translate-x-1/2 md:left-auto md:transform-none cursor-pointer">
						<Link href={`${data?.open_link}`}>
							<div className="absolute right-0">
								<div className="cursor-pointer">
									<img src={parseImgUrl(data.image)} />
								</div>
							</div>
						</Link>
					</div>
				</Fragment>
			)}
		</>
	)
}

export default FloatingBanner
