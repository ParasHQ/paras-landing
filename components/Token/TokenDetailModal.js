import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import TokenDetail from './TokenDetail'
import Modal from 'components/Modal'
import { useIntl } from 'hooks/useIntl'
import { IconArrow } from 'components/Icons'

function TokenDetailModal({ tokens = [], isAuctionEnds }) {
	const router = useRouter()
	const { localeLn } = useIntl()
	const [activeToken, setActiveToken] = useState(null)

	const closeTokenSeriesDetail = () => {
		const prevUrl = window.sessionStorage.getItem('prevPath')
		if (prevUrl && prevUrl[0] === '/') {
			router.push(prevUrl, prevUrl, { shallow: true })
		} else {
			router.back()
		}
	}

	useEffect(() => {
		router.beforePopState((state) => {
			state.options.scroll = false
			return true
		})
	}, [])

	useEffect(() => {
		if (router.query.tokenId) {
			const token = tokens.find((token) => {
				const lookupToken = token?.token
				return (
					(token?.token_id === router.query.tokenId ||
						token?.token_series_id === router.query.tokenId ||
						lookupToken?.token_id === router.query.tokenId) &&
					token?.contract_id === router.query.contractId
				)
			})
			if (token?.token) {
				setActiveToken({
					...token.token,
					price: token.price || token.lowest_price,
					total_likes: token?.total_likes || 0,
					likes: token?.likes || null,
				})
			} else {
				setActiveToken(token)
			}
		} else {
			setActiveToken(null)
		}
	}, [router.query, JSON.stringify(tokens), isAuctionEnds, tokens.token?.bidder_list])

	return (
		<div>
			{activeToken && (
				<Modal close={() => closeTokenSeriesDetail(null)}>
					<div className="max-w-5xl m-auto w-full relative">
						<div className="absolute top-0 left-0 p-4 z-50">
							<div
								className="cursor-pointer flex items-center select-none"
								onClick={() => closeTokenSeriesDetail(null)}
							>
								<IconArrow size={16} />
								<p className="pl-2 text-gray-100 cursor-pointer relative z-50">
									{localeLn('Back')}
								</p>
							</div>
						</div>
						<TokenDetail token={activeToken} isAuctionEnds={isAuctionEnds} />
					</div>
				</Modal>
			)}
		</div>
	)
}

export default TokenDetailModal
