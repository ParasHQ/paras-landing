import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

import { parseImgUrl } from 'utils/common'

import { generateFromString } from 'generate-avatar'

const EmbeddedCollection = ({ collectionId, pubDetail }) => {
	const [collection, setCollection] = useState(null)

	useEffect(() => {
		fetchCollection()
	}, [])

	const fetchCollection = async () => {
		if (pubDetail?.isComic) {
			pubDetail?.collection_ids?.map(async () => {
				const url = process.env.COMIC_API_URL
				const res = await axios({
					url: url + `/comics`,
					method: 'GET',
					params: {
						comic_id: collectionId,
					},
				})
				const _comic = (await res.data.data.results[0]) || null
				setCollection(_comic)
			})
		}

		const url = process.env.V2_API_URL
		const res = await axios({
			url: url + `/collections`,
			method: 'GET',
			params: {
				collection_id: collectionId,
			},
		})

		const _token = (await res.data.data.results[0]) || null
		setCollection(_token)
	}

	if (!collection) return null

	return (
		<div>
			<Link
				href={
					pubDetail.isComic
						? `https://comic.paras.id/comics/${collection.comic_id}/chapter`
						: `/collection/${collection.collection_id}`
				}
				shallow={true}
			>
				<a target={pubDetail.isComic && '_blank'} className="cursor-pointer">
					<div className="flex flex-row flex-wrap md:h-60 h-72">
						<div className="w-full h-full mb-4 rounded">
							{pubDetail.isComic ? (
								<div
									className="mx-auto w-52 h-72 lg:w-56 lg:h-80 flex-none bg-no-repeat bg-center bg-cover shadow-xl pb-20"
									style={{
										backgroundImage: `url(${parseImgUrl(
											collection?.media
										)}?w=800&auto=format,compress)`,
									}}
								/>
							) : (
								<img
									className="object-cover w-full md:h-60 h-full transform ease-in-out duration-200 hover:opacity-80 rounded-xl"
									src={parseImgUrl(
										collection?.media ||
											`data:image/svg+xml;utf8,${generateFromString(collection?.collection_id)}`,
										null,
										{
											width: `600`,
											useOriginal: process.env.APP_ENV === 'production' ? false : true,
										}
									)}
								/>
							)}
						</div>
					</div>
				</a>
			</Link>
			<div className={`${pubDetail?.isComic ? 'mt-24 ml-2' : 'mt-4'}`}>
				<Link
					href={
						pubDetail?.isComic
							? `https://comic.paras.id/comics/${collection?.comic_id}/chapter`
							: `/collection/${collection?.collection_id}`
					}
					shallow={true}
				>
					<a
						target={pubDetail?.isComic && '_blank'}
						className="text-2xl hover:underline font-bold text-white cursor-pointer"
					>
						{pubDetail?.isComic ? collection?.comic_id : collection?.collection}
					</a>
				</Link>
			</div>
			<div className="flex flex-row flex-wrap text-sm text-gray-400 items-center w-full">
				<span className={`mr-1 ${pubDetail?.isComic && 'ml-2'}`}>
					{pubDetail?.isComic ? 'comic by' : 'collection by'}
				</span>
				<Link
					href={`${
						pubDetail?.isComic
							? `https://comic.paras.id/${collection?.author_ids}`
							: `/${collection?.creator_id}`
					}`}
					shallow={true}
				>
					<a target={pubDetail?.isComic && '_blank'}>
						<span className="cursor-pointer truncate hover:text-gray-300 hover:underline">
							{pubDetail?.isComic ? collection?.author_ids : collection?.creator_id}
						</span>
					</a>
				</Link>
				{collection?.isCreator && (
					<span className="ml-1">
						<svg
							width="16"
							height="14"
							viewBox="0 0 18 17"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M17.8095 8.5L15.8343 6.24143L16.1095 3.25429L13.1871 2.59048L11.6571 0L8.90476 1.1819L6.15238 0L4.62238 2.58238L1.7 3.2381L1.97524 6.23333L0 8.5L1.97524 10.7586L1.7 13.7538L4.62238 14.4176L6.15238 17L8.90476 15.81L11.6571 16.9919L13.1871 14.4095L16.1095 13.7457L15.8343 10.7586L17.8095 8.5Z"
								fill="white"
							/>
							<path
								d="M7.3956 12.1429L5.66675 6.494H7.62684L8.74022 10.9039H9.06951L10.1855 5.66675H12.1429L10.4141 12.1429H7.3956Z"
								fill="#0816B3"
							/>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M10.1191 5.26196H14.4169L13.6074 6.88101H10.1191V5.26196Z"
								fill="#0816B3"
							/>
						</svg>
					</span>
				)}
			</div>
		</div>
	)
}

export default EmbeddedCollection
