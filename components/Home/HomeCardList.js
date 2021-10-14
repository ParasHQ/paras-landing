import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import CardList from 'components/TokenSeries/CardList'
import CardListLoader from 'components/Card/CardListLoader'
import { useIntl } from 'hooks/useIntl'
export const HomeCardList = () => {
	const [tokenList, setTokenList] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const { localeLn } = useIntl()
	useEffect(() => {
		fetchTokenList()
	}, [])

	const fetchTokenList = async () => {
		const resp = await axios.get(`${process.env.V2_API_URL}/token-series`, {
			params: {
				is_verified: true,
				__sort: `_id::-1`,
				__limit: 4,
			},
		})
		if (resp.data.data) {
			setTokenList(resp.data.data.results)
			setIsLoading(false)
		}
	}

	return (
		<div className="mt-8 w-full">
			<div className="flex items-center justify-between">
				<p className="text-white font-semibold text-3xl">{localeLn('NewestCards')}</p>
				<Link href="/market">
					<a className="text-gray-400 hover:text-white cursor-pointer font-semibold flex items-center">
						<span>{localeLn('More')}</span>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="fill-current pl-1"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M17.5858 13.0001H3V11.0001H17.5858L11.2929 4.70718L12.7071 3.29297L21.4142 12.0001L12.7071 20.7072L11.2929 19.293L17.5858 13.0001Z"
							/>
						</svg>
					</a>
				</Link>
			</div>
			<div className="mt-4">
				{!isLoading ? <CardList tokens={tokenList} /> : <CardListLoader length={4} />}
			</div>
		</div>
	)
}
