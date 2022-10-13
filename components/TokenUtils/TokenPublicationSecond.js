import { useEffect, useState } from 'react'
import cachios from 'cachios'
import InfiniteScroll from 'react-infinite-scroll-component'
import { IconArrowSmall } from 'components/Icons'
import IconEmptyPublication from 'components/Icons/component/IconEmptyPublication'
import IconLoaderSecond from 'components/Icons/component/IconLoaderSecond'
import Link from 'next/link'

const LIMIT = 5

const TokenPublicationSecond = ({ localToken }) => {
	const [publications, setPublications] = useState([])
	const [page, setPage] = useState(0)
	const [isFetching, setIsFetching] = useState(false)
	const [hasMore, setHasMore] = useState(true)

	useEffect(() => {
		if (publications.length === 0 && hasMore) {
			_fetchData()
		}
	}, [])

	const _fetchData = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)

		const query = `${localToken.contract_id}::${localToken.token_series_id}`

		const publicationFetch = await cachios.get(
			`${process.env.V2_API_URL}/publications?contract_token_id=${query}&__skip=${
				page * 12
			}&__limit=${LIMIT}&__view=simple`,
			{
				ttl: 60,
			}
		)

		const publicationResult = await publicationFetch.data.data

		const newPublications = [...publications, ...publicationResult.results]
		setPublications(newPublications)

		setPage(page + 1)
		if (publicationResult.results.length === 0) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}

		setIsFetching(false)
	}

	return (
		<div className="h-[275px] bg-neutral-03 text-white rounded-lg border border-neutral-05 py-6 px-5">
			<p className="font-bold text-xl mb-2">Publications</p>
			<p className="font-normal text-xs mb-6">Visit the publication to see the creation story.</p>

			<div className="h-[158px] overflow-y-auto">
				{publications.length <= 0 ? (
					<div className="bg-neutral-01 border border-neutral-05 rounded-lg py-3">
						<IconEmptyPublication size={100} className="mx-auto my-2" />
					</div>
				) : (
					<InfiniteScroll
						dataLength={publications.length}
						next={_fetchData}
						hasMore={hasMore}
						loader={<IconLoaderSecond size={50} />}
					>
						{publications.map((publication) => (
							<Link
								key={publication.slug}
								href={`/publication/${publication.slug}-${publication._id}`}
							>
								<a className="flex flex-row justify-between items-center bg-neutral-01 border border-neutral-05 rounded-lg px-3 py-4 my-2">
									<div>
										<p className="text-neutral-08">{publication.title} </p>
										<p className="text-neutral-09">{publication.description}</p>
									</div>
									<div className="flex flex-row items-center justify-between text-right">
										<p className="font-normal text-sm">
											{new Date(publication.issued_at).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}{' '}
										</p>
										<div className="text-sm text-neutral-09">
											<IconArrowSmall size={45} />
										</div>
									</div>
								</a>
							</Link>
						))}
					</InfiniteScroll>
				)}
			</div>
		</div>
	)
}

export default TokenPublicationSecond
