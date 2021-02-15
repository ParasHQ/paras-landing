import { useRouter } from 'next/router'
import { useState } from 'react'
import { parseImgUrl, prettyTruncate } from '../utils/common'
import CopyLink from './CopyLink'

const Profile = ({ userProfile, activeTab }) => {
	const router = useRouter()

	const [isCopied, setIsCopied] = useState(false)

	return (
		<div className="max-w-6xl py-12 px-4 relative m-auto">
			<div className="flex flex-col items-center justify-center">
				<div className="w-32 h-32 rounded-full overflow-hidden bg-primary">
					<img src={parseImgUrl(userProfile.imgUrl)} className="object-cover" />
				</div>
				<div className="mt-4 max-w-sm text-center overflow-hidden">
					<div className="flex items-center justify-center">
						<h4
							className="text-gray-100 font-bold truncate"
							title={router.query.id}
						>
							{' '}
							{prettyTruncate(router.query.id, 12, 'address')}
						</h4>
						<div
							title="Copy Account ID"
							className="relative cursor-pointer pl-4 flex-grow-0"
						>
							<CopyLink
								link={`${router.query.id}`}
								afterCopy={() => {
									setIsCopied(true)
									setTimeout(() => {
										setIsCopied(false)
									}, 2500)
								}}
							>
								{isCopied ? (
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M9.70711 14.2929L19 5L20.4142 6.41421L9.70711 17.1213L4 11.4142L5.41421 10L9.70711 14.2929Z"
											fill="white"
										/>
									</svg>
								) : (
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M10 2H20C21.1523 2 22 2.84772 22 4V14C22 15.1523 21.1523 16 20 16H16V20C16 21.1523 15.1523 22 14 22H4C2.84772 22 2 21.1523 2 20V10C2 8.84772 2.84772 8 4 8H8V4C8 2.84772 8.84772 2 10 2ZM8 10H4V20H14V16H10C8.84772 16 8 15.1523 8 14V10ZM10 4V14H20V4H10Z"
											fill="white"
										/>
									</svg>
								)}
							</CopyLink>
						</div>
					</div>
					<p className="mt-2 text-gray-300 whitespace-pre-line">
						{userProfile.bio?.replace(/\n\s*\n\s*\n/g, '\n\n')}
					</p>
					{userProfile.website && (
						<a
							href={
								!/^https?:\/\//i.test(userProfile.website)
									? 'http://' + userProfile.website
									: userProfile.website
							}
							target="_blank"
							className="cursor-pointer italic"
						>
							<p className="mt-1 text-gray-400 text-sm whitespace-pre-line">
								{userProfile.website}
							</p>
						</a>
					)}
				</div>
			</div>
			<div className="flex justify-center mt-4">
				<div className="flex -mx-4">
					<div
						className="px-4 relative"
						onClick={(_) => router.push(`/${router.query.id}/collection`)}
					>
						<h4 className="text-gray-100 font-bold cursor-pointer">
							Collection
						</h4>
						{activeTab === 'collection' && (
							<div
								className="absolute left-0 right-0"
								style={{
									bottom: `-.25rem`,
								}}
							>
								<div className="mx-auto w-8 h-1 bg-gray-100"></div>
							</div>
						)}
					</div>
					<div
						className="px-4 relative"
						onClick={(_) => router.push(`/${router.query.id}/creation`)}
					>
						<h4 className="text-gray-100 font-bold cursor-pointer">Creation</h4>
						{activeTab === 'creation' && (
							<div
								className="absolute left-0 right-0"
								style={{
									bottom: `-.25rem`,
								}}
							>
								<div className="mx-auto w-8 h-1 bg-gray-100"></div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Profile
