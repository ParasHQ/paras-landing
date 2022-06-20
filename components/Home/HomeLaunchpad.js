import axios from 'axios'
import useSWR from 'swr'
import { useRef, useState } from 'react'
import CollectionListLoader from 'components/Collection/CollectionListLoader'
import { IconLeft, IconRight } from 'components/Icons'
import { LaunchpadItem } from 'components/Launchpad/LaunchpadList'

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

	if (!data && isValidating) {
		return (
			<div className="my-8 relative">
				<h1 className="text-white font-semibold text-3xl capitalize mb-4">Upcoming Drops</h1>
				<div className="md:-mx-3">
					<div className="hidden md:block">
						<CollectionListLoader uniqueKey="big-collection-loader" contentLength={3} />
					</div>
					<div className="md:hidden">
						<CollectionListLoader uniqueKey="small-collection-loader" contentLength={1} />
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="mb-8 relative">
			<div className="text-white md:flex justify-start items-center gap-4 mb-4">
				<h1 className="font-semibold text-3xl capitalize">Upcoming Drops</h1>
				<div className="flex justify-around items-center mx-[67px] md:mx-0 border-2 border-gray-800 rounded-full text-sm font-thin mt-2 md:mt-0">
					<div
						className={`pr-2 pl-2 py-3 rounded-l-full ${
							isActive === 'next-days' && 'bg-primary'
						} cursor-pointer`}
						onClick={() => tabAction('next-days')}
					>
						Next 7 days
					</div>
					<div
						className={`px-2 py-3 ${isActive === 'coming-soon' && 'bg-primary'} cursor-pointer`}
						onClick={() => tabAction('coming-soon')}
					>
						Coming Soon
					</div>
					<div
						className={`pr-6 pl-2 py-3 ${
							isActive === 'live' && 'bg-primary'
						} rounded-r-full cursor-pointer`}
						onClick={() => tabAction('live')}
					>
						Live
					</div>
				</div>
			</div>
			<div
				ref={ref}
				className="flex flex-nowrap overflow-scroll -mx-3 disable-scrollbars"
				onScroll={onScroll}
			>
				{data.map((collection) => (
					<LaunchpadItem
						key={collection._id}
						collection={collection}
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
		</div>
	)
}

export default HomeLaunchpad
