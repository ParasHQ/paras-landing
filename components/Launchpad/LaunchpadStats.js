import { useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import { projectStatus } from './LaunchpadItem'
import TimeLaunchpad from './TimeLaunchpad'

const LaunchpadStats = ({ project, isEnded }) => {
	const [showTooltip, setShowTooltip] = useState(false)
	const [mintDuration, setMintDuration] = useState()
	const randomID = 'launchpad-stats'

	useEffect(() => {
		setShowTooltip(true)
		getMintDuration()
	}, [project])

	const getMintDuration = () => {
		const startDate = new Date(project.mint_details[0].started_at)
		const endedDate = new Date(project.mint_details[0].ended_at)
		const diff = endedDate.getTime() - startDate.getTime()
		setMintDuration(Math.floor(diff / 1000 / 60 / 60))
	}

	const mintDurationType = (status) => {
		switch (status) {
			case 'live':
				return (
					<TimeLaunchpad
						date={project.mint_details[0].ended_at}
						timeType="live"
						isEnded={(e) => isEnded(e)}
					/>
				)
			case 'upcoming':
				if (mintDuration === 0) {
					return `None`
				}
				return `${mintDuration} Hours`
			case 'end':
				return `Ended`
		}
	}

	return (
		<>
			{showTooltip && <ReactTooltip id={randomID} place="top" type="dark" />}
			<div className="max-w-3xl mx-auto mb-16 grid grid-cols-2 md:flex md:flex-wrap md:items-center md:justify-between text-gray-200">
				<div
					className="text-center mb-5 md:mb-0"
					data-for={randomID}
					data-tip="Project status consists of 3 status, Live, Upcoming, and Ended"
				>
					<p className={`text-2xl font-bold ${projectStatus(project.status, true)}`}>
						{projectStatus(project.status)}
					</p>
					<p>Mint Start</p>
				</div>
				<div className="text-center" data-for={randomID} data-tip="Mint time duration">
					<p className="text-2xl font-bold">{mintDurationType(project.status)}</p>
					<p>Mint Duration</p>
				</div>
				<div className="text-center" data-for={randomID} data-tip="Mint price">
					<p className="text-2xl font-bold">
						{project.mint_details[0].price ? `${project.mint_details[0].price} Ⓝ` : `None`}
					</p>
					<p>Starting Price</p>
				</div>
				<div className="text-center" data-for={randomID} data-tip="Total supply NFT">
					<p className="text-2xl font-bold">{project.supply ? project.supply : `None`}</p>
					<p>Items</p>
				</div>
			</div>
		</>
	)
}

export default LaunchpadStats
