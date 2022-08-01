const ReminderCheckbox = ({ value, onChange }) => {
	return (
		<div className="text-gray-200 mt-6 flex justify-between items-center mt-2">
			<div className="mb-1">
				<div className="form-switch inline-block align-middle">
					<input
						type="checkbox"
						name={'reminder'}
						id={'reminder'}
						className="form-switch-checkbox"
						onChange={onChange}
						checked={value}
					/>
					<label className="form-switch-label" htmlFor={'reminder'}></label>
				</div>
			</div>
			<p>Remind Me Via Email</p>
		</div>
	)
}

export default ReminderCheckbox
