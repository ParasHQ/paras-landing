import Link from 'next/link'
import { parseImgUrl, prettyBalance } from 'utils/common'
import LinkToProfile from '../LinkToProfile'
import { useIntl } from 'hooks/useIntl'
import TopUserLoader from './TopUserLoader'
import useProfileData from 'hooks/useProfileData'

const TopUsers = ({ data = [], className, userType = 'buyer', linkTo, isFetching }) => {
	const { localeLn } = useIntl()
	return (
		<div className={className}>
			<div className="flex justify-between items-baseline">
				<div className="flex space-x-2">
					<h1 className="text-2xl font-semibold text-gray-100 capitalize">{`Top ${userType}`}</h1>
				</div>
				<Link href={linkTo}>
					<a className="text-gray-400 hover:text-white cursor-pointer font-semibold flex items-center">
						<span>{localeLn('More')}</span>
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
			<div className="block md:flex md:flex-col">
				{isFetching ? (
					<TopUserLoader />
				) : (
					data?.map((user, idx) => <TopUser key={idx} user={user} idx={idx} />)
				)}
			</div>
		</div>
	)
}

const TopUser = ({ user, idx }) => {
	const profile = useProfileData(user.account_id)

	return (
		<div className="my-3 flex items-center">
			<p className="text-base text-gray-100 opacity-50 mr-3">{idx + 1}</p>
			<Link href={`/${user.account_id}`}>
				<div className="cursor-pointer w-12 h-12 rounded-full overflow-hidden bg-primary">
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
				<p className="text-base text-gray-400">{prettyBalance(user.total_sum, 24, 6)} Ⓝ</p>
			</div>
		</div>
	)
}

export default TopUsers
