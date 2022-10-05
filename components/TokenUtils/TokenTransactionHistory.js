import { IconArrowSmall } from 'components/Icons'
import IconEmptyTransactionHistory from 'components/Icons/component/IconEmptyTransactionHistory'
import { useEffect, useState } from 'react'

const HEADERS = [
	{
		id: 'type',
		title: 'Transaction Type',
		className: `flex w-4/6 lg:w-full flex-shrink-0 p-3 h-full`,
	},
	{
		id: 'id',
		title: 'Transaction ID',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-2 h-full`,
	},
	{
		id: 'price',
		title: 'Price',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-2 h-full`,
	},
	{
		id: 'buyer',
		title: 'Buyer',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-2 h-full`,
	},
	{
		id: 'seller',
		title: 'Seller',
		className: `flex flex-col md:flex-row items-center w-2/6 md:w-full md:flex-shrink-0 p-3 md:p-0 lg:p-3 md:h-full`,
	},
	{
		id: 'date',
		title: 'Date',
		className: `flex items-center w-2/6 lg:w-full flex-shrink-0 p-3 h-full`,
	},
]

const TokenTransactionHistory = () => {
	const [transactions, setTransactions] = useState([])

	useEffect(() => {}, [])

	return (
		<div className="relative max-w-6xl m-auto pt-10 pb-14">
			<div className="flex flex-row justify-between items-center mb-5">
				<div>
					<p className="font-bold text-xl text-white mb-3">Transaction History</p>
					<p className="font-thin text-sm text-white">
						Watch your NFT transaction activity and filter it by the type
					</p>
				</div>
				<div>
					<button className="flex flex-row justify-between items-center bg-neutral-05 rounded-lg p-2">
						<p className="text-white text-sm mr-40">Filter</p>
						<IconArrowSmall color={'#F9F9F9'} className="rotate-90" />
					</button>
				</div>
			</div>
			<div>
				{transactions.length <= 0 ? (
					<div className="bg-neutral-01 border border-neutral-05 rounded-lg py-10">
						<IconEmptyTransactionHistory size={150} className="mx-auto" />
					</div>
				) : (
					<div>TRANSACTION</div>
					// TODO
				)}
			</div>
		</div>
	)
}

export default TokenTransactionHistory
