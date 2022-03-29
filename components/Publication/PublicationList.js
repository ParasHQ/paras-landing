import LinkToProfile from 'components/LinkToProfile'
import Link from 'next/link'
import { parseImgUrl } from 'utils/common'

const PublicationList = ({ data }) => {
	return (
		<div className="publication-card rounded-md overflow-hidden border-dashed border-2 border-gray-800">
			<div className="relative z-10 bg-gray-800">
				<Link href={`/publication/${data.slug}-${data._id}`}>
					<a>
						<div className="h-64 overflow-hidden m-auto cursor-pointer shadow-inner">
							<img
								className="publication-card-img h-64 w-full object-cover"
								src={parseImgUrl(data.thumbnail, null, {
									width: `600`,
								})}
							/>
						</div>
					</a>
				</Link>
				{data.isComic && (
					<div
						className="absolute bottom-4 right-0 py-1 px-3 rounded-l-lg text-white -mr-4 w-24 shadow-2xl"
						style={{ backgroundColor: '#00BBDB' }}
					>
						Comic
					</div>
				)}
			</div>
			<div className="flex flex-col p-4 -mt-1 h-48">
				<Link href={`/publication/${data.slug}-${data._id}`}>
					<a>
						<div className="cursor-pointer">
							<div
								className="overflow-hidden"
								style={{
									maxHeight: `3.75rem`,
								}}
							>
								<h1 className="text-gray-100 text-xl font-bold line-clamp-2 border-b-2 border-transparent">
									{data.title}
								</h1>
							</div>
							<div
								className="overflow-hidden mt-2"
								style={{
									maxHeight: `3.2rem`,
								}}
							>
								<p className="text-gray-300 line-clamp-2">{data.description}</p>
							</div>
						</div>
					</a>
				</Link>
				<div className="flex justify-between items-center mt-auto">
					<p className="text-white">
						<span className="capitalize">
							<Link href={`/publication?type=${data.type}`} shallow={true}>
								<a className="text-white font-semibold hover:border-white border-b-2 border-transparent">
									{data.type}
								</a>
							</Link>
						</span>
						<span className="px-2">|</span>
						<LinkToProfile
							accountId={data.author_id}
							className="text-white font-semibold hover:border-white"
							isComic={data?.isComic}
						/>
					</p>
					<div className="mt-1">
						<div className="text-gray-100 font-semibold">
							<div className="flex gap-1 items-start">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									></path>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									></path>
								</svg>
								{!data.view ? '0' : data.view}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PublicationList
