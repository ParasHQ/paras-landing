import { useRef, useState } from 'react'
import { IconLeft, IconRight } from 'components/Icons'
import LaunchpadItem from './LaunchpadItem'
import LaunchpadListLoader from './LaunchpadListLoader'

const LaunchpadEmpty = () => {
	return (
		<div className="w-full">
			<div className="m-auto text-2xl text-gray-600 font-semibold py-28 text-center">
				<p className="mb-8 md:mb-0">No Project</p>
			</div>
		</div>
	)
}

const LaunchpadList = ({ showDetails, data, validating }) => {
	const [showLeftClick, setShowLeftClick] = useState(false)
	const [showRightClick, setShowRightClick] = useState(true)

	const ref = useRef(null)

	const scrollToRight = () => {
		const scrollSkip = ref.current.clientWidth
		if (showRightClick) {
			ref.current.scrollTo({
				left: ref.current.scrollLeft + scrollSkip,
				behavior: 'smooth',
			})
		}
	}

	const scrollToLeft = () => {
		const scrollSkip = ref.current.clientWidth
		if (showLeftClick) {
			ref.current.scrollTo({
				left: ref.current.scrollLeft - scrollSkip,
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
	return !data && validating ? (
		<div className="-mx-3">
			<div className="hidden md:block">
				<LaunchpadListLoader uniqueKey="big-project-loader" contentLength={4} />
			</div>
			<div className="md:hidden">
				<LaunchpadListLoader uniqueKey="small-project-loader" contentLength={2} />
			</div>
		</div>
	) : (
		<>
			<div
				ref={ref}
				className="flex flex-nowrap overflow-scroll -mx-3 disable-scrollbars"
				onScroll={onScroll}
			>
				{data?.length === 0 ? (
					<LaunchpadEmpty />
				) : (
					data?.map((project) => (
						<LaunchpadItem
							key={project._id}
							project={project}
							showDetails={showDetails}
							className="rounded-md overflow-hidden snap-center w-1/2 md:w-1/4 px-3 shrink-0"
						/>
					))
				)}
			</div>
			<div className="flex absolute right-0 top-0 gap-1 mt-2">
				<div
					className={`${
						showLeftClick ? 'text-gray-200 cursor-pointer' : 'text-gray-500 cursor-not-allowed'
					}`}
					onClick={scrollToLeft}
				>
					<IconLeft />
				</div>
				<div
					className={`${
						showRightClick ? 'text-gray-200 cursor-pointer' : 'text-gray-500 cursor-not-allowed'
					}`}
					onClick={scrollToRight}
				>
					<IconRight />
				</div>
			</div>
		</>
	)
}

export default LaunchpadList
