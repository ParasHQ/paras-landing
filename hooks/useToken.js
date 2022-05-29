import axios from 'axios'
import useSWR from 'swr'

const useToken = ({ key, initialData, args = {}, params = {} }) => {
	const fetchData = async (key) => {
		const [contractId, token] = key.split('::')
		const [tokenSeriesId, tokenId] = token.split('/')
		return axios
			.get(`${process.env.V2_API_URL}/token`, {
				params: {
					contract_id: contractId,
					token_series_id: tokenSeriesId,
					token_id: tokenId,
					...params,
				},
			})
			.then((res) => res.data.data.results[0])
	}

	const { data, mutate, error } = useSWR(
		key || `${initialData.contract_id}::${initialData.token_series_id}/${initialData.token_id}`,
		fetchData,
		{
			fallbackData: initialData,
			revalidateOnMount: false,
			revalidateOnFocus: false,
			revalidateIfStale: false,
			revalidateOnReconnect: false,
			refreshInterval: 0,
			...args,
		}
	)

	return {
		token: data,
		isLoading: !error && !data,
		isError: error,
		mutate: mutate,
	}
}

export default useToken
