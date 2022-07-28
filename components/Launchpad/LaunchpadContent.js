import { sanitizeHTML } from 'utils/common'

const LaunchpadContent = ({ project, tabActive, setTabActive }) => {
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
				{tabActive === 'story' && (
					<div dangerouslySetInnerHTML={{ __html: sanitizeHTML(project.content.story) }} />
				)}
				{tabActive === 'roadmap' && (
					<div dangerouslySetInnerHTML={{ __html: sanitizeHTML(project.content.roadmap) }} />
				)}
				{tabActive === 'team' && (
					<div dangerouslySetInnerHTML={{ __html: sanitizeHTML(project.content.team) }} />
				)}
			</div>
		</>
	)
}

export default LaunchpadContent
