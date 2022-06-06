import axios from 'axios'
import useSWR from 'swr'

const useTokenSeries = ({ key, initialData, params = {} }) => {
	const fetchData = async (key) => {
		const [contractId, tokenSeriesId] = key.split('::')
		return axios
			.get(`${process.env.V2_API_URL}/token-series`, {
				params: {
					contract_id: contractId,
					token_series_id: tokenSeriesId,
					lookup_token: true,
					...params,
				},
			})
			.then((res) => res.data.data.results[0])
	}

	const { data, mutate, error } = useSWR(
		key || `${initialData.contract_id}::${initialData.token_series_id}`,
		fetchData,
		{
			fallbackData: initialData,
			revalidateOnMount: false,
			revalidateOnFocus: false,
			revalidateIfStale: false,
			revalidateOnReconnect: false,
			refreshInterval: 0,
		}
	)

	return {
		token: data,
		isLoading: !error && !data,
		isError: error,
		mutate: mutate,
	}
}

export default useTokenSeries
