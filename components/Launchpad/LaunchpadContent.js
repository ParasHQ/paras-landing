const LaunchpadContent = ({ project, tabActive, setTabActive }) => {
	return (
		<>
			<div className="flex justify-center md:justify-start gap-10 mb-6 text-gray-200">
				<div className="text-2xl">
					<span className="cursor-pointer" onClick={() => setTabActive('story')}>
						Story
						{tabActive === 'story' && <div className="w-full h-1 bg-gray-200" />}
					</span>
				</div>
				<div className="text-2xl">
					<span className="cursor-pointer" onClick={() => setTabActive('roadmap')}>
						Roadmap
						{tabActive === 'roadmap' && <div className="w-full h-1 bg-gray-200" />}
					</span>
				</div>
				<div className="text-2xl">
					<span className="cursor-pointer" onClick={() => setTabActive('team')}>
						Team
						{tabActive === 'team' && <div className="w-full h-1 bg-gray-200" />}
					</span>
				</div>
			</div>
			<div className="text-gray-200 text-justify">
				{tabActive === 'story' &&
					(project.content.story ? (
						<div dangerouslySetInnerHTML={{ __html: project.content.story }} />
					) : (
						<div className="text-center my-20">No Story</div>
					))}
				{tabActive === 'roadmap' &&
					(project.content.roadmap ? (
						<div dangerouslySetInnerHTML={{ __html: project.content.roadmap }} />
					) : (
						<div className="text-center my-20">No Roadmap</div>
					))}
				{tabActive === 'team' &&
					(project.content.team ? (
						<div dangerouslySetInnerHTML={{ __html: project.content.team }} />
					) : (
						<div className="text-center my-20">No Team</div>
					))}
			</div>
		</>
	)
}

export default LaunchpadContent
