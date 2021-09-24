import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { parseImgUrl } from 'utils/common'
import LinkToProfile from 'components/LinkToProfile'
import Scrollbars from 'react-custom-scrollbars'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import HomeTopUsersLoader from 'components/Home/Loaders/TopUsers'
import { strings } from 'utils/strings'

const renderThumb = ({ style, ...props }) => {
	return (
		<div
			{...props}
			style={{
				...style,
				cursor: 'pointer',
				borderRadius: 'inherit',
				backgroundColor: 'rgba(255, 255, 255, 0.1)',
			}}
		/>
	)
}

const TopUser = ({ user, idx }) => {
	const [profile, setProfile] = useState({})

	useEffect(async () => {
		const res = await axios(`${process.env.V2_API_URL}/profiles`, {
			params: {
				accountId: user.account_id,
			},
		})
		setProfile(res.data.data.results[0])
	}, [])

	return (
		<div className="my-3 flex items-center">
			<p className="text-base text-gray-100 opacity-50 mr-3">{idx + 1}</p>
			<Link href={`/${user.account_id}`}>
				<div className="flex-shrink-0 cursor-pointer w-12 h-12 rounded-full overflow-hidden bg-primary border-white border">
					<img
						src={parseImgUrl(profile?.imgUrl, null, {
							width: `300`,
						})}
						className="object-cover"
					/>
				</div>
			</Link>
			<div className="ml-3">
				{user.account_id && (
					<LinkToProfile
						accountId={user.account_id}
						len={16}
						className="text-gray-100 hover:border-gray-100 font-semibold text-lg"
					/>
				)}
				<p className="text-base text-gray-400">
					{formatNearAmount(user.total_sum)} Ⓝ
				</p>
			</div>
		</div>
	)
}

export const HomeTopUserList = () => {
	const [topBuyerList, setTopBuyerList] = useState([])
	const [topSellerList, setTopSellerList] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		fetchTopUsers()
	}, [])

	const fetchTopUsers = async () => {
		const resp = await axios.get(
			`${process.env.V2_API_URL}/activities/top-users`,
			{
				params: {
					__limit: 5,
				},
			}
		)
		if (resp.data.data) {
			setTopBuyerList(resp.data.data.buyers)
			setTopSellerList(resp.data.data.sellers)
			setIsLoading(false)
		}
	}

	return (
		<div>
			<div className="w-full mt-16">
				<div className="flex items-center justify-between">
					<p className="text-white font-semibold text-3xl">
						{strings.TOP_BUYERS}
					</p>
					<Link href="/activity/top-buyers">
						<a className="text-gray-400 hover:text-white cursor-pointer font-semibold flex items-center">
							<span>{strings.MORE}</span>
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
				<Scrollbars
					renderThumbHorizontal={renderThumb}
					autoHeight={true}
					universal={true}
					width={100}
				>
					{!isLoading ? (
						<div className="w-full flex -mx-4 py-2 pb-4">
							{topBuyerList.map((user, idx) => {
								return (
									<div
										key={idx}
										style={{
											width: `18rem`,
										}}
										className="flex-shrink-0 flex-grow-0 px-4"
									>
										<TopUser user={user} idx={idx} />
									</div>
								)
							})}
						</div>
					) : (
						<div>
							<HomeTopUsersLoader />
						</div>
					)}
				</Scrollbars>
			</div>
			<div className="w-full mt-8">
				<div className="flex items-center justify-between">
					<p className="text-white font-semibold text-3xl">
						{strings.TOP_SELLERS}
					</p>
					<Link href="/activity/top-sellers">
						<a className="text-gray-400 hover:text-white cursor-pointer font-semibold flex items-center">
							<span>{strings.MORE}</span>
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
				<Scrollbars
					renderThumbHorizontal={renderThumb}
					autoHeight={true}
					universal={true}
					width={100}
				>
					{!isLoading ? (
						<div className="w-full flex -mx-4 py-2 pb-4">
							{topSellerList.map((user, idx) => {
								return (
									<div
										key={idx}
										style={{
											width: `18rem`,
										}}
										className="flex-shrink-0 flex-grow-0 px-4"
									>
										<TopUser user={user} idx={idx} />
									</div>
								)
							})}
						</div>
					) : (
						<div>
							<HomeTopUsersLoader />
						</div>
					)}
				</Scrollbars>
			</div>
		</div>
	)
}
