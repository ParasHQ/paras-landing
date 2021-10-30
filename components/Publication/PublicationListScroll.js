import InfiniteScroll from 'react-infinite-scroll-component'
import PublicationCardListLoader from './PublicationCardListLoader'
import PublicationList from './PublicationList'

const PublicationListScroll = ({ data, fetchData, hasMore }) => (
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

export default PublicationListScroll
