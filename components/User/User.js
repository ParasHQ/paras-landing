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

		if (showAccountModal) {
			fetchUserBalance()
			document.body.addEventListener('click', onClickEv)
		}

		return () => {
			document.body.removeEventListener('click', onClickEv)
		}
	}, [showAccountModal])

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
							<svg
								width="10"
								height="10"
								viewBox="0 0 21 19"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M20.7846 0.392303L10.3923 18.3923L0 0.392304L20.7846 0.392303Z"
									fill="white"
								/>
							</svg>
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
										<p className="font-medium text-sm opacity-80">NEAR</p>
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
									<a
										className="text-sm text-gray-100 hover:opacity-75"
										href="https://wallet.near.org/"
										target="_blank"
										rel="noreferrer"
									>
										{localeLn('NavViewWallet')}
									</a>
								</div>
							</div>
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
