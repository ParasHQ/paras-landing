import axios from 'axios'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Nav from '../../components/Nav'
import Head from 'next/head'
import Footer from '../../components/Footer'
import useStore from '../../lib/store'
import CardList from '../../components/CardList'
import CardListLoader from '../../components/CardListLoader'
import { parseImgUrl, parseSortQuery } from '../../utils/common'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import CategoryList from '../../components/CategoryList'
import AddCategoryModal from '../../components/AddCategoryModal'
import { useToast } from '../../hooks/useToast'

const LIMIT = 12

export default function Category({ categoryList, _categoryDetail }) {
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
		userProfile,
		currentUser,
	} = useStore()
	const router = useRouter()
	const chooseSubmitRef = useRef()
	const toast = useToast()

	const [isFetching, setIsFetching] = useState(false)
	const [isFiltering, setIsFiltering] = useState(false)
	const [showAddModal, setShowAddModal] = useState(false)
	const [chooseSubmilModal, setChooseSubmitModal] = useState(false)
	const [categoryDetail, setCategoryDetail] = useState(_categoryDetail)

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

			const detail = cardCategory.find(
				(category) => category.category_id === categoryId
			)
			if (detail) {
				setCategoryDetail(detail)
			}
		}
	}, [categoryId])

	useEffect(() => {
		if (router.query.sort || router.query.pmin || router.query.pmax) {
			updateFilter()
		}
	}, [router.query.sort, router.query.pmin, router.query.pmax])

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
		const _page = initial ? 0 : pageCategoryCardList[categoryId]

		if (!_hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios.get(`${process.env.V2_API_URL}/token-series`, {
			params: tokensParams(_page, router.query),
		})
		const newData = await res.data.data
		const newTokens = [..._tokens, ...newData.results]
		const newCategoryData = {
			...categoryCardList,
			[categoryId]: newTokens,
		}

		setCategoryCardList(newCategoryData)
		setPageCategoryCardList({
			...pageCategoryCardList,
			[categoryId]: _page + 1,
		})
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
		}
		setIsFetching(false)
	}

	const manageSubmission = () => {
		router.push(`/category-submission/${categoryId}`)
	}

	const createCard = () => {
		if (process.env.APP_ENV !== 'production') {
			router.push(`/new?categoryId=${categoryId}`)
		} else if (userProfile.isCreator) {
			router.push(`/new?categoryId=${categoryId}`)
		} else {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						<p>
							Currently we only allow whitelisted Artist to create their digital
							art card on Paras.
						</p>
						<p className="mt-2">Apply now using the link below:</p>
						<div className="mt-2">
							<a
								href="https://forms.gle/QsZHqa2MKXpjckj98"
								target="_blank"
								className="cursor-pointer border-b-2 border-gray-900"
							>
								Apply as an Artist
							</a>
						</div>
					</div>
				),
				type: 'info',
				duration: null,
			})
		}
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
				<title>
					{categoryDetail ? categoryDetail.name : _categoryDetail.name} — Paras
				</title>
				<meta
					name="description"
					content={`Create, trade, and collect ${(categoryDetail
						? categoryDetail.name
						: _categoryDetail.name
					).toLowerCase()} digital card collectibles`}
				/>

				<meta
					name="twitter:title"
					content={`${
						categoryDetail ? categoryDetail.name : _categoryDetail.name
					} — Paras`}
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content={`Create, trade, and collect ${(categoryDetail
						? categoryDetail.name
						: _categoryDetail.name
					).toLowerCase()} digital card collectibles`}
				/>
				<meta
					name="twitter:image"
					content={parseImgUrl(
						categoryDetail ? categoryDetail.coverImg : _categoryDetail.coverImg
					)}
				/>
				<meta property="og:type" content="website" />
				<meta
					property="og:title"
					content={`${
						categoryDetail ? categoryDetail.name : _categoryDetail.name
					} — Paras`}
				/>
				<meta
					property="og:site_name"
					content={`${
						categoryDetail ? categoryDetail.name : _categoryDetail.name
					} — Paras`}
				/>
				<meta
					property="og:description"
					content={`Create, trade, and collect ${(categoryDetail
						? categoryDetail.name
						: _categoryDetail.name
					).toLowerCase()} digital card collectibles`}
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content={parseImgUrl(
						categoryDetail ? categoryDetail.coverImg : _categoryDetail.coverImg
					)}
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
				<div className="flex justify-center mb-4">
					<h1 className="text-4xl font-bold text-gray-100 text-center">
						Market
					</h1>
				</div>
				<CategoryList
					categoryId={categoryDetail?.category_id || ''}
					listCategory={cardCategory}
				/>
				<div className="md:flex justify-between mt-8 px-4">
					{categoryDetail && (
						<>
							<div className="mb-8 md:mb-0">
								<h1 className="text-gray-100 font-bold text-4xl mb-4">
									{categoryDetail.name}
								</h1>
								<div
									className="category-description text-gray-200 max-w-lg"
									dangerouslySetInnerHTML={{
										__html: categoryDetail.description,
									}}
								></div>
							</div>
							<div className="text-gray-100 md:w-1/3 my-4 relative">
								<div className="flex justify-between mb-4">
									<div>Status</div>
									<div className="font-medium">Open</div>
								</div>
								<div className="flex justify-between mb-6">
									<div>Curators</div>
									<div className="text-right font-medium">
										{categoryDetail.curators.map((curator, index) => (
											<Fragment key={index}>
												<span
													className="cursor-pointer"
													onClick={() => router.push(`/${curator}`)}
												>
													{curator}
												</span>
												{index !== categoryDetail.curators.length - 1 && (
													<span>, </span>
												)}
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
										<div className="bg-dark-primary-2 rounded-md p-4">
											<h1
												className="text-white font-medium cursor-pointer"
												onClick={() => {
													setChooseSubmitModal(false)
													setShowAddModal(true)
												}}
											>
												Submit an existing cards
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
						<div className="min-h-full border-2 border-dashed border-gray-800 rounded-md">
							<CardListLoader />
						</div>
					) : (
						<CardList
							name="market"
							tokens={categoryCardList[categoryId] || []}
							fetchData={_fetchData}
							hasMore={hasMoreCategoryCard[categoryId]}
						/>
					)}
				</div>
			</div>
			<Footer />
		</div>
	)
}

const tokensParams = (_page = 0, query) => {
	const params = {
		category_id: query.categoryId,
		exclude_total_burn: true,
		__sort: parseSortQuery(query.sort),
		__skip: _page * LIMIT,
		__limit: LIMIT,
		...(query.pmin && { minPrice: parseNearAmount(query.pmin) }),
		...(query.pmax && { maxPrice: parseNearAmount(query.pmax) }),
	}
	return params
}

export async function getServerSideProps({ params }) {
	const categoryListResp = await axios(`${process.env.V2_API_URL}/categories`)
	const categoryList = categoryListResp.data.data.results
	const categoryDetail = categoryList.filter(
		(category) => category.category_id === params.categoryId
	)[0]

	return {
		props: {
			categoryList: categoryList,
			_categoryDetail: categoryDetail,
		},
	}
}
