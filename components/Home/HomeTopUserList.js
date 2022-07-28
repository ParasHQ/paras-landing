import { useEffect, useState, useRef } from 'react'
import cachios from 'cachios'
import Link from 'next/link'
import { parseImgUrl, prettyTruncate } from 'utils/common'
import LinkToProfile from 'components/LinkToProfile'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import HomeTopUsersLoader from 'components/Home/Loaders/TopUsers'
import { useIntl } from 'hooks/useIntl'
import { trackTopBuyer, trackTopCollection, trackTopSeller } from 'lib/ga'
import router from 'next/router'
import useProfileData from 'hooks/useProfileData'
import IconV from 'components/Icons/component/IconV'

const TopCollection = ({ collection, idx }) => {
	const [colDetail, setColDetail] = useState({})

	useEffect(() => {
		const fetchCollection = async () => {
			const res = await cachios.get(`${process.env.V2_API_URL}/collections`, {
				params: {
					collection_id: collection.collection_id,
				},
			})
			setColDetail(res.data.data.results[0])
		}
		fetchCollection()
	}, [])

	const onTopColllection = (e) => {
		e.preventDefault()
		trackTopCollection(collection.collection_id)
		router.push(`/collection/${collection.collection_id}`)
	}

	return (
		<div className="my-3 flex items-center">
			<p className="text-base text-gray-100 opacity-50 mr-3">{idx + 1}</p>
			<a
				href={`/collection/${collection.collection_id}`}
				onClick={onTopColllection}
				className="cursor-pointer"
			>
				<div className="flex-shrink-0 cursor-pointer w-12 h-12 rounded-full overflow-hidden bg-primary border-white border">
					<img
						src={parseImgUrl(colDetail?.media, null, {
							width: `300`,
						})}
						className="object-cover"
					/>
				</div>
			</a>
			<div className="ml-3 min-w-0">
				{collection.collection_id && (
					<div onClick={onTopColllection} className="cursor-pointer">
						<a
							href={`/collection/${collection.collection_id}`}
							onClick={(e) => e.preventDefault()}
							className="text-gray-100 border-b-2 border-transparent hover:border-gray-100 font-semibold overflow-hidden text-ellipsis truncate"
						>
							{prettyTruncate(colDetail?.collection, 20)}
						</a>
					</div>
				)}
				<p className="text-base text-gray-400">{formatNearAmount(collection.total_sum, 2)} Ⓝ</p>
			</div>
		</div>
	)
}

const TopUser = ({ user, idx, topUserType }) => {
	const profile = useProfileData(user.account_id)

	const onTopUser = (type) => {
		if (type === 'top-buyers') {
			trackTopBuyer(user.account_id)
			router.push(`/${user.account_id}`)
		} else if (type === 'top-sellers') {
			trackTopSeller(user.account_id)
			router.push(`/${user.account_id}`)
		}
	}

	return (
		<div className="my-3 flex items-center">
			<p className="text-base text-gray-100 opacity-50 mr-3">{idx + 1}</p>
			<div onClick={() => onTopUser(topUserType)}>
				<a href={`/${user.account_id}`} onClick={(e) => e.preventDefault()}>
					<div className="flex-shrink-0 cursor-pointer w-12 h-12 rounded-full overflow-hidden bg-primary border-white border">
						<img
							src={parseImgUrl(profile?.imgUrl, null, {
								width: `300`,
							})}
							className="object-cover"
						/>
					</div>
				</a>
			</div>
			<div onClick={() => onTopUser(topUserType)} className="ml-3">
				{user.account_id && (
					<LinkToProfile
						accountId={user.account_id}
						len={16}
						className="text-gray-100 hover:border-gray-100 font-semibold"
					/>
				)}
				<p className="text-base text-gray-400">{formatNearAmount(user.total_sum, 2)} Ⓝ</p>
			</div>
		</div>
	)
}

