import Modal from 'components/Modal'
import ProfileEdit from 'components/Profile/ProfileEdit'
import Setting from 'components/Setting'
import { useIntl } from 'hooks/useIntl'
import { useToast } from 'hooks/useToast'
import Link from 'next/link'
import useStore from 'lib/store'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { parseImgUrl, prettyBalance, prettyTruncate } from 'utils/common'
import ChooseAccountModal from 'components/Modal/ChooseAccountModal'
import Scrollbars from 'react-custom-scrollbars'
import WalletHelper, { walletType } from 'lib/WalletHelper'
import near from 'lib/near'
import transakSDK from '@transak/transak-sdk'
import getConfigTransak from 'config/transak'
import { IconTriangle } from 'components/Icons'
import { trackTransakButton } from 'lib/ga'

export function openTransak(fetchNearBalance, toast) {
	const transak = new transakSDK(
		getConfigTransak(process.env.APP_ENV !== 'production' ? 'staging' : 'production')
	)
	transak.init()
	transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
		transak.close()
	})
	transak.on(transak.EVENTS.TRANSAK_ORDER_FAILED, () => {
		toast.show({
			text: (
				<div className="font-semibold text-center text-sm">{`Transaction order was failed`}</div>
			),
			type: 'error',
			duration: 2500,
		})
	})
	transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (successData) => {
		const fiatCurrency = successData?.status?.fiatCurrency
		const fiatAmount = successData?.status?.fiatAmount
		const cryptoCurrency = successData?.status?.cryptoCurrency
		const cryptoAmount = successData?.status?.cryptoAmount
		toast.show({
			text: (
				<div className="font-semibold text-center text-sm">
					{`Transaction order to buy from ${fiatAmount} ${fiatCurrency} to ${cryptoAmount} ${cryptoCurrency} was successfully, please wait for 1-3 minutes for completing the order`}
				</div>
			),
			type: 'success',
			duration: 2500,
		})
		fetchNearBalance()
		transak.close()
	})
}

