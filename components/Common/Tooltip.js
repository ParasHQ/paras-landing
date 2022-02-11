import ReactTooltip from 'react-tooltip'

const Tooltip = ({
	id = '',
	show,
	children,
	place = 'right',
	type = 'dark',
	effect = 'solid',
	className,
	text = '',
}) => {
	return (
		<>
			{show && (
				<ReactTooltip
					place={place}
					type={type}
					effect={effect}
					id={id}
					className={`w-80 text-sm ${className}`}
				/>
			)}
			<div data-tip={text} data-for={id} className="cursor-default">
				{children}
			</div>
		</>
	)
}

export default Tooltip
