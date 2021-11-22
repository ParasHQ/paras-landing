import { useEffect, useState } from 'react'
import Axios from 'axios'
import Link from 'next/link'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useIntl } from 'hooks/useIntl'

const PublicationPreviewMini = ({ data }) => {
	return (
		<div className="m-auto border-2 border-dashed my-4 p-2 rounded-md">
			<div className="m-auto">
				<Link href={`/publication/${data.slug}-${data._id}`}>
					<div className="cursor-pointer">
						<h1 className="font-bold line-clamp-1">{data.title}</h1>
						<p className="text-sm mt-1 line-clamp-2 overflow-hidden">{data.description}</p>
					</div>
				</Link>
			</div>
		</div>
	)
}

const PublicationPreviewList = ({ tokenId }) => {
	const { localeLn } = useIntl()
	const [publicationList, setPublicationList] = useState([])
	const [page, setPage] = useState(0)
	const [isFetching, setIsFetching] = useState(false)
	const [hasMore, setHasMore] = useState(true)

	useEffect(() => {
		if (publicationList.length === 0 && hasMore) {
			_fetchData()
		}
	}, [])

	const _fetchData = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await Axios(
			`${process.env.V2_API_URL}/publications?tokenId=${tokenId}&__skip=${
				page * 5
			}&__limit=5&__view=simple`
		)
		const newData = await res.data.data

		const newPublicationList = [...publicationList, ...newData.results]
		setPublicationList(newPublicationList)
		setPage(page + 1)
		if (newData.results.length === 0) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	return (
		<div>
			{publicationList.length === 0 && !hasMore && (
				<div className="border-2 border-dashed my-4 p-2 rounded-md text-center">
					<p className="text-gray-500 py-8 px-8">{localeLn('CardNotMentioned')}</p>
				</div>
			)}
			<InfiniteScroll
				dataLength={publicationList.length}
				next={_fetchData}
				hasMore={hasMore}
				loader={
					<div className="border-2 border-dashed my-4 p-2 rounded-md text-center">
						<p className="my-2 text-center">{localeLn('LoadingLoading')}</p>
					</div>
				}
				scrollableTarget="publicationListScroll"
			>
				{publicationList.map((pub) => {
					return <PublicationPreviewMini key={pub._id} data={pub} />
				})}
			</InfiniteScroll>
		</div>
	)
}

export default PublicationPreviewList
