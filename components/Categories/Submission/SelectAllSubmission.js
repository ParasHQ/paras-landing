const SelectAllSubmission = ({ submissionsData, selectedSubmissions, setSelectedSubmissions }) => {
	const handleSelect = (e) => {
		if (!e.target.checked) setSelectedSubmissions({})
		else
			submissionsData.map((submission) => {
				setSelectedSubmissions((prev) => ({
					...prev,
					[submission._id]: !prev[submission._id] ? true : e.target.checked,
				}))
			})
	}

	return (
		<div className="px-4 pt-2 pb-1 bg-dark-primary-2 button-wrapper rounded-md flex items-center">
			<input
				type="checkbox"
				className="w-4 h-4 my-auto mr-1"
				checked={
					Object.keys(selectedSubmissions).length !== 0 &&
					Object.keys(selectedSubmissions).length === submissionsData.length &&
					Object.keys(selectedSubmissions).every(
						(selectedSubmission) =>
							submissionsData.map((data) => data._id).includes(selectedSubmission) &&
							selectedSubmissions[selectedSubmission] === true
					)
				}
				onChange={(e) => handleSelect(e)}
			/>
			<h1 className="text-white font-bold text-lg select-none">Select All</h1>
		</div>
	)
}

export default SelectAllSubmission
