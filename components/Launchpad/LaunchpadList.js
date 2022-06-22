import { parseImgUrl } from 'utils/common'
import InfiniteScroll from 'react-infinite-scroll-component'
import ProjectListLoader from 'components/Collection/ProjectListLoader'
import { generateFromString } from 'generate-avatar'
import router from 'next/router'

const LaunchpadList = ({ data, fetchData, hasMore, page }) => {
	if (data.length === 0 && !hasMore) {
		return (
			<div className="w-full">
				<div className="m-auto text-2xl text-gray-600 font-semibold py-32 text-center">
					<div className="w-40 m-auto">
						<img src="/cardstack.png" className="opacity-75" />
					</div>
					<p className="mt-4">No Project</p>
				</div>
			</div>
		)
	}

	return (
		<InfiniteScroll
			dataLength={data?.length || 4}
			next={fetchData}
			hasMore={hasMore}
			loader={<ProjectListLoader />}
		>
			<div className="flex flex-wrap pt-4">
				{data.map((project, index) => (
					<LaunchpadItem
						key={index}
						project={project}
						fullOpacity={page !== 'search'}
						className="rounded-md overflow-hidden mb-12 md:mb-8 w-full md:w-1/3 md:px-4"
					/>
				))}
			</div>
		</InfiniteScroll>
	)
}

export default LaunchpadList

export const LaunchpadItem = ({ project, fullOpacity = true, className, showDetails = true }) => {
	const defaultAvatar = `data:image/svg+xml;utf8,${generateFromString(project.collection_id)}`

	const onToProject = () => {
		router.push(`/launchpad/project-detail/${project.collection_id}`, undefined, { shallow: true })
	}

	return (
		<div
			className={`${className} ${project?.isCreator || fullOpacity ? 'opacity-100' : 'opacity-60'}`}
		>
			<div onClick={onToProject}>
				<a
					href={`/launchpad/project-detail/${project.collection_id}`}
					onClick={(e) => e.preventDefault()}
					className="cursor-pointer"
				>
					<div className="flex flex-row flex-wrap md:h-40 h-48">
						<div className="w-full h-full mb-4 rounded">
							<img
								className="object-cover w-full md:h-40 h-full p-1 transform ease-in-out duration-200 hover:opacity-80 rounded-xl"
								src={parseImgUrl(project.cover || project.media || defaultAvatar, {
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
								href={`/launchpad/project-detail/${project.collection_id}`}
								onClick={(e) => e.preventDefault()}
								className="cursor-pointer"
							>
								<p className="grid grid-flow-col text-md hover:underline font-bold">
									{project.collection}
								</p>
							</a>
						</div>
					</div>
				</div>
				{showDetails && (
					<>
						<div className="flex justify-around my-2">
							<div className="flex my-1 text-center font-light gap-1">
								<p className="font-light text-xs text-white text-opacity-70 mb-1">Items</p>
								<p className="font-bold text-xs">{project.total_cards || 5555}</p>
							</div>
							<div className="flex my-1 text-center gap-1">
								<p className="font-light text-xs text-white text-opacity-70 mb-1">Price</p>
								{/* <p className="font-bold text-xs">{formatNearAmount(collection.volume || '0', 2)} Ⓝ</p> */}
								<p className="font-bold text-xs">7.77 Ⓝ</p>
							</div>
						</div>
						<p className="text-center text-green-500">LIVE</p>
					</>
				)}
			</div>
		</div>
	)
}
