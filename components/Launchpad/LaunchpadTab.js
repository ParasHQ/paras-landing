const LaunchpadTab = ({ isActive, setIsActive }) => {
	return (
		<div className="flex justify-between items-center mx-10 md:mx-0 border-2 border-gray-800 rounded-full text-sm font-thin mt-2 md:mt-0">
			<div
				className={`pr-2 pl-6 py-2 rounded-l-full ${
					isActive === 'date_next_7_days' && 'bg-primary'
				} cursor-pointer`}
				onClick={() => setIsActive('date_next_7_days')}
			>
				Next 7 days
			</div>
			<div
				className={`px-2 py-2 ${isActive === 'date_coming_soon' && 'bg-primary'} cursor-pointer`}
				onClick={() => setIsActive('date_coming_soon')}
			>
				Coming Soon
			</div>
			<div
				className={`pr-6 pl-2 py-2 ${
					isActive === 'date_live' && 'bg-primary'
				} rounded-r-full cursor-pointer`}
				onClick={() => setIsActive('date_live')}
			>
				Live
			</div>
		</div>
	)
}

export default LaunchpadTab
