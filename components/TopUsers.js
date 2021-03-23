import axios from 'axios'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { parseImgUrl, prettyBalance } from '../utils/common'
import LinkToProfile from './LinkToProfile'

const TopUsers = ({ data }) => {
	const modalRef = useRef()
	const [showModal, setShowModal] = useState(false)
	const [userType, setUserType] = useState('buyers')

	useEffect(() => {
		const onClick = (e) => {
			if (!modalRef.current.contains(e.target)) {
				setShowModal(false)
			}
		}
		if (showModal) {
			document.body.addEventListener('click', onClick)
		}
		return () => {
			document.body.removeEventListener('click', onClick)
		}
	})

	const onClickType = (type) => {
		setUserType(type)
		setShowModal(false)
	}

	return (
		<div>
			<div className="flex justify-between items-end">
				<div className="flex space-x-2">
					<h1 className="text-2xl font-semibold text-gray-100">Top</h1>
					<div ref={modalRef}>
						<div
							onClick={() => setShowModal(!showModal)}
							className="flex items-center cursor-pointer select-none"
						>
							<h1 className="text-2xl font-semibold text-gray-100 mr-2 capitalize">
								{userType}
							</h1>
							<svg
								viewBox="0 0 11 7"
								fill="whites"
								width="18"
								height="18"
								xlmns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M5.00146 6.41431L9.70857 1.7072C10.0991 1.31668 10.0991 0.683511 9.70857 0.292986C9.31805 -0.097538 8.68488 -0.097538 8.29436 0.292986L5.00146 3.58588L1.70857 0.292986C1.31805 -0.097538 0.684882 -0.097538 0.294358 0.292986C-0.0961662 0.68351 -0.0961662 1.31668 0.294358 1.7072L5.00146 6.41431Z"
									fill="white"
								></path>
							</svg>
						</div>
						{showModal && (
							<div className="absolute max-w-full z-20 -mx-2 bg-dark-primary-1 px-5 py-2 rounded-md text-lg text-gray-100">
								<p
									className={`opacity-50 cursor-pointer select-none
										${userType === 'buyers' && 'font-semibold mb-1 opacity-100'}
									`}
									onClick={() => onClickType('buyers')}
								>
									Buyers
								</p>
								<p
									className={`opacity-50 cursor-pointer select-none
										${userType === 'sellers' && 'font-semibold mb-1 opacity-100'}
									`}
									onClick={() => onClickType('sellers')}
								>
									Sellers
								</p>
							</div>
						)}
					</div>
				</div>
				<Link href="/activity/topusers">
					<p className="text-lg text-gray-100 cursor-pointer select-none">
						More
					</p>
				</Link>
			</div>
			{data[userType].map((user, idx) => (
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
					len={18}
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
