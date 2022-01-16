import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'

import LinkToProfile from '../LinkToProfile'

import { parseImgUrl } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import TopTransactionCard, { renderThumb } from './TopTransactionCard'

const UserTransactionDetail = ({ data, idx, type = 'buyer', setLocalToken }) => {
	const [profile, setProfile] = useState({})
	const { localeLn } = useIntl()
	useEffect(async () => {
		const res = await axios(`${process.env.V2_API_URL}/profiles`, {
			params: {
				accountId: data.account_id,
			},
		})
		setProfile(res.data.data.results[0])
	}, [])

	return (
		<div key={idx} className="md:flex border-2 border-dashed border-gray-800 rounded-md my-4">
			<div className="flex items-center md:w-2/5 p-4">
				<p className="text-base text-gray-100 opacity-50 mr-3 self-start">{idx + 1}</p>
				<div className="flex self-start">
					<Link href={`/${data.account_id}`}>
						<div className="cursor-pointer w-20 h-20 rounded-full overflow-hidden bg-primary">
							<img
								src={parseImgUrl(profile?.imgUrl, null, {
									width: `200`,
								})}
								className="object-cover"
							/>
						</div>
					</Link>
					<div className="ml-4">
						{data.account_id && (
							<LinkToProfile
								accountId={data.account_id}
								len={16}
								className="text-gray-100 hover:border-gray-100 font-bold text-lg md:text-2xl"
							/>
						)}
						<p className="text-base text-gray-400">
							Total {type !== 'buyer' ? 'sales' : 'purchase'}: {formatNearAmount(data.total_sum, 2)}{' '}
							Ⓝ
						</p>
						<p className="text-base text-gray-400">
							{localeLn('Card')} {type !== 'buyer' ? 'sold' : 'bought'}:{' '}
							{data.contract_token_ids.length}
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

export default UserTransactionDetail
