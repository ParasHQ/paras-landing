import { useEffect, useState } from 'react'
import { getProfiles } from 'utils/common'

function useProfileData(creatorId) {
	const [profileData, setProfileData] = useState(null)

	useEffect(() => {
		if (creatorId) {
			getProfiles(creatorId, setProfileData)
		}
	}, [creatorId])

	return profileData
}

export default useProfileData
