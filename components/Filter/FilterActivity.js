import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'hooks/useIntl'
const FilterActivity = ({ onClickFilter }) => {
	const filterModalRef = useRef()
	const router = useRouter()

	const [showFilterModal, setShowFilterModal] = useState(false)
	const [filterBy, setFilterBy] = useState(router.query.filter || filter[1].key)
	const [minPrice, setMinPrice] = useState(router.query.pmin || '')
	const [maxPrice, setMaxPrice] = useState(router.query.pmax || '')
	const [isVerified, setIsVerified] = useState(
		router.query.is_verified ? router.query.is_verified === 'true' : true
	)
	const { localeLn } = useIntl()
	useEffect(() => {
		const onClickEv = (e) => {
			if (!filterModalRef.current.contains(e.target)) {
				setShowFilterModal(false)
			}
		}
		if (showFilterModal) {
			document.body.addEventListener('click', onClickEv)
		}
		return () => {
			document.body.removeEventListener('click', onClickEv)
		}
	})

	const onClickApply = async () => {
		const query = {
			filter: filterBy,
			is_verified: isVerified,
			...(minPrice && { pmin: minPrice }),
			...(maxPrice && { pmax: maxPrice }),
		}
		router.push({ query })
		onClickFilter(query)
		setShowFilterModal(false)
	}

	return (
		<div ref={filterModalRef} className="inline-block">
			<div
				className="inline-flex cursor-pointer px-4 py-2 bg-dark-primary-2 button-wrapper rounded-md"
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
					className="absolute max-w-full z-40 mt-2 px-4 right-0"
					style={{
						width: `24rem`,
					}}
				>
					<div className="bg-dark-primary-2 rounded-md p-4">
						<h1 className="text-white font-semibold text-xl">{localeLn('FilterBy')}</h1>
						<div>
							{filter.map((item) => (
								<button
									key={item.key}
									className={`rounded-md text-white px-2 py-1 inline-block mb-2 mr-2 border-2 border-[#1B4FA7] border-opacity-[50%] ${
										filterBy === item.key && 'bg-[#1B4FA7] bg-opacity-[50%]'
									}`}
									onClick={() => setFilterBy(item.key)}
								>
									<p>{item.value}</p>
								</button>
							))}
						</div>
						<h1 className="text-white font-semibold text-xl mt-2">{localeLn('Price')}</h1>
						<form onSubmit={onClickApply} className={`flex w-full space-x-2`}>
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
						<label htmlFor="put-verified-only">
							<div className="mt-2 flex items-center justify-between">
								<h1 className="text-white font-semibold text-xl mt-2">Verified Only</h1>
								<input
									id="put-verified-only"
									className="w-auto"
									type="checkbox"
									defaultChecked={isVerified}
									onChange={() => setIsVerified(!isVerified)}
								/>
							</div>
						</label>
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
		key: 'showAll',
		value: 'Show All',
	},
	{
		key: 'market_sales',
		value: 'Market Sales',
	},
	{
		key: 'market_update',
		value: 'Market Update',
	},
	{
		key: 'nft_create_series',
		value: 'Series Creation',
	},
	{
		key: 'gift',
		value: 'NFT Transfer',
	},
	{
		key: 'mint',
		value: 'NFT Mint',
	},
	{
		key: 'burn',
		value: 'NFT Burn',
	},
	{
		key: 'offer',
		value: 'NFT Offer',
	},
	{
		key: 'bid',
		value: 'NFT Auction',
	},
]

export default FilterActivity
