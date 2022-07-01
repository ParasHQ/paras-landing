import axios from 'axios'
import Button from 'components/Common/Button'
import { IconVerified } from 'components/Icons'
import { useNonInitialEffect } from 'hooks/useNonInitialEffect'
import useProfileSWR from 'hooks/useProfileSWR'
import useStore from 'lib/store'
import WalletHelper from 'lib/WalletHelper'
import Link from 'next/link'
import { useState } from 'react'
import { parseImgUrl, prettyBalance, prettyTruncate } from 'utils/common'

const RecommendationUserFollow = ({ data }) => {
	const currentUser = useStore((state) => state.currentUser)
	const { profile, mutate } = useProfileSWR({
		key: data.account_id,
		params: { followed_by: currentUser },
	})
	const [isLoading, setIsLoading] = useState(false)

	useNonInitialEffect(() => {
		if (currentUser) {
			mutate()
		}
	}, currentUser)

	const onClickFollowUnfollow = async () => {
		if (!currentUser) {
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
		<div className="border-[0.5px] border-gray-600 rounded-xl h-full">
			<Link href={`/${data.account_id}`}>
				<a>
					<div
						className={`object-cover w-full h-20 p-1 rounded-t-xl ${
							!profile?.coverUrl ? 'bg-primary' : 'bg-dark-primary-2'
						}`}
						style={{
							backgroundImage: `url(${parseImgUrl(profile?.coverUrl, null)})`,
							backgroundPosition: 'center',
							backgroundSize: 'cover',
						}}
					/>
				</a>
			</Link>
			<div className="mt-2 mx-2">
				<div className="relative">
					<Link href={`/${data.account_id}`}>
						<a
							className={`absolute w-12 h-12 -top-6 overflow-hidden border-2 border-black ${
								!profile?.imgUrl ? 'bg-primary' : 'bg-dark-primary-2'
							} rounded-full cursor-pointer`}
						>
							<img
								src={parseImgUrl(profile?.imgUrl, null, {
									width: `300`,
								})}
								className="w-full object-cover rounded-full cursor-pointer"
							/>
						</a>
					</Link>
				</div>
				<div className="text-right flex justify-end gap-1">
					<Link href={`/${data.account_id}`}>
						<a className="text-white font-bold text-right">
							{prettyTruncate(data.account_id, 15, 'address')}
						</a>
					</Link>
					{profile?.isCreator && <IconVerified size={15} color="#0816B3" />}
				</div>
			</div>
			<div className="flex justify-between items-end gap-2 mx-2 mt-1 mb-2">
				<div>
					<p className="text-gray-400 text-[0.6rem]">Last 7 days volume</p>
					<p className="text-white font-bold">{prettyBalance(data.total_sum, 24)} Ⓝ</p>
				</div>
				<div>
					<p className="text-gray-400 text-[0.6rem]">Followers</p>
					<p className="text-white font-bold">{profile?.followers || 0}</p>
				</div>
				<div className="flex-1 w-full">
					<Button
						size="sm"
						isLoading={isLoading}
						loadingStyle="h-4"
						className={`rounded-full float-right w-[4.5rem] text-[0.55rem] ${
							profile?.follows ? 'bg-[#1B4FA7]' : ''
						}`}
						onClick={onClickFollowUnfollow}
					>
						{profile?.follows ? 'Followed' : 'Follow'}
					</Button>
				</div>
			</div>
		</div>
	)
}
export default RecommendationUserFollow
