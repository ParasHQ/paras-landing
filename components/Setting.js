import Axios from 'axios'
import { sentryCaptureException } from 'lib/sentry'
import { useEffect, useState } from 'react'
import { useToast } from 'hooks/useToast'
import { useIntl } from 'hooks/useIntl'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import WalletHelper from 'lib/WalletHelper'
import { IconX } from './Icons'
import InputDropdown from './Common/form/components/InputDropdown'
import { InputText } from './Common/form'
import { ping } from './Common/RPCStatus'
import { getRPC } from 'config/near'

const Setting = ({ close }) => {
	const { localeLn } = useIntl()
	const toast = useToast()
	const RPC_LIST = getRPC(process.env.APP_ENV)
	const [email, setEmail] = useState('')
	const [minPriceOffer, setMinPriceOffer] = useState('0')
	const [preferences, setPreferences] = useState(['nft-drops', 'newsletter', 'notification'])
	const [initialSetting, setInitialSetting] = useState(null)
	const [isUpdating, setIsUpdating] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [rpcList, setRpcList] = useState([])

	useEffect(() => {
		fetchEmail()
	}, [])

	useEffect(() => {
		const fetchPingRPC = async () => {
			const pingRes = await Promise.all(
				Object.entries(RPC_LIST).map(async ([key, data]) => {
					const time = await ping(data.url, key)
					return {
						id: key,
						label: data.simpleName,
						ping: time > 0 ? time : 'timeout',
					}
				})
			)
			setRpcList(pingRes)
		}
		fetchPingRPC()
	}, [])

	const fetchEmail = async () => {
		const resp = await Axios.get(`${process.env.V2_API_URL}/credentials/mail`, {
			headers: {
				authorization: await WalletHelper.authToken(),
			},
		})
		const data = await resp.data.data.results[0]
		if (data) {
			setEmail(data.email)
			setPreferences(data.preferences)
			setMinPriceOffer(data.minPriceOffer !== null ? formatNearAmount(data.minPriceOffer) : '0')
			setInitialSetting(data)
		}
		setIsLoading(false)
	}

	const updateEmail = async () => {
		setIsUpdating(true)
		try {
			const resp = await Axios.put(
				`${process.env.V2_API_URL}/credentials/mail`,
				{ email, preferences, minPriceOffer: parseNearAmount(minPriceOffer) },
				{ headers: { authorization: await WalletHelper.authToken() } }
			)
			const message = resp.data.data
			const toastMessage =
				message === 'verify-email'
					? 'Add email success, please check your email address to verify'
					: 'Update setting success'
			toast.show({
				text: <div className="font-semibold text-center text-sm">{toastMessage}</div>,
				type: 'success',
				duration: 5000,
			})
			setIsUpdating(false)
			fetchEmail()
		} catch (err) {
			sentryCaptureException(err)
			const message = err.response.data.message
			toast.show({
				text: <div className="font-semibold text-center text-sm">{message}</div>,
				type: 'error',
				duration: 2500,
			})
			setIsUpdating(false)
		}
	}

	const updatePreferences = (preference) => {
		let temp = [...preferences]
		temp.includes(preference)
			? temp.splice(preferences.indexOf(preference), 1)
			: temp.push(preference)
		setPreferences(temp)
	}

	const checkIfSettingUnedited = () => {
		return (
			initialSetting?.email === email &&
			initialSetting?.minPriceOffer === minPriceOffer &&
			initialSetting?.preferences.sort().join() === preferences.sort().join()
		)
	}

	const chooseRPC = (id) => {
		localStorage.setItem('choosenRPC', id)
		window.location.reload()
	}

	return (
		<>
			<div className="max-w-md w-full m-auto bg-dark-primary-2 rounded-md p-4">
				<div className="m-auto">
					<div className="flex justify-between">
						<h1 className="text-3xl font-bold text-gray-100 tracking-tight mb-4">
							{localeLn('Setting')}
						</h1>
						<div onClick={close}>
							<IconX size={24} className="cursor-pointer" />
						</div>
					</div>
					{!isLoading ? (
						<>
							{process.env.APP_ENV !== 'testnet' && (
								<>
									<div>
										<label className="font-bold text-xl my-2 text-gray-100">
											{localeLn('AddEmail')}
										</label>
										<InputText
											type="text"
											name="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="Email"
										/>
									</div>
									<div className="text-gray-100 font-bold text-xl mt-4 my-2">
										{localeLn('NotificationPreferences')}
									</div>
									<div className="text-gray-100 flex justify-between items-center my-2">
										<div>
											<div className="text-lg">{localeLn('Newsletters')}</div>
											<div className="text-gray-100 opacity-75 text-sm">
												{localeLn('FirstNotifiedFor')}
											</div>
										</div>
										<Toggle
											id="newsletter"
											value={preferences.includes('newsletter')}
											onChange={() => updatePreferences('newsletter')}
										/>
									</div>
									<div className="text-gray-100 flex justify-between items-center my-2">
										<div>
											<div className="text-lg">{localeLn('NFTDrops')}</div>
											<div className="text-gray-100 opacity-75 text-sm">
												{localeLn('GetFirstNotifiedFor')}
											</div>
										</div>
										<Toggle
											id="nft-drops"
											value={preferences.includes('nft-drops')}
											onChange={() => updatePreferences('nft-drops')}
										/>
									</div>
									<div className="text-gray-100 flex justify-between items-center my-2">
										<div>
											<div className="text-lg">{localeLn('Notification')}</div>
											<div className="text-gray-100 opacity-75 text-sm">
												{localeLn('GetNotifiedForTransaction')}
											</div>
										</div>
										<Toggle
											id="notification"
											value={preferences.includes('notification')}
											onChange={() => updatePreferences('notification')}
										/>
									</div>
									<div className="text-gray-100 flex justify-between items-center gap-2 my-2">
										<div>
											<div className="text-lg">{localeLn('MinPriceOffer')}</div>
											<div className="text-gray-100 opacity-75 text-sm">
												Set the minimum offer you want for your collectibles
											</div>
										</div>
										<div className="flex w-6/12 text-white mt-0.5 mb-2 relative">
											<InputText
												type="number"
												value={minPriceOffer}
												onChange={(e) => setMinPriceOffer(e.target.value)}
											/>
											<div className="absolute right-0 top-0 bottom-0 flex items-center justify-center mr-3">
												Ⓝ
											</div>
										</div>
									</div>
								</>
							)}
							<div className="text-gray-100 flex justify-between items-center gap-2 my-2">
								<div className="text-xl font-bold">{localeLn('RPC URL')}</div>
								<div className="flex mt-0.5 mb-2">
									{rpcList.length !== 0 && (
										<InputDropdown
											data={rpcList}
											selectItem={chooseRPC}
											defaultValue={window.localStorage.getItem('choosenRPC') || 'defaultRpc'}
										/>
									)}
								</div>
							</div>
						</>
					) : (
						<div className="flex items-center justify-center h-64 text-gray-100">
							{localeLn('LoadingLoading')}
						</div>
					)}
					<button
						disabled={
							checkIfSettingUnedited() || email === '' || minPriceOffer === '' || minPriceOffer < 0
						}
						className="outline-none h-12 w-full mt-4 rounded-md bg-transparent text-sm font-semibold border-none px-4 py-2 bg-primary text-gray-100"
						onClick={updateEmail}
					>
						{isUpdating ? localeLn('SavingLoading') : localeLn('Save')}
					</button>
				</div>
			</div>
		</>
	)
}

export default Setting

const Toggle = ({ value, onChange, id }) => {
	return (
		<div className="mb-2">
			<div className="form-switch inline-block align-middle">
				<input
					type="checkbox"
					name={id}
					id={id}
					className="form-switch-checkbox"
					onChange={onChange}
					checked={value}
				/>
				<label className="form-switch-label" htmlFor={id} />
			</div>
		</div>
	)
}
