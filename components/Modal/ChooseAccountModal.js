import axios from 'axios'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import near from 'lib/near'
import { useEffect, useState } from 'react'
import cachios from 'cachios'
import { parseImgUrl, prettyTruncate } from 'utils/common'
import { IconX } from 'components/Icons'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import useStore from 'lib/store'
import { useIntl } from 'hooks/useIntl'

const ChooseAccountModal = ({ show, onClose }) => {
	const [profileList, setProfileList] = useState([])
	const connectedAccount = near.getAccountAndKey()
	const currentUser = useStore((state) => state.currentUser)
	const { localeLn } = useIntl()

	useEffect(() => {
		const fetchAllUserData = async () => {
			const res = await axios.all(connectedAccount.map(fetchSingleUser))
			setProfileList(res)
		}

		const fetchSingleUser = async ({ accountId }) => {
			const account = await near.wallet?._near?.account(accountId)
			const balance = await account.getAccountBalance()
			return cachios
				.get(`${process.env.V2_API_URL}/profiles`, {
					params: { accountId: accountId },
					ttl: 600,
				})
				.then((response) => ({ ...response.data.data.results[0], balance }))
				.catch((error) => error)
		}

		fetchAllUserData()
	}, [])

	const switchAccount = (account) => {
		if (currentUser === account.accountId) {
			onClose()
			return
		}

		near.switchAccount(account.key)
	}

	const onAddAccount = () => {
		near.login()
	}

	return (
		<Modal isShow={show} close={onClose} closeOnBgClick={false} closeOnEscape={false}>
			<div className="max-w-sm w-full m-auto bg-gray-800 p-4 rounded-md relative">
				<div className="absolute right-0 top-0 pr-4 pt-4">
					<div className="cursor-pointer" onClick={onClose}>
						<IconX />
					</div>
				</div>
				<p className="text-white font-bold text-2xl mb-4">{localeLn('NavSwitchAccount')}</p>

				{connectedAccount.map((account, idx) => (
					<div key={account.key} className="my-4">
						<div className="flex items-center space-x-4">
							<div
								className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-primary cursor-pointer"
								onClick={() => switchAccount(account)}
							>
								<img
									src={parseImgUrl(profileList[idx]?.imgUrl || '', null, {
										width: `300`,
									})}
									className="object-cover"
								/>
							</div>
							<div className="truncate flex-grow">
								<p
									className="text-white font-bold inline cursor-pointer"
									onClick={() => switchAccount(account)}
								>
									{prettyTruncate(account.accountId, 24, 'address')}
								</p>
								<p className="text-white opacity-80">
									{formatNearAmount(profileList[idx]?.balance?.available || '', 2)} Ⓝ
								</p>
							</div>
							{currentUser === account.accountId && (
								<div className="flex-shrink-0 w-3 h-3 rounded-full bg-green-500" />
							)}
						</div>
					</div>
				))}

				{connectedAccount.length < 3 && (
					<Button size="md" className="mt-2" isFullWidth onClick={onAddAccount}>
						{localeLn('NavAddAccount')}
					</Button>
				)}
			</div>
		</Modal>
	)
}

export default ChooseAccountModal
