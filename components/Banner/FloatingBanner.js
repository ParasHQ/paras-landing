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
		animateOnScroll()
	}, [])

	const animateOnScroll = async () => {
		window.addEventListener(
			'scroll',
			async () => {
				handleScrollOffset(async () => {
					bannerRef.current?.style.setProperty('transform', 'translate(70px)')
					bannerRef.current?.style.setProperty('transition-duration', '.3s')
					bannerRef.current?.style.setProperty('transition-timing-function', 'ease-out')

					await waitForScrollEnd()

					bannerRef.current?.style.setProperty('transform', 'translate(-50px)')
					bannerRef.current?.style.setProperty('transition-duration', '.3s')
					bannerRef.current?.style.setProperty('transition-timing-function', 'ease-out')
				}, 100)
			},
			false
		)
	}

	const handleScrollOffset = (callback, refresh) => {
		let isScrolling, start, end, distance

		if (!start) {
			start = window.scrollY
		}

		window.clearTimeout(isScrolling)

		isScrolling = setTimeout(() => {
			end = window.scrollY
			distance = end - start

			const distanceAbs = Math.abs(distance)
			if (distanceAbs > 10) {
				callback()
			}
		}, refresh)
	}

	const waitForScrollEnd = async () => {
		let last_changed_frame = 0
		let last_x = window.scrollX
		let last_y = window.scrollY

		return new Promise((resolve) => {
			function tick(frames) {
				if (frames >= 500 || frames - last_changed_frame > 100) {
					resolve()
				} else {
					if (window.scrollX != last_x || window.scrollY != last_y) {
						last_changed_frame = frames
						last_x = window.scrollX
						last_y = window.scrollY
					}
					requestAnimationFrame(tick.bind(null, frames + 1))
				}
			}
			tick(0)
		})
	}

	if ((!data && isValidating) || data?.length === 0) {
		return null
	}

	return (
		<>
			{data?.is_active && (
				<Fragment>
					<div
						ref={bannerRef}
						className="flex justify-center items-center md:hidden h-32 w-32 z-20 fixed -right-8 md:right-36 bottom-8 transform -translate-x-1/2 cursor-pointer"
					>
						<Link href={`${data?.open_link}`}>
							<div>
								<div className="cursor-pointer">
									<img src={parseImgUrl(data?.image)} className="w-[120px]" />
								</div>
							</div>
						</Link>
					</div>
					<div className="hidden md:block h-32 w-32 p-4 md:m-auto z-20 fixed -right-8 md:right-32 bottom-10 transform -translate-x-1/2 md:left-auto md:transform-none cursor-pointer">
						<Link href={`${data?.open_link}`}>
							<div className="absolute right-0">
								<div className="cursor-pointer">
									<img src={parseImgUrl(data?.image)} />
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
