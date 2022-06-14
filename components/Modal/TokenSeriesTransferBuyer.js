import axios from 'axios'
import Modal from 'components/Common/Modal'
import { useEffect, useState } from 'react'

import TokenTransferModal from './TokenTransferModal'
import Scrollbars from 'react-custom-scrollbars'
import InfiniteScroll from 'react-infinite-scroll-component'
import useStore from 'lib/store'
import Link from 'next/link'
import Button from 'components/Common/Button'
import { IconX } from 'components/Icons'
import { useIntl } from 'hooks/useIntl'
const FETCH_TOKENS_LIMIT = 12

const TokenSeriesTransferBuyer = ({ show, onClose, data }) => {
	const [activeData, setActiveData] = useState(null)
	const [tokens, setTokens] = useState([])
	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)
	const store = useStore()
	const { localeLn } = useIntl()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (data.token_series_id && store.currentUser && show) {
			fetchTokens()
		}
	}, [data, store, show])

	const fetchTokens = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const resp = await axios.get(`${process.env.V2_API_URL}/token`, {
			params: {
				token_series_id: data.token_series_id,
				contract_id: data.contract_id,
				owner_id: store.currentUser,
				__skip: page * FETCH_TOKENS_LIMIT,
				__limit: FETCH_TOKENS_LIMIT,
			},
		})

		const newData = resp.data.data

		const newTokens = [...(tokens || []), ...newData.results]
		setTokens(newTokens)
		setPage(page + 1)
		if (newData.results.length < FETCH_TOKENS_LIMIT) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	const onDismissModal = () => {
		setActiveData(null)
	}

	return (
		<>
			<Modal isShow={show} close={onClose}>
				<div className="max-w-sm w-full p-4 bg-gray-800 m-auto rounded-md relative max-h-96">
					<Scrollbars autoHeight>
						<div>
							<div className="sticky top-0 flex justify-between">
								<h1 className="text-2xl font-bold text-white tracking-tight ">
									{localeLn('Transfer')}
								</h1>
								<div className="cursor-pointer" onClick={onClose}>
									<IconX />
								</div>
							</div>
							{!isFetching && !hasMore && tokens.length === 0 ? (
								<div className="mt-4">
									<p className="text-gray-200">{localeLn('NoTokensOwned')}</p>
								</div>
							) : (
								<InfiniteScroll
									dataLength={tokens.length}
									next={fetchTokens}
									hasMore={hasMore}
									loader={
										<div className="border-2 border-dashed my-4 p-2 rounded-md text-center">
											<p className="my-2 text-center">{localeLn('LoadingLoading')}</p>
										</div>
									}
								>
									{tokens.map((token) => {
										return (
											<div
												key={token.token_id}
												className="flex items-center text-white justify-between mt-2"
											>
												<div>
													<Link
														href={`/token/${token.contract_id}::${token.token_series_id}/${token.token_id}`}
													>
														<a>
															{localeLn('Edition')} #{token.edition_id}
														</a>
													</Link>
												</div>
												<Button size="sm" onClick={() => setActiveData(token)}>
													{localeLn('Transfer')}
												</Button>
											</div>
										)
									})}
								</InfiniteScroll>
							)}
						</div>
					</Scrollbars>
				</div>
			</Modal>
			{activeData && (
				<TokenTransferModal show={activeData} onClose={onDismissModal} data={activeData} />
			)}
		</>
	)
}

export default TokenSeriesTransferBuyer
