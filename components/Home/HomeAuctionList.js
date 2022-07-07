import React, { useEffect, useState } from 'react'
import { useIntl } from 'hooks/useIntl'
import CardListLoader from 'components/Card/CardListLoader'
import axios from 'axios'
import TokenList from 'components/Token/TokenList'
import Link from 'next/link'

const HomeAuctionList = () => {
	const { localeLn } = useIntl()
	const _title = localeLn('LiveAuction')
	const [auctionToken, setAuctionToken] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const auctionParams = {
			is_auction: true,
			is_verified: true,
			__sort: 'ended_at::1',
			__limit: 4,
		}
		const fetchAuctionToken = async () => {
			setIsLoading(true)
			const resp = await axios.get(`${process.env.V2_API_URL}/token`, {
				params: auctionParams,
			})
			setAuctionToken(resp.data.data.results)
			setIsLoading(false)
		}
		fetchAuctionToken()
	}, [])

	return (
		<div className="my-8 w-full">
			<div className="flex w-full items-center justify-between gap-2">
				<h1 className="text-white font-semibold text-3xl capitalize">{_title}</h1>
				<Link href={`/market?is_verified=true&card_trade_type=onAuction&sort=urgentAuction`}>
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
				{!isLoading ? (
					<>
						<div className="block md:hidden">
							<TokenList tokens={auctionToken} showLike={true} displayType="small" />
						</div>
						<div className="hidden md:block">
							<TokenList tokens={auctionToken} showLike={true} />
						</div>
					</>
				) : (
					<CardListLoader length={4} />
				)}
			</div>
		</div>
	)
}

export default HomeAuctionList
