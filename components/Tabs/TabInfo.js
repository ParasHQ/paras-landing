import TokenInfoCopy from 'components/TokenInfoCopy'
import Link from 'next/link'
import ReactLinkify from 'react-linkify'
import { parseImgUrl } from 'utils/common'

const TabInfo = ({ localToken, isNFT }) => {
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
				<p className="text-sm text-white font-bold">Description</p>
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
						{localToken.metadata.description.replace(/\n\s*\n\s*\n/g, '\n\n')}
					</p>
				</ReactLinkify>
			</div>
			{isNFT && (
				<div className="flex bg-gray-800 mt-3 p-3 rounded-md shadow-md">
					<div>
						<p className="text-sm text-white font-bold">Owner</p>
						<Link href={`/${localToken.owner_id}`}>
							<a className="text-gray-100 font-semibold hover:opacity-80">
								{localToken.owner_id}
							</a>
						</Link>
					</div>
				</div>
			)}
			<div className="flex bg-gray-800 mt-3 p-3 rounded-md shadow-md">
				<div>
					<p className="text-sm text-white font-bold">Collection</p>
					<Link href={`/collection/${collection.id}`}>
						<a className="text-gray-100 font-semibold hover:opacity-80">
							{collection.name}
						</a>
					</Link>
				</div>
			</div>
			<div className="flex space-x-3">
				<div className="flex flex-1 bg-gray-800 mt-3 p-3 rounded-md shadow-md">
					<div>
						<p className="text-sm text-white font-bold">Royalty</p>
						<p className="text-gray-100 font-semibold">
							{Object.keys(localToken.royalty).length === 0
								? `None`
								: `${Object.values(localToken.royalty)[0] / 100} %`}
						</p>
					</div>
				</div>
				{!isNFT && (
					<div className="flex flex-1 bg-gray-800 mt-3 p-3 rounded-md shadow-md">
						<div>
							<p className="text-sm text-white font-bold">Copies</p>
							<p className="text-gray-100 font-semibold">
								{localToken.metadata.copies}
							</p>
						</div>
					</div>
				)}
			</div>
			<div className="bg-gray-800 text-gray-100  mt-3 p-3 rounded-md shadow-md">
				<p className="text-sm text-white font-medium mb-2">Token Info</p>
				<div className="flex justify-between text-sm">
					<p>Smart Contract</p>
					<TokenInfoCopy text={process.env.NFT_CONTRACT_ID} small />
				</div>
				<div className="flex justify-between text-sm">
					<p>Image Link</p>
					<TokenInfoCopy
						text={parseImgUrl(localToken.metadata.media, null, {
							useOriginal: true,
						})}
					/>
				</div>
			</div>
		</div>
	)
}

export default TabInfo
