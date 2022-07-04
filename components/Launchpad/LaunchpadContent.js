import LaunchpadContentLoader from './LaunchpadContentLoader'

const LaunchpadContent = ({ project, tabActive, setTabActive, isValidating }) => {
	return (
		<>
			<div className="flex justify-center md:justify-start gap-10 mb-6 text-gray-200">
				{project?.content.story && (
					<div className="text-2xl">
						<span className="cursor-pointer" onClick={() => setTabActive('story')}>
							Story
							{tabActive === 'story' && <div className="w-full h-1 bg-gray-200" />}
						</span>
					</div>
				)}
				{project?.content.roadmap && (
					<div className="text-2xl">
						<span className="cursor-pointer" onClick={() => setTabActive('roadmap')}>
							Roadmap
							{tabActive === 'roadmap' && <div className="w-full h-1 bg-gray-200" />}
						</span>
					</div>
				)}
				{project?.content.team && (
					<div className="text-2xl">
						<span className="cursor-pointer" onClick={() => setTabActive('team')}>
							Team
							{tabActive === 'team' && <div className="w-full h-1 bg-gray-200" />}
						</span>
					</div>
				)}
			</div>
			<div className="text-gray-200 text-justify">
				{tabActive === 'story' && !isValidating ? (
					<div dangerouslySetInnerHTML={{ __html: project.content.story }} />
				) : (
					project?.content.story && (
						<>
							<div className="hidden md:block">
								<LaunchpadContentLoader
									uniqueKey="big-launchpad-content-loader"
									contentLength={1}
								/>
							</div>
							<div className="md:hidden">
								<LaunchpadContentLoader
									uniqueKey="small-launchpad-content-loader"
									contentLength={1}
								/>
							</div>
						</>
					)
				)}
				{tabActive === 'roadmap' && !isValidating ? (
					<div dangerouslySetInnerHTML={{ __html: project.content.roadmap }} />
				) : (
					project?.content.roadmap && (
						<>
							<div className="hidden md:block">
								<LaunchpadContentLoader
									uniqueKey="big-launchpad-content-loader"
									contentLength={1}
								/>
							</div>
							<div className="md:hidden">
								<LaunchpadContentLoader
									uniqueKey="small-launchpad-content-loader"
									contentLength={1}
								/>
							</div>
						</>
					)
				)}
				{tabActive === 'team' && !isValidating ? (
					<div dangerouslySetInnerHTML={{ __html: project.content.team }} />
				) : (
					project.content.team && (
						<>
							<div className="hidden md:block">
								<LaunchpadContentLoader
									uniqueKey="big-launchpad-content-loader"
									contentLength={1}
								/>
							</div>
							<div className="md:hidden">
								<LaunchpadContentLoader
									uniqueKey="small-launchpad-content-loader"
									contentLength={1}
								/>
							</div>
						</>
					)
				)}
			</div>
		</>
	)
}

export default LaunchpadContent
