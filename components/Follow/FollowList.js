import Avatar from 'components/Common/Avatar'
import Button from 'components/Common/Button'
import { IconVerified } from 'components/Icons'
import Link from 'next/link'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { parseImgUrl, prettyTruncate } from 'utils/common'
import FollowListLoader from './FollowListLoader'

const FollowList = ({ data, getMoreData, hasMore }) => {
	const [buttonHover, setButtonHover] = useState()

	return (
		<div className="rounded-md ml-1 md:ml-0">
			{data.length === 0 && !hasMore && (
				<div className="w-full">
					<div className="m-auto text-2xl text-gray-600 font-semibold py-32 text-center">
						<p>No Following</p>
					</div>
				</div>
			)}
			<InfiniteScroll
				dataLength={data.length}
				next={getMoreData}
				hasMore={hasMore}
				loader={<FollowListLoader length={2} />}
			>
				<div>
					{data.map((user, idx) => {
						return (
							<div className="flex items-center gap-2 mt-2" key={idx}>
								<div className="ml-1 md:ml-2">
									<Link href={`/${user?.accountId}`}>
										<div className="relative hover:opacity-80 cursor-pointer">
											<a>
												<Avatar
													size="lg"
													src={parseImgUrl(user?.imgUrl)}
													className="align-bottom"
												/>
											</a>
										</div>
									</Link>
								</div>
								<div>
									<div className="text-white flex gap-1">
										<Link href={`/${user?.accountId}`}>
											<a className="hover:opacity-80 mt-1">{prettyTruncate(user?.accountId, 18)}</a>
										</Link>
										<IconVerified size={15} />
									</div>
								</div>
								<div
									className="absolute right-4"
									onMouseEnter={() => setButtonHover(idx)}
									onMouseLeave={() => setButtonHover(null)}
								>
									<Button
										key={idx}
										className={`mt-1 px-2 w-20 ${
											buttonHover === idx ? 'hover:bg-red-500' : 'bg-[#1B4FA7] '
										}`}
										size="sm"
										variant="error"
									>
										{buttonHover === idx ? 'Unfollow' : 'Following'}
									</Button>
								</div>
							</div>
						)
					})}
				</div>
			</InfiniteScroll>
		</div>
	)
}

export default FollowList
