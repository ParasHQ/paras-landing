import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'

import { parseImgUrl, prettyBalance } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import TopTransactionCard, { renderThumb } from './TopTransactionCard'

const CollectionTransactionDetail = ({ data, idx, setLocalToken }) => {
	const { localeLn } = useIntl()

	const [colDetail, setColDetail] = useState({})
	const [remainStats, setRemainStats] = useState({})

	useEffect(() => {
		const fetchCollection = async () => {
			const res = await axios(`${process.env.V2_API_URL}/collections`, {
				params: {
					collection_id: data.collection_id,
				},
			})
			setColDetail(res.data.data.results[0])
		}
		const fetchRemainStats = async () => {
			const stat = await axios(`${process.env.V2_API_URL}/collection-stats`, {
				params: {
					collection_id: data.collection_id,
				},
			})
			setRemainStats(stat.data.data.results)
		}
		fetchCollection()
		fetchRemainStats()
	}, [])

	return (
		<div key={idx} className="md:flex border-2 border-dashed border-gray-800 rounded-md my-4">
			<div className="flex items-center md:w-2/5 p-4">
				<p className="text-base text-gray-100 opacity-50 mr-3 self-start">{idx + 1}</p>
				<div className="flex self-start">
					<Link href={`/collection/${data.collection_id}`}>
						<a>
							<div className="cursor-pointer w-20 h-20 rounded-full overflow-hidden bg-primary">
								<img
									src={parseImgUrl(colDetail?.media, null, {
										width: `200`,
									})}
									className="object-cover"
								/>
							</div>
						</a>
					</Link>
					<div className="ml-4">
						{colDetail?.collection && (
							<Link href={`/collection/${data.collection_id}`}>
								<a className="text-gray-100 border-b-2 border-transparent hover:border-gray-100 font-bold text-lg md:text-2xl">
									{colDetail.collection}
								</a>
							</Link>
						)}
						<p className="text-base text-gray-400">
							Total sales: {formatNearAmount(data.total_sum, 2)} Ⓝ
						</p>
						<p className="text-base text-gray-400">
							{localeLn('Card')} sold: {data.contract_token_ids.length}
						</p>
						<p className="text-base text-gray-400">
							Floor Price:{' '}
							{remainStats.floor_price ? prettyBalance(remainStats.floor_price, 24, 4) : '--'} Ⓝ
						</p>
					</div>
				</div>
			</div>
			<div className="md:w-3/5 p-4 px-2">
				<Scrollbars
					autoHeight
					autoHeightMax={`24rem`}
					renderView={(props) => <div {...props} id="scrollableDiv" />}
					className="overflow-auto whitespace-no-wrap"
					universal={true}
					renderThumbHorizontal={renderThumb}
				>
					<div className="flex py-2">
						{data.contract_token_ids.slice(0, 5).map((contract_token_id, idx) => (
							<TopTransactionCard
								key={idx}
								contract_token_id={contract_token_id}
								setLocalToken={setLocalToken}
							/>
						))}
					</div>
				</Scrollbars>
			</div>
		</div>
	)
}

export default CollectionTransactionDetail
