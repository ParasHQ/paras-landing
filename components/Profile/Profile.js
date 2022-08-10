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
import {
	IconCopied,
	IconCopy,
	IconInstagram,
	IconLeftArrowMenu,
	IconRightArrowMenu,
	IconTwitter,
	IconWebsite,
	IconWeibo,
	IconInfo,
} from 'components/Icons'
import Tooltip from 'components/Common/Tooltip'
import Follow from 'components/Follow/Follow'

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
				<div className="mt-4 max-w-sm text-center overflow-hidden">
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
								{isCopied ? <IconCopied size={24} /> : <IconCopy size={24} />}
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
								<IconWebsite size={18} color="#cbd5e0" />
							</a>
						)}
						{profileData?.instagramId && (
							<a
								href={'https://instagram.com/' + profileData?.instagramId}
								className="mt-2 mb-4"
								target="_blank"
								rel="noreferrer"
							>
								<IconInstagram size={16} color="#cbd5e0" />
							</a>
						)}
						{profileData?.twitterId && (
							<a
								href={'https://twitter.com/' + profileData?.twitterId}
								className="mt-2 mb-4"
								target="_blank"
								rel="noreferrer"
							>
								<IconTwitter size={18} color="#cbd5e0" />
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
								<IconWeibo size={20} color="#cbd5e0" />
							</a>
						)}
					</div>
					{profileData && <Follow userProfile={profileData} currentUser={currentUser} />}
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
						{TabItems.filter((item) =>
							router.query.id !== currentUser ? item.title !== 'Liked' : item
						).map((tab) => (
							<div key={tab.title} className="px-4 relative flex flex-row">
								<h4
									onClick={() => router.push(`/${router.query.id}/${tab.linkUrl}`)}
									className="text-gray-100 font-bold cursor-pointer"
								>
									{localeLn(tab.title)}
								</h4>
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
								{tab.title === 'Liked' && (
									<Tooltip
										id="locked-fee"
										show={true}
										text={'This page is only visible to you'}
										className="absolute text-center"
										type="dark"
										place="top"
										width="36"
									>
										<IconInfo size={16} color="#ffffff" className="absolute mb-1 ml-1 text-white" />
									</Tooltip>
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
	const router = useRouter()
	const currentUser = useStore((store) => store.currentUser)

	return (
		<div className="mt-4 py-2">
			<ScrollMenu
				LeftArrow={LeftArrow}
				RightArrow={RightArrow}
				wrapperClassName="flex items-center"
				scrollContainerClassName="top-user-scroll"
			>
				{TabItems.filter((item) =>
					router.query.id !== currentUser ? item.title !== 'Liked' : item
				).map((tab) => (
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
		<div className="px-4 relative flex flex-row">
			<h4
				onClick={() => router.push(`/${router.query.id}/${linkUrl}`)}
				className="text-gray-100 font-bold cursor-pointer"
			>
				{localeLn(title)}
			</h4>
			{activeTab === itemId && (
				<div
					className="absolute left-0 right-0"
					style={{
						bottom: `-.10rem`,
					}}
				>
					<div
						className={`${title === 'Liked' ? 'ml-6 w-7' : 'mx-auto w-8'} h-1.5 bg-gray-100`}
					></div>
				</div>
			)}
			{title === 'Liked' && (
				<Tooltip
					id="locked-fee-mobile"
					show={true}
					text={'This page is only visible to you'}
					className=" text-center"
					type="dark"
					place="top"
					width="36"
				>
					<IconInfo size={16} color="#ffffff" className=" z-10 mb-1 ml-1 text-white" />
				</Tooltip>
			)}
		</div>
	)
}

const LeftArrow = () => {
	const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext)

	return (
		<div disabled={isFirstItemVisible} onClick={() => scrollPrev()}>
			<IconLeftArrowMenu />
		</div>
	)
}

const RightArrow = () => {
	const { isLastItemVisible, scrollNext } = useContext(VisibilityContext)

	return (
		<div disabled={isLastItemVisible} onClick={() => scrollNext()}>
			<IconRightArrowMenu />
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
		title: 'Liked',
		linkUrl: 'liked',
		activeTab: 'liked',
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