const User = () => {
	const store = useStore()
	const toast = useToast()
	const accModalRef = useRef()
	const router = useRouter()

	const [showAccountModal, setShowAccountModal] = useState(false)
	const [showUserModal, setShowUserModal] = useState(null)

	const { localeLn } = useIntl()

	useEffect(() => {
		const onClickEv = (e) => {
			if (accModalRef.current?.contains && !accModalRef.current.contains(e.target)) {
				setShowAccountModal(false)
			}
		}

		if (showAccountModal) {
			fetchUserBalance()
			document.body.addEventListener('click', onClickEv)
		}

		return () => {
			document.body.removeEventListener('click', onClickEv)
		}
	}, [showAccountModal])

	const onTransakButtonClick = () => {
		trackTransakButton(near.currentUser?.accountId)
	}

	const fetchUserBalance = async () => {
		const nearbalance = await (await near.near.account(store.currentUser)).getAccountBalance()
		const parasBalance = await WalletHelper.viewFunction({
			methodName: 'ft_balance_of',
			contractId: process.env.PARAS_TOKEN_CONTRACT,
			args: { account_id: store.currentUser },
		})
		store.setUserBalance(nearbalance)
		store.setParasBalance(parasBalance)
	}

	const toggleAccountModal = () => {
		setShowAccountModal(!showAccountModal)
	}

	const _createCard = () => {
		router.push('/new')
	}

	const _createColllection = () => {
		router.push('/new-collection')
	}

	const _createPublication = () => {
		if (process.env.APP_ENV !== 'production') {
			router.push('/publication/create')
		} else if (store.userProfile.isCreator) {
			router.push('/publication/create')
		} else {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						<p>{localeLn('CurrentlyWeOnly')}</p>
						<p className="mt-2">{localeLn('VisitOurDiscord')}</p>
						<div className="mt-2">
							<a
								href="https://discord.paras.id"
								target="_blank"
								className="cursor-pointer border-b-2 border-gray-900"
								rel="noreferrer"
							>
								{localeLn('NavJoinDiscord')}
							</a>
						</div>
					</div>
				),
				type: 'info',
				duration: null,
			})
		}
	}

	const _signOut = () => {
		WalletHelper.signOut()
	}

	const dismissUserModal = () => {
		setShowUserModal(null)
	}

	const onClickSetting = () => {
		setShowUserModal('setting')
		toggleAccountModal()
	}

	const onClickSwitchAccount = () => {
		setShowUserModal('switchAcc')
		toggleAccountModal()
	}

	const onClickEditProfile = () => {
		setShowUserModal('edit')
		toggleAccountModal()
	}

	return (
		<div ref={accModalRef} className="relative">
			{showUserModal === 'setting' && (
				<Modal close={dismissUserModal} closeOnBgClick={false} closeOnEscape={false}>
					<Setting close={dismissUserModal} />
				</Modal>
			)}
			{showUserModal === 'edit' && (
				<Modal close={dismissUserModal} closeOnBgClick={false} closeOnEscape={false}>
					<div className="w-full max-w-sm p-4 m-auto bg-dark-primary-2 rounded-md overflow-hidden">
						<ProfileEdit close={dismissUserModal} />
					</div>
				</Modal>
			)}
			<ChooseAccountModal show={showUserModal === 'switchAcc'} onClose={dismissUserModal} />
			<div
				className="relative flex items-center justify-end text-gray-100"
				onClick={toggleAccountModal}
			>
				<div className="cursor-pointer select-none overflow-hidden rounded-md bg-dark-primary-2">
					<div className="flex items-center w-full h-full button-wrapper p-1">
						<div className="w-8 h-8 rounded-full overflow-hidden bg-primary shadow-inner">
							<img src={store.userProfile?.imgUrl ? parseImgUrl(store.userProfile.imgUrl) : null} />
						</div>
						<div className="ml-1">
							<IconTriangle size={10} />
						</div>
					</div>
				</div>
				{showAccountModal && (
					<div
						className="absolute bottom-0 right-0 z-20"
						style={{
							bottom: `-20px`,
							left: `0px`,
						}}
					>
						<svg
							width="33"
							height="16"
							viewBox="0 0 33 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="mx-auto"
						>
							<path d="M16.1436 0L32.1436 16H0.143593L16.1436 0Z" fill="#26222C" />
						</svg>
					</div>
				)}
			</div>
			{showAccountModal && (
				<div className="absolute right-0 w-64 pt-4 z-10" style={{ maxHeight: '90vh' }}>
					<Scrollbars
						autoHeight
						autoHeightMax={'70vh'}
						renderView={(props) => <div {...props} id="scrollableDiv" />}
					>
						<div className="p-2 shadow-inner bg-dark-primary-2 rounded-md overflow-hidden">
							<div className="w-full px-2 text-gray-100">
								<p className="truncate font-bold text-xl">
									{prettyTruncate(store.currentUser, 18, 'address')}
								</p>
								<div className="w-6 bg-white mb-1" style={{ height: '0.10rem' }} />
								<div>
									<div className="flex justify-between items-end">
										<a
											href="https://wallet.near.org/"
											className="font-medium text-sm opacity-80 hover:opacity-95"
											target="_blank"
											rel="noreferrer"
										>
											<p>NEAR</p>
										</a>
										<p className="font-medium">
											{prettyBalance(store.userBalance.available, 24, 4)} Ⓝ
										</p>
									</div>
									<div className="flex justify-between items-end">
										<p className="font-medium text-sm opacity-80">PARAS</p>
										{store.parasBalance === 0 ? (
											<a
												className="text-sm text-gray-100 hover:opacity-75 font-normal"
												href="https://app.ref.finance/#wrap.near|token.paras.near"
												target="_blank"
												rel="noreferrer"
											>
												{localeLn('NavGetParas')}
											</a>
										) : (
											<p className="font-medium">{prettyBalance(store.parasBalance, 18, 4)} ℗</p>
										)}
									</div>
								</div>
							</div>
							<button
								className="flex items-center justify-center button-wrapper rounded-md p-2 px-4 text-white bg-gray-100 bg-opacity-15 hover:bg-opacity-10 transition-all mt-1"
								onClick={() => {
									openTransak(fetchUserBalance, toast)
									onTransakButtonClick()
								}}
							>
								<p className="flex items-center justify-center text-sm">
									Buy{' '}
									<svg
										className="mx-1 flex"
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<g clipPath="url(#clip0)">
											<path
												className="fill-current"
												d="M19.1736 1.21319L14.2154 8.57143C13.8725 9.07253 14.5318 9.67912 15.0066 9.25714L19.8857 5.01099C20.0175 4.90549 20.2022 4.98462 20.2022 5.16923V18.4352C20.2022 18.6198 19.9648 18.6989 19.8593 18.567L5.09008 0.896703C4.61535 0.316484 3.92964 0 3.1648 0H2.63733C1.2659 0 0.131836 1.13407 0.131836 2.53187V21.2044C0.131836 22.6022 1.2659 23.7363 2.6637 23.7363C3.53403 23.7363 4.35162 23.2879 4.82634 22.5231L9.78458 15.1648C10.1274 14.6637 9.4681 14.0571 8.99337 14.4791L4.11425 18.6989C3.98239 18.8044 3.79777 18.7253 3.79777 18.5407V5.3011C3.79777 5.11648 4.03513 5.03736 4.14063 5.16923L18.9099 22.8396C19.3846 23.4198 20.0967 23.7363 20.8351 23.7363H21.3626C22.7604 23.7363 23.8945 22.6022 23.8945 21.2044V2.53187C23.8945 1.13407 22.7604 0 21.3626 0C20.4659 0 19.6483 0.448352 19.1736 1.21319V1.21319Z"
											/>
										</g>
										<defs>
											<clipPath id="clip0">
												<rect width="24" height="23.7363" fill="white" />
											</clipPath>
										</defs>
									</svg>
									{` `}with
								</p>
								<div className="w-20 h-6 flex items-center justify-center">
									<img src="/transakLogo.png" className="object-contain" alt="" />
								</div>
							</button>
							<hr className="my-2" />
							<div onClick={_createCard}>
								<a className="cursor-pointer p-2 text-gray-100 rounded-md button-wrapper block">
									{localeLn('NavCreateCard')}
								</a>
							</div>
							<div onClick={_createColllection}>
								<a className="cursor-pointer p-2 text-gray-100 rounded-md button-wrapper block">
									{localeLn('NavCreateCollection')}
								</a>
							</div>
							<div onClick={_createPublication}>
								<a className="cursor-pointer p-2 text-gray-100 rounded-md button-wrapper block">
									{localeLn('NavCreatePublication')}
								</a>
							</div>
							<Link href={`/artist-verification`}>
								<a className="cursor-pointer p-2 text-gray-100 rounded-md button-wrapper block">
									Get Verified
								</a>
							</Link>

							<hr className="my-2" />
							<Link href={`/${store.currentUser}`}>
								<a className="cursor-pointer p-2 text-gray-100 rounded-md button-wrapper block">
									{localeLn('NavMyProfile')}
								</a>
							</Link>
							<Link href="/my-bids">
								<a className="cursor-pointer p-2 text-gray-100 rounded-md button-wrapper block">
									{localeLn('NavMyBids')}
								</a>
							</Link>
							<button
								onClick={onClickEditProfile}
								className="w-full text-left cursor-pointer p-2 text-gray-100 rounded-md button-wrapper block"
							>
								{localeLn('EditProfile')}
							</button>
							{process.env.APP_ENV !== 'testnet' && (
								<button
									onClick={onClickSetting}
									className="w-full text-left cursor-pointer p-2 text-gray-100 rounded-md button-wrapper block"
								>
									{localeLn('NavSettings')}
								</button>
							)}
							<hr className="my-2" />
							{WalletHelper.activeWallet === walletType.web && (
								<div
									className="cursor-pointer p-2 text-gray-100 rounded-md button-wrapper block"
									onClick={onClickSwitchAccount}
								>
									{localeLn('NavSwitchAccount')}
								</div>
							)}
							<p
								onClick={_signOut}
								className="cursor-pointer p-2 text-gray-100 rounded-md button-wrapper block"
							>
								{localeLn('NavLogOut')}
							</p>
						</div>
					</Scrollbars>
				</div>
			)}
		</div>
	)
}

export default User
