import axios from 'axios'
import useSWR from 'swr'

const useProfileSWR = ({ key, initialData, args = {}, params = {} }) => {
	const fetchData = async (key) => {
		if (!key) {
			return
		}
		return axios
			.get(`${process.env.V2_API_URL}/profiles`, {
				params: {
					accountId: key,
					...params,
				},
			})
			.then((res) => res.data.data.results[0])
	}

	const { data, mutate, error } = useSWR(key, fetchData, {
		fallbackData: initialData,
		revalidateOnFocus: false,
		revalidateIfStale: false,
		revalidateOnReconnect: false,
		refreshInterval: 0,
		...args,
	})

	return {
		profile: data,
		isLoading: !error && !data,
		isError: error,
		mutate: mutate,
	}
}

export default useProfileSWR
