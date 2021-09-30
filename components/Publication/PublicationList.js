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
				<div className="flex mt-auto">
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
						/>
					</p>
				</div>
			</div>
		</div>
	)
}

export default PublicationList
