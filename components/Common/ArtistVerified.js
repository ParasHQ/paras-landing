import Link from 'next/link'
import cachios from 'cachios'
import { useEffect, useState } from 'react'

import ReactTooltip from 'react-tooltip'
import { prettyTruncate } from 'utils/common'

const ArtistVerified = ({ token, collection }) => {
	const [artistData, setArtistData] = useState(null)
	const [showTooltip, setShowTooltip] = useState(false)

	useEffect(async () => {
		if (token?.metadata.creator_id) {
			const profileRes = await cachios.get(`${process.env.V2_API_URL}/profiles`, {
				params: {
					accountId: token?.metadata.creator_id,
				},
				ttl: 600,
			})
			const userProfile = profileRes.data.data.results[0]
			setArtistData(userProfile)
		}
		setShowTooltip(true)
	}, [token])

	const getCreatorId = () => {
		return token?.metadata.creator_id || token?.contract_id
	}

	return (
		<>
			{showTooltip && <ReactTooltip place="right" type="dark" />}
			<span className="font-semibold">
				<Link
					href={
						token?.metadata.creator_id
							? `/${getCreatorId()}/creation`
							: `/collection/${getCreatorId()}`
					}
				>
					<a className="text-white font-semibold border-b-2 border-transparent hover:border-white">
						{prettyTruncate(getCreatorId(), 30, 'address')}
					</a>
				</Link>
			</span>
			{(artistData?.isCreator || collection?.isCreator) && (
				<span data-tip="Verified Creator" className="ml-1">
					<svg
						width="18"
						height="17"
						viewBox="0 0 18 17"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M17.8095 8.5L15.8343 6.24143L16.1095 3.25429L13.1871 2.59048L11.6571 0L8.90476 1.1819L6.15238 0L4.62238 2.58238L1.7 3.2381L1.97524 6.23333L0 8.5L1.97524 10.7586L1.7 13.7538L4.62238 14.4176L6.15238 17L8.90476 15.81L11.6571 16.9919L13.1871 14.4095L16.1095 13.7457L15.8343 10.7586L17.8095 8.5Z"
							fill="white"
						/>
						<path
							d="M7.3956 12.1429L5.66675 6.494H7.62684L8.74022 10.9039H9.06951L10.1855 5.66675H12.1429L10.4141 12.1429H7.3956Z"
							fill="#0816B3"
						/>
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M10.1191 5.26196H14.4169L13.6074 6.88101H10.1191V5.26196Z"
							fill="#0816B3"
						/>
					</svg>
				</span>
			)}
		</>
	)
}

export default ArtistVerified
