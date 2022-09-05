import RaffleRegisterModal from 'components/Modal/RaffleRegisterModal'
import RaffleRewardModal from 'components/Modal/RaffleRewardModal'
import { useRouter } from 'next/router'

const RaffleLoyaltyModalGroup = ({ children }) => {
	const router = useRouter()

	const showAtSpecificPage = [
		'/',
		'/market',
		'/loyalty',
		'/token',
		'/activity',
		'/collection/[collection_id]',
	]

	if (showAtSpecificPage.includes(router.pathname)) {
		return (
			<>
				{children}
				<RaffleRegisterModal />
				<RaffleRewardModal />
			</>
		)
	}

	return children
}

export default RaffleLoyaltyModalGroup
