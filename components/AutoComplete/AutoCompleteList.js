import Scrollbars from 'react-custom-scrollbars'
import Media from 'components/Common/Media'
import { parseImgUrl } from 'utils/common'
import router from 'next/router'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import Link from 'next/link'

const AutoCompleteImage = ({ media, rounded }) => {
	return (
		<div
			className={`w-10 h-10 flex-shrink-0 rounded-${rounded} overflow-hidden bg-primary shadow-inner`}
		>
			<Media
				url={parseImgUrl(media, null, {
					width: '200',
					useOriginal: process.env.APP_ENV !== 'production',
				})}
				videoControls={false}
				videoMuted={true}
				videoLoop={true}
			/>
		</div>
	)
}

const AutoCompleteList = ({
	collectionList,
	profileList,
	itemList,
	modal,
	searchQuery,
	isRefreshing,
}) => {
	return (
		searchQuery && (
			<div className="md:max-w-2xl w-full absolute mt-1 px-4 md:px-0">
				<div className="text-white bg-dark-primary-2 w-full md:w-2/3 p-1 rounded-md">
					<div className="p-2 shadow-inner bg-dark-primary-2 text-gray-100 rounded-md">
						{isRefreshing ? (
							<div className="flex justify-center my-20">
								<svg
									className="animate-spin m h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
							</div>
						) : (
							<Scrollbars
								autoHeight
								autoHeightMax={`24rem`}
								renderView={(props) => <div {...props} id="scrollableDiv" />}
							>
								<h4 className="font-bold text-2xl px-2">Collections</h4>
								{collectionList?.length === 0 ? (
									<>
										<div className="p-2 opacity-75">
											<div className="border-2 border-dashed rounded-md text-center">
												<p className="text-gray-300 py-4">No Results</p>
											</div>
										</div>
									</>
								) : (
									collectionList?.map((collection, idx) => {
										return (
											<Link key={idx} href={`/collection/${collection.collection_id}`}>
												<a>
													<div
														className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
														onClick={() => modal(false)}
													>
														<AutoCompleteImage media={collection?.media} rounded="full" />
														<div className="mt-1 pl-4 text-gray-300 text-md">
															<div className="flex">
																{collection.collection}
																{collection?.isCreator && (
																	<span className="ml-1">
																		<svg
																			width="16"
																			height="14"
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
																	</span>
																)}
															</div>
															<div className="flex-none text-xs">
																Volume: {formatNearAmount(collection.volume || '0', 2)} Ⓝ
															</div>
														</div>
													</div>
												</a>
											</Link>
										)
									})
								)}
								<h4 className="font-bold text-2xl px-2 pt-4">Profiles</h4>
								{profileList?.length === 0 ? (
									<>
										<div className="p-2 opacity-75">
											<div className="border-2 border-dashed rounded-md text-center">
												<p className="text-gray-300 py-4">No Results</p>
											</div>
										</div>
									</>
								) : (
									profileList?.map((profile, idx) => {
										return (
											<div
												key={idx}
												onClick={() =>
													router.push({
														pathname: !router.query.id && `${profile.accountId}`,
														query: router.query.id && {
															id: `${profile.accountId}`,
														},
													})
												}
											>
												<a>
													<div
														className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
														onClick={() => modal(false)}
													>
														<AutoCompleteImage media={profile?.imgUrl} rounded="full" />
														<div className="flex mt-1 pl-4 text-gray-300 text-md">
															{profile.accountId}
															{profile?.isCreator && (
																<span className="ml-1">
																	<svg
																		width="16"
																		height="14"
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
																</span>
															)}
														</div>
													</div>
												</a>
											</div>
										)
									})
								)}
								<h4 className="font-bold text-2xl px-2 pt-4">Items</h4>
								{itemList?.length === 0 ? (
									<>
										<div className="p-2 opacity-75">
											<div className="border-2 border-dashed rounded-md text-center">
												<p className="text-gray-300 py-4">No Results</p>
											</div>
										</div>
									</>
								) : (
									itemList?.map((item, idx) => {
										return (
											<div
												key={idx}
												onClick={() =>
													router.push(`/token/${item.contract_id}::${item.token_series_id}`)
												}
											>
												<a>
													<div
														className="cursor-pointer p-2 rounded-md button-wrapper flex items-center"
														onClick={() => modal(false)}
													>
														<AutoCompleteImage media={item.metadata?.media} rounded="md" />
														<div className="flex mt-1 pl-4 text-gray-300 text-md">
															{item.metadata.title}
															{item?.isCreator && (
																<span className="ml-1">
																	<svg
																		width="16"
																		height="14"
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
																</span>
															)}
														</div>
													</div>
												</a>
											</div>
										)
									})
								)}
							</Scrollbars>
						)}
					</div>
				</div>
			</div>
		)
	)
}

export default AutoCompleteList
