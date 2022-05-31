import cachios from 'cachios'
import { useEffect, useState } from 'react'

function useProfileData(creatorId) {
	const [profileData, setProfileData] = useState(null)

	useEffect(() => {
		if (creatorId) {
			const fetchProfile = async () => {
				const profileRes = await cachios.get(`${process.env.V2_API_URL}/profiles`, {
					params: {
						accountId: creatorId,
					},
					ttl: 600,
				})
				const userProfile = profileRes.data.data.results[0]
				setProfileData(userProfile)
			}
			fetchProfile()
		}
	}, [creatorId])

	return profileData
}

export default useProfileData
