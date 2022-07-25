import axios from 'axios'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Nav from 'components/Nav'
import Head from 'next/head'
import Footer from 'components/Footer'
import useStore from 'lib/store'
import CardList from 'components/TokenSeries/CardList'
import CardListLoader from 'components/Card/CardListLoader'
import { parseImgUrl, parseSortQuery, sanitizeHTML, setDataLocalStorage } from 'utils/common'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import CategoryList from 'components/CategoryList'
import AddCategoryModal from 'components/Modal/AddCategoryModal'
import { useIntl } from 'hooks/useIntl'
import ButtonScrollTop from 'components/Common/ButtonScrollTop'
import FilterMarket from 'components/Filter/FilterMarket'
import FilterDisplay from 'components/Filter/FilterDisplay'

const LIMIT = 12

export default function Category({ serverQuery, categoryList, _categoryDetail }) {
	const {
		categoryCardList,
		setCategoryCardList,
		cardCategory,
		setCardCategory,
		setMarketScrollPersist,
		pageCategoryCardList,
		setPageCategoryCardList,
		hasMoreCategoryCard,
		setHasMoreCategoryCard,
		currentUser,
	} = useStore()
	const { localeLn } = useIntl()
	const router = useRouter()
	const chooseSubmitRef = useRef()

	const [isFetching, setIsFetching] = useState(false)
	const [isFiltering, setIsFiltering] = useState(false)
	const [showAddModal, setShowAddModal] = useState(false)
	const [chooseSubmilModal, setChooseSubmitModal] = useState(false)
	const [categoryDetail, setCategoryDetail] = useState(_categoryDetail)
	const [display, setDisplay] = useState(
		(typeof window !== 'undefined' && window.localStorage.getItem('display')) || 'large'
	)

	const { categoryId } = router.query

	useEffect(() => {
		if (categoryList) {
			setCardCategory(categoryList)
		} else {
			getCategory()
		}
		return () => {
			setMarketScrollPersist('market', 0)
		}
	}, [])

	useEffect(() => {
		if (categoryId) {
			_fetchData(true)

			const detail = cardCategory.find((category) => category.category_id === categoryId)
			if (detail) {
				setCategoryDetail(detail)
			}
		}
	}, [categoryId])

	useEffect(() => {
		if (
			router.query.sort ||
			router.query.pmin ||
			router.query.pmax ||
			router.query.min_copies ||
			router.query.max_copies ||
			router.query.is_verified
		) {
			updateFilter()
		}
	}, [
		router.query.sort,
		router.query.pmin,
		router.query.pmax,
		router.query.min_copies,
		router.query.max_copies,
		router.query.is_verified,
	])

	useEffect(() => {
		const onClickEv = (e) => {
			if (!chooseSubmitRef.current?.contains(e.target)) {
				setChooseSubmitModal(false)
			}
		}
		if (chooseSubmilModal) {
			document.body.addEventListener('click', onClickEv)
		}
		return () => {
			document.body.removeEventListener('click', onClickEv)
		}
	})

	const getCategory = async () => {
		const res = await axios.get(`${process.env.V2_API_URL}/categories`)
		setCardCategory(res.data.data.results)
	}

	const updateFilter = async () => {
		setIsFiltering(true)
		await _fetchData(true)
		setIsFiltering(false)
	}

	const _fetchData = async (initial = false) => {
		const _hasMore = initial ? true : hasMoreCategoryCard[categoryId]
		const _tokens = initial ? [] : categoryCardList[categoryId]
		const _page = initial ? {} : pageCategoryCardList[categoryId]

		if (!_hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const params = tokensParams({
			...(router.query || serverQuery),
			..._page,
		})
		const res = await axios.get(`${process.env.V2_API_URL}/token-series`, {
			params: params,
		})
		const newData = await res.data.data
		const newTokens = [..._tokens, ...newData.results]
		const newCategoryData = {
			...categoryCardList,
			[categoryId]: newTokens,
		}

		const lastData = newData.results[newData.results.length - 1]
		setCategoryCardList(newCategoryData)

		if (newData.results.length < LIMIT) {
			setHasMoreCategoryCard({
				...hasMoreCategoryCard,
				[categoryId]: false,
			})
		} else {
			setHasMoreCategoryCard({
				...hasMoreCategoryCard,
				[categoryId]: true,
			})

			setPageCategoryCardList({
				...pageCategoryCardList,
				[categoryId]: {
					_id_next: lastData._id,
					updated_at_next: params.__sort.includes('updated_at') ? lastData.updated_at : null,
					lowest_price_next: params.__sort.includes('lowest_price') ? lastData.lowest_price : null,
				},
			})
		}
		setIsFetching(false)
	}

	const manageSubmission = () => {
		router.push(`/category-submission/${categoryId}`)
	}

	const onClickDisplay = (typeDisplay) => {
		setDataLocalStorage('display', typeDisplay, setDisplay)
	}

	return (
		<div className="min-h-screen bg-black">
			<div
				className="fixed inset-0 opacity-50"
				style={{
					zIndex: 0,
					backgroundImage: `url('../bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			></div>
			<Head>
				<title>{categoryDetail ? categoryDetail.name : _categoryDetail.name} — Paras</title>
				<meta
					name="description"
					content={`Create, trade, and collect ${(categoryDetail
						? categoryDetail.name
						: _categoryDetail.name
					).toLowerCase()} NFT digital card collectibles`}
				/>

				<meta
					name="twitter:title"
					content={`${categoryDetail ? categoryDetail.name : _categoryDetail.name} — Paras`}
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content={`Create, trade, and collect ${(categoryDetail
						? categoryDetail.name
						: _categoryDetail.name
					).toLowerCase()} NFT digital card collectibles`}
				/>
				<meta
					name="twitter:image"
					content={parseImgUrl(categoryDetail ? categoryDetail.coverImg : _categoryDetail.coverImg)}
				/>
				<meta property="og:type" content="website" />
				<meta
					property="og:title"
					content={`${categoryDetail ? categoryDetail.name : _categoryDetail.name} — Paras`}
				/>
				<meta
					property="og:site_name"
					content={`${categoryDetail ? categoryDetail.name : _categoryDetail.name} — Paras`}
				/>
				<meta
					property="og:description"
					content={`Create, trade, and collect ${(categoryDetail
						? categoryDetail.name
						: _categoryDetail.name
					).toLowerCase()} NFT digital card collectibles`}
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content={parseImgUrl(categoryDetail ? categoryDetail.coverImg : _categoryDetail.coverImg)}
				/>
			</Head>
			<Nav />
			{showAddModal && (
				<AddCategoryModal
					onClose={() => setShowAddModal(false)}
					categoryName={categoryDetail.name}
					categoryId={categoryId}
					curators={categoryDetail.curators}
				/>
			)}
			<div className="max-w-6xl relative m-auto py-12">
				<div className="grid grid-cols-3 mb-4">
					<h1 className="col-start-1 md:col-start-2 col-span-2 md:col-span-1 pl-5 md:pl-0 text-4xl font-bold text-gray-100 text-left md:text-center">
						{localeLn('Market')}
					</h1>
					<div className="flex items-center justify-end">
						<div className="grid justify-items-end">
							<FilterMarket />
						</div>
						<div className="flex mr-4 md:mx-4">
							<FilterDisplay type={display} onClickDisplay={onClickDisplay} />
						</div>
					</div>
				</div>
				<CategoryList categoryId={categoryDetail?.category_id || ''} listCategory={cardCategory} />
				<div className="md:flex justify-between mt-8 px-4">
					{categoryDetail && (
						<>
							<div className="mb-8 md:mb-0">
								<h1 className="text-gray-100 font-bold text-4xl mb-4">{categoryDetail.name}</h1>
								<div
									className="category-description text-gray-200 max-w-lg"
									dangerouslySetInnerHTML={{
										__html: sanitizeHTML(categoryDetail.description),
									}}
								></div>
							</div>
							<div className="text-gray-100 md:w-1/3 my-4 relative">
								<div className="flex justify-between mb-4">
									<div>{localeLn('Status')}</div>
									<div className="font-medium">{localeLn('Open')}</div>
								</div>
								<div className="flex justify-between mb-6">
									<div>{localeLn('Curators')}</div>
									<div className="text-right font-medium">
										{categoryDetail.curators.map((curator, index) => (
											<Fragment key={index}>
												<span className="cursor-pointer" onClick={() => router.push(`/${curator}`)}>
													{curator}
												</span>
												{index !== categoryDetail.curators.length - 1 && <span>, </span>}
											</Fragment>
										))}
									</div>
								</div>
								<div className="flex">
									<button
										className="w-full outline-none rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
										onClick={() => setChooseSubmitModal(true)}
										type="button"
									>
										{`Submit to ${categoryDetail.name}`}
									</button>
									{categoryDetail.curators.includes(currentUser) && (
										<button
											className="ml-4 w-full outline-none rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-white text-white"
											onClick={manageSubmission}
											type="button"
										>
											{`Manage Submission`}
										</button>
									)}
								</div>
								{chooseSubmilModal && (
									<div
										ref={chooseSubmitRef}
										className="absolute w-full z-20 mt-2 right-0 shadow-lg"
									>
										<div className="bg-dark-primary-2 rounded-t-md p-4">
											<h1
												className="text-white font-medium cursor-pointer"
												onClick={() => {
													setChooseSubmitModal(false)
													setShowAddModal(true)
												}}
											>
												{localeLn('SubmitExistingCards')}
											</h1>
										</div>
										<div className="bg-dark-primary-2 rounded-b-md p-4">
											<h1
												className="text-white font-medium cursor-pointer"
												onClick={() => {
													router.push(
														`/new?category_name=${categoryDetail.name}&category_id=${categoryDetail.category_id}`
													)
												}}
											>
												Submit a new card
											</h1>
										</div>
									</div>
								)}
							</div>
						</>
					)}
				</div>
				<div className="mt-8 px-4">
					{!categoryCardList[categoryId] || isFiltering ? (
						<div className="min-h-full">
							<CardListLoader />
						</div>
					) : (
						<CardList
							name="market"
							tokens={categoryCardList[categoryId] || []}
							fetchData={_fetchData}
							hasMore={hasMoreCategoryCard[categoryId]}
							showLike={true}
							displayType={display}
						/>
					)}
				</div>
				<ButtonScrollTop />
			</div>
			<Footer />
		</div>
	)
}

const tokensParams = (query) => {
	const parsedSortQuery = parseSortQuery(query.sort)
	const params = {
		category_id: query.categoryId,
		exclude_total_burn: true,
		__sort: parsedSortQuery,
		__limit: LIMIT,
		is_verified: typeof query.is_verified !== 'undefined' ? query.is_verified : true,
		lookup_token: true,
		...(query.pmin && { min_price: parseNearAmount(query.pmin) }),
		...(query.pmax && { max_price: parseNearAmount(query.pmax) }),
		...(query._id_next && { _id_next: query._id_next }),
		...(query.lowest_price_next &&
			parsedSortQuery.includes('lowest_price') && { lowest_price_next: query.lowest_price_next }),
		...(query.updated_at_next &&
			parsedSortQuery.includes('updated_at') && { updated_at_next: query.updated_at_next }),
		...(query.min_copies && { min_copies: query.min_copies }),
		...(query.max_copies && { max_copies: query.max_copies }),
	}
	return params
}

export async function getServerSideProps({ params, query }) {
	const categoryListResp = await axios(`${process.env.V2_API_URL}/categories`)
	const categoryList = categoryListResp.data.data.results
	const categoryDetail = categoryList.filter(
		(category) => category.category_id === params.categoryId
	)[0]

	return {
		props: {
			categoryList: categoryList,
			_categoryDetail: categoryDetail,
			serverQuery: query,
		},
	}
}
