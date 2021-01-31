import Link from 'next/link'
import { parseImgUrl } from '../utils/common'
import LinkToProfile from './LinkToProfile'

const PublicationList = ({ data }) => {
	return (
		<div className="md:flex max-w-4xl m-auto mt-8">
			<div className="md:w-1/4 md:mr-8">
				<div className="md:w-56 md:h-48 w-full h-auto flex overflow-hidden">
					<Link href={`/publication/${data.type}/${data.slug}-${data._id}`}>
						<div className="m-auto cursor-pointer">
							<img className="w-full" src={parseImgUrl(data.thumbnail)} />
						</div>
					</Link>
				</div>
			</div>
			<div className="md:w-3/4 m-auto">
				<Link href={`/publication/${data.type}/${data.slug}-${data._id}`}>
					<div className="cursor-pointer">
						<h1 className="text-white text-2xl font-bold border-b-2 border-transparent">
							{data.title}
						</h1>
						<p className="text-white mt-2">{data.description}</p>
					</div>
				</Link>
				<div className="mt-2 flex m-auto">
					<p className="text-white">
						<span>Community | </span>
						<LinkToProfile
							accountId={data.authorId}
							className="text-white font-bold hover:border-white"
						/>
					</p>
				</div>
			</div>
		</div>
	)
}

export default PublicationList
