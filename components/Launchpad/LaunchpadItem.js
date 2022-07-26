import { parseImgUrl, prettyTruncate } from 'utils/common'
import { generateFromString } from 'generate-avatar'
import router from 'next/router'
import TimeLaunchpad from './TimeLaunchpad'
import { useState } from 'react'
import { checkPriceMintCalendar } from 'components/Home/HomeLaunchpad'

const LaunchpadItem = ({ project, className }) => {
	const [isEndedTime, setIsEndedTime] = useState(false)
	const defaultAvatar = `data:image/svg+xml;utf8,${generateFromString(project._id)}`

	const onToProject = () => {
		router.push(`/mint-calendar/${project.launchpad_id}/project/${project._id}`, undefined, {
			shallow: true,
		})
	}

	return (
		<div className={`${className}`}>
			<div onClick={onToProject}>
				<a
					href={`/mint-calendar/${project.launchpad_id}/project/${project._id}`}
					onClick={(e) => e.preventDefault()}
					className="cursor-pointer"
				>
					<div className="flex flex-row flex-wrap md:h-40 h-48">
						<div className="w-full h-full mb-4 rounded">
							<img
								className="object-cover w-full md:h-40 h-full p-1 transform ease-in-out duration-200 hover:opacity-80 rounded-xl"
								src={parseImgUrl(project.profile_image || defaultAvatar, {
									width: '200',
								})}
							/>
						</div>
					</div>
				</a>
			</div>
			<div className="text-white mt-1">
				<div className="flex justify-center">
					<div>
						<div onClick={onToProject}>
							<a
								href={`/mint-calendar/${project.launchpad_id}/project/${project._id}`}
								onClick={(e) => e.preventDefault()}
								className="cursor-pointer"
							>
								<p className="grid grid-flow-col text-md hover:underline font-bold">
									{project.title}
								</p>
							</a>
						</div>
					</div>
				</div>
				<div className="flex justify-around my-2">
					<div className="flex my-1 text-center font-light gap-1">
						<p className="font-light text-xs text-white text-opacity-70 mb-1">Items</p>
						<p className="font-bold text-xs">{project.supply ? project.supply : `None`}</p>
					</div>
					<div className="flex my-1 text-center gap-1">
						<p className="font-light text-xs text-white text-opacity-70 mb-1">Price</p>
						<p className="font-bold text-xs">
							{prettyTruncate(
								project.mint_details[0].price ? checkPriceMintCalendar(project) : `None`,
								7
							)}
						</p>
					</div>
				</div>
				<p className={`text-center ${projectStatus(project.status)}`}>
					{project.status === 'upcoming' && project.started_at !== 0 && !isEndedTime ? (
						<TimeLaunchpad
							date={project.started_at}
							timeType="upcoming"
							isEnded={(e) => setIsEndedTime(e)}
						/>
					) : (
						<>
							{project.status === 'live' && `Live`}
							{project.status === 'upcoming' && `Live`}
							{project.status === 'end' && `Ended`}
						</>
					)}
				</p>
			</div>
		</div>
	)
}

export default LaunchpadItem

export const projectStatus = (status) => {
	if (status === 'live') {
		return 'text-green-500'
	} else if (status === 'upcoming') {
		return 'text-green-500'
	} else if (status === 'end') {
		return 'text-red-500'
	}
}
