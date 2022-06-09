import Avatar from 'components/Common/Avatar'
import Button from 'components/Common/Button'
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
										<svg
											width="15"
											height="15"
											viewBox="0 0 18 17"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M17.8095 8.5L15.8343 6.24143L16.1095 3.25429L13.1871 2.59048L11.6571 0L8.90476 1.1819L6.15238 0L4.62238 2.58238L1.7 3.2381L1.97524 6.23333L0 8.5L1.97524 10.7586L1.7 13.7538L4.62238 14.4176L6.15238 17L8.90476 15.81L11.6571 16.9919L13.1871 14.4095L16.1095 13.7457L15.8343 10.7586L17.8095 8.5Z"
												fill="white"
											/>
											<path
												d="M7.3956 12.1429L5.66675 6.494H7.62684L8.74022 10.9039H9.06951L10.1855 5.66675H12.1429L10.4141 12.1429H7.3956Z"
												fill="#0816B3"
											/>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M10.1191 5.26196H14.4169L13.6074 6.88101H10.1191V5.26196Z"
												fill="#0816B3"
											/>
										</svg>
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
