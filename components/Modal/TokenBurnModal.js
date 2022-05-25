import { useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import LoginModal from './LoginModal'
import { GAS_FEE } from 'config/constants'
import { sentryCaptureException } from 'lib/sentry'
import { useIntl } from 'hooks/useIntl'
import { trackBurnToken } from 'lib/ga'
import WalletHelper from 'lib/WalletHelper'
import useStore from 'lib/store'
import { useToast } from 'hooks/useToast'
import { mutate } from 'swr'

const TokenBurnModal = ({ show, onClose, data }) => {
	const [showLogin, setShowLogin] = useState(false)
	const [isBurning, setIsBurning] = useState(false)
	const { localeLn } = useIntl()
	const { currentUser } = useStore()
	const toast = useToast()

	const onBurnToken = async () => {
		if (!currentUser) {
			setShowLogin(true)
			return
		}
		setIsBurning(true)

		trackBurnToken(data.token_id)
		try {
			const params = {
				token_id: data.token_id,
			}
			const res = await WalletHelper.callFunction({
				contractId: data.contract_id,
				methodName: `nft_burn`,
				args: params,
				gas: GAS_FEE,
				deposit: `1`,
			})

			if (res?.response.error) {
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							{res?.response.error.kind.ExecutionError}
						</div>
					),
					type: 'error',
					duration: 2500,
				})
				return
			} else if (res) {
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							{`Successfully burned ${data.metadata.title}`}
						</div>
					),
					type: 'success',
					duration: 2500,
				})
				setTimeout(() => {
					onClose()
					mutate(`${data.contract_id}::${data.token_series_id}/${data.token_id}`)
				}, 2500)
			}
			setIsBurning(false)
		} catch (err) {
			sentryCaptureException(err)
			setIsBurning(false)
		}
	}

	return (
		<>
			<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
				<div className="max-w-sm w-full p-4 bg-gray-800 m-4 md:m-auto rounded-md">
					<div>
						<h1 className="text-2xl font-bold text-white tracking-tight">
							{localeLn('BurnAsset')}
						</h1>
						<p className="text-white mt-2">
							{localeLn('AreAboutToBurn')} {data.metadata.title}
						</p>
						<div className="mt-4">
							<div className="mt-2 text-sm text-red-500"></div>
						</div>
						<p className="text-white mt-4 text-sm text-center opacity-90 px-4">
							{localeLn('RedirectedToconfirm')}
						</p>
						<div className="mt-6">
							<Button size="md" isFullWidth onClick={onBurnToken} isLoading={isBurning}>
								{localeLn('Burn')}
							</Button>
							<Button variant="ghost" size="md" isFullWidth className="mt-4" onClick={onClose}>
								{localeLn('Cancel')}
							</Button>
						</div>
					</div>
				</div>
			</Modal>
			<LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
		</>
	)
}

export default TokenBurnModal
