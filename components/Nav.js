import Link from 'next/link'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Hamburger from 'react-hamburgers'

import near from '../lib/near'
import useStore from '../store'
import Modal from './Modal'
import ProfileEdit from './ProfileEdit'
import { parseImgUrl, prettyBalance, prettyTruncate } from '../utils/common'
import { useToast } from '../hooks/useToast'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'
import Scrollbars from 'react-custom-scrollbars'
import useSWR from 'swr'
import Setting from './Setting'
import Cookies from 'js-cookie'

const LIMIT = 10

const User = () => {
	const store = useStore()
	const toast = useToast()
	const accModalRef = useRef()
	const router = useRouter()

	const [showAccountModal, setShowAccountModal] = useState(false)
	const [showEditAccountModal, setShowEditAccountModal] = useState(false)
	const [showSettingModal, setShowSettingModal] = useState(false)

	useEffect(() => {
		const onClickEv = (e) => {
			if (!accModalRef.current.contains(e.target)) {
				setShowAccountModal(false)
			}
		}

		if (showAccountModal) {
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
		if (process.env.APP_ENV !== 'production') {
			router.push('/new')
		} else if (store.userProfile.isCreator) {
			router.push('/new')
		} else {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						<p>
							Currently we only allow whitelisted Artist to create their digital
							art card on Paras.
						</p>
						<p className="mt-2">Apply now using the link below:</p>
						<div className="mt-2">
							<a
								href="https://forms.gle/QsZHqa2MKXpjckj98"
								target="_blank"
								className="cursor-pointer border-b-2 border-gray-900"
							>
								Apply as an Artist
							</a>
						</div>
					</div>
				),
				type: 'info',
				duration: null,
			})
		}
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
						<p>
							Currently we only allow whitelisted Writer to create their digital
							art card on Paras.
						</p>
						<p className="mt-2">Apply now using the link below:</p>
						<div className="mt-2">
							<a
								href="https://forms.gle/QsZHqa2MKXpjckj98"
								target="_blank"
								className="cursor-pointer border-b-2 border-gray-900"
							>
								Apply as an Writer
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
		near.wallet.signOut()

		window.location.replace(window.location.origin + window.location.pathname)
	}

	return (
		<div ref={accModalRef} className="relative">
			{showSettingModal && (
				<Modal
					close={(_) => setShowSettingModal(false)}
					closeOnBgClick={false}
					closeOnEscape={false}
				>
					<Setting close={() => setShowSettingModal(false)} />
				</Modal>
			)}
			{showEditAccountModal && (
				<Modal
					close={(_) => setShowEditAccountModal(false)}
					closeOnBgClick={false}
					closeOnEscape={false}
				>
					<div className="w-full max-w-sm p-4 m-auto bg-dark-primary-2 rounded-md overflow-hidden">
						<ProfileEdit close={(_) => setShowEditAccountModal(false)} />
					</div>
				</Modal>
			)}
			<div
				className="relative flex items-center justify-end text-gray-100"
				onClick={toggleAccountModal}
			>
				<div className="cursor-pointer select-none overflow-hidden rounded-md bg-dark-primary-2">
					<div className="flex items-center w-full h-full button-wrapper p-1">
						<div className="w-8 h-8 rounded-full overflow-hidden bg-primary shadow-inner">
							<img src={parseImgUrl(store.userProfile.imgUrl)} />
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
							<path
								d="M16.1436 0L32.1436 16H0.143593L16.1436 0Z"
								fill="#26222C"
							/>
						</svg>
					</div>
				)}
			</div>
			{showAccountModal && (
				<div className="absolute right-0 w-56 pt-4 z-10">
					<div className="p-2 shadow-inner bg-dark-primary-2 rounded-md overflow-hidden">
						<div className="px-2 text-gray-100">
							<p className="truncate">{store.currentUser}</p>
							<p className="text-lg">
								{prettyBalance(store.userBalance.available, 24, 4)} Ⓝ
							</p>
							<div>
								<a
									className="text-sm text-gray-100 hover:opacity-75"
									href="https://wallet.near.org/"
									target="_blank"
								>
									View on NEAR Wallet
								</a>
							</div>
						</div>
						<hr className="my-2" />
						<div onClick={_createCard}>
							<a className="cursor-pointer p-2 text-gray-100 rounded-md button-wrapper block">
								Create Card
							</a>
						</div>
						<div onClick={_createPublication}>
							<a className="cursor-pointer p-2 text-gray-100 rounded-md button-wrapper block">
								Create Publication
							</a>
						</div>
						<hr className="my-2" />
						<Link href={`/${store.currentUser}`}>
							<a className="cursor-pointer p-2 text-gray-100 rounded-md button-wrapper block">
								My Profile
							</a>
						</Link>
						<button
							onClick={(_) => {
								setShowEditAccountModal(true)
								toggleAccountModal()
							}}
							className="w-full text-left cursor-pointer p-2 text-gray-100 rounded-md button-wrapper block"
						>
							Edit Profile
						</button>
						<button
							onClick={(_) => {
								setShowSettingModal(true)
								toggleAccountModal()
							}}
							className="w-full text-left cursor-pointer p-2 text-gray-100 rounded-md button-wrapper block"
						>
							Settings
						</button>
						<hr className="my-2" />
						<p
							onClick={_signOut}
							className="cursor-pointer p-2 text-gray-100 rounded-md button-wrapper block"
						>
							Log out
						</p>
					</div>
				</div>
			)}
		</div>
	)
}

