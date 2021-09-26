import { useEffect, useState } from 'react'
import cachios from 'cachios'
import { useIntl } from '../../hooks/useIntl'
const ArtistBanned = ({ creatorId }) => {
	const [artistData, setArtistData] = useState(null)
	const { localeLn } = useIntl()
	useEffect(async () => {
		if (creatorId) {
			const profileRes = await cachios.get(
				`${process.env.V2_API_URL}/profiles`,
				{
					params: {
						accountId: creatorId,
					},
					ttl: 600,
				}
			)
			const userProfile = profileRes.data.data.results[0]
			setArtistData(userProfile)
		}
	}, [creatorId])

	return (
		<>
			{artistData?.isBanned && (
				<div className="absolute z-20 bottom-0 flex items-center justify-center px-4 md:px-12">
					<p className="text-white text-sm m-2 md:mb-4 mt-2 p-1 bg-red-600 font-bold w-full mx-auto px-4 text-center rounded-md">
						{localeLn('WARNING: This profile has been flagged by PARAS due to art stealing')}
					</p>
				</div>
			)}
		</>
	)
}

export default ArtistBanned
