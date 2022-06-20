import Link from 'next/link'
import { parseImgUrl } from 'utils/common'
import InfiniteScroll from 'react-infinite-scroll-component'
import CollectionListLoader from 'components/Collection/CollectionListLoader'
import { generateFromString } from 'generate-avatar'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import router from 'next/router'
import { trackCollectionList } from 'lib/ga'

const LaunchpadList = ({ data, fetchData, hasMore, page }) => {
	if (data.length === 0 && !hasMore) {
		return (
			<div className="w-full">
				<div className="m-auto text-2xl text-gray-600 font-semibold py-32 text-center">
					<div className="w-40 m-auto">
						<img src="/cardstack.png" className="opacity-75" />
					</div>
					<p className="mt-4">No Collections</p>
				</div>
			</div>
		)
	}

	return (
		<InfiniteScroll
			dataLength={data?.length || 3}
			next={fetchData}
			hasMore={hasMore}
			loader={<CollectionListLoader />}
		>
			<div className="flex flex-wrap pt-4">
				{data.map((collection, index) => (
					<LaunchpadItem
						key={index}
						collection={collection}
						fullOpacity={page !== 'search'}
						className="rounded-md overflow-hidden mb-12 md:mb-8 w-full md:w-1/3 md:px-4"
					/>
				))}
			</div>
		</InfiniteScroll>
	)
}

export default LaunchpadList

export const LaunchpadItem = ({
	collection,
	fullOpacity = true,
	className,
	showDetails = true,
}) => {
	const defaultAvatar = `data:image/svg+xml;utf8,${generateFromString(collection.collection_id)}`

	const onToCollection = () => {
		if (router.pathname === '/') {
			trackCollectionList(collection.collection_id)
		}
		router.push(`/collection/${collection.collection_id}`, undefined, { shallow: true })
	}

	return (
		<div
			className={`${className} ${
				collection?.isCreator || fullOpacity ? 'opacity-100' : 'opacity-60'
			}`}
		>
			<div onClick={onToCollection}>
				<a
					href={`/collection/${collection.collection_id}`}
					onClick={(e) => e.preventDefault()}
					className="cursor-pointer"
				>
					<div className="flex flex-row flex-wrap md:h-40 h-48">
						<div className="w-full h-full mb-4 rounded">
							<img
								className="object-cover w-full md:h-40 h-full p-1 transform ease-in-out duration-200 hover:opacity-80 rounded-xl"
								src={parseImgUrl(collection.cover || collection.media || defaultAvatar, {
									width: '200',
								})}
							/>
						</div>
					</div>
				</a>
			</div>
			<div className="text-white mt-1">
				<div className="flex justify-center">
					<div>
						<div onClick={onToCollection}>
							<a
								href={`/collection/${collection.collection_id}`}
								onClick={(e) => e.preventDefault()}
								className="cursor-pointer"
							>
								<p className="grid grid-flow-col text-md hover:underline font-bold">
									{collection.collection}
								</p>
							</a>
						</div>
					</div>
				</div>
				{showDetails && (
					<>
						<div className="flex justify-around my-2">
							<div className="flex my-1 text-center font-light gap-1">
								<p className="font-light text-xs text-white text-opacity-70 mb-1">Items</p>
								<p className="font-bold text-xs">{collection.total_cards || 5555}</p>
							</div>
							<div className="flex my-1 text-center gap-1">
								<p className="font-light text-xs text-white text-opacity-70 mb-1">Price</p>
								{/* <p className="font-bold text-xs">{formatNearAmount(collection.volume || '0', 2)} Ⓝ</p> */}
								<p className="font-bold text-xs">7.77 Ⓝ</p>
							</div>
						</div>
						<p className="text-center text-green-500">LIVE</p>
					</>
				)}
			</div>
		</div>
	)
}