const Notification = ({ notif }) => {
	const fetcher = async (key) => {
		const resp = await axios.get(`${process.env.API_URL}/${key}`)
		if (resp.data.data.results.length > 0) {
			return resp.data.data.results[0]
		} else {
			return {}
		}
	}

	const { data: token } = useSWR(
		`tokens?tokenId=${notif.payload.tokenId}`,
		fetcher
	)

	if (notif.type === 'onBuy') {
		return (
			<div>
				<Link href={`/token/${notif.payload.tokenId}`}>
					<div className="cursor-pointer p-2 rounded-md button-wrapper flex items-center">
						<div className="w-16 flex-shrink-0 rounded-md overflow-hidden bg-primary shadow-inner">
							<img src={parseImgUrl(token?.metadata?.image)} />
						</div>
						<div className="pl-2 text-gray-300">
							<span className="font-medium text-gray-100">
								{prettyTruncate(notif.payload.buyer, 12, 'address')}
							</span>{' '}
							bought {notif.payload.quantity}pcs of{' '}
							<span className="font-medium text-gray-100">
								{token?.metadata?.name}
							</span>{' '}
							for {prettyBalance(notif.payload.amount, 24, 4)} Ⓝ
						</div>
					</div>
				</Link>
			</div>
		)
	}
	if (notif.type === 'onBuyRoyalty') {
		return (
			<div>
				<Link href={`/token/${notif.payload.tokenId}`}>
					<div className="cursor-pointer p-2 rounded-md button-wrapper flex items-center">
						<div className="w-16 flex-shrink-0 rounded-md overflow-hidden bg-primary shadow-inner">
							<img src={parseImgUrl(token?.metadata?.image)} />
						</div>
						<div className="pl-2 text-gray-300">
							received royalty{' '}
							{prettyBalance(
								(notif.payload.amount *
									notif.payload.quantity *
									notif.payload.royalty) /
									100,
								24,
								4
							)}{' '}
							Ⓝ
						</div>
					</div>
				</Link>
			</div>
		)
	}
	if (notif.type === 'onBidAdd') {
		return (
			<div>
				<Link href={`/token/${notif.payload.tokenId}?tab=bids`}>
					<div className="cursor-pointer p-2 rounded-md button-wrapper flex items-center">
						<div className="w-16 flex-shrink-0 rounded-md overflow-hidden bg-primary shadow-inner">
							<img src={parseImgUrl(token?.metadata?.image)} />
						</div>
						<div className="pl-2 text-gray-300">
							received new bid from{' '}
							<span className="font-medium text-gray-100">
								{prettyTruncate(notif.payload.accountId, 12, 'address')}
							</span>{' '}
							for {prettyBalance(notif.payload.amount, 24, 4)} Ⓝ
						</div>
					</div>
				</Link>
			</div>
		)
	}
	return (
		<div>
			<Link href={`/token/${notif.payload.tokenId}`}>
				<div className="cursor-pointer p-2 rounded-md button-wrapper flex items-center">
					<div className="w-16 flex-shrink-0 rounded-md overflow-hidden bg-primary shadow-inner">
						<img src={parseImgUrl(token?.metadata?.image)} />
					</div>
					<div className="pl-2 text-gray-300">
						<span className="font-medium text-gray-100">
							{prettyTruncate(notif.payload.from, 12, 'address')}
						</span>{' '}
						send you {notif.payload.quantity}pcs of{' '}
						<span className="font-medium text-gray-100">
							{token?.metadata?.name}
						</span>
					</div>
				</div>
			</Link>
		</div>
	)
}

