import axios from 'axios'
import useSWR from 'swr'
import LaunchpadList from 'components/Launchpad/LaunchpadList'

const HomeLaunchpad = ({ showDetails }) => {
	const fetchData = () => {
		return axios(`${process.env.V2_API_URL}/launchpad`).then((res) => res.data.results)
	}

	const { data, isValidating } = useSWR('launchpad', fetchData)

	return (
		<div className="mb-8 relative">
			<div className="text-white md:flex justify-start items-center gap-4 mb-8">
				<h1 className="font-semibold text-3xl capitalize">Mint Calendar</h1>
			</div>
			<LaunchpadList showDetails={showDetails} data={data} isValidating={isValidating} />
		</div>
	)
}

export default HomeLaunchpad
