import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'hooks/useIntl'
import InputDropdown from 'components/Common/form/components/InputDropdown'

const FilterMarket = ({
	isShowVerified = true,
	isShowNotForSale = true,
	isCollectibles = false,
	defaultMinPrice = false,
	isCollection = false,
	isShowStaked = false,
	isLikedTab = false,
}) => {
	const filterModalRef = useRef()
	const router = useRouter()

	const [showFilterModal, setShowFilterModal] = useState(false)
	const [sortBy, setSortBy] = useState(router.query.sort || filter[0].key)
	const [minPrice, setMinPrice] = useState(router.query.pmin || '')
	const [maxPrice, setMaxPrice] = useState(router.query.pmax || '')
	const [sortCopies, setSortCopies] = useState(
		router.query.min_copies === undefined ? 'undefined' : router.query.min_copies
	)
	const [isVerified, setIsVerified] = useState(
		router.query.is_verified ? router.query.is_verified === 'true' : true
	)
	const [cardTradeType, setCardTradeType] = useState(
		router.query.card_trade_type ? router.query.card_trade_type : 'all'
	)
	const [isStaked, setIsStaked] = useState(
		router.query.is_staked ? router.query.is_staked === 'true' : false
	)
	const { localeLn } = useIntl()

	useEffect(() => {
		const onClickEv = (e) => {
			if (filterModalRef.current?.contains && !filterModalRef.current.contains(e.target)) {
				setShowFilterModal(false)
			}
		}
		if (showFilterModal) {
			document.body.addEventListener('click', onClickEv)
		}
		return () => {
			document.body.removeEventListener('click', onClickEv)
		}
	}, [showFilterModal])

	// update filter state based on query
	useEffect(() => {
		if (router.pathname === '/search') {
			setSortBy(defaultMinPrice ? filter[3].key : filter[0].key)
			setMinPrice('')
			setMaxPrice('')
		} else {
			if (router.query.sort) {
				setSortBy(router.query.sort)
			} else {
				setSortBy(isCollectibles ? filter[1].key : defaultMinPrice ? filter[3].key : filter[0].key)
			}
			if (router.query.pmin && router.query.pmin !== '0') {
				setMinPrice(router.query.pmin)
			} else {
				setMinPrice('')
			}
			if (router.query.pmax) {
				setMaxPrice(router.query.pmax)
			} else {
				setMaxPrice('')
			}
			if (router.query.min_copies) {
				setSortCopies(router.query.min_copies)
			} else {
				setSortCopies('undefined')
			}
			if (router.query.is_verified) {
				setIsVerified(router.query.is_verified === 'true')
			} else {
				setIsVerified(true)
			}
			if (router.query.card_trade_type) {
				setCardTradeType(router.query.card_trade_type)
			} else {
				setCardTradeType('all')
			}
			if (router.query.is_staked) {
				setIsStaked(router.query.is_staked === 'true')
			} else {
				setIsStaked(false)
			}
		}
	}, [router.query])

	const onClickApply = async () => {
		const query = {
			...router.query,
			sort: sortBy,
			...(minPrice && { pmin: minPrice }),
			...(maxPrice && { pmax: maxPrice }),
			...(isShowVerified && { is_verified: isVerified }),
			...(isShowNotForSale && { card_trade_type: cardTradeType }),
			...(isShowStaked && { is_staked: isStaked }),
		}

		if (minPrice === '') {
			delete query.pmin
		}
		if (maxPrice === '') {
			delete query.pmax
		}

		if (sortCopies === 'undefined') {
			delete query.min_copies
			delete query.max_copies
		} else if (sortCopies === '1') {
			query.min_copies = 1
			query.max_copies = 1
		} else if (sortCopies === '2') {
			query.min_copies = 2
			delete query.max_copies
		}

		if (cardTradeType === 'forSale' && minPrice === '') query.pmin = 0

		if (cardTradeType === 'notForSale') {
			delete query.pmin
			delete query.pmax
		}

		if (query.sort === 'urgentAuction') {
			query.card_trade_type = 'onAuction'
		}

		router.push(
			{
				query: query,
			},
			undefined,
			{ shallow: true, scroll: false }
		)
		setShowFilterModal(false)
	}

	return (
		<div ref={filterModalRef} className="inline-block">
			<div
				className="mx-4 inline-flex cursor-pointer px-4 py-2 bg-dark-primary-2 button-wrapper rounded-md"
				onClick={() => setShowFilterModal(!showFilterModal)}
			>
				<svg viewBox="0 0 24 24" width="24" height="24" fill="white" className="inline-block mr-1">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M5.14 9H4a1 1 0 110-2h1.14a4 4 0 017.72 0H20a1 1 0 110 2h-7.14a4 4 0 01-7.72 0zm4.971-2.663A2 2 0 107.89 9.663a2 2 0 002.222-3.326zM18.86 15H20a1 1 0 110 2h-1.14a4 4 0 01-7.72 0H4a1 1 0 010-2h7.14a4 4 0 017.72 0zm-4.971 2.663a2 2 0 102.222-3.325 2 2 0 00-2.222 3.325z"
					></path>
				</svg>
				<h1 className="text-white font-semibold text-xl select-none hidden md:inline-block">
					{localeLn('Filter')}
				</h1>
			</div>
			{showFilterModal && (
				<div
					className="absolute w-96 z-20 mt-2 px-4 right-0"
					style={{
						width: `24rem`,
					}}
				>
					<div className="bg-dark-primary-2 rounded-md p-4">
						<h1 className="text-white font-semibold text-xl">{localeLn('SortBy')}</h1>
						<div>
							{filter
								.filter((item) => (isCollectibles ? item.key !== 'marketupdate' : item.key))
								.filter((item) => (!isCollection ? item.key !== 'scoredesc' : item))
								.map((item, index) => (
									<button
										key={item.key}
										className={`rounded-md text-white px-3 py-1 inline-block mb-2 mr-2 border-2 border-[#1B4FA7] border-opacity-[50%] ${
											sortBy === item.key && 'bg-[#1B4FA7] bg-opacity-[50%]'
										}`}
										onClick={() => setSortBy(item.key)}
									>
										<p>{isLikedTab && index === 1 ? 'Card Liked' : item.value}</p>
									</button>
								))}
						</div>
						{cardTradeType !== 'notForSale' && (
							<>
								<h1 className="text-white font-semibold text-xl mt-2">{localeLn('Price')}</h1>
								<form onSubmit={onClickApply} className={`flex w-full space-x-2 mb-2`}>
									<div className="flex w-1/2 bg-gray-300 p-2 rounded-md focus:bg-gray-100 ">
										<input
											type="number"
											value={minPrice}
											onChange={(e) => setMinPrice(e.target.value)}
											className="clear pr-2"
											placeholder="Minimum"
										/>
										<div className="inline-block">Ⓝ</div>
									</div>
									<div className="flex w-1/2 bg-gray-300 p-2 rounded-md focus:bg-gray-100 ">
										<input
											type="number"
											value={maxPrice}
											onChange={(e) => setMaxPrice(e.target.value)}
											className="clear pr-2"
											placeholder="Maximum"
										/>
										<div className="inline-block">Ⓝ</div>
									</div>
									<input type="submit" className="hidden" />
								</form>
							</>
						)}
						{!isCollectibles && (
							<h1 className="text-white font-semibold text-xl mt-4">{localeLn('CopiesOfCard')}</h1>
						)}
						{!isCollectibles &&
							filterCopies.map((item) => (
								<button
									key={item.key}
									className={`rounded-md text-white px-3 py-1 inline-block mr-2 border-2 border-[#1B4FA7] border-opacity-[50%] ${
										sortCopies === item.key && 'bg-[#1B4FA7] bg-opacity-[50%]'
									}`}
									onClick={() => setSortCopies(item.key)}
								>
									<p>{item.value}</p>
								</button>
							))}
						{isShowVerified && (
							<label htmlFor="put-marketplace">
								<div className="mt-3 flex items-center justify-between">
									<h1 className="text-white font-semibold text-xl">Verified Only</h1>
									<input
										id="put-marketplace"
										className="w-auto"
										type="checkbox"
										defaultChecked={isVerified}
										onChange={() => {
											setIsVerified(!isVerified)
										}}
									/>
								</div>
							</label>
						)}
						{isShowNotForSale && (
							<label htmlFor="put-forsale-only">
								<div className="mt-3 flex items-center justify-between">
									<h1 className="text-white font-semibold text-xl">Type</h1>
									<InputDropdown
										data={[
											{ id: 'all', label: 'All' },
											{ id: 'forSale', label: 'Sale Only' },
											{ id: 'notForSale', label: 'Not for Sale' },
											{ id: 'onAuction', label: 'On Auction' },
											{ id: 'ownedByCreator', label: 'Owned by Creator' },
										]}
										defaultValue={cardTradeType}
										selectItem={setCardTradeType}
									/>
								</div>
							</label>
						)}
						{isCollectibles && (
							<label htmlFor="put-isstaked-only">
								<div className="mt-2 flex items-center justify-between">
									<h1 className="text-white font-semibold text-xl mt-2">Staked Only</h1>
									<input
										id="put-isstaked-only"
										className="w-auto"
										type="checkbox"
										defaultChecked={isStaked}
										onChange={() => setIsStaked(!isStaked)}
									/>
								</div>
							</label>
						)}

						<button
							onClick={onClickApply}
							className="w-full outline-none mt-4 rounded-md bg-transparent text-sm font-semibold py-2 bg-primary text-gray-100"
						>
							{localeLn('Apply')}
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

const filter = [
	{
		key: 'marketupdate',
		value: 'Market Update',
	},
	// {
	// 	key: 'marketupdateasc',
	// 	value: 'Market Update asc',
	// },
	{
		key: 'cardcreate',
		value: 'Card Created',
	},
	// {
	// 	key: 'cardcreateasc',
	// 	value: 'Card Created asc',
	// },
	{
		key: 'pricedesc',
		value: 'Highest Price',
	},
	{
		key: 'priceasc',
		value: 'Lowest Price',
	},
	{
		key: 'scoredesc',
		value: 'Rare to Common',
	},
	{
		key: 'urgentAuction',
		value: 'Ended Soonest Auction',
	},
]

const filterCopies = [
	{
		key: 'undefined',
		value: 'All',
	},
	{
		key: '1',
		value: '1 of 1',
	},
	{
		key: '2',
		value: 'Multiple',
	},
]

export default FilterMarket