const NotificationList = () => {
	const {
		currentUser,
		notificationList,
		setNotificationList,
		notificationUnreadList,
		setNotificationUnreadList,
		notificationListPage,
		setNotificationListPage,
		notificationListHasMore,
		setNotificationListHasMore,
	} = useStore()

	const accModalRef = useRef()

	const [isFetching, setIsFetching] = useState(false)
	const [showAccountModal, setShowAccountModal] = useState(false)

	useEffect(() => {
		if (
			currentUser &&
			notificationList.length === 0 &&
			notificationListHasMore
		) {
			_fetchData()
		}
	}, [currentUser, notificationList, notificationListHasMore])

	useEffect(() => {
		const onClickEv = (e) => {
			if (!accModalRef.current.contains(e.target)) {
				setShowAccountModal(false)
			}
		}

		if (showAccountModal) {
			document.body.addEventListener('click', onClickEv)
		}

		return () => {
			document.body.removeEventListener('click', onClickEv)
		}
	}, [showAccountModal])

	useEffect(() => {
		if (showAccountModal && notificationUnreadList.length > 0) {
			_readNotificationList()
		}
	}, [showAccountModal, notificationUnreadList])

	const toggleAccountModal = () => {
		setShowAccountModal(!showAccountModal)
	}

	const _readNotificationList = async () => {
		try {
			await axios.put(
				`${process.env.API_URL}/notifications/read`,
				{
					accountId: currentUser,
					notificationIds: notificationUnreadList.map((n) => n._id),
				},
				{
					headers: {
						authorization: await near.authToken(),
					},
				}
			)
			setNotificationUnreadList([])
		} catch (err) {
			console.log(err)
		}
	}

	const _fetchData = async () => {
		if (!notificationListHasMore || isFetching) {
			return
		}

		setIsFetching(true)
		try {
			const res = await axios.get(
				`${process.env.API_URL}/notifications?accountId=${currentUser}&__skip=${
					notificationListPage * LIMIT
				}&__limit=${LIMIT}`,
				{
					headers: {
						authorization: await near.authToken(),
					},
				}
			)
			const newData = await res.data.data

			const newNotificationList = [...notificationList, ...newData.results]
			const unreadList = res.data.data.results.filter((notif) => !notif.isRead)
			setNotificationUnreadList(unreadList)
			setNotificationList(newNotificationList)

			setNotificationListPage(notificationListPage + 1)
			if (newData.results.length === 0) {
				setNotificationListHasMore(false)
			} else {
				setNotificationListHasMore(true)
			}
		} catch (err) {
			console.log(err)
		}
		setIsFetching(false)
	}

	return (
		<div ref={accModalRef}>
			<div className="relative flex items-center justify-end text-gray-100">
				<div
					onClick={toggleAccountModal}
					className="cursor-pointer select-none flex items-center overflow-hidden rounded-full"
				>
					<div className="bg-dark-primary-2">
						<div className="relative w-full h-full button-wrapper p-2">
							{notificationUnreadList.length > 0 && (
								<div className="absolute right-0 top-0 p-2">
									<div className="rounded-full bg-primary w-2 h-2"></div>
								</div>
							)}
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M19 10C19 5.94082 16.7616 3.1235 13.8654 2.27771C13.7605 2.00636 13.5948 1.7541 13.3695 1.54243C12.5997 0.81919 11.4003 0.81919 10.6305 1.54243C10.4057 1.75364 10.2402 2.00525 10.1353 2.27592C7.23535 3.11803 5 5.92919 5 10C5 12.6339 4.46898 14.1098 3.48596 15.1793C3.32161 15.3582 2.87632 15.7678 2.57468 16.0453L2.57465 16.0453L2.57465 16.0453L2.5745 16.0454C2.43187 16.1766 2.32138 16.2783 2.28796 16.3119L2 16.604V20.0141H8.08798C8.29384 21.0761 8.87009 21.7867 9.9122 22.4226C11.1941 23.2049 12.8059 23.2049 14.0878 22.4226C15.0075 21.8614 15.6241 20.9989 15.8743 20.0141H22V16.604L21.712 16.3119C21.6817 16.2812 21.5757 16.1834 21.437 16.0555C21.1363 15.7781 20.6823 15.3592 20.5154 15.1769C19.5317 14.1024 19 12.6246 19 10ZM13.7367 20.0141H10.1786C10.3199 20.2769 10.5607 20.4754 10.954 20.7154C11.5963 21.1073 12.4037 21.1073 13.046 20.7154C13.3434 20.5339 13.5758 20.2937 13.7367 20.0141ZM19.0402 16.5274C19.2506 16.7573 19.7016 17.1774 20 17.4519V18.0141H4V17.4524C4.29607 17.1811 4.74843 16.7613 4.95849 16.5327C6.29422 15.0794 7 13.1178 7 10C7 6.21989 9.33277 4.01238 12 4.01238C14.6597 4.01238 17 6.23129 17 10C17 13.1078 17.706 15.07 19.0402 16.5274Z"
									fill="#e2e8f0"
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
							<path
								d="M16.1436 0L32.1436 16H0.143593L16.1436 0Z"
								fill="#26222C"
							/>
						</svg>
					</div>
				)}
			</div>
			{showAccountModal && (
				<Fragment>
					<div
						className="absolute right-0 p-4 z-10 max-w-full md:max-w-none"
						style={{
							width: `24rem`,
						}}
					>
						<div className="p-2 shadow-inner bg-dark-primary-2 text-gray-100 rounded-md">
							<h4 className="font-bold text-2xl px-2">Notifications</h4>
							<Scrollbars
								autoHeight
								autoHeightMax={`24rem`}
								renderView={(props) => <div {...props} id="scrollableDiv" />}
							>
								{notificationList.length === 0 && !notificationListHasMore ? (
									<div className="p-2 opacity-75">
										<div className="border-2 border-dashed rounded-md text-center">
											<p className="text-gray-300 py-4">No Notifications</p>
										</div>
									</div>
								) : (
									<InfiniteScroll
										dataLength={notificationList.length}
										next={_fetchData}
										hasMore={notificationListHasMore}
										loader={<h4 className="text-center p-2">Loading...</h4>}
										scrollableTarget="scrollableDiv"
									>
										{notificationList.map((notif) => {
											return (
												<div key={notif._id}>
													<Notification notif={notif} />
												</div>
											)
										})}
									</InfiniteScroll>
								)}
							</Scrollbars>
						</div>
					</div>
				</Fragment>
			)}
		</div>
	)
}

