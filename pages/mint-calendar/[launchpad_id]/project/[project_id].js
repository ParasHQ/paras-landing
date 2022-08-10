import axios from 'axios'
import Card from 'components/Card/Card'
import Button from 'components/Common/Button'
import Footer from 'components/Footer'
import LaunchpadButtonLoader from 'components/Launchpad/LaunchpadButtonLoader'
import LaunchpadContent from 'components/Launchpad/LaunchpadContent'
import LaunchpadStats from 'components/Launchpad/LaunchpadStats'
import ReminderCheckbox from 'components/Launchpad/ReminderCheckbox'
import SocialMediaLaunchpad from 'components/Launchpad/SocialMediaLaunchpad'
import Nav from 'components/Nav'
import { generateFromString } from 'generate-avatar'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { parseImgUrl } from 'utils/common'
import useStore from 'lib/store'
import WalletHelper from 'lib/WalletHelper'
import Modal from '../../../../components/Modal'
import Setting from '../../../../components/Setting'
import LaunchpadRemindModal from 'components/Modal/LaunchpadRemindModal'

const ProjectPage = ({ project }) => {
	const currentUser = useStore((state) => state.currentUser)
	const currentProfile = useStore((state) => state.userProfile)
	const isEmailVerified = currentProfile.isEmailVerified || false
	const [tabActive, setTabActive] = useState('story')
	const [showRemindMe, setShowRemindMe] = useState(true)
	const [showSettings, setShowSettings] = useState(false)
	const [checkEmailShowed, setCheckEmailShowed] = useState(true)
	const [remindMe, setRemindMe] = useState(false)
	const [isEndedLive, setIsEndedLive] = useState(false)
	const [isEndedComing, setIsEndedComing] = useState(false)
	const router = useRouter()

	const fetchData = (url) => axios(url).then((res) => res.data)

	const changeRemindMe = async () => {
		if (isEmailVerified) {
			try {
				const resp = await axios.post(
					`${process.env.V2_API_URL}/launchpad/${router.query.launchpad_id}/project/${router.query.project_id}/reminder`,
					{
						remind: !remindMe,
					},
					{ headers: { authorization: await WalletHelper.authToken() } }
				)
				if (resp.status == 200) {
					localStorage.setItem(`${router.query.launchpad_id}:${router.query.project_id}`, !remindMe)
					setRemindMe(!remindMe)
				}
			} catch (e) {
				console.log(e)
			}
		} else {
			setCheckEmailShowed(false)
		}
	}

	const goTo = () => {
		closeReminderModal()
		setShowSettings(true)
	}

	const closeReminderModal = () => {
		setCheckEmailShowed(true)
	}

	const { data, isValidating } = useSWR(
		`${process.env.V2_API_URL}/mint-calendar/${router.query.launchpad_id}/project/${router.query.project_id}`,
		fetchData,
		{
			fallbackData: project,
		}
	)

	const headMeta = {
		title: project.title,
		description: project.description,
		image: parseImgUrl(project.profile_image, null, { useOriginal: true }),
		cover: parseImgUrl(project.banner_image, null, { useOriginal: true }),
	}

	useEffect(() => {
		if (!currentUser) {
			setShowRemindMe(false)
		} else {
			setShowRemindMe(true)
			const pref =
				window.localStorage.getItem(`${router.query.launchpad_id}:${router.query.project_id}`) ||
				null
			if (pref == null && project.reminder && project.reminder.includes(currentUser)) {
				setRemindMe(true)
			} else if (pref != null) {
				setRemindMe(pref === 'true')
			}
		}
	}, [currentUser])

	return (
		<div className="min-h-screen bg-black">
			{!checkEmailShowed && !isEmailVerified && currentUser && (
				<Modal close={closeReminderModal} closeOnBgClick={false} closeOnEscape={false}>
					<LaunchpadRemindModal onClose={closeReminderModal} onGoToSetting={goTo} />
				</Modal>
			)}
			{showSettings && currentUser && (
				<Modal close={() => setShowSettings(false)} closeOnBgClick={false} closeOnEscape={false}>
					<Setting close={() => setShowSettings(false)} />
				</Modal>
			)}
			<div
				className="fixed inset-0 opacity-75"
				style={{
					zIndex: 0,
					backgroundImage: `url('/bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			></div>
			<Head>
				<title>{headMeta.title}</title>
				<meta name="description" content={headMeta.description} />

				<meta name="twitter:title" content={headMeta.title} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta name="twitter:description" content={headMeta.description} />
				<meta name="twitter:image" content={headMeta.image} />
				<meta property="og:type" content="website" />
				<meta property="og:title" content={headMeta.title} />
				<meta property="og:site_name" content={headMeta.title} />
				<meta property="og:description" content={headMeta.description} />
				<meta property="og:url" content="https://paras.id" />
				<meta property="og:image" content={headMeta.image} />
			</Head>
			<Nav />
			<div className="max-w-6xl relative m-auto md:mt-20 py-12">
				<div className="flex items-center m-auto justify-center mb-4">
					{project.banner_image === null && (
						<div className="absolute top-0 left-0 w-full h-36 md:h-72 bg-black bg-opacity-10 backdrop-filter backdrop-blur-lg backdrop-saturate-200 -z-10" />
					)}
					<div
						className="absolute top-0 left-0 w-full h-36 md:h-72 bg-center bg-cover bg-dark-primary-2 rounded-b-3xl md:rounded-3xl"
						style={{
							backgroundImage: `url(${parseImgUrl(
								project.banner_image !== 'https://cms.enleap.app/storage/'
									? project.banner_image
									: project.profile_image
							)})`,
						}}
					/>
					<div
						className={`w-36 h-36 overflow-hidden ${
							headMeta.image === null ? 'bg-primary' : 'bg-dark-primary-2'
						} z-0 shadow-inner rounded-full mt-8 md:mt-44`}
					>
						<img
							src={parseImgUrl(
								project?.profile_image ||
									`data:image/svg+xml;utf8,${generateFromString(project._id)}`,
								{
									width: `300`,
								}
							)}
							className="w-full object-cover rounded-full border-8 border-black"
						/>
					</div>
				</div>
				<h1 className="text-4xl font-bold text-gray-100 text-center break-words mb-10">
					{project?.title}
				</h1>
				<LaunchpadStats
					project={data}
					isEnded={(e) => setIsEndedLive(e)}
					isEndedComing={(e) => setIsEndedComing(e)}
					isValidating={isValidating}
				/>
				<div className="max-w-3xl mx-auto md:flex md:justify-start">
					<div className="mx-4 mb-6 md:mb-0 md:w-4/12 h-full relative">
						<Card
							imgUrl={parseImgUrl(
								project.nft_image !== 'https://cms.enleap.app/storage/'
									? project.nft_image
									: project.profile_image,
								null,
								{
									width: `600`,
								}
							)}
							token={{
								title: project.title,
								collection: project.title,
								copies: 1,
								royalty: {},
							}}
						/>
						<div className="absolute mt-6 left-1/2 md:-left-1 md:transform-none transform -translate-x-1/2 md:-right-1">
							{!data && isValidating ? (
								<>
									<div className="hidden md:block">
										<LaunchpadButtonLoader
											uniqueKey="big-launchpad-button-loader"
											contentLength={1}
										/>
									</div>
									<div className="md:hidden">
										<LaunchpadButtonLoader
											uniqueKey="small-launchpad-button-loader"
											contentLength={1}
										/>
									</div>
								</>
							) : (
								<>
									{data.mint_url && data.status === 'live' && (!isEndedLive || !isEndedComing) && (
										<a href={data.mint_url} rel="noreferrer" target="_blank">
											<Button>Mint here</Button>
										</a>
									)}
									{data.mint_url && data.status === 'upcoming' && isEndedComing && (
										<a href={data.mint_url} rel="noreferrer" target="_blank">
											<Button>Mint here</Button>
										</a>
									)}
									{data.status === 'upcoming' && !isEndedComing && (
										<Button isDisabled>Upcoming</Button>
									)}
								</>
							)}
							{showRemindMe && data && data.status === 'upcoming' && !isEndedComing && (
								<ReminderCheckbox value={remindMe} onChange={changeRemindMe} />
							)}
						</div>
					</div>
					<div className="mx-6 mt-28 md:mt-0 md:ml-10 md:w-8/12">
						<LaunchpadContent
							project={data}
							tabActive={tabActive}
							setTabActive={(e) => setTabActive(e)}
						/>
						<div className="relative md:flex justify-between items-center mt-10 text-center">
							<div className="absolute right-0">
								<SocialMediaLaunchpad socialUrl={project.social_urls} />
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default ProjectPage

export async function getServerSideProps({ params }) {
	const resp = await axios.get(
		`${process.env.V2_API_URL}/launchpad/${params.launchpad_id}/project/${params.project_id}`
	)
	if (!resp.data) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}
	return {
		props: {
			project: resp.data,
		},
	}
}
