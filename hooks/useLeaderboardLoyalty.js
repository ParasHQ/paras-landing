import ParasRequest from 'lib/ParasRequest'
import useSWR from 'swr'
import { isEmptyObject } from 'utils/common'

const fetchLeaderboard = async ({ raffleId, currentUser, raffleType }) => {
	return ParasRequest(`${process.env.V2_API_URL}/raffle/${raffleId}/leaderboards`, {
		params: {
			__skip: 0,
			__limit: 10,
			raffle_type: raffleType,
			account_id: currentUser,
		},
	}).then((res) => res.data)
}

const useLeaderboardLoyalty = ({ raffleId, currentUser }) => {
	const {
		data: platinumRes,
		mutate: mutateLbPlatinum,
		isValidating: isValidatingPlatinum,
	} = useSWR(
		'lb-platinum' + raffleId + currentUser,
		() => fetchLeaderboard({ raffleId, currentUser, raffleType: 'platinum' }),
		{ refreshInterval: 5000 }
	)
	const {
		data: goldRes,
		mutate: mutateLbGold,
		isValidating: isValidatingGold,
	} = useSWR(
		'lb-gold' + raffleId + currentUser,
		() => fetchLeaderboard({ raffleId, currentUser, raffleType: 'gold' }),
		{ refreshInterval: 5000 }
	)
	const {
		data: silverRes,
		mutate: mutateLbSilver,
		isValidating: isValidatingSilver,
	} = useSWR(
		'lb-silver' + raffleId + currentUser,
		() => fetchLeaderboard({ raffleId, currentUser, raffleType: 'silver' }),
		{ refreshInterval: 5000 }
	)

	const mutateAll = async () => {
		await Promise.all([mutateLbPlatinum(), mutateLbGold(), mutateLbSilver()])
	}

	return {
		data: {
			platinum: platinumRes?.results || [],
			gold: goldRes?.results || [],
			silver: silverRes?.results || [],
		},
		mutate: mutateAll,
		mutatePlatinum: mutateLbPlatinum,
		mutateGold: mutateLbGold,
		mutateLbSilver: mutateLbSilver,
		isValidating: isValidatingPlatinum || isValidatingGold || isValidatingSilver,
		myRank: !isEmptyObject(platinumRes?.account_id) ? platinumRes?.account_id : null,
	}
}

export default useLeaderboardLoyalty
