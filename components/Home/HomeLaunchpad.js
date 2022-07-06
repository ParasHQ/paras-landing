import axios from 'axios'
import useSWR from 'swr'
import { useState } from 'react'
import LaunchpadTab from 'components/Launchpad/LaunchpadTab'
import LaunchpadList from 'components/Launchpad/LaunchpadList'

const HomeLaunchpad = ({ showDetails }) => {
	const [isActive, setIsActive] = useState('date_next_7_days')

	const fetchData = (activeType) => {
		return axios(`${process.env.V2_API_URL}/launchpad`, {
			params: {
				__filter: activeType,
			},
		}).then((res) => res.data.results)
	}

	const { data: nextDays, isValidating: isValidatingNextDays } = useSWR(
		'date_next_7_days',
		fetchData
	)
	const { data: comingSoon, isValidating: isValidatingComingSoon } = useSWR(
		'date_coming_soon',
		fetchData
	)
	const { data: live, isValidating: isValidatingLive } = useSWR('date_live', fetchData)

	return (
		<div className="mb-8 relative">
			<div className="text-white md:flex justify-start items-center gap-4 mb-8">
				<h1 className="font-semibold text-3xl capitalize">Mint Calendar</h1>
				<LaunchpadTab isActive={isActive} setIsActive={(e) => setIsActive(e)} />
			</div>
			{isActive === 'date_next_7_days' && (
				<LaunchpadList
					showDetails={showDetails}
					data={nextDays}
					validating={isValidatingNextDays}
				/>
			)}
			{isActive === 'date_coming_soon' && (
				<LaunchpadList
					showDetails={showDetails}
					data={comingSoon}
					validating={isValidatingComingSoon}
				/>
			)}
			{isActive === 'date_live' && (
				<LaunchpadList showDetails={showDetails} data={live} validating={isValidatingLive} />
			)}
		</div>
	)
}

export default HomeLaunchpad
