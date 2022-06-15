import axios from 'axios'
import useSWR from 'swr'

const useTokenOrTokenSeries = ({ key, args = {}, params = {} }) => {
	const fetchData = async (key) => {
		const [contractId, token] = key.split('::')
		const [tokenSeriesId, tokenId] = token.split('/')
		const reqUrl = tokenId ? 'token' : 'token-series'
		return axios
			.get(`${process.env.V2_API_URL}/${reqUrl}`, {
				params: {
					contract_id: contractId,
					token_series_id: tokenSeriesId,
					token_id: tokenId,
					...params,
				},
			})
			.then((res) => res.data.data.results[0])
	}

	const { data, mutate, error } = useSWR(key, fetchData, {
		revalidateOnFocus: false,
		revalidateIfStale: false,
		revalidateOnReconnect: false,
		refreshInterval: 0,
		...args,
	})

	return {
		token: data,
		isLoading: !error && !data,
		isError: error,
		mutate: mutate,
	}
}

export default useTokenOrTokenSeries