const Nav = () => {
	const [showMobileNav, setShowMobileNav] = useState(false)

	const store = useStore()
	const router = useRouter()
	const mobileNavRef = useRef()
	const testnetBannerRef = useRef()
	const toast = useToast()

	const [showSettingModal, setShowSettingModal] = useState(false)
	const [searchQuery, setSearchQuery] = useState(router.query.q || '')

	useEffect(() => {
		const onClickEv = (e) => {
			if (!mobileNavRef.current.contains(e.target)) {
				setShowMobileNav(false)
			}
		}

		if (showMobileNav) {
			document.body.addEventListener('click', onClickEv)
		}

		return () => {
			document.body.removeEventListener('click', onClickEv)
		}
	}, [showMobileNav])

	const _showTestnetInfo = () => {
		toast.show({
			text: (
				<div className="text-sm text-gray-900">
					<p>
						Testnet is used for creators and collectors to try and experience
						Paras without the need to spend real value cryptocurrency.
					</p>
					<p className="mt-2">
						Creators can use Testnet to prevent any mistakes before publishing
						on Mainnet.
					</p>
				</div>
			),
			type: 'info',
			duration: null,
		})
	}

	const _handleSubmit = (event) => {
		event.preventDefault()
		router.push({
			pathname: '/search',
			query: {
				q: searchQuery,
			},
		})
	}

	const hideEmailNotVerified = () => {
		Cookies.set('hideEmailNotVerified', 'true', { expires: 30 })
		store.setShowEmailWarning(false)
	}

	return (
		<Fragment>
			{showSettingModal && (
				<Modal
					close={(_) => setShowSettingModal(false)}
					closeOnBgClick={false}
					closeOnEscape={false}
				>
					<Setting close={() => setShowSettingModal(false)} />
				</Modal>
			)}
			{testnetBannerRef.current && (
				<div
					style={{
						height: `${testnetBannerRef.current.offsetHeight}px`,
					}}
				></div>
			)}
			<div
				className={`h-16 transition-height duration-500 ${
					store.showEmailWarning && 'h-24'
				}`}
			>
				<div className="fixed z-40 top-0 left-0 right-0 bg-black">
					<div
						className={`relative text-white text-center overflow-hidden text-sm md:leading-8 m-auto bg-red-700 z-50 flex items-center justify-center transition-height duration-500 ${
							store.showEmailWarning ? 'md:h-8' : 'h-0'
						}`}
					>
						<div className="px-10 py-1 md:p-0 ">
							Please add your email to be verified as Paras user{' '}
							<span
								onClick={() => setShowSettingModal(true)}
								className="font-bold cursor-pointer hover:underline"
							>
								here
							</span>
						</div>
						<svg
							className={`absolute right-0 z-50 mr-2 cursor-pointer ${
								!store.showEmailWarning && 'hidden'
							}`}
							onClick={hideEmailNotVerified}
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M8.00008 9.41423L3.70718 13.7071L2.29297 12.2929L6.58586 8.00001L2.29297 3.70712L3.70718 2.29291L8.00008 6.5858L12.293 2.29291L13.7072 3.70712L9.41429 8.00001L13.7072 12.2929L12.293 13.7071L8.00008 9.41423Z"
								fill="white"
							/>
						</svg>
					</div>
					{process.env.APP_ENV !== 'production' && (
						<div
							ref={testnetBannerRef}
							className="bg-primary relative z-50 text-white text-sm text-center p-1 px-2"
						>
							<p>
								You are using Testnet. Everything here has no value. To use
								Paras, please switch to{' '}
								<a
									className="text-gray-100 font-semibold border-b-2 border-transparent hover:border-gray-100"
									href="https://mainnet.paras.id"
								>
									Mainnet
								</a>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="inline	ml-2 cursor-pointer opacity-75"
									onClick={_showTestnetInfo}
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8ZM14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8ZM7 10V9.5C7 8.28237 7.42356 7.68233 8.4 6.95C8.92356 6.55733 9 6.44904 9 6C9 5.44772 8.55229 5 8 5C7.44772 5 7 5.44772 7 6H5C5 4.34315 6.34315 3 8 3C9.65685 3 11 4.34315 11 6C11 7.21763 10.5764 7.81767 9.6 8.55C9.07644 8.94267 9 9.05096 9 9.5V10H7ZM9.00066 11.9983C9.00066 12.5506 8.55279 12.9983 8.00033 12.9983C7.44786 12.9983 7 12.5506 7 11.9983C7 11.4461 7.44786 10.9983 8.00033 10.9983C8.55279 10.9983 9.00066 11.4461 9.00066 11.9983Z"
										fill="white"
									/>
								</svg>
							</p>
						</div>
					)}
					<div className="relative z-40 flex items-center justify-between max-w-6xl m-auto p-4 h-16">
						<div className="flex items-center pr-4">
							<div className="block md:hidden">
								<Hamburger
									active={showMobileNav}
									type="squeeze"
									onClick={(_) => setShowMobileNav(!showMobileNav)}
								/>
							</div>
							<Link href="/">
								<svg
									className="cursor-pointer hidden md:block"
									width="80"
									height="19"
									viewBox="0 0 80 19"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M27.8185 18.223L27.4999 17.0833C27.4018 17.1649 27.2956 17.2426 27.1812 17.3161C26.1355 18.0269 24.6813 18.3823 22.8185 18.3823C21.0538 18.3823 19.6486 18.0636 18.6029 17.4264C17.5571 16.7891 17.0342 15.6168 17.0342 13.9092C17.0342 12.3079 17.5653 11.1723 18.6274 10.5024C19.6976 9.83247 21.3561 9.4975 23.6028 9.4975H27.218V9.05633C27.218 8.10045 26.9647 7.41826 26.4582 7.00977C25.9517 6.59311 25.2736 6.38477 24.4239 6.38477C23.6559 6.38477 23.0023 6.5686 22.4631 6.93624C21.9239 7.30389 21.589 7.88803 21.4582 8.68868L17.3406 7.53673C17.5857 6.20504 18.3128 5.20831 19.522 4.54655C20.7393 3.88479 22.3079 3.5539 24.2278 3.5539C27.0056 3.5539 28.9051 4.12988 29.9263 5.28184C30.9476 6.43379 31.4582 8.07186 31.4582 10.196V18.223H27.8185ZM27.218 13.897V11.9852H24.4852C23.276 11.9852 22.4468 12.1364 21.9974 12.4387C21.5563 12.741 21.3357 13.2107 21.3357 13.848C21.3357 14.4771 21.5358 14.9509 21.9362 15.2695C22.3365 15.58 22.9778 15.7352 23.8602 15.7352C24.8324 15.7352 25.633 15.5514 26.2621 15.1838C26.8994 14.8161 27.218 14.3872 27.218 13.897Z"
										fill="white"
									/>
									<path
										d="M43.0744 10.8823C43.0744 9.06041 42.8661 7.87169 42.4494 7.31614C42.0409 6.75242 41.4691 6.47056 40.7338 6.47056C39.8841 6.47056 39.206 6.76876 38.6995 7.36516C38.2746 7.87169 38.0295 8.43542 37.9642 9.05633V18.223H33.7485V3.68871H37.7803L37.8661 5.08576C37.907 5.04491 37.9478 5.00815 37.9887 4.97547C39.0916 4.03593 40.5377 3.56616 42.3269 3.56616C44.2632 3.56616 45.5744 4.16256 46.2607 5.35537C46.947 6.54 47.2901 8.38231 47.2901 10.8823H43.0744Z"
										fill="white"
									/>
									<path
										d="M59.9157 18.223L59.597 17.0833C59.499 17.1649 59.3928 17.2426 59.2784 17.3161C58.2327 18.0269 56.7784 18.3823 54.9157 18.3823C53.151 18.3823 51.7458 18.0636 50.7 17.4264C49.6543 16.7891 49.1314 15.6168 49.1314 13.9092C49.1314 12.3079 49.6624 11.1723 50.7245 10.5024C51.7948 9.83247 53.4533 9.4975 55.7 9.4975H59.3152V9.05633C59.3152 8.10045 59.0619 7.41826 58.5554 7.00977C58.0488 6.59311 57.3707 6.38477 56.5211 6.38477C55.7531 6.38477 55.0995 6.5686 54.5603 6.93624C54.0211 7.30389 53.6861 7.88803 53.5554 8.68868L49.4378 7.53673C49.6829 6.20504 50.41 5.20831 51.6191 4.54655C52.8364 3.88479 54.4051 3.5539 56.325 3.5539C59.1028 3.5539 61.0023 4.12988 62.0235 5.28184C63.0447 6.43379 63.5553 8.07186 63.5553 10.196V18.223H59.9157ZM59.3152 13.897V11.9852H56.5823C55.3732 11.9852 54.5439 12.1364 54.0946 12.4387C53.6534 12.741 53.4328 13.2107 53.4328 13.848C53.4328 14.4771 53.633 14.9509 54.0333 15.2695C54.4337 15.58 55.075 15.7352 55.9573 15.7352C56.9296 15.7352 57.7302 15.5514 58.3593 15.1838C58.9965 14.8161 59.3152 14.3872 59.3152 13.897Z"
										fill="white"
									/>
									<path
										d="M72.9902 18.3455C71.0131 18.3455 69.3914 18.0514 68.1251 17.4632C66.8587 16.8667 66.0376 15.8823 65.6618 14.5097L69.3628 13.1617C69.5262 14.0277 69.9347 14.6445 70.5883 15.0122C71.25 15.3717 72.0262 15.5514 72.9167 15.5514C73.8481 15.5514 74.567 15.4248 75.0736 15.1715C75.5801 14.9182 75.8334 14.5547 75.8334 14.0808C75.8334 13.4844 75.527 13.0963 74.9142 12.9166C74.3097 12.7287 73.317 12.5326 71.9363 12.3284C69.7059 12.0343 68.121 11.589 67.1814 10.9926C66.2419 10.3962 65.7721 9.3627 65.7721 7.89212C65.7721 6.38886 66.4176 5.29409 67.7084 4.60782C69.0074 3.92155 70.7231 3.57841 72.8554 3.57841C74.9224 3.57841 76.5074 3.87253 77.6103 4.46076C78.7214 5.04083 79.4445 5.98445 79.7794 7.29163L76.2133 8.61516C76.0417 7.83084 75.6618 7.25895 75.0736 6.89948C74.4935 6.53183 73.7296 6.34801 72.7819 6.34801C71.8832 6.34801 71.1806 6.4869 70.6741 6.76467C70.1757 7.04245 69.9265 7.40193 69.9265 7.8431C69.9265 8.41499 70.2492 8.77855 70.8947 8.93378C71.5482 9.08901 72.5327 9.26058 73.8481 9.44848C75.9886 9.72626 77.549 10.1715 78.5294 10.7843C79.5098 11.3888 80 12.4101 80 13.848C80 15.4738 79.3668 16.6298 78.1005 17.3161C76.8423 18.0024 75.1389 18.3455 72.9902 18.3455Z"
										fill="white"
									/>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M2.45097 18.3823L0 0L10.3553 1.83823C10.7955 1.95407 11.2031 2.0472 11.5784 2.13296C12.9897 2.45543 13.9444 2.67359 14.4607 3.60292C15.1143 4.77122 15.4411 6.20912 15.4411 7.91663C15.4411 9.63231 15.1143 11.0743 14.4607 12.2426C13.8071 13.4109 12.4387 13.995 10.3553 13.995H5.87007L6.72791 18.3823H2.45097ZM3.799 3.799L9.3876 4.78089C9.62517 4.84277 9.84513 4.89252 10.0477 4.93832C10.8093 5.11057 11.3246 5.2271 11.6032 5.72351C11.9559 6.34755 12.1323 7.11561 12.1323 8.02767C12.1323 8.9441 11.9559 9.71434 11.6032 10.3384C11.2505 10.9624 10.5119 11.2745 9.3876 11.2745H6.8347L5.29625 11.1519L3.799 3.799Z"
										fill="white"
									/>
								</svg>
							</Link>
						</div>
						<div className="flex-1 pr-4">
							<div className="max-w-sm mr-auto">
								<form action="/search" method="get" onSubmit={_handleSubmit}>
									<div className="flex border-dark-primary-1 border-2 rounded-lg bg-dark-primary-1">
										<svg
											width="36"
											height="36"
											viewBox="0 0 32 32"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M10.6667 15.1667C10.6667 12.6814 12.6814 10.6667 15.1667 10.6667C17.6519 10.6667 19.6667 12.6814 19.6667 15.1667C19.6667 17.6519 17.6519 19.6667 15.1667 19.6667C12.6814 19.6667 10.6667 17.6519 10.6667 15.1667ZM15.1667 8C11.2086 8 8 11.2086 8 15.1667C8 19.1247 11.2086 22.3333 15.1667 22.3333C16.6639 22.3333 18.0538 21.8742 19.2035 21.0891L21.7239 23.6095C22.2446 24.1302 23.0888 24.1302 23.6095 23.6095C24.1302 23.0888 24.1302 22.2446 23.6095 21.7239L21.0891 19.2035C21.8742 18.0538 22.3333 16.6639 22.3333 15.1667C22.3333 11.2086 19.1247 8 15.1667 8Z"
												fill="white"
											></path>
										</svg>
										<input
											name="q"
											type="search"
											value={searchQuery}
											onChange={(event) => setSearchQuery(event.target.value)}
											placeholder="Search by title, collection or artist"
											className="p-1 pl-0 m-auto bg-transparent focus:bg-transparent border-none text-white text-sm font-medium"
										/>
									</div>
								</form>
							</div>
						</div>
						<div className="flex items-center -mx-4">
							<div className="px-3 text-gray-100 hidden md:block fireText">
								<Link href="/drops">
									<a>Drops</a>
								</Link>
							</div>
							<div className="px-3 text-gray-100 hidden md:block">
								{router.pathname === '/market' ? (
									<a
										className="cursor-pointer"
										onClick={(_) => store.setMarketScrollPersist(0)}
									>
										Market
									</a>
								) : (
									<Link href="/market">
										<a>Market</a>
									</Link>
								)}
							</div>
							<div className="px-3 text-gray-100 hidden md:block">
								<Link href="/publication/editorial">
									<a>Publication</a>
								</Link>
							</div>
							<div className="px-3 text-gray-100 hidden md:block">
								<Link href="/activity">
									<a>Activity</a>
								</Link>
							</div>
							<div className="px-3 text-gray-100 hidden md:block">
								<Link href="/activity/top-cards">
									<a>Stats</a>
								</Link>
							</div>
							<div className="px-3">
								{store.currentUser ? (
									<div className="flex items-center -mx-2">
										<div className="px-2">
											<NotificationList />
										</div>
										<div className="px-2">
											<User />
										</div>
									</div>
								) : (
									<Link href="/login">
										<a className="text-gray-100 ">Login</a>
									</Link>
								)}
							</div>
						</div>
					</div>
					<div
						ref={mobileNavRef}
						className={`absolute bg-black top-0 left-0 right-0 z-30 transform transition-transform duration-200`}
						style={{ '--transform-translate-y': !showMobileNav && '-24rem' }}
					>
						{testnetBannerRef.current && (
							<div
								style={{
									height: `${testnetBannerRef.current.offsetHeight}px`,
								}}
							></div>
						)}
						<div
							className={`h-16`}
							style={{ height: store.showEmailWarning && '7rem' }}
						></div>
						<div className="text-center border-b-2 border-dashed border-gray-800">
							<div className="text-gray-100 ">
								<Link href="/drops">
									<a className="p-4 block w-full fireText">Drops</a>
								</Link>
							</div>
							<div className="text-gray-100 ">
								{router.pathname === '/market' ? (
									<a
										className="cursor-pointer p-4 block w-full"
										onClick={(_) => store.setMarketScrollPersist(0)}
									>
										Market
									</a>
								) : (
									<Link href="/market">
										<a className="p-4 block w-full">Market</a>
									</Link>
								)}
							</div>
							<div className="text-gray-100 ">
								<Link href="/publication/editorial">
									<a className="p-4 block w-full">Publication</a>
								</Link>
							</div>
							<div className="text-gray-100 ">
								<Link href="/activity">
									<a className="p-4 block w-full">Activity</a>
								</Link>
							</div>
							<div className="text-gray-100">
								<Link href="/activity/top-cards">
									<a className="p-4 block w-full">Stats</a>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	)
}

export default Nav