export const HomeTopUserList = ({
	activeType = 'top-collections',
	showToggle = true,
	className,
}) => {
	const { localeLn } = useIntl()
	const [topBuyerList, setTopBuyerList] = useState([])
	const [topSellerList, setTopSellerList] = useState([])
	const [topCollectionList, setTopCollectionList] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [showTopModal, setShowTopModal] = useState(false)
	const [topUserType, setTopUserType] = useState(activeType)

	const modalRef = useRef()

	useEffect(() => {
		const onClick = (e) => {
			if (!modalRef.current.contains(e.target)) {
				setShowTopModal(false)
			}
		}
		if (showTopModal) {
			document.body.addEventListener('click', onClick)
		}
		return () => {
			document.body.removeEventListener('click', onClick)
		}
	})

	useEffect(() => {
		fetchTopUsers()
	}, [])

	const onClickType = (type) => {
		setTopUserType(type)
		setShowTopModal(false)
	}

	const fetchTopUsers = async () => {
		const resp = await cachios.get(`${process.env.V2_API_URL}/activities/top-users`, {
			params: {
				__limit: 12,
			},
			ttl: 60,
		})
		if (resp.data.data) {
			setTopBuyerList(resp.data.data.buyers)
			setTopSellerList(resp.data.data.sellers)
			setTopCollectionList(resp.data.data.collections)
			setIsLoading(false)
		}
	}

	const topUserTitle = (currentType) => {
		switch (currentType) {
			case 'top-collections':
				return localeLn('TopCollections')
			case 'top-buyers':
				localeLn('TopBuyers')
				return localeLn('TopBuyers')
			case 'top-sellers':
				return localeLn('TopSellers')
		}
	}

	return (
		<div className={className}>
			<div className="w-full mt-6">
				<div className="flex items-center justify-between">
					<div ref={modalRef}>
						<div
							className={`flex items-baseline gap-2 ${showToggle ? 'cursor-pointer' : ''}`}
							onClick={() => showToggle && setShowTopModal(!showTopModal)}
						>
							<h1 className="text-white font-semibold text-3xl capitalize">
								{topUserTitle(topUserType)}
							</h1>
							{showToggle && <IconV size={18} />}
							<p className="text-white hidden md:block">in 7 days</p>
						</div>
						{showTopModal && (
							<div className="absolute max-w-full z-20 bg-dark-primary-1 px-5 py-2 rounded-md text-lg text-gray-100 w-64">
								<p
									className={`opacity-50 cursor-pointer select-none my-1
										${topUserType === 'top-collections' && 'font-semibold opacity-100'}
									`}
									onClick={() => onClickType('top-collections')}
								>
									{localeLn('TopCollections')}
								</p>
								<p
									className={`opacity-50 cursor-pointer select-none my-1
										${topUserType === 'top-buyers' && 'font-semibold opacity-100'}
									`}
									onClick={() => onClickType('top-buyers')}
								>
									{localeLn('TopBuyers')}
								</p>
								<p
									className={`opacity-50 cursor-pointer select-none my-1
										${topUserType === 'top-sellers' && 'font-semibold opacity-100'}
									`}
									onClick={() => onClickType('top-sellers')}
								>
									{localeLn('TopSellers')}
								</p>
							</div>
						)}
					</div>
					<Link href={`/activity/${topUserType}`}>
						<a className="text-gray-400 hover:text-white cursor-pointer font-semibold flex items-center">
							<span>{localeLn('More')}</span>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="fill-current pl-1"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M17.5858 13.0001H3V11.0001H17.5858L11.2929 4.70718L12.7071 3.29297L21.4142 12.0001L12.7071 20.7072L11.2929 19.293L17.5858 13.0001Z"
								/>
							</svg>
						</a>
					</Link>
				</div>
				<p className="text-white md:hidden">in 7 days</p>
				<div className="w-full md:mt-2">
					{!isLoading ? (
						<div className="w-full grid grid-rows-3 grid-flow-col py-2 pb-4 overflow-x-scroll top-user-scroll">
							{topUserType === 'top-collections' &&
								topCollectionList.map((collection, idx) => {
									return (
										<div key={idx} className="flex-shrink-0 flex-grow-0 px-2 w-72">
											<TopCollection collection={collection} idx={idx} />
										</div>
									)
								})}
							{topUserType === 'top-buyers' &&
								topBuyerList.map((user, idx) => {
									return (
										<div key={idx} className="flex-shrink-0 flex-grow-0 px-2 w-72">
											<TopUser user={user} idx={idx} topUserType={topUserType} />
										</div>
									)
								})}
							{topUserType === 'top-sellers' &&
								topSellerList.map((user, idx) => {
									return (
										<div key={idx} className="flex-shrink-0 flex-grow-0 px-2 w-72">
											<TopUser user={user} idx={idx} topUserType={topUserType} />
										</div>
									)
								})}
						</div>
					) : (
						<div>
							<HomeTopUsersLoader />
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
