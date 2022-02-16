import { useEffect, useState } from 'react'
import cachios from 'cachios'

function useProfileData(creatorId) {
	const [profileData, setProfileData] = useState(null)

	useEffect(async () => {
		if (creatorId) {
			const profileRes = await cachios.get(`${process.env.V2_API_URL}/profiles`, {
				params: {
					accountId: creatorId,
				},
				ttl: 600,
			})
			const userProfile = profileRes.data.data.results[0]
			setProfileData(userProfile)
		}
	}, [creatorId])

	return profileData
}

export default useProfileData
