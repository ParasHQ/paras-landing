import axios from 'axios'
import useSWR from 'swr'

import { CollectionItem } from 'components/Collection/CollectionList'
import { useRef, useState } from 'react'
import CollectionListLoader from 'components/Collection/CollectionListLoader'

const HomeCollectionList = ({ showDetails }) => {
	const [showLeftClick, setShowLeftClick] = useState(false)
	const [showRightClick, setShowRightClick] = useState(true)

	const fetchData = () =>
		axios(`${process.env.V2_API_URL}/collections`, {
			params: {
				__skip: 0,
				__limit: 12,
				__sort: 'volume::-1',
			},
		}).then((res) => res.data.data.results)

	const { data, isValidating } = useSWR('home-collections', fetchData)
	const ref = useRef(null)

	const scrollToRight = () => {
		if (showRightClick) {
			ref.current.scrollTo({
				left: ref.current.scrollLeft + 400,
				behavior: 'smooth',
			})
		}
	}

	const scrollToLeft = () => {
		if (showLeftClick) {
			ref.current.scrollTo({
				left: ref.current.scrollLeft - 400,
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

	if (!data && isValidating) {
		return (
			<div className="my-8 relative">
				<h1 className="text-white font-semibold text-3xl capitalize mb-4">Featured Collections</h1>
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
		<div className="my-12 relative">
			<h1 className="text-white font-semibold text-3xl capitalize mb-4">Featured Collections</h1>
			<div
				ref={ref}
				className="flex flex-nowrap overflow-scroll snap-x -mx-3 disable-scrollbars"
				onScroll={onScroll}
			>
				{data.map((collection) => (
					<CollectionItem
						key={collection._id}
						collection={collection}
						showDetails={showDetails}
						className="rounded-md overflow-hidden snap-center w-full md:w-1/3 px-3 shrink-0"
					/>
				))}
			</div>
			<div className="flex absolute right-0 top-0 gap-4">
				<div
					className={`${
						showLeftClick ? 'text-gray-200 cursor-pointer' : 'text-gray-500 cursor-not-allowed'
					}`}
					onClick={scrollToLeft}
				>
					Left
				</div>
				<div
					className={`${
						showRightClick ? 'text-gray-200 cursor-pointer' : 'text-gray-500 cursor-not-allowed'
					}`}
					onClick={scrollToRight}
				>
					Right
				</div>
			</div>
		</div>
	)
}

export default HomeCollectionList
