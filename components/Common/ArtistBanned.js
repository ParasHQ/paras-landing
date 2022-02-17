import { useEffect, useState } from 'react'
import cachios from 'cachios'
import { useIntl } from 'hooks/useIntl'
import { flagColor, flagText } from 'constants/flag'

const ArtistBanned = ({ creatorId, className }) => {
	const [artistData, setArtistData] = useState(null)
	const { localeLn } = useIntl()

	useEffect(async () => {
		if (creatorId) {
			const profileRes = await cachios.get(`${process.env.V2_API_URL}/profiles`, {
				params: {
					accountId: creatorId,
				},
				ttl: 600,
			})
			const userProfile = profileRes.data.data.results[0]
			setArtistData(userProfile)
		}
	}, [creatorId])

	return (
		<>
			{artistData?.flag && (
				<div
					className={`${className} absolute z-20 bottom-0 flex items-center justify-center px-4 md:px-12 w-full`}
				>
					<p
						className={`text-white text-sm m-2 md:mb-4 mt-2 p-1 font-bold w-full mx-auto px-4 text-center rounded-md ${
							flagColor[artistData?.flag]
						}`}
					>
						{localeLn(flagText[artistData?.flag])}
					</p>
				</div>
			)}
		</>
	)
}

export default ArtistBanned
