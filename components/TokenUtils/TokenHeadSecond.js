import { useEffect } from 'react'
import IconRefresh from 'components/Icons/component/IconRefresh'
import IconShareSecond from 'components/Icons/component/IconShareSecond'
import { IconDots } from 'components/Icons'
import Link from 'next/link'
import Media from 'components/Common/Media'
import IconOut from 'components/Icons/component/IconOut'
import { parseImgUrl, prettyTruncate } from 'utils/common'

const TokenHeadSecond = ({ localToken }) => {
	return (
		<div className="bg-neutral-04 rounded-lg">
			<div className="bg-neutral-03 text-white rounded-lg border border-neutral-05 p-4 mb-4">
				<div className="flex flex-row justify-between items-center">
					<p className="font-bold text-3xl">TES</p>
					<div className="flex flex-row">
						<button className="border border-neutral-09 rounded-l-lg rounded-r-none rounded-lg p-1">
							<IconRefresh stroke={'#F9F9F9'} className="p-1" />
							{/* TODO */}
						</button>
						<button className="border border-neutral-09 rounded-none p-1">
							<IconShareSecond size={25} stroke={'#F9F9F9'} className="p-1" />
							{/* TODO */}
						</button>
						<button className="border border-neutral-09 rounded-r-lg rounded-l-none p-1 rounded-lg">
							<IconDots className="p-1" />
							{/* TODO */}
						</button>
					</div>
				</div>

				<div className="bg-neutral-01 border border-neutral-05 rounded-lg p-2 my-2">
					<p className="text-sm">
						Owned by{' '}
						<Link href={`/${localToken.owner_id}`}>
							<a className="font-bold underline cursor-pointer">{localToken.owner_id}</a>
						</Link>
					</p>
				</div>

				<div className="grid grid-cols-2 gap-x-4 my-2">
					<div className="border border-neutral-05 rounded-lg">
						<div className="flex flex-row justify-between items-center">
							<div className="inline-flex items-center w-16 p-2">
								<Media
									className="rounded-lg"
									url={parseImgUrl(localToken?.metadata.media, null, {
										width: `30`,
										useOriginal: process.env.APP_ENV === 'production' ? false : true,
										isMediaCdn: localToken?.isMediaCdn,
									})}
									videoControls={false}
									videoLoop={true}
									videoMuted={true}
									autoPlay={false}
									playVideoButton={false}
								/>
								<div className="flex flex-col justify-between items-stretch ml-2">
									<p className="text-xs font-thin mb-2">Collection</p>
									<Link
										href={`/collection/${
											localToken.metadata?.collection_id || localToken.contract_id
										}`}
									>
										<a className="text-sm font-bold truncate">
											{prettyTruncate(
												localToken.metadata?.collection || localToken.contract_id,
												20
											)}
										</a>
									</Link>
								</div>
							</div>
							<div className="justify-self-end mr-2">
								<Link
									href={`/collection/${
										localToken.metadata?.collection_id || localToken.contract_id
									}`}
								>
									<a>
										<IconOut size={25} stroke={'#F9F9F9'} />
									</a>
								</Link>
							</div>
						</div>
					</div>
					<div className="border border-neutral-05 rounded-lg">
						<div className="flex flex-row justify-between items-center">
							<div className="inline-flex items-center w-16 p-2">
								<Media
									className="rounded-lg"
									url={parseImgUrl(localToken?.metadata.media, null, {
										width: `30`,
										useOriginal: process.env.APP_ENV === 'production' ? false : true,
										isMediaCdn: localToken?.isMediaCdn,
									})}
									videoControls={false}
									videoLoop={true}
									videoMuted={true}
									autoPlay={false}
									playVideoButton={false}
								/>
								<div className="flex flex-col justify-between items-stretch ml-2">
									<p className="text-xs font-thin mb-2">Collection</p>
									<Link
										href={`/collection/${
											localToken.metadata?.collection_id || localToken.contract_id
										}`}
									>
										<a className="text-sm font-bold truncate">
											{prettyTruncate(
												localToken.metadata?.collection || localToken.contract_id,
												20
											)}
										</a>
									</Link>
								</div>
							</div>
							<div className="justify-self-end mr-2">
								<Link
									href={`/collection/${
										localToken.metadata?.collection_id || localToken.contract_id
									}`}
								>
									<a>
										<IconOut size={25} stroke={'#F9F9F9'} />
									</a>
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-row justify-start items-center my-2 gap-x-2">
					{/* TODO */}
					<div className="bg-neutral-04 border border-neutral-05 rounded-md">
						<p className="text-xs font-thin px-1 py-2">Abstract</p>
					</div>
					<div className="bg-neutral-04 border border-neutral-05 rounded-md">
						<p className="text-xs font-thin px-1 py-2">Abstract</p>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-x-4 items-center justify-center px-4 pb-6">
				<div className="bg-neutral-01 border border-neutral-05 rounded-lg py-2 px-6">
					<p className="text-neutral-10 text-center text-sm">
						Edition <span className="bg-primary p-1 font-bold">#1</span> of 10
					</p>
				</div>
				<div className="bg-neutral-01 border border-neutral-05 rounded-lg py-2 px-6">
					<p className="text-neutral-10 text-center text-sm">
						Rarity Score{' '}
						<span className="bg-primary p-1 font-bold">
							{localToken.metadata?.score.toFixed(2) || 0}
						</span>
					</p>
				</div>
				<div className="bg-neutral-01 border border-neutral-05 rounded-lg py-2 px-6">
					<p className="text-neutral-10 text-center text-sm">
						Rarity Rank{' '}
						<span className="bg-primary p-1 font-bold">#{localToken.metadata?.rank || 0}</span>
					</p>
				</div>
			</div>
		</div>
	)
}

export default TokenHeadSecond
