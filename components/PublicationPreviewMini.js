import Link from 'next/link'
import { parseImgUrl } from '../utils/common'
import LinkToProfile from './LinkToProfile'

const PublicationPreviewMini = ({ data }) => {
	return (
		<div className="m-auto border-2 border-dashed my-4 p-2 rounded-md">
			{/* <div className="mb-4">
				<div className="w-24 h-auto flex overflow-hidden">
					<Link href={`/publication/${data.type}/${data.slug}-${data._id}`}>
						<div className="m-auto cursor-pointer">
							<img
								className="w-24 object-contain"
								src={parseImgUrl(data.thumbnail)}
							/>
						</div>
					</Link>
				</div>
			</div> */}
			<div className="m-auto">
				<Link href={`/publication/${data.type}/${data.slug}-${data._id}`}>
					<div className="cursor-pointer">
						<h1 className="font-bold border-b-2 border-transparent">
							{data.title}
						</h1>
						<p className="text-sm mt-1 h-10 overflow-hidden">
							{data.description}
						</p>
					</div>
				</Link>
				{/* <div className="mt-2 flex m-auto">
					<p>
						<span className="capitalize">
							<Link href={`/publication/${data.type}`}>
								<a className="font-bold hover:border-white border-b-2 border-transparent">
									{data.type}
								</a>
							</Link>
						</span>
						<span className="px-2">|</span>
						<LinkToProfile
							accountId={data.authorId}
							className="font-bold hover:border-white"
						/>
					</p>
				</div> */}
			</div>
		</div>
	)
}

export default PublicationPreviewMini
