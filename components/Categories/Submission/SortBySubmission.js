import { IconSortArrowLight } from 'components/Icons'
import { SORT_BY_SUBMISSION } from 'constants/submission'
import { useState } from 'react'
import clsx from 'clsx'

const SortBySubmission = ({ sortAttributes, setSortAttributes }) => {
	const [showTooltip, setShowTooltip] = useState(false)

	const onChangeSort = (id) => {
		setSortAttributes(id)
	}
	return (
		<div className="relative">
			{showTooltip && <div className="fixed inset-0 z-0" onClick={() => setShowTooltip(false)} />}
			<div
				className="px-4 pt-2 pb-1 bg-dark-primary-2 button-wrapper rounded-md flex items-center cursor-pointer"
				onClick={() => setShowTooltip((prev) => !prev)}
			>
				<IconSortArrowLight size={18} color="white" className="mr-1" />
				<h1 className="text-white font-bold text-lg">Sort By</h1>
			</div>
			{showTooltip && (
				<div className="flex flex-col absolute top-full mt-2 right-0 z-10 rounded-md bg-dark-primary-2 space-y-2 p-2 text-white text-sm font-normal cursor-pointer">
					{SORT_BY_SUBMISSION.map((data, index) => {
						return (
							<div
								key={index}
								className={clsx(
									`p-2 rounded-md hover:bg-cyan-blue-1 whitespace-nowrap`,
									sortAttributes === data.id && `bg-cyan-blue-1`
								)}
								onClick={() => onChangeSort(data.id)}
							>
								{data.title}
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}

export default SortBySubmission
