const ButtonOutline = ({ content, onClick }) => {
	return (
		<button
			className="bg-transparent border border-neutral-10 text-white p-2 rounded-lg"
			onClick={onClick}
		>
			{content}
		</button>
	)
}

export default ButtonOutline
