import { useState } from 'react'
import { IconDots } from 'components/Icons'
import { useRouter } from 'next/router'
import { parseImgUrl, prettyTruncate } from 'utils/common'
import Link from 'next/link'
import Media from 'components/Common/Media'
import IconOut from 'components/Icons/component/IconOut'
import IconRefresh from 'components/Icons/component/IconRefresh'
import IconShareSecond from 'components/Icons/component/IconShareSecond'
import TokenShareModalSecond from 'components/Modal/TokenShareModalSecond'
import TokenMoreModalSecond from 'components/Modal/TokenMoreModalSecond'

const TokenHeadSecond = ({ localToken, onShowTradeModal }) => {
	const router = useRouter()

	const [showShareModal, setShowShareModal] = useState(false)
	const [showMoreModal, setShowMoreModal] = useState(false)

	return (
		<div className="relative bg-neutral-04 rounded-lg">
			<div className="bg-neutral-03 text-white rounded-lg border border-neutral-05 px-5 pt-6 pb-3 mb-4">
				<div className="flex flex-row justify-between items-center">
					<p className="font-bold text-3xl">TES</p>
					<div className="flex flex-row">
						<button
							className="border border-neutral-09 rounded-l-lg rounded-r-none rounded-lg p-1"
							onClick={() => router.reload()}
						>
							<IconRefresh stroke={'#F9F9F9'} className="p-1" />
						</button>
						<button
							className="border border-neutral-09 rounded-none p-1"
							onClick={() => setShowShareModal(!showShareModal)}
						>
							<IconShareSecond size={25} stroke={'#F9F9F9'} className="p-1" />
						</button>
						<button
							className="border border-neutral-09 rounded-r-lg rounded-l-none p-1 rounded-lg"
							onClick={() => setShowMoreModal(!showMoreModal)}
						>
							<IconDots className="p-1" />
						</button>
					</div>
				</div>

				<div className="bg-neutral-01 border border-neutral-05 rounded-lg p-2 mt-2">
					<p className="text-sm">
						Owned by{' '}
						<Link href={`/${localToken.owner_id}`}>
							<a className="font-bold underline cursor-pointer">
								{prettyTruncate(localToken.owner_id, 40, 'address')}
							</a>
						</Link>
					</p>
				</div>

				<div className="grid grid-cols-2 gap-x-3 mt-2">
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
									<p className="text-xs font-thin mb-2">Creator</p>
									<Link href={`/${localToken.metadata?.creator_id}`}>
										<a className="text-sm font-bold truncate">
											{prettyTruncate(localToken.metadata?.creator_id, 20)}
										</a>
									</Link>
								</div>
							</div>
							<div className="justify-self-end mr-2">
								<Link href={`/${localToken.metadata?.collection_id || localToken.contract_id}`}>
									<a>
										<IconOut size={25} stroke={'#F9F9F9'} />
									</a>
								</Link>
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-row gap-x-[6px] justify-start items-center mt-3 mb-2">
					{localToken.categories && localToken.categories.length !== 0 && (
						<div>
							{localToken.categories?.map((cat, idx) => (
								<Link key={idx} href={`/market/${cat.category_id}`}>
									<a>
										<div className="bg-neutral-04 border border-neutral-05 rounded-md cursor-pointer">
											<p className="text-xs font-thin px-1 py-2">{cat.name}</p>
										</div>
									</a>
								</Link>
							))}
						</div>
					)}
				</div>
			</div>

			<div className="grid grid-cols-3 gap-x-4 items-center justify-center px-4 pb-6">
				<div className="bg-neutral-01 border border-neutral-05 rounded-lg py-2 px-4">
					<p className="text-neutral-10 text-center text-sm">
						Edition <span className="bg-primary p-1 font-bold">#1</span> of 10
					</p>
				</div>
				<div className="bg-neutral-01 border border-neutral-05 rounded-lg py-2 px-4">
					<p className="text-neutral-10 text-center text-sm">
						Rarity Score{' '}
						<span className="bg-primary p-1 font-bold">
							{localToken.metadata?.score ? localToken.metadata?.score.toFixed(2) : 0}
						</span>
					</p>
				</div>
				<div className="bg-neutral-01 border border-neutral-05 rounded-lg py-2 px-4">
					<p className="text-neutral-10 text-center text-sm">
						Rarity Rank{' '}
						<span className="bg-primary p-1 font-bold">#{localToken.metadata?.rank || 0}</span>
					</p>
				</div>
			</div>

			<TokenShareModalSecond
				show={showShareModal}
				localToken={localToken}
				onClose={() => setShowShareModal(!showShareModal)}
			/>
			<TokenMoreModalSecond
				show={showMoreModal}
				localToken={localToken}
				onClose={() => setShowMoreModal(!showMoreModal)}
				onShowTradeModal={onShowTradeModal}
			/>
		</div>
	)
}

export default TokenHeadSecond
