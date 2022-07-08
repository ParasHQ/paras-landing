import { useEffect, useState } from 'react'
import useStore from 'lib/store'
import { trackLikeToken, trackUnlikeToken } from 'lib/ga'
import WalletHelper from 'lib/WalletHelper'
import { abbrNum } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import axios from 'axios'
import { mutate } from 'swr'
import ArtistVerified from 'components/Common/ArtistVerified'
import IconLove from 'components/Icons/component/IconLove'
import { Tooltip } from 'recharts'

const TokenHead = ({ token, setShowModal }) => {
	const [defaultLikes, setDefaultLikes] = useState(0)
	const [isLiked, setIsLiked] = useState(false)
	const currentUser = useStore((state) => state.currentUser)

	const { localeLn } = useIntl()

	useEffect(() => {
		if (token?.total_likes) {
			if (token.likes) {
				setIsLiked(true)
			}

			setDefaultLikes(token?.total_likes)
		}
	}, [JSON.stringify(token)])

	const likeToken = async (contract_id, token_series_id, source) => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}

		setIsLiked(true)
		setDefaultLikes(defaultLikes + 1)
		const params = {
			account_id: currentUser,
		}

		const res = await axios.put(
			`${process.env.V2_API_URL}/like/${contract_id}/${token_series_id}`,
			params,
			{
				headers: {
					authorization: await WalletHelper.authToken(),
				},
			}
		)

		mutate(`${token.contract_id}::${token.token_series_id}`)
		mutate(`${token.contract_id}::${token.token_series_id}/${token.token_id}`)
		if (res.status !== 200) {
			setIsLiked(false)
			setDefaultLikes(defaultLikes - 1)
			return
		}

		trackLikeToken(`${contract_id}::${token_series_id}`, source)
	}

	const unlikeToken = async (contract_id, token_series_id, source) => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}

		setIsLiked(false)
		setDefaultLikes(defaultLikes - 1)
		const params = {
			account_id: currentUser,
		}

		const res = await axios.put(
			`${process.env.V2_API_URL}/unlike/${contract_id}/${token_series_id}`,
			params,
			{
				headers: {
					authorization: await WalletHelper.authToken(),
				},
			}
		)

		mutate(`${token.contract_id}::${token.token_series_id}`)
		mutate(`${token.contract_id}::${token.token_series_id}/${token.token_id}`)
		if (res.status !== 200) {
			setIsLiked(true)
			setDefaultLikes(defaultLikes + 1)
			return
		}

		trackUnlikeToken(`${contract_id}::${token_series_id}`, source)
	}

	return (
		<div>
			<div className="flex justify-between">
				<div className="overflow-x-hidden">
					<div className="flex justify-between items-center">
						<p className="text-gray-300 text-xl truncate">
							NFT //{' '}
							{token.contract_id === process.env.NFT_CONTRACT_ID
								? `#${token.edition_id} of ${token.metadata.copies}`
								: `#${token.token_id}`}
						</p>
					</div>
					<h1 className="mt-2 text-xl md:text-4xl font-bold text-white tracking-tight pr-4 break-all">
						{token.metadata.title}
					</h1>
					<div className="mt-1 text-white text-lg flex">
						<p className="mr-1">{localeLn('owned by')}</p>
						<ArtistVerified token={token} type={'token-detail'} />
					</div>
				</div>
			</div>
			<div className="w-full flex items-center justify-start gap-8 relative mt-10">
				<div className="flex gap-2 items-center">
					<div
						className="cursor-pointer"
						onClick={() => {
							isLiked
								? unlikeToken(token.contract_id, token.token_series_id, 'detail')
								: likeToken(token.contract_id, token.token_series_id, 'detail')
						}}
					>
						<IconLove
							size={24}
							color={isLiked ? '#c51104' : 'transparent'}
							stroke={isLiked ? 'none' : 'white'}
						/>
					</div>
					<p className="text-white text-center text-lg">{abbrNum(defaultLikes ?? 0, 1)} Likes</p>
				</div>
				<div className="flex text-white">
					<div className="flex gap-1 items-center text-lg">
						<svg
							className="w-8 h-8 -mt-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							></path>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
							></path>
						</svg>
						<p>{!token.view ? '0' : token.view}</p>
						<p>{localeLn('Views')}</p>
					</div>
				</div>
				<div className="absolute right-0">
					{token.is_staked && (
						<Tooltip
							id="text-staked"
							show={true}
							text={'The NFT is being staked by the owner'}
							className="font-bold bg-gray-800 text-white"
						>
							<span
								className="bg-white text-primary font-bold rounded-full px-3 py-2 text-sm"
								style={{ boxShadow: `rgb(83 97 255) 0px 0px 5px 1px` }}
							>
								staked
							</span>
						</Tooltip>
					)}
				</div>
			</div>
		</div>
	)
}

export default TokenHead
