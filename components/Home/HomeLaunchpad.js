import axios from 'axios'
import useSWR from 'swr'
import LaunchpadList from 'components/Launchpad/LaunchpadList'

const HomeLaunchpad = ({ showDetails }) => {
	const fetchData = () => {
		return axios(`${process.env.V2_API_URL}/launchpad/all`, {
			params: {
				launchpad_id: 'enleap',
			},
		}).then((res) => res.data.results)
	}

	const { data, isValidating } = useSWR('/launchpad/all', fetchData)
	const results = data?.filter((project) => project.status !== 'end')

	return (
		<div className="mb-8 relative">
			<div className="text-white md:flex justify-start items-center gap-4 mb-8">
				<h1 className="font-semibold text-3xl capitalize">Mint Calendar</h1>
			</div>
			<LaunchpadList showDetails={showDetails} data={results} isValidating={isValidating} />
		</div>
	)
}

export default HomeLaunchpad

export const checkPriceMintCalendar = (project) => {
	const checkLetter = RegExp(/^\p{L}/, 'u').test(project.mint_details[0].price)
	const price = project.mint_details[0].price

	if (!checkLetter && RegExp(/^[0-9a-zA-Z]+$/).test(price)) {
		return `${project.mint_details[0].price} Ⓝ`
	}
	return `${project.mint_details[0].price}`
}
