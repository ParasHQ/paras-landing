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
						<svg
							className="w-10 h-10 text-white"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
								clipRule="evenodd"
							></path>
						</svg>
					</div>
				</div>
			)}
		</>
	)
}

export default ButtonScrollTop
