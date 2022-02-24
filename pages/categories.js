import axios from 'axios'
import { useEffect, useState } from 'react'
import Nav from 'components/Nav'
import Head from 'next/head'
import Footer from 'components/Footer'
import { useIntl } from 'hooks/useIntl'
import Link from 'next/link'
import { parseImgUrl } from 'utils/common'
import ButtonScrollTop from 'components/Common/ButtonScrollTop'

const LIMIT = 12

const Categories = () => {
	const { localeLn } = useIntl()

	const [isFetching, setIsFetching] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [categories, setCategories] = useState([])
	const [page, setPage] = useState(0)

	useEffect(() => {
		_fetchData()
	}, [])

	const _fetchData = async () => {
		if (!hasMore || isFetching) return

		setIsFetching(true)
		const res = await axios.get(`${process.env.V2_API_URL}/all-categories`, {
			params: {
				__skip: page * LIMIT,
				__limit: LIMIT,
			},
		})
		const data = await res.data.data
		const newData = [...categories, ...data]
		setCategories(newData)
		setPage(page + 1)
		if (data.length < LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	return (
		<div className="min-h-screen bg-black">
			<div
				className="fixed inset-0 opacity-50"
				style={{
					zIndex: 0,
					backgroundImage: `url('./bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			></div>
			<Head>
				<title>{localeLn('Categories')}</title>
				<meta
					name="description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>

				<meta name="twitter:title" content="Market — Paras" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Market — Paras" />
				<meta property="og:site_name" content="Market — Paras" />
				<meta
					property="og:description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>
			<Nav />
			<div className="max-w-6xl relative m-auto py-12 px-5">
				<div className="mb-10">
					<h1 className="text-4xl font-bold text-gray-100 mb-2">{localeLn('Categories')}</h1>
					<p className="text-xl text-gray-100">{localeLn('ExploreAllCategoriesOnParas')}</p>
				</div>
				<div className="flex flex-wrap -mx-4">
					{categories.map((category, index) => {
						return (
							<div
								key={index}
								className="rounded-md overflow-hidden mb-12 md:mb-8 w-full md:w-1/3 px-4"
							>
								<Link href={`/market/${category.category_id}`} shallow={true}>
									<a className="cursor-pointer">
										<div className="flex flex-row flex-wrap md:h-72 h-48">
											{category.token_preview.length < 3 ? (
												<div className="w-full h-full md:h-1/2 mb-4 rounded">
													<img
														className="object-cover w-full md:h-72 h-48 p-1"
														src={parseImgUrl(category?.coverImg, null, {
															width: `200`,
															useOriginal: process.env.APP_ENV === 'production' ? false : true,
														})}
													/>
												</div>
											) : (
												<>
													<div className="w-1/2 h-full md:h-1/2 mb-4 rounded">
														<img
															className="object-cover w-full md:h-72 h-48 p-1"
															src={parseImgUrl(category?.token_preview[0]?.metadata.media, null, {
																width: `200`,
																useOriginal: process.env.APP_ENV === 'production' ? false : true,
															})}
														/>
													</div>
													<div className="w-1/2 md:h-72 h-48">
														<div className="flex flex-col md:block md:h-full">
															<div className="w-full md:h-1/2">
																<img
																	className="object-cover w-full md:h-full h-24 p-1"
																	src={parseImgUrl(
																		category?.token_preview[1]?.metadata.media,
																		null,
																		{
																			width: `200`,
																			useOriginal:
																				process.env.APP_ENV === 'production' ? false : true,
																		}
																	)}
																/>
															</div>
															<div className="w-full md:h-1/2">
																<img
																	className="object-cover w-full md:h-full h-24 p-1"
																	src={parseImgUrl(
																		category?.token_preview[2]?.metadata.media,
																		null,
																		{
																			width: `200`,
																			useOriginal:
																				process.env.APP_ENV === 'production' ? false : true,
																		}
																	)}
																/>
															</div>
														</div>
													</div>
												</>
											)}
										</div>
									</a>
								</Link>
								<div className="text-white mt-4 md:mt-2">
									<Link href={`/market/${category.category_id}`} shallow={true}>
										<a className="cursor-pointer">
											<p className="text-xl hover:underline">{category.name}</p>
										</a>
									</Link>
									<div className="flex flex-row -mt-1 mb-2 text-gray-400 text-sm">
										<p className="w-32 text-sm">{localeLn('CuratedBy')}</p>
										<div className="w-full">
											<p>{category.curators.join(', ')}</p>
										</div>
									</div>
									<div className="category-description text-gray-200 max-w-lg">
										<p className="truncate text-ellipsis">{category.description_short}</p>
									</div>
								</div>
							</div>
						)
					})}
				</div>
				<ButtonScrollTop className="-mr-5" />
			</div>
			<Footer />
		</div>
	)
}

export default Categories
