import InfiniteScroll from 'react-infinite-scroll-component'
import PublicationCardListLoader from './PublicationCardListLoader'
import PublicationList from './PublicationList'

const PublicationListScroll = ({ data, fetchData, hasMore }) => {
	if (data.length === 0 && !hasMore) {
		return (
			<div className="w-full">
				<div className="m-auto text-2xl text-gray-600 font-semibold py-32 text-center">
					<div className="w-40 m-auto">
						<img src="/cardstack.png" className="opacity-75" />
					</div>
					<p className="mt-4">No Publication</p>
				</div>
			</div>
		)
	}

	return (
		<InfiniteScroll
			dataLength={data?.length || 4}
			next={fetchData}
			hasMore={hasMore}
			loader={<PublicationCardListLoader />}
		>
			<div className="flex flex-wrap">
				{data?.map((pub, idx) => (
					<div key={idx} className="w-full md:w-1/2 p-4">
						<PublicationList key={pub._id} data={pub} />
					</div>
				))}
			</div>
		</InfiniteScroll>
	)
}
export default PublicationListScroll
