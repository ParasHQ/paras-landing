import axios from 'axios'
import Button from 'components/Common/Button'
import { InputText } from 'components/Common/form/index'
import Modal from 'components/Common/Modal'
import { useEffect, useState } from 'react'

import owned from 'dummy/tokens_owned.json'
import TokenTransferModal from './TokenTransferModal'
import Scrollbars from 'react-custom-scrollbars'
import InfiniteScroll from 'react-infinite-scroll-component'
import useStore from 'lib/store'

const FETCH_TOKENS_LIMIT = 12

const TokenSeriesTransferBuyer = ({
	show,
	onClose,
	data = {
		token_id: 'paradigm-1:2',
		comic_id: 'paradigm',
		chapter_id: 1,
		edition_id: 2,
		metadata: {
			title: 'Paradigm Ch.1 : The Metaverse #2',
			description:
				"While waiting for the hackathon's final stage, Abee got transferred into an unknown world",
			media: 'bafybeih4vvtevzfxtwsq2oadkvg6rtpspih4pyqqegtocwklcmnhe7p5mi',
			media_hash: null,
			copies: null,
			issued_at: '2021-08-21T16:33:28.475Z',
			expires_at: null,
			starts_at: null,
			updated_at: null,
			extra: null,
			reference: 'bafybeiaqaxyw2x6yx6vnbntg3dpdqzv2hpq2byffcrbit7dygcksauv3ta',
			reference_hash: null,
			blurhash: 'UCQ0XJ~qxu~q00IUayM{00M{M{M{00ayofWB',
			author_ids: ['afiq.testnet'],
			page_count: 12,
			collection: 'Paradigm',
			subtitle: 'The Metaverse',
		},
		owner_id: 'ahnaf.testnet',
		token_type: 'paradigm-1',
	},
}) => {
	const [activeData, setActiveData] = useState(null)
	const [tokens, setTokens] = useState([])
	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)
	const store = useStore()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(async () => {
		console.log(data.token_series_id, store.currentUser)
		if (data.token_series_id && store.currentUser) {
			await fetchTokens()
		}
	}, [data, store])

	const fetchTokens = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const resp = await axios.get(`${process.env.V2_API_URL}/token`, {
			params: {
				token_series_id: data.token_series_id,
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
				<div className="max-w-sm w-full p-4 bg-blueGray-800 m-4 md:m-auto rounded-md h-96">
					<Scrollbars>
						<div className="bg-blue-400">
							<h1 className="text-2xl font-bold text-white tracking-tight sticky top-0 bg-blue-400">
								Transfer
							</h1>
							{!isFetching && !hasMore && tokens.length === 0 ? (
								<div>No Tokens Owned</div>
							) : (
								<InfiniteScroll
									dataLength={tokens.length}
									next={fetchTokens}
									hasMore={hasMore}
									loader={
										<div className="border-2 border-dashed my-4 p-2 rounded-md text-center">
											<p className="my-2 text-center">Loading...</p>
										</div>
									}
								>
									{tokens.map((token) => {
										return (
											<div className="flex text-white justify-between">
												<div>#{token.edition_id}</div>
												<div onClick={() => setActiveData(token)}>Transfer</div>
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
				<TokenTransferModal
					show={activeData}
					onClose={onDismissModal}
					data={activeData}
				/>
			)}
		</>
	)
}

export default TokenSeriesTransferBuyer
