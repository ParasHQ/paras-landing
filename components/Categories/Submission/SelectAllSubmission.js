const SelectAllSubmission = ({
	setSelectedSubmissions,
	selectedAllSubmissions,
	setSelectedAllSubmissions,
}) => {
	const handleSelect = (e) => {
		setSelectedAllSubmissions((prev) => !prev)
		if (!e.target.checked) setSelectedSubmissions({})
	}

	return (
		<div className="px-4 pt-2 pb-1 bg-dark-primary-2 button-wrapper rounded-md flex items-center">
			<input
				type="checkbox"
				className="w-4 h-4 my-auto mr-1"
				checked={!!selectedAllSubmissions}
				onChange={(e) => handleSelect(e)}
			/>
			<h1 className="text-white font-bold text-lg select-none">Select All</h1>
		</div>
	)
}

export default SelectAllSubmission
