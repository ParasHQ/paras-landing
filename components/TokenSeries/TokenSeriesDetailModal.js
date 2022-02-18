import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import TokenSeriesDetail from './TokenSeriesDetail'
import { useIntl } from 'hooks/useIntl'
import Modal from 'components/Modal'

function TokenSeriesDetailModal({ tokens = [] }) {
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
		if (router.query.tokenSeriesId && activeToken === null) {
			const token = tokens.find(
				(token) =>
					token?.token_series_id === router.query.tokenSeriesId &&
					token?.contract_id === router.query.contractId
			)
			setActiveToken(token)
		} else {
			setActiveToken(null)
		}
	}, [router.query])

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
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M5.41412 7.00001H13.9999V9.00001H5.41412L8.70701 12.2929L7.2928 13.7071L1.58569 8.00001L7.2928 2.29291L8.70701 3.70712L5.41412 7.00001Z"
										fill="white"
									/>
								</svg>
								<p className="pl-2 text-gray-100 cursor-pointer relative z-50">
									{localeLn('Back')}
								</p>
							</div>
						</div>
						<TokenSeriesDetail token={activeToken} />
					</div>
				</Modal>
			)}
		</div>
	)
}

export default TokenSeriesDetailModal
