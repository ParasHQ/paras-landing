import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import { parseImgUrl, prettyTruncate } from '../utils/common'
import CopyLink from './CopyLink'

const Profile = ({ userProfile = {}, activeTab }) => {
	const router = useRouter()

	const [isCopied, setIsCopied] = useState(false)

	return (
		<Fragment>
			<div className="flex flex-col items-center justify-center">
				<div className="w-32 h-32 rounded-full overflow-hidden bg-primary">
					<img
						src={parseImgUrl(userProfile?.imgUrl)}
						className="object-cover"
					/>
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
						{userProfile?.bio?.replace(/\n\s*\n\s*\n/g, '\n\n')}
					</p>
					<div className="flex items-center justify-center space-x-2">
						{userProfile?.website && (
							<a
								href={
									!/^https?:\/\//i.test(userProfile?.website)
										? 'http://' + userProfile?.website
										: userProfile?.website
								}
								className="mt-2 mb-4"
								target="_blank"
							>
								<svg
									width="18"
									height="18"
									viewBox="0 0 16 16"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill="#cbd5e0"
										fillRule="evenodd"
										clipRule="evenodd"
										d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"
									/>
								</svg>
							</a>
						)}
						{userProfile.instagramId && (
							<a
								href={'https://instagram.com/' + userProfile?.instagramId}
								className="mt-2 mb-4"
								target="_blank"
							>
								<svg
									viewBox="0 0 511 511.9"
									height="16"
									width="16"
									fill="#cbd5e0"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="m510.949219 150.5c-1.199219-27.199219-5.597657-45.898438-11.898438-62.101562-6.5-17.199219-16.5-32.597657-29.601562-45.398438-12.800781-13-28.300781-23.101562-45.300781-29.5-16.296876-6.300781-34.898438-10.699219-62.097657-11.898438-27.402343-1.300781-36.101562-1.601562-105.601562-1.601562s-78.199219.300781-105.5 1.5c-27.199219 1.199219-45.898438 5.601562-62.097657 11.898438-17.203124 6.5-32.601562 16.5-45.402343 29.601562-13 12.800781-23.097657 28.300781-29.5 45.300781-6.300781 16.300781-10.699219 34.898438-11.898438 62.097657-1.300781 27.402343-1.601562 36.101562-1.601562 105.601562s.300781 78.199219 1.5 105.5c1.199219 27.199219 5.601562 45.898438 11.902343 62.101562 6.5 17.199219 16.597657 32.597657 29.597657 45.398438 12.800781 13 28.300781 23.101562 45.300781 29.5 16.300781 6.300781 34.898438 10.699219 62.101562 11.898438 27.296876 1.203124 36 1.5 105.5 1.5s78.199219-.296876 105.5-1.5c27.199219-1.199219 45.898438-5.597657 62.097657-11.898438 34.402343-13.300781 61.601562-40.5 74.902343-74.898438 6.296876-16.300781 10.699219-34.902343 11.898438-62.101562 1.199219-27.300781 1.5-36 1.5-105.5s-.101562-78.199219-1.300781-105.5zm-46.097657 209c-1.101562 25-5.300781 38.5-8.800781 47.5-8.601562 22.300781-26.300781 40-48.601562 48.601562-9 3.5-22.597657 7.699219-47.5 8.796876-27 1.203124-35.097657 1.5-103.398438 1.5s-76.5-.296876-103.402343-1.5c-25-1.097657-38.5-5.296876-47.5-8.796876-11.097657-4.101562-21.199219-10.601562-29.398438-19.101562-8.5-8.300781-15-18.300781-19.101562-29.398438-3.5-9-7.699219-22.601562-8.796876-47.5-1.203124-27-1.5-35.101562-1.5-103.402343s.296876-76.5 1.5-103.398438c1.097657-25 5.296876-38.5 8.796876-47.5 4.101562-11.101562 10.601562-21.199219 19.203124-29.402343 8.296876-8.5 18.296876-15 29.398438-19.097657 9-3.5 22.601562-7.699219 47.5-8.800781 27-1.199219 35.101562-1.5 103.398438-1.5 68.402343 0 76.5.300781 103.402343 1.5 25 1.101562 38.5 5.300781 47.5 8.800781 11.097657 4.097657 21.199219 10.597657 29.398438 19.097657 8.5 8.300781 15 18.300781 19.101562 29.402343 3.5 9 7.699219 22.597657 8.800781 47.5 1.199219 27 1.5 35.097657 1.5 103.398438s-.300781 76.300781-1.5 103.300781zm0 0" />
									<path d="m256.449219 124.5c-72.597657 0-131.5 58.898438-131.5 131.5s58.902343 131.5 131.5 131.5c72.601562 0 131.5-58.898438 131.5-131.5s-58.898438-131.5-131.5-131.5zm0 216.800781c-47.097657 0-85.300781-38.199219-85.300781-85.300781s38.203124-85.300781 85.300781-85.300781c47.101562 0 85.300781 38.199219 85.300781 85.300781s-38.199219 85.300781-85.300781 85.300781zm0 0" />
									<path d="m423.851562 119.300781c0 16.953125-13.746093 30.699219-30.703124 30.699219-16.953126 0-30.699219-13.746094-30.699219-30.699219 0-16.957031 13.746093-30.699219 30.699219-30.699219 16.957031 0 30.703124 13.742188 30.703124 30.699219zm0 0" />
								</svg>
							</a>
						)}
						{userProfile.twitterId && (
							<a
								href={'https://twitter.com/' + userProfile?.twitterId}
								className="mt-2 mb-4"
								target="_blank"
							>
								<svg
									height="18"
									width="18"
									viewBox="0 0 273.5 222.3"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill="#cbd5e0"
										fillRule="evenodd"
										clipRule="evenodd"
										d="M273.5 26.3a109.77 109.77 0 0 1-32.2 8.8 56.07 56.07 0 0 0 24.7-31 113.39 113.39 0 0 1-35.7 13.6 56.1 56.1 0 0 0-97 38.4 54 54 0 0 0 1.5 12.8A159.68 159.68 0 0 1 19.1 10.3a56.12 56.12 0 0 0 17.4 74.9 56.06 56.06 0 0 1-25.4-7v.7a56.11 56.11 0 0 0 45 55 55.65 55.65 0 0 1-14.8 2 62.39 62.39 0 0 1-10.6-1 56.24 56.24 0 0 0 52.4 39 112.87 112.87 0 0 1-69.7 24 119 119 0 0 1-13.4-.8 158.83 158.83 0 0 0 86 25.2c103.2 0 159.6-85.5 159.6-159.6 0-2.4-.1-4.9-.2-7.3a114.25 114.25 0 0 0 28.1-29.1"
									></path>
								</svg>
							</a>
						)}
					</div>
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
					<div
						className="px-4 relative"
						onClick={(_) => router.push(`/${router.query.id}/publication`)}
					>
						<h4 className="text-gray-100 font-bold cursor-pointer">
							Publication
						</h4>
						{activeTab === 'publication' && (
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
		</Fragment>
	)
}

export default Profile
