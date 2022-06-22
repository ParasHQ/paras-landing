import axios from 'axios'
import useSWR from 'swr'
import { useRef, useState } from 'react'
import { IconLeft, IconRight } from 'components/Icons'
import { LaunchpadItem } from 'components/Launchpad/LaunchpadList'
import ProjectListLoader from 'components/Collection/ProjectListLoader'

const HomeLaunchpad = ({ showDetails }) => {
	const [showLeftClick, setShowLeftClick] = useState(false)
	const [showRightClick, setShowRightClick] = useState(true)
	const [isActive, setIsActive] = useState('next-days')

	const fetchData = () =>
		axios(`${process.env.V2_API_URL}/featured-collections`, {}).then((res) => res.data.data.results)

	const { data, isValidating } = useSWR('home-featured-collections', fetchData)
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

	const tabAction = (type) => {
		setIsActive(type)
	}

	return (
		<div className="md:mb-8 relative">
			<div className="text-white md:flex justify-start items-center gap-4 mb-8">
				<h1 className="font-semibold text-3xl capitalize">Upcoming Drops</h1>
				<div className="flex justify-between items-center mx-10 md:mx-0 border-2 border-gray-800 rounded-full text-sm font-thin mt-2 md:mt-0">
					<div
						className={`pr-2 pl-6 py-2 rounded-l-full ${
							isActive === 'next-days' && 'bg-primary'
						} cursor-pointer`}
						onClick={() => tabAction('next-days')}
					>
						Next 7 days
					</div>
					<div
						className={`px-2 py-2 ${isActive === 'coming-soon' && 'bg-primary'} cursor-pointer`}
						onClick={() => tabAction('coming-soon')}
					>
						Coming Soon
					</div>
					<div
						className={`pr-6 pl-2 py-2 ${
							isActive === 'live' && 'bg-primary'
						} rounded-r-full cursor-pointer`}
						onClick={() => tabAction('live')}
					>
						Live
					</div>
				</div>
			</div>
			{!data && isValidating ? (
				<div className="-mx-3">
					<div className="hidden md:block">
						<ProjectListLoader uniqueKey="big-project-loader" contentLength={4} />
					</div>
					<div className="md:hidden">
						<ProjectListLoader uniqueKey="small-project-loader" contentLength={2} />
					</div>
				</div>
			) : (
				<>
					<div
						ref={ref}
						className="flex flex-nowrap overflow-scroll -mx-3 disable-scrollbars"
						onScroll={onScroll}
					>
						{data?.map((project) => (
							<LaunchpadItem
								key={project._id}
								project={project}
								showDetails={showDetails}
								className="rounded-md overflow-hidden snap-center w-1/2 md:w-1/4 px-3 shrink-0"
							/>
						))}
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
			)}
		</div>
	)
}

export default HomeLaunchpad
