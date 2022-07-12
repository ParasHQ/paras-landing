import { IconDiscord, IconTwitter, IconWebsite } from 'components/Icons'
import { useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'

const SocialMediaLaunchpad = ({ socialUrl }) => {
	const [showTooltip, setShowTooltip] = useState(false)
	const randomID = 'social-media-launchpad'

	useEffect(() => {
		setShowTooltip(true)
	}, [socialUrl])

	return (
		<>
			{showTooltip && <ReactTooltip id={randomID} place="top" type="dark" />}
			<div className="flex justify-center gap-3.5 mt-10 md:mt-0">
				{socialUrl.website && (
					<a
						href={
							!/^https?:\/\//i.test(socialUrl?.website)
								? 'http://' + socialUrl?.website
								: socialUrl?.website
						}
						target="_blank"
						rel="noreferrer"
						data-for={randomID}
						data-tip="Website"
					>
						<IconWebsite size={25} color="#cbd5e0" />
					</a>
				)}
				{socialUrl.discord && (
					<a
						href={
							!/^https?:\/\//i.test(socialUrl?.discord)
								? 'http://' + socialUrl?.discord
								: socialUrl?.discord
						}
						target="_blank"
						rel="noreferrer"
						data-for={randomID}
						data-tip="Discord"
					>
						<IconDiscord size={25} />
					</a>
				)}
				{socialUrl.twitter && (
					<a
						href={
							!/^https?:\/\//i.test(socialUrl?.twitter)
								? 'http://' + socialUrl?.twitter
								: socialUrl?.twitter
						}
						target="_blank"
						rel="noreferrer"
						data-for={randomID}
						data-tip="Twitter"
					>
						<IconTwitter size={25} color="#cbd5e0" />
					</a>
				)}
			</div>
		</>
	)
}

export default SocialMediaLaunchpad
