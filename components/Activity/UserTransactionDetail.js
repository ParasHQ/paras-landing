import Link from 'next/link'
import Scrollbars from 'react-custom-scrollbars'
import LinkToProfile from '../LinkToProfile'
import { parseImgUrl } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import TopTransactionCard, { renderThumb } from './TopTransactionCard'
import Button from 'components/Common/Button'
import axios from 'axios'
import WalletHelper from 'lib/WalletHelper'
import useProfileSWR from 'hooks/useProfileSWR'
import useStore from 'lib/store'
import { useNonInitialEffect } from 'hooks/useNonInitialEffect'
import { useState } from 'react'
import LoginModal from 'components/Modal/LoginModal'

const UserTransactionDetail = ({ data, idx, type = 'buyer', setLocalToken }) => {
	const currentUser = useStore((state) => state.currentUser)
	const { profile, mutate } = useProfileSWR({
		key: data.account_id,
		params: { followed_by: currentUser },
	})
	const { localeLn } = useIntl()
	const [isLoading, setIsLoading] = useState(false)
	const [showLogin, setShowLogin] = useState(false)

	useNonInitialEffect(() => {
		if (currentUser) {
			mutate()
		}
	}, [currentUser])

	const onClickFollowUnfollow = async () => {
		if (!currentUser) {
			setShowLogin(true)
			return
		}

		setIsLoading(true)
		try {
			await axios.request({
				url: `${process.env.V2_API_URL}${profile.follows ? '/unfollow' : '/follow'}`,
				method: 'PUT',
				headers: {
					authorization: await WalletHelper.authToken(),
				},
				params: {
					account_id: currentUser,
					following_account_id: profile.accountId,
				},
			})
		} catch (error) {
			null
		}

		setTimeout(() => {
			mutate()
			setIsLoading(false)
		}, 300)
	}

	return (
		<div key={idx} className="md:flex border-2 border-dashed border-gray-800 rounded-md my-4">
			<LoginModal show={showLogin} onClose={() => setShowLogin(false)} />
			<div className="flex items-center md:w-2/5 p-4">
				<p className="text-base text-gray-100 opacity-50 mr-3 self-start">{idx + 1}</p>
				<div className="flex self-start">
					<div className="flex flex-col items-center">
						<Link href={`/${data.account_id}`}>
							<div className="cursor-pointer w-12 h-12 md:w-20 md:h-20 rounded-full overflow-hidden bg-primary">
								<img
									src={parseImgUrl(profile?.imgUrl, null, {
										width: `200`,
									})}
									className="object-cover"
								/>
							</div>
						</Link>
						<Button
							size="sm"
							isLoading={isLoading}
							loadingStyle="h-4"
							className={`mt-2 w-24 rounded-full ${profile?.follows ? 'bg-[#1B4FA7]' : ''}`}
							onClick={onClickFollowUnfollow}
						>
							{profile?.follows ? 'Following' : 'Follow'}
						</Button>
					</div>
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
