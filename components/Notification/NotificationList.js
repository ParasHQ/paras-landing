import { Fragment, useEffect, useRef, useState } from 'react'
import useStore from 'lib/store'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'
import Scrollbars from 'react-custom-scrollbars'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import NotificationItem from './NotificationItem'
import WalletHelper from 'lib/WalletHelper'

const LIMIT = 30

const NotificationList = () => {
	const {
		currentUser,
		notificationList,
		setNotificationList,
		notificationUnreadList,
		setNotificationUnreadList,
		notificationListIdBefore,
		setNotificationListIdBefore,
		notificationListHasMore,
		setNotificationListHasMore,
		userProfile,
		setUserProfile,
	} = useStore((state) => ({
		currentUser: state.currentUser,
		notificationList: state.notificationList,
		setNotificationList: state.setNotificationList,
		notificationUnreadList: state.notificationUnreadList,
		setNotificationUnreadList: state.setNotificationUnreadList,
		notificationListIdBefore: state.notificationListIdBefore,
		setNotificationListIdBefore: state.setNotificationListIdBefore,
		notificationListHasMore: state.notificationListHasMore,
		setNotificationListHasMore: state.setNotificationListHasMore,
		userProfile: state.userProfile,
		setUserProfile: state.setUserProfile,
	}))

	const accModalRef = useRef()

	const [isFetching, setIsFetching] = useState(false)
	const [showNotificationModal, setShowNotificationModal] = useState(false)
	const [hasNotification, setHasNotification] = useState(false)
	const { localeLn } = useIntl()
	useEffect(() => {
		if (userProfile?.has_notification) {
			setHasNotification(true)
		}
	}, [userProfile])

	useEffect(() => {
		const onClickEv = (e) => {
			if (accModalRef.current?.contains && !accModalRef.current?.contains(e.target)) {
				setShowNotificationModal(false)
			}
		}

		if (showNotificationModal) {
			document.body.addEventListener('click', onClickEv)
		}

		return () => {
			document.body.removeEventListener('click', onClickEv)
		}
	}, [showNotificationModal])

	useEffect(() => {
		if (showNotificationModal) {
			_fetchData()
			if (hasNotification) {
				setHasNotification(false)
				const newProfile = { ...userProfile, ...{ has_notification: false } }
				setUserProfile(newProfile)
			}
		}
	}, [showNotificationModal, notificationUnreadList])

	const toggleAccountModal = () => {
		setShowNotificationModal(!showNotificationModal)
	}

	const _fetchData = async () => {
		if (!notificationListHasMore || isFetching) {
			return
		}

		setIsFetching(true)
		try {
			const res = await axios.get(`${process.env.V2_API_URL}/activities/notifications`, {
				params: {
					account_id: currentUser,
					_id_before: notificationListIdBefore,
					__limit: LIMIT,
				},
				headers: {
					authorization: await WalletHelper.authToken(),
				},
			})
			const newData = await res.data.data

			const newNotificationList = [...notificationList, ...newData.results]
			const unreadList = res.data.data.results.filter((notif) => !notif.isRead)
			setNotificationUnreadList(unreadList)
			setNotificationList(newNotificationList)

			if (newData.results.length === 0) {
				setNotificationListHasMore(false)
			} else {
				setNotificationListHasMore(true)
				setNotificationListIdBefore(newData.results[newData.results.length - 1]._id)
			}
		} catch (err) {
			sentryCaptureException(err)
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
							{hasNotification && (
								<div className="absolute right-0 top-0 p-2">
									<div
										className="rounded-full bg-primary w-2 h-2"
										style={{
											boxShadow: `rgb(83 97 255) 0px 0px 3px 2px`,
										}}
									></div>
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
				{showNotificationModal && (
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
			{showNotificationModal && (
				<Fragment>
					<div
						className="absolute right-0 p-4 z-10 max-w-full md:max-w-none"
						style={{
							width: `24rem`,
						}}
					>
						<div className="p-2 shadow-inner bg-dark-primary-2 text-gray-100 rounded-md">
							<h4 className="font-bold text-2xl px-2">{localeLn('Notifications')}</h4>
							<Scrollbars
								autoHeight
								autoHeightMax={`24rem`}
								renderView={(props) => <div {...props} id="scrollableDiv" />}
							>
								{notificationList.length === 0 && !notificationListHasMore ? (
									<div className="p-2 opacity-75">
										<div className="border-2 border-dashed rounded-md text-center">
											<p className="text-gray-300 py-4">{localeLn('NoNotifications')}</p>
										</div>
									</div>
								) : (
									<InfiniteScroll
										dataLength={notificationList.length}
										next={_fetchData}
										hasMore={notificationListHasMore}
										loader={<h4 className="text-center p-2">{localeLn('LoadingLoading')}</h4>}
										scrollableTarget="scrollableDiv"
									>
										{notificationList.map((notif) => {
											return (
												<div key={notif._id}>
													<NotificationItem
														notif={notif}
														currentUser={currentUser}
														notificationModal={setShowNotificationModal}
													/>
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

export default NotificationList
