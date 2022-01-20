import Link from 'next/link'
import { parseImgUrl } from 'utils/common'
import InfiniteScroll from 'react-infinite-scroll-component'
import CollectionListLoader from './CollectionListLoader'
import ArtistVerified from 'components/Common/ArtistVerified'
import { generateFromString } from 'generate-avatar'

const CollectionList = ({ data, fetchData, hasMore }) => {
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
					<div
						key={index}
						className="rounded-md overflow-hidden mb-12 md:mb-8 w-full md:w-1/3 md:px-4"
					>
						<Link href={`/collection/${collection.collection_id}`} shallow={true}>
							<a className="cursor-pointer">
								<div className="flex flex-row flex-wrap md:h-72 h-80">
									<div className="w-full h-full mb-4 rounded">
										<img
											className="object-cover w-full md:h-72 h-full p-1 transform ease-in-out duration-200 hover:opacity-80 rounded-xl"
											src={parseImgUrl(
												collection?.media ||
													`data:image/svg+xml;utf8,${generateFromString(collection.collection_id)}`,
												null,
												{
													width: `200`,
													useOriginal: process.env.APP_ENV === 'production' ? false : true,
												}
											)}
										/>
									</div>
								</div>
							</a>
						</Link>
						<div className="text-white mt-4 md:mt-2">
							<Link href={`/collection/${collection.collection_id}`} shallow={true}>
								<a className="cursor-pointer">
									<p className="grid grid-flow-col text-xl hover:underline font-bold">
										{collection.collection}
									</p>
								</a>
							</Link>
							<div className="flex flex-row flex-wrap text-sm text-gray-400">
								<span className="mr-1">collection by</span>
								<Link href={`/${collection.creator_id}`} shallow={true}>
									<a>
										<span className="cursor-pointer truncate hover:text-gray-300 hover:underline">
											{collection.creator_id}
										</span>
									</a>
								</Link>
								<span className="ml-1">
									<ArtistVerified collection={collection} />
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</InfiniteScroll>
	)
}

export default CollectionList
