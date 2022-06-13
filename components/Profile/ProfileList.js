import Link from 'next/link'
import { parseImgUrl } from 'utils/common'
import InfiniteScroll from 'react-infinite-scroll-component'
import ProfileListLoader from './ProfileListLoader'
import { IconInstagram, IconTwitter, IconWebsite, IconWeibo } from 'components/Icons'

const ProfileList = ({ data, fetchData, hasMore, page }) => {
	if (data.length === 0 && !hasMore) {
		return (
			<div className="w-full">
				<div className="m-auto text-2xl text-gray-600 font-semibold py-32 text-center">
					<div className="w-40 m-auto">
						<img src="/cardstack.png" className="opacity-75" />
					</div>
					<p className="mt-4">No Profiles</p>
				</div>
			</div>
		)
	}
	return (
		<InfiniteScroll
			dataLength={data?.length || 3}
			next={fetchData}
			hasMore={hasMore}
			loader={<ProfileListLoader />}
		>
			<div className="flex flex-wrap pt-4">
				{data.map((profile, index) => (
					<div
						key={index}
						className={`rounded-md overflow-hidden mb-12 md:mb-8 w-full md:w-1/3 md:px-4 ${
							profile?.isCreator || page !== 'search' ? 'opacity-100' : 'opacity-60'
						}`}
					>
						<Link href={`/${profile.accountId}`} shallow={true}>
							<a className="cursor-pointer">
								<div className="flex flex-row flex-wrap md:h-40 h-48 relative">
									<div
										className={`object-cover w-full md:h-40 h-full p-1 transform ease-in-out duration-200 hover:opacity-80 rounded-xl ${
											!profile?.coverUrl ? 'bg-primary' : 'bg-dark-primary-2'
										}`}
										style={{
											backgroundImage: `url(${parseImgUrl(profile?.coverUrl, null)})`,
										}}
									/>
									<div
										className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-3 md:-translate-y-36 right-0 w-24 h-24 overflow-hidden border-4 border-black ${
											!profile.imgUrl ? 'bg-primary' : 'bg-dark-primary-2'
										} shadow-inner z-20 rounded-full mt-8 md:mt-44`}
									>
										<img
											src={parseImgUrl(profile?.imgUrl, null, {
												width: `300`,
											})}
											className="w-full object-cover rounded-full"
										/>
									</div>
								</div>
							</a>
						</Link>
						<div className="text-white mt-14">
							<div className="flex flex-row justify-center">
								<div>
									{profile?.isCreator && (
										<p className="text-white text-center text-xs mb-2 mt-2 p-1 bg-primary bg-opacity-75 rounded-md font-bold w-40 mx-auto">
											Verified Creator
										</p>
									)}
									<div className={`${profile.accountId.length > 20 && 'w-80'}`}>
										<Link href={`/${profile.accountId}`} shallow={true}>
											<a className="cursor-pointer">
												<p className="text-xl text-center hover:underline font-bold overflow-scroll truncate">
													{profile.accountId}
												</p>
											</a>
										</Link>
									</div>
								</div>
							</div>
							<div className="flex items-center justify-center space-x-2">
								{profile?.website && (
									<a
										href={
											!/^https?:\/\//i.test(profile?.website)
												? 'http://' + profile?.website
												: profile?.website
										}
										className="mt-2 mb-4"
										target="_blank"
										rel="noreferrer"
									>
										<IconWebsite size={18} color="#cbd5e0" />
									</a>
								)}
								{profile?.instagramId && (
									<a
										href={'https://instagram.com/' + profile?.instagramId}
										className="mt-2 mb-4"
										target="_blank"
										rel="noreferrer"
									>
										<IconInstagram size={16} color="#cbd5e0" />
									</a>
								)}
								{profile?.twitterId && (
									<a
										href={'https://twitter.com/' + profile?.twitterId}
										className="mt-2 mb-4"
										target="_blank"
										rel="noreferrer"
									>
										<IconTwitter size={18} color="#cbd5e0" />
									</a>
								)}
								{profile?.weiboUrl && (
									<a
										href={
											!/^https?:\/\//i.test(profile?.weiboUrl)
												? 'http://' + profile?.weiboUrl
												: profile?.weiboUrl
										}
										className="mt-2 mb-4"
										target="_blank"
										rel="noreferrer"
									>
										<IconWeibo size={20} color="#cbd5e0" />
									</a>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</InfiniteScroll>
	)
}

export default ProfileList
