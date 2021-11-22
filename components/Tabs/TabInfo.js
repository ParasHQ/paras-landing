import TokenInfoCopy from 'components/TokenInfoCopy'
import Link from 'next/link'
import ReactLinkify from 'react-linkify'
import { parseImgUrl } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import { Fragment } from 'react'
import { useRouter } from 'next/router'

const TabInfo = ({ localToken, isNFT }) => {
	const { localeLn } = useIntl()
	const router = useRouter()

	const collection = localToken.metadata.collection_id
		? {
				id: localToken.metadata.collection_id,
				name: localToken.metadata.collection,
		  }
		: {
				id: localToken.contract_id,
				name: localToken.contract_id,
		  }

	return (
		<div>
			<div className="bg-gray-800 mt-3 p-3 rounded-md shadow-md">
				<p className="text-sm text-white font-bold">{localeLn('Description')}</p>
				<ReactLinkify
					componentDecorator={(decoratedHref, decoratedText, key) => (
						<a target="blank" href={decoratedHref} key={key}>
							{decoratedText}
						</a>
					)}
				>
					<p
						className="text-gray-100 whitespace-pre-line"
						style={{
							wordBreak: 'break-word',
						}}
					>
						{localToken.metadata.description?.replace(/\n\s*\n\s*\n/g, '\n\n')}
					</p>
				</ReactLinkify>
			</div>
			{isNFT && (
				<div className="flex bg-gray-800 mt-3 p-3 rounded-md shadow-md">
					<div>
						<p className="text-sm text-white font-bold">{localeLn('Owner')}</p>
						<Link href={`/${localToken.owner_id}`}>
							<a className="text-gray-100 font-semibold hover:opacity-80">{localToken.owner_id}</a>
						</Link>
					</div>
				</div>
			)}
			<div className="flex bg-gray-800 mt-3 p-3 rounded-md shadow-md">
				<div>
					<p className="text-sm text-white font-bold">{localeLn('Collection')}</p>
					<Link href={`/collection/${collection.id}`}>
						<a className="text-gray-100 font-semibold hover:opacity-80">{collection.name}</a>
					</Link>
				</div>
			</div>
			{localToken.categories.length !== 0 && (
				<div className="flex bg-gray-800 mt-3 p-3 rounded-md shadow-md">
					<div>
						<p className="text-sm text-white font-bold">{localeLn('FeaturedIn')}</p>
						{localToken.categories.map((cat, idx) => (
							<Fragment key={idx}>
								<span
									onClick={() => router.push(`/market/${cat.category_id}`)}
									className="cursor-pointer text-gray-200 font-semibold hover:opacity-80"
								>
									{cat.name}
								</span>
								{idx !== localToken.categories.length - 1 && (
									<span className="text-gray-200">, </span>
								)}
							</Fragment>
						))}
					</div>
				</div>
			)}
			<div className="flex space-x-3">
				<div className="flex flex-1 bg-gray-800 mt-3 p-3 rounded-md shadow-md">
					<div>
						<p className="text-sm text-white font-bold">{localeLn('Royalty')}</p>
						<p className="text-gray-100 font-semibold">
							{localToken.royalty && Object.keys(localToken.royalty).length !== 0
								? `${Object.values(localToken.royalty)[0] / 100} %`
								: `None`}
						</p>
					</div>
				</div>
				{!isNFT && localToken.metadata.copies && (
					<div className="flex flex-1 bg-gray-800 mt-3 p-3 rounded-md shadow-md">
						<div>
							<p className="text-sm text-white font-bold">{localeLn('Copies')}</p>
							<p className="text-gray-100 font-semibold">{localToken.metadata.copies}</p>
						</div>
					</div>
				)}
			</div>
			{localToken.metadata.attributes && (
				<div className="flex bg-gray-800 mt-3 p-3 pb-1 rounded-md shadow-md">
					<div>
						<p className="text-sm text-white font-bold mb-2">{localeLn('Attributes')}</p>
						<div className="flex flex-wrap">
							{localToken.metadata.attributes.map((attr, idx) => (
								<div
									key={idx}
									className="px-2 py-1 rounded-md border border-gray-700 flex space-x-1 mr-2 mb-2"
								>
									<p className="text-white opacity-80 text-sm">{attr.trait_type}</p>
									<p className="text-white font-medium text-sm">{attr.value}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
			<div className="bg-gray-800 text-gray-100  mt-3 p-3 rounded-md shadow-md">
				<p className="text-sm text-white font-bold mb-2">{localeLn('TokenInfo')}</p>
				<div className="flex justify-between text-sm">
					<p>Smart Contract</p>
					<TokenInfoCopy text={localToken.contract_id} small />
				</div>
				<div className="flex justify-between text-sm">
					<p>{localeLn('ImageLink')}</p>
					<TokenInfoCopy
						text={parseImgUrl(localToken.metadata.media, null, {
							useOriginal: process.env.APP_ENV === 'production' ? true : false,
						})}
					/>
				</div>
			</div>
		</div>
	)
}

export default TabInfo
