import Link from 'next/link'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Hamburger from 'react-hamburgers'

import useStore from 'lib/store'
import Modal from './Modal'
import { useIntl } from 'hooks/useIntl'
import { useToast } from 'hooks/useToast'
import Setting from './Setting'
import Cookies from 'js-cookie'
import NotificationList from './Notification/NotificationList'
import User from './User/User'
import SlowActivityInfo from './SlowActivityInfo'
import axios from 'axios'
import AutoCompleteList from './AutoComplete/AutoCompleteList'
import { IconQuestion, IconSearch, IconX } from './Icons'

const LIMIT = 5

const Nav = () => {
	const [showMobileNav, setShowMobileNav] = useState(false)
	const [showAutoComplete, setShowAutoComplete] = useState(false)
	const [isRefreshing, setIsRefreshing] = useState(false)

	const [collections, setCollections] = useState()
	const [profiles, setProfiles] = useState()
	const [items, setItems] = useState()

	const store = useStore()
	const router = useRouter()
	const mobileNavRef = useRef()
	const testnetBannerRef = useRef()
	const autoCompleteRef = useRef()
	const toast = useToast()

	const [showSettingModal, setShowSettingModal] = useState(false)
	const [searchQuery, setSearchQuery] = useState(router.query.q || '')
	const { localeLn } = useIntl()

	useEffect(() => {
		const onClickEv = (e) => {
			if (mobileNavRef && !mobileNavRef?.current?.contains(e.target)) {
				setShowMobileNav(false)
			}
			if (autoCompleteRef.current?.contains && !autoCompleteRef.current.contains(e.target)) {
				setShowAutoComplete(false)
			}
		}

		if (showMobileNav) {
			document.body.addEventListener('click', onClickEv)
		}
		if (showAutoComplete) {
			document.body.addEventListener('click', onClickEv)
		}

		return () => {
			document.body.removeEventListener('click', onClickEv)
		}
	}, [showMobileNav, showAutoComplete])

	const debounce = (func, timeout) => {
		let timer

		return function (...args) {
			const context = this
			if (timer) clearTimeout(timer)
			timer = setTimeout(() => {
				timer = null
				func.apply(context, args)
			}, timeout)
		}
	}

	const handleAutoComplete = async (event) => {
		const { value } = event

		if (value.length >= 3) {
			const resSearchAutoComplete = await axios.get(`${process.env.V2_API_URL}/search`, {
				params: {
					search: value,
					__skip: 0,
					__limit: LIMIT,
					is_verified: true,
				},
			})

			const res = resSearchAutoComplete.data.data

			setCollections(res.collections.results)
			setProfiles(res.profiles.results)
			setItems(res.tokenSeries.results)
		}

		setIsRefreshing(false)
	}

	const debounceAutoComplete = debounce(handleAutoComplete, 400)

	const onChangeAutoComplete = (event) => {
		setSearchQuery(event)
		setIsRefreshing(true)
		debounceAutoComplete(event)
	}

	const debounceOnChange = debounce(onChangeAutoComplete, 200)

	const _showTestnetInfo = () => {
		toast.show({
			text: (
				<div className="text-sm text-gray-900">
					<p>
						Testnet is used for creators and collectors to try and experience Paras without the need
						to spend real value cryptocurrency.
					</p>
					<p className="mt-2">
						Creators can use Testnet to prevent any mistakes before publishing on Mainnet.
					</p>
				</div>
			),
			type: 'info',
			duration: null,
		})
	}

	const _handleSubmit = (event) => {
		const data = new FormData(event.target)
		event.preventDefault()
		router.push({
			pathname: '/search',
			query: {
				q: data.get('q'),
			},
		})
	}

	const hideEmailNotVerified = () => {
		Cookies.set('hideEmailNotVerified', 'true', { expires: 3 })
		store.setShowEmailWarning(false)
	}

	const toggleAutoComplete = () => {
		setShowAutoComplete(true)
	}

	const navActive = () => {
		return <div className="absolute left-1/2 transform -translate-x-1/2 px-5 py-0.5 bg-primary" />
	}

	return (
		<Fragment>
			{showSettingModal && (
				<Modal
					close={() => setShowSettingModal(false)}
					closeOnBgClick={false}
					closeOnEscape={false}
				>
					<Setting close={() => setShowSettingModal(false)} />
				</Modal>
			)}
			{store.activitySlowUpdate && process.env.APP_ENV !== 'testnet' && (
				<SlowActivityInfo refresh={router.pathname.includes('activity')} />
			)}
			<div className="sticky top-0 left-0 right-0 z-40 bg-black">
				{process.env.APP_ENV !== 'testnet' && (
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
						<IconX
							size={20}
							className={`absolute right-0 z-50 mr-2 cursor-pointer ${
								!store.showEmailWarning && 'hidden'
							}`}
							onClick={hideEmailNotVerified}
						/>
					</div>
				)}

				{/* Banner for special event */}
				{store.smallBanner && store.smallBanner.is_active && (
					<div
						className={`relative text-white text-center overflow-hidden text-md md:leading-8 m-auto bg-primary z-50 flex items-center justify-center transition-height duration-500 md:h-8`}
					>
						<div dangerouslySetInnerHTML={{ __html: store.smallBanner.bannerText }}></div>
					</div>
				)}

				{process.env.APP_ENV !== 'production' && (
					<div
						ref={testnetBannerRef}
						className="bg-primary relative z-50 text-white text-sm text-center p-1 px-2"
					>
						<p>
							You are using Testnet. Everything here has no value. To use Paras, please switch to{' '}
							<a
								className="text-gray-100 font-semibold border-b-2 border-transparent hover:border-gray-100"
								href="https://mainnet.paras.id"
							>
								Mainnet
							</a>
							<IconQuestion
								size={16}
								className="inline ml-2 cursor-pointer opacity-75"
								onClick={_showTestnetInfo}
							/>
						</p>
					</div>
				)}
				<div className="relative z-40 flex items-center justify-between max-w-6xl m-auto p-4 h-16">
					<div className="flex items-center pr-4">
						<div className="block md:hidden">
							<Hamburger
								active={showMobileNav}
								type="squeeze"
								onClick={() => setShowMobileNav(!showMobileNav)}
							/>
						</div>
						<Link href="/">
							<a>
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
							</a>
						</Link>
					</div>
					<div className="flex-1 pr-4">
						<div className="max-w-sm mr-auto flex items-center">
							<form action="/search" method="get" onSubmit={_handleSubmit} autoComplete="off">
								<div
									ref={autoCompleteRef}
									className="flex border-dark-primary-1 border-2 rounded-lg bg-dark-primary-1"
									onClick={toggleAutoComplete}
								>
									<IconSearch size={36} />
									<input
										id="search"
										name="q"
										type="search"
										value={router.query.search}
										onChange={(e) => debounceOnChange(e.target)}
										placeholder={localeLn('SearchByTitle')}
										className="p-1 pl-0 m-auto bg-transparent focus:bg-transparent border-none text-white text-base md:text-sm font-medium"
										style={{ WebkitAppearance: 'none' }}
									/>
								</div>
								<div className="hidden md:block">
									{showAutoComplete && (
										<AutoCompleteList
											collectionList={collections}
											profileList={profiles}
											itemList={items}
											modal={(e) => setShowAutoComplete(e)}
											searchQuery={searchQuery}
											isRefreshing={isRefreshing}
										/>
									)}
								</div>
							</form>
							<div>
								<Link href={{ pathname: '/languages' }}>
									<a className="flex items-center text-gray-100 text-sm">
										<svg
											className="fill-current text-gray-100 ml-2"
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
										>
											<path d="M0 0h24v24H0z" fill="none"></path>
											<path d=" M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z "></path>
										</svg>
										<span className="pl-2 hidden md:block">{localeLn('Languages')}</span>
									</a>
								</Link>
							</div>
						</div>
					</div>
					<div className="flex items-center -mx-4">
						{/* <div className="px-3 text-gray-100 hidden md:block fireText text-sm">
							<Link href="/drops">
								<a className="block w-full">{localeLn('Drops')}</a>
							</Link>
						</div> */}
						<div className="relative px-3 text-gray-100 hidden md:block text-sm">
							{router.pathname === '/market' ? (
								<a className="cursor-pointer" onClick={() => store.setMarketScrollPersist(0)}>
									{localeLn('Market')}
								</a>
							) : (
								<Link href="/market">
									<a>{localeLn('Market')}</a>
								</Link>
							)}
							{router.pathname.includes('/market') && navActive()}
						</div>
						<div className="relative px-3 text-gray-100 hidden md:block text-sm">
							<Link href="/token">
								<a>{localeLn('Token')}</a>
							</Link>
							{router.pathname === '/token' && navActive()}
						</div>
						<div className="relative px-3 text-gray-100 hidden md:block text-sm">
							<Link href="/activity">
								<a>{localeLn('Activity')}</a>
							</Link>
							{router.pathname === '/activity' && navActive()}
						</div>
						<div className="relative px-3 text-gray-100 hidden md:block text-sm">
							<Link href="/publication">
								<a>{localeLn('Publication')}</a>
							</Link>
							{router.pathname.includes('/publication') && navActive()}
						</div>
						<div className="px-3 text-gray-100 hidden md:block text-sm">
							<a
								href="https://comic.paras.id?utm_source=paras-marketplace&utm_medium=website&utm_campaign=nav"
								target="_blank"
								className="flex cursor-pointer"
								rel="noreferrer"
							>
								{localeLn('Comics')}
							</a>
						</div>
						<div className="px-3 text-gray-100 hidden md:block text-sm">
							<a
								href="https://guide.paras.id/collectors-guide/how-to-do-your-own-research-dyor"
								target="_blank"
								className="flex cursor-pointer"
								rel="noreferrer"
							>
								DYOR
							</a>
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
								<Link href="/login" as={router.asPath}>
									<a className="text-gray-100 ">{localeLn('Login')}</a>
								</Link>
							)}
						</div>
					</div>
				</div>
				<div className="md:hidden">
					{showAutoComplete && (
						<AutoCompleteList
							collectionList={collections}
							profileList={profiles}
							itemList={items}
							modal={(e) => setShowAutoComplete(e)}
							searchQuery={searchQuery}
							isRefreshing={isRefreshing}
						/>
					)}
				</div>
				<div className="relative">
					<div
						ref={mobileNavRef}
						className="absolute bg-black top-0 left-0 right-0 z-30 transform-gpu transition-transform duration-200"
						style={{
							'--tw-translate-y': showMobileNav ? `0%` : `-200%`,
						}}
					>
						<div className="text-center border-b-2 border-dashed border-gray-800">
							<div className="text-gray-400 ">
								<Link href="/">
									<a className={`p-4 block w-full ${router.pathname === '/' && 'text-white'}`}>
										{localeLn('Home')}
									</a>
								</Link>
							</div>
							{/* <div className="text-gray-100 ">
								<Link href="/drops">
									<a className="p-4 block w-full fireText">Drops</a>
								</Link>
							</div> */}
							<div className="text-gray-400 ">
								{router.pathname === '/market' ? (
									<a
										className={`cursor-pointer p-4 block w-full ${
											router.pathname.includes('/market') && 'text-white'
										}`}
										onClick={() => store.setMarketScrollPersist(0)}
									>
										{localeLn('Market')}
									</a>
								) : (
									<Link href="/market">
										<a
											className={`p-4 block w-full ${
												router.pathname.includes('/market') && 'text-white'
											}`}
										>
											{localeLn('Market')}
										</a>
									</Link>
								)}
							</div>
							<div className="text-gray-400 ">
								<Link href="/token">
									<a className={`p-4 block w-full ${router.pathname === '/token' && 'text-white'}`}>
										{localeLn('Token')}
									</a>
								</Link>
							</div>
							<div className="text-gray-400 ">
								<Link href="/activity">
									<a
										className={`p-4 block w-full ${
											router.pathname === '/activity' && 'text-white'
										}`}
									>
										{localeLn('Activity')}
									</a>
								</Link>
							</div>
							<div className="text-gray-400 ">
								<Link href="/publication">
									<a
										className={`p-4 block w-full ${
											router.pathname.includes('/publication') && 'text-white'
										}`}
									>
										{localeLn('Publication')}
									</a>
								</Link>
							</div>
							<div className="text-gray-400 ">
								<a
									href="https://comic.paras.id?utm_source=paras-marketplace&utm_medium=website&utm_campaign=nav"
									target="_blank"
									className="p-4 block w-full"
									rel="noreferrer"
								>
									{localeLn('Comics')}
								</a>
							</div>
							<div className="text-gray-400">
								<a
									href="https://guide.paras.id/collectors-guide/how-to-do-your-own-research-dyor"
									target="_blank"
									className="p-4 block w-full"
									rel="noreferrer"
								>
									DYOR
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	)
}

export default Nav
