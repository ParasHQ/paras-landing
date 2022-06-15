import { IconChevronUp } from 'components/Icons'
import React, { useEffect, useState } from 'react'

const ButtonScrollTop = ({ className }) => {
	const [isScrollTop, setIsScrollTop] = useState(false)

	useEffect(() => {
		const checkScroll = () => {
			if (window.pageYOffset > 200 && !isScrollTop) setIsScrollTop(true)
			else setIsScrollTop(false)
		}

		window.addEventListener('scroll', checkScroll)

		return () => window.removeEventListener('scroll', checkScroll)
	}, [])

	return (
		<>
			{isScrollTop && (
				<div className="flex justify-end mr-2 md:mr-3 transition">
					<div
						className={`${className} fixed bottom-0 mb-5 bg-primary rounded-md cursor-pointer bg-opacity-50 hover:bg-opacity-20 z-20`}
						onClick={() =>
							window.scrollTo({
								top: 0,
								behavior: 'smooth',
							})
						}
					>
						<IconChevronUp className="h-6 w-6 m-2 text-white" />
					</div>
				</div>
			)}
		</>
	)
}

export default ButtonScrollTop
