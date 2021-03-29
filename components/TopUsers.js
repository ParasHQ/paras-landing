import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { parseImgUrl, prettyBalance } from '../utils/common'
import LinkToProfile from './LinkToProfile'

const TopUsers = ({ data = [], className, userType = 'buyer', linkTo }) => {
	return (
		<div className={className}>
			<div className="flex justify-between items-baseline">
				<div className="flex space-x-2">
					<h1 className="text-2xl font-semibold text-gray-100 capitalize">{`Top ${userType}`}</h1>
				</div>
				<Link href={linkTo}>
					<p className="text-lg text-gray-100 cursor-pointer select-none">
						More
					</p>
				</Link>
			</div>
			{data?.map((user, idx) => (
				<TopUser key={user._id} user={user} idx={idx} />
			))}
		</div>
	)
}

const TopUser = ({ user, idx }) => {
	const [profile, setProfile] = useState({})

	useEffect(async () => {
		const res = await axios(
			`${process.env.API_URL}/profiles?accountId=${user._id}`
		)
		setProfile(res.data.data.results[0])
	}, [])

	return (
		<div className="my-3 flex items-center">
			<p className="text-base text-gray-100 opacity-50 mr-3">{idx + 1}</p>
			<Link href={`/${user._id}`}>
				<div className="cursor-pointer w-12 h-12 rounded-full overflow-hidden bg-primary">
					<img src={parseImgUrl(profile?.imgUrl)} className="object-cover" />
				</div>
			</Link>
			<div className="ml-3">
				<LinkToProfile
					accountId={user._id}
					len={16}
					className="text-gray-100 hover:border-gray-100 font-semibold text-lg"
				/>
				<p className="text-base text-gray-400">
					{prettyBalance(user.total, 24, 6)} Ⓝ
				</p>
			</div>
		</div>
	)
}

export default TopUsers
