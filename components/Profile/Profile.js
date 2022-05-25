import { useRouter } from 'next/router'
import { Fragment, useContext, useEffect, useState } from 'react'
import { parseImgUrl, prettyTruncate } from 'utils/common'
import CopyLink from '../Common/CopyLink'
import { useIntl } from 'hooks/useIntl'
import useStore from 'lib/store'
import { flagColor, flagText } from 'constants/flag'
import LineClampText from 'components/Common/LineClampText'
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu'
import ProfileEdit from './ProfileEdit'
import Modal from 'components/Modal'

const Profile = ({ userProfile, activeTab }) => {
	const currentUser = useStore((store) => store.currentUser)
	const router = useRouter()
	const { localeLn } = useIntl()
	const [isCopied, setIsCopied] = useState(false)
	const [showModal, setShowModal] = useState(false)

	const [profileData, setProfileData] = useState(userProfile)
	const userProfileStore = useStore((state) => state.userProfile)

	useEffect(() => {
		if (
			JSON.stringify(userProfileStore) !== '{}' &&
			userProfile?.accountId === userProfileStore?.accountId
		) {
			setProfileData(userProfileStore)
		}
	}, [userProfileStore])

	useEffect(() => {
		setProfileData(userProfile)
	}, [userProfile])

	const dismissUserModal = () => {
		setShowModal(false)
	}

	return (
		<Fragment>
			{showModal && (
				<Modal close={dismissUserModal} closeOnBgClick={false} closeOnEscape={false}>
					<div className="w-full max-w-sm p-4 m-auto bg-dark-primary-2 rounded-md overflow-hidden">
						<ProfileEdit close={dismissUserModal} />
					</div>
				</Modal>
			)}
			<div className="flex flex-col items-center justify-center">
				<div
					className={`absolute top-0 left-0 w-full h-36 md:h-72 bg-center bg-cover -z-0 ${
						profileData?.coverUrl === (null || undefined) ? 'bg-primary' : 'bg-dark-primary-2'
					}`}
					style={{
						backgroundImage: `url(${parseImgUrl(profileData?.coverUrl, null, {
							width: `1152`,
						})})`,
					}}
				>
					{currentUser === profileData?.accountId && (
						<div
							className={`absolute bottom-4 left-4 md:left-10 text-xs md:text-base text-white bg-primary py-2 px-2 rounded-md cursor-pointer ${
								profileData?.coverUrl === (null || undefined) && 'border-2'
							}`}
							onClick={() => setShowModal(true)}
						>
							<div className="flex gap-1">
								<svg
									className="w-4 md:w-6 h-4 md:h-6"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
									<path
										fillRule="evenodd"
										d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
										clipRule="evenodd"
									/>
								</svg>
								<p className="pt-0.5">Edit Profile</p>
							</div>
						</div>
					)}
				</div>
				<div className="w-32 h-32 rounded-full overflow-hidden bg-primary mt-8 md:mt-44 z-0 border-4 border-black">
					<img
						src={parseImgUrl(profileData?.imgUrl, null, {
							width: `300`,
						})}
						className="object-cover"
					/>
				</div>
				<div className="mt-4 max-w-sm text-center overflow-hidden z-0">
					{profileData?.isCreator && (
						<p className="text-white text-xs mb-2 mt-2 p-1 bg-primary bg-opacity-75 rounded-md font-bold w-40 mx-auto">
							Verified Creator
						</p>
					)}
					<div className="flex items-center justify-center mt-2">
						<h4 className="text-gray-100 font-bold truncate pr-4" title={router.query.id}>
							{' '}
							{prettyTruncate(router.query.id, 20, 'address')}
						</h4>
						<div title="Copy Account ID" className="relative cursor-pointer flex-grow-0">
							<CopyLink
								link={`${router.query.id}`}
								afterCopy={() => {
									setIsCopied(true)
									setTimeout(() => {
										setIsCopied(false)
									}, 2500)
								}}
							>
								{isCopied ? (
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
											d="M9.70711 14.2929L19 5L20.4142 6.41421L9.70711 17.1213L4 11.4142L5.41421 10L9.70711 14.2929Z"
											fill="white"
										/>
									</svg>
								) : (
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
											d="M10 2H20C21.1523 2 22 2.84772 22 4V14C22 15.1523 21.1523 16 20 16H16V20C16 21.1523 15.1523 22 14 22H4C2.84772 22 2 21.1523 2 20V10C2 8.84772 2.84772 8 4 8H8V4C8 2.84772 8.84772 2 10 2ZM8 10H4V20H14V16H10C8.84772 16 8 15.1523 8 14V10ZM10 4V14H20V4H10Z"
											fill="white"
										/>
									</svg>
								)}
							</CopyLink>
						</div>
					</div>
					<LineClampText text={profileData?.bio || ''} />
					<div className="flex items-center justify-center space-x-2">
						{profileData?.website && (
							<a
								href={
									!/^https?:\/\//i.test(profileData?.website)
										? 'http://' + profileData?.website
										: profileData?.website
								}
								className="mt-2 mb-4"
								target="_blank"
								rel="noreferrer"
							>
								<svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
									<path
										fill="#cbd5e0"
										fillRule="evenodd"
										clipRule="evenodd"
										d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"
									/>
								</svg>
							</a>
						)}
						{profileData?.instagramId && (
							<a
								href={'https://instagram.com/' + profileData?.instagramId}
								className="mt-2 mb-4"
								target="_blank"
								rel="noreferrer"
							>
								<svg
									viewBox="0 0 511 511.9"
									height="16"
									width="16"
									fill="#cbd5e0"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="m510.949219 150.5c-1.199219-27.199219-5.597657-45.898438-11.898438-62.101562-6.5-17.199219-16.5-32.597657-29.601562-45.398438-12.800781-13-28.300781-23.101562-45.300781-29.5-16.296876-6.300781-34.898438-10.699219-62.097657-11.898438-27.402343-1.300781-36.101562-1.601562-105.601562-1.601562s-78.199219.300781-105.5 1.5c-27.199219 1.199219-45.898438 5.601562-62.097657 11.898438-17.203124 6.5-32.601562 16.5-45.402343 29.601562-13 12.800781-23.097657 28.300781-29.5 45.300781-6.300781 16.300781-10.699219 34.898438-11.898438 62.097657-1.300781 27.402343-1.601562 36.101562-1.601562 105.601562s.300781 78.199219 1.5 105.5c1.199219 27.199219 5.601562 45.898438 11.902343 62.101562 6.5 17.199219 16.597657 32.597657 29.597657 45.398438 12.800781 13 28.300781 23.101562 45.300781 29.5 16.300781 6.300781 34.898438 10.699219 62.101562 11.898438 27.296876 1.203124 36 1.5 105.5 1.5s78.199219-.296876 105.5-1.5c27.199219-1.199219 45.898438-5.597657 62.097657-11.898438 34.402343-13.300781 61.601562-40.5 74.902343-74.898438 6.296876-16.300781 10.699219-34.902343 11.898438-62.101562 1.199219-27.300781 1.5-36 1.5-105.5s-.101562-78.199219-1.300781-105.5zm-46.097657 209c-1.101562 25-5.300781 38.5-8.800781 47.5-8.601562 22.300781-26.300781 40-48.601562 48.601562-9 3.5-22.597657 7.699219-47.5 8.796876-27 1.203124-35.097657 1.5-103.398438 1.5s-76.5-.296876-103.402343-1.5c-25-1.097657-38.5-5.296876-47.5-8.796876-11.097657-4.101562-21.199219-10.601562-29.398438-19.101562-8.5-8.300781-15-18.300781-19.101562-29.398438-3.5-9-7.699219-22.601562-8.796876-47.5-1.203124-27-1.5-35.101562-1.5-103.402343s.296876-76.5 1.5-103.398438c1.097657-25 5.296876-38.5 8.796876-47.5 4.101562-11.101562 10.601562-21.199219 19.203124-29.402343 8.296876-8.5 18.296876-15 29.398438-19.097657 9-3.5 22.601562-7.699219 47.5-8.800781 27-1.199219 35.101562-1.5 103.398438-1.5 68.402343 0 76.5.300781 103.402343 1.5 25 1.101562 38.5 5.300781 47.5 8.800781 11.097657 4.097657 21.199219 10.597657 29.398438 19.097657 8.5 8.300781 15 18.300781 19.101562 29.402343 3.5 9 7.699219 22.597657 8.800781 47.5 1.199219 27 1.5 35.097657 1.5 103.398438s-.300781 76.300781-1.5 103.300781zm0 0" />
									<path d="m256.449219 124.5c-72.597657 0-131.5 58.898438-131.5 131.5s58.902343 131.5 131.5 131.5c72.601562 0 131.5-58.898438 131.5-131.5s-58.898438-131.5-131.5-131.5zm0 216.800781c-47.097657 0-85.300781-38.199219-85.300781-85.300781s38.203124-85.300781 85.300781-85.300781c47.101562 0 85.300781 38.199219 85.300781 85.300781s-38.199219 85.300781-85.300781 85.300781zm0 0" />
									<path d="m423.851562 119.300781c0 16.953125-13.746093 30.699219-30.703124 30.699219-16.953126 0-30.699219-13.746094-30.699219-30.699219 0-16.957031 13.746093-30.699219 30.699219-30.699219 16.957031 0 30.703124 13.742188 30.703124 30.699219zm0 0" />
								</svg>
							</a>
						)}
						{profileData?.twitterId && (
							<a
								href={'https://twitter.com/' + profileData?.twitterId}
								className="mt-2 mb-4"
								target="_blank"
								rel="noreferrer"
							>
								<svg
									height="18"
									width="18"
									viewBox="0 0 273.5 222.3"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill="#cbd5e0"
										fillRule="evenodd"
										clipRule="evenodd"
										d="M273.5 26.3a109.77 109.77 0 0 1-32.2 8.8 56.07 56.07 0 0 0 24.7-31 113.39 113.39 0 0 1-35.7 13.6 56.1 56.1 0 0 0-97 38.4 54 54 0 0 0 1.5 12.8A159.68 159.68 0 0 1 19.1 10.3a56.12 56.12 0 0 0 17.4 74.9 56.06 56.06 0 0 1-25.4-7v.7a56.11 56.11 0 0 0 45 55 55.65 55.65 0 0 1-14.8 2 62.39 62.39 0 0 1-10.6-1 56.24 56.24 0 0 0 52.4 39 112.87 112.87 0 0 1-69.7 24 119 119 0 0 1-13.4-.8 158.83 158.83 0 0 0 86 25.2c103.2 0 159.6-85.5 159.6-159.6 0-2.4-.1-4.9-.2-7.3a114.25 114.25 0 0 0 28.1-29.1"
									></path>
								</svg>
							</a>
						)}
						{profileData?.weiboUrl && (
							<a
								href={
									!/^https?:\/\//i.test(profileData?.weiboUrl)
										? 'http://' + profileData?.weiboUrl
										: profileData?.weiboUrl
								}
								className="mt-2 mb-4"
								target="_blank"
								rel="noreferrer"
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M8.93164 10.6056C7.60156 10.2599 6.09961 10.922 5.52148 12.0939C4.93359 13.2892 5.50195 14.6153 6.8457 15.0489C8.23633 15.4982 9.87695 14.8107 10.4473 13.5196C11.0078 12.2579 10.3066 10.961 8.93164 10.6056V10.6056ZM7.91602 13.6564C7.64648 14.088 7.06641 14.2755 6.63086 14.0782C6.20117 13.8829 6.07422 13.381 6.3457 12.961C6.61328 12.5431 7.17187 12.3556 7.60352 12.5372C8.04102 12.7228 8.18164 13.2208 7.91602 13.6564V13.6564ZM8.80469 12.5138C8.70703 12.6818 8.49023 12.7618 8.32227 12.6915C8.15625 12.6232 8.10352 12.4357 8.19727 12.2716C8.29492 12.1075 8.50195 12.0294 8.66797 12.0939C8.83789 12.1564 8.89844 12.3458 8.80469 12.5138V12.5138ZM15.3379 8.66222C15.6309 8.75597 15.9434 8.59581 16.0391 8.3048C16.2695 7.58995 16.125 6.77355 15.5859 6.17589C15.33 5.89231 15.004 5.6811 14.6406 5.5635C14.2771 5.4459 13.8891 5.42606 13.5156 5.50597C13.4442 5.52116 13.3764 5.5503 13.3162 5.59172C13.256 5.63314 13.2046 5.68602 13.1648 5.74734C13.1251 5.80865 13.0979 5.87721 13.0847 5.94907C13.0715 6.02093 13.0726 6.09469 13.0879 6.16613C13.1032 6.23749 13.1324 6.30514 13.1738 6.3652C13.2153 6.42525 13.2682 6.47652 13.3296 6.51608C13.3909 6.55564 13.4594 6.5827 13.5312 6.59571C13.6031 6.60872 13.6767 6.60743 13.748 6.59191C14.1074 6.51574 14.4961 6.62706 14.7617 6.91808C14.8871 7.05667 14.9736 7.22599 15.0124 7.40884C15.0512 7.59169 15.0408 7.78154 14.9824 7.9591C14.9594 8.02859 14.9503 8.10196 14.9558 8.17497C14.9612 8.24799 14.981 8.31921 15.014 8.38455C15.047 8.44989 15.0926 8.50806 15.1482 8.55571C15.2038 8.60336 15.2683 8.63956 15.3379 8.66222V8.66222ZM17.2871 4.63878C16.1797 3.41027 14.5449 2.94152 13.0352 3.26183C12.952 3.2794 12.8732 3.31323 12.8033 3.36139C12.7333 3.40954 12.6735 3.47105 12.6274 3.5424C12.5813 3.61374 12.5497 3.6935 12.5346 3.77708C12.5194 3.86066 12.5209 3.94642 12.5391 4.02941C12.5567 4.11252 12.5906 4.19133 12.6388 4.26134C12.6869 4.33136 12.7484 4.3912 12.8197 4.43745C12.891 4.4837 12.9706 4.51545 13.0542 4.5309C13.1378 4.54634 13.2235 4.54517 13.3066 4.52745C14.3809 4.29894 15.541 4.63292 16.3301 5.50597C17.1172 6.37902 17.3301 7.57042 16.9941 8.61339C16.8848 8.95324 17.0703 9.31652 17.4102 9.42785C17.75 9.53722 18.1133 9.35167 18.2227 9.01378V9.01183C18.6934 7.53917 18.3965 5.86535 17.2871 4.63878V4.63878ZM14.2383 9.7462C14 9.67589 13.8379 9.62706 13.9629 9.31456C14.2324 8.63683 14.2598 8.05089 13.9688 7.63488C13.4219 6.85167 11.9219 6.89464 10.2031 7.61339C10.2031 7.61339 9.66406 7.84972 9.80078 7.42199C10.0645 6.57238 10.0254 5.86144 9.61328 5.44933C8.68164 4.51574 6.20312 5.48449 4.07617 7.60949C2.48633 9.20128 1.5625 10.8888 1.5625 12.3478C1.5625 15.1388 5.14062 16.836 8.64258 16.836C13.2324 16.836 16.2852 14.17 16.2852 12.0509C16.2852 10.7716 15.207 10.047 14.2383 9.7462ZM8.65234 15.836C5.85938 16.1114 3.44727 14.8497 3.26562 13.0138C3.08398 11.1798 5.20312 9.46886 7.99609 9.19347C10.7891 8.91613 13.2012 10.1798 13.3828 12.0138C13.5625 13.8478 11.4453 15.5587 8.65234 15.836Z"
										fill="white"
									/>
								</svg>
							</a>
						)}
					</div>
				</div>
			</div>
			{profileData?.flag && (
				<div>
					<p
						className={`text-white text-sm mb-2 mt-2 p-1 rounded-md font-bold w-full mx-auto px-8 text-center max-w-2xl ${
							flagColor[profileData?.flag]
						}`}
					>
						{localeLn(flagText[profileData?.flag])}
					</p>
				</div>
			)}
			<div className="hidden sm:block">
				<div className="flex flex-row sm:justify-center overflow-auto mt-4 py-2 w-full">
					<div className="flex flex-row">
						{TabItems.map((tab) => (
							<div
								key={tab.title}
								className="px-4 relative"
								onClick={() => router.push(`/${router.query.id}/${tab.linkUrl}`)}
							>
								<h4 className="text-gray-100 font-bold cursor-pointer">{localeLn(tab.title)}</h4>
								{activeTab === tab.activeTab && (
									<div
										className="absolute left-0 right-0"
										style={{
											bottom: `-.25rem`,
										}}
									>
										<div className="mx-auto w-8 h-1 bg-gray-100"></div>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="sm:hidden">
				<TabProfileMobile activeTab={activeTab} />
			</div>
		</Fragment>
	)
}

const TabProfileMobile = ({ activeTab }) => {
	return (
		<div className="mt-4 py-2">
			<ScrollMenu
				LeftArrow={LeftArrow}
				RightArrow={RightArrow}
				wrapperClassName="flex items-center"
				scrollContainerClassName="top-user-scroll"
			>
				{TabItems.map((tab) => (
					<TabProfile
						key={tab.title}
						itemId={tab.activeTab}
						title={tab.title}
						linkUrl={tab.linkUrl}
						activeTab={activeTab}
					/>
				))}
			</ScrollMenu>
		</div>
	)
}

const TabProfile = ({ itemId, title, linkUrl, activeTab }) => {
	const router = useRouter()
	const { localeLn } = useIntl()

	return (
		<div className="px-4 relative" onClick={() => router.push(`/${router.query.id}/${linkUrl}`)}>
			<h4 className="text-gray-100 font-bold cursor-pointer">{localeLn(title)}</h4>
			{activeTab === itemId && (
				<div
					className="absolute left-0 right-0"
					style={{
						bottom: `-.10rem`,
					}}
				>
					<div className="mx-auto w-8 h-1.5 bg-gray-100"></div>
				</div>
			)}
		</div>
	)
}

const LeftArrow = () => {
	const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext)

	return (
		<div disabled={isFirstItemVisible} onClick={() => scrollPrev()}>
			<svg
				className="w-10 h-10 text-white cursor-pointer"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
					clipRule="evenodd"
				></path>
			</svg>
		</div>
	)
}

const RightArrow = () => {
	const { isLastItemVisible, scrollNext } = useContext(VisibilityContext)

	return (
		<div disabled={isLastItemVisible} onClick={() => scrollNext()}>
			<svg
				className="w-10 h-10 text-white cursor-pointer"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
					clipRule="evenodd"
				></path>
			</svg>
		</div>
	)
}

export default Profile

const TabItems = [
	{
		title: 'Collectibles',
		linkUrl: 'collectibles',
		activeTab: 'collection',
	},
	{
		title: 'Creation',
		linkUrl: 'creation',
		activeTab: 'creation',
	},
	{
		title: 'Collections',
		linkUrl: 'collections',
		activeTab: 'collections',
	},
	{
		title: 'Publication',
		linkUrl: 'publication',
		activeTab: 'publication',
	},
]
