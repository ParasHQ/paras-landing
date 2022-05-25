import React, { useEffect, useState } from 'react'

const LargeSVGFilter = ({ className, onClick }) => (
	<div
		className={`inline-flex cursor-pointer px-4 py-2 ${className} button-wrapper rounded-tl-md rounded-bl-md`}
		onClick={onClick}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={`icon icon-tabler icon-tabler-layout-grid rounded-tl-md rounded-bl-md`}
			width={24}
			height={24}
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke="#fff"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<rect x={4} y={4} width={6} height={6} rx={1} />
			<rect x={14} y={4} width={6} height={6} rx={1} />
			<rect x={4} y={14} width={6} height={6} rx={1} />
			<rect x={14} y={14} width={6} height={6} rx={1} />
		</svg>
	</div>
)

const SmallSVGFilter = ({ className, onClick }) => (
	<div
		className={`inline-flex cursor-pointer px-4 py-2 ${className} button-wrapper rounded-tr-md rounded-br-md`}
		onClick={onClick}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="icon icon-tabler icon-tabler-grid-dots"
			width={24}
			height={24}
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke="#fff"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<circle cx={5} cy={5} r={1} />
			<circle cx={12} cy={5} r={1} />
			<circle cx={19} cy={5} r={1} />
			<circle cx={5} cy={12} r={1} />
			<circle cx={12} cy={12} r={1} />
			<circle cx={19} cy={12} r={1} />
			<circle cx={5} cy={19} r={1} />
			<circle cx={12} cy={19} r={1} />
			<circle cx={19} cy={19} r={1} />
		</svg>
	</div>
)

const FilterDisplay = ({ type, onClickDisplay }) => {
	const [typeDisplay, setTypeDisplay] = useState()

	useEffect(() => {
		setTypeDisplay(type)
	}, [type])

	return (
		<>
			<LargeSVGFilter
				className={typeDisplay === 'large' ? `bg-dark-primary-2` : `bg-dark-primary-6`}
				onClick={() => {
					onClickDisplay('large')
				}}
			/>
			<SmallSVGFilter
				className={typeDisplay === 'small' ? `bg-dark-primary-2` : `bg-dark-primary-6`}
				onClick={() => {
					onClickDisplay('small')
				}}
			/>
		</>
	)
}

export default FilterDisplay
