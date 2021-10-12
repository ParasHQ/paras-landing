import { useIntl } from 'hooks/useIntl'
import { useEffect, useState } from 'react'
import cachios from 'cachios'
import InfiniteScroll from 'react-infinite-scroll-component'
import Link from 'next/link'

const TabPublication = ({ localToken }) => {
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

		// const queryTokenId = localToken.token_id ? `/${localToken.token_id}` : ''

		const query = `${localToken.contract_id}::${localToken.token_series_id}`

		setIsFetching(true)
		const res = await cachios.get(
			`${process.env.V2_API_URL}/publications?contract_token_id=${query}&__skip=${
				page * 12
			}&__limit=5&__view=simple`,
			{
				ttl: 60,
			}
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
				<div className="bg-gray-800 mt-3 p-3 rounded-md shadow-md">
					<p className="text-white text-center">
						{localeLn('Card not mentioned in any publication')}
					</p>
				</div>
			)}
			<InfiniteScroll
				dataLength={publicationList.length}
				next={_fetchData}
				hasMore={hasMore}
				loader={
					<div className="bg-gray-800 mt-3 p-3 rounded-md shadow-md">
						<p className="text-white text-center">{localeLn('Loading...')}</p>
					</div>
				}
				scrollableTarget="publicationListScroll"
			>
				{publicationList.map((pub) => (
					<div key={pub._id} className="m-auto bg-gray-800 mt-3 p-3 rounded-md shadow-md">
						<div className="m-auto">
							<Link href={`/publication/${pub.slug}-${pub._id}`}>
								<div className="cursor-pointer">
									<h1 className="font-bold line-clamp-1 text-white">{pub.title}</h1>
									<p className="text-sm mt-1 line-clamp-2 overflow-hidden text-white opacity-80">
										{pub.description}
									</p>
								</div>
							</Link>
						</div>
					</div>
				))}
			</InfiniteScroll>
		</div>
	)
}

export default TabPublication
