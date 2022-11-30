import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { IconX } from 'components/Icons'
import useStore from 'lib/store'
import ParasRequest from 'lib/ParasRequest'
import { TwitterShareButton } from 'react-share'
import Button from 'components/Common/Button'

const RaffleRewardModal = () => {
	const [showModal, setShowModal] = useState(false)
	const currentUser = useStore((state) => state.currentUser)

	const fetchRewardRaffle = async () =>
		ParasRequest.get(
			`${process.env.V2_API_URL}/activities/popup-notification?account_id=${currentUser}`
		).then((res) => res.data.data)

	const { data } = useSWR(currentUser ? 'raffle-reward-status' : null, fetchRewardRaffle, {
		revalidateOnFocus: false,
		revalidateIfStale: false,
		revalidateOnReconnect: false,
	})

	const onClose = () => {
		setShowModal(false)
	}

	useEffect(() => {
		if (data) {
			setShowModal(true)
		}
	}, [data])

	if (!data || !showModal) {
		return null
	}

	return (
		<div className="fixed z-50 bottom-0 right-0 w-full md:w-auto">
			<div className="max-w-xl relative bg-[#25222b] rounded-md p-4 md:py-6 md:px-10 text-center m-8">
				<div className="absolute right-0 top-0 pr-4 pt-4">
					<div className="cursor-pointer" onClick={onClose}>
						<IconX />
					</div>
				</div>
				<div className="md:w-[23rem]">
					<p className="text-xl md:text-2xl font-semibold text-gray-100">
						Congratulations, {currentUser}!
					</p>
					<p className="text-white pr-2 text-sm mt-2">
						{data.type === 'notification_raffle_won_nft' ? (
							<>
								<span>
									You have won a ${data.msg.card_name} from Paras Loyalty! We will send it to your
									account in 1x24 hours.
								</span>
								<span>
									Read more about the rewards{' '}
									<a className="font-bold cursor-pointer" href={data.msg.winners_publication_url}>
										here
									</a>
								</span>
							</>
						) : data.type === 'notification_raffle_won_paras_token' ? (
							<>
								<span>You have won </span>
								<span>
									{(data.msg.amount_paras_token / 10 ** 18).toLocaleString('en-US')} $PARAS from
									Paras Loyalty raffle! Read more about the rewards{' '}
									<a className="font-bold cursor-pointer" href={data.msg.winners_publication_url}>
										here
									</a>
								</span>
							</>
						) : (
							<>
								<span>You have won 1 </span>
								<span>
									{data?.msg?.collection_name} WL Spot from Paras Loyalty! Read more about the
									rewards{' '}
									<a className="font-bold cursor-pointer" href={data?.msg?.reward_publication_url}>
										here
									</a>
								</span>
							</>
						)}
					</p>
					{(data?.msg.twitterShareContent || data?.msg.twitterShareLink) && (
						<div className="mt-2">
							<Button
								size="sm"
								className="px-6"
								onClick={(e) => {
									e.preventDefault()
									e.stopPropagation()
								}}
							>
								<TwitterShareButton
									title={data?.msg.twitterShareContent}
									url={data?.msg.twitterShareLink || ' '}
									className="flex items-center w-full"
								>
									Share
								</TwitterShareButton>
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default RaffleRewardModal
