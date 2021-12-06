import TokenInfoCopy from 'components/TokenInfoCopy'
import Link from 'next/link'
import ReactLinkify from 'react-linkify'
import { parseImgUrl } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'
import TokenRoyaltyModal from 'components/Modal/TokenRoyaltyModal'

const TabInfo = ({ localToken, isNFT }) => {
	const { localeLn } = useIntl()
	const router = useRouter()
	const [showModal, setShowModal] = useState('')

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
			{showModal === 'royalty' && (
				<TokenRoyaltyModal
					show={true}
					royalty={localToken.royalty}
					onClose={() => setShowModal('')}
				/>
			)}
			{localToken.metadata.description && (
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
			)}

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
						{localToken.royalty && Object.keys(localToken.royalty).length > 0 ? (
							<div
								className="flex cursor-pointer hover:opacity-80"
								onClick={() => setShowModal('royalty')}
							>
								<p className="text-gray-100 font-semibold">
									{Object.values(localToken.royalty).reduce(
										(a, b) => parseInt(a) + parseInt(b),
										0
									) / 100}
									%
								</p>
								<div className="pl-2 pt-0.5">
									<svg
										width="16"
										height="16"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8ZM14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8ZM7 10V9.5C7 8.28237 7.42356 7.68233 8.4 6.95C8.92356 6.55733 9 6.44904 9 6C9 5.44772 8.55229 5 8 5C7.44772 5 7 5.44772 7 6H5C5 4.34315 6.34315 3 8 3C9.65685 3 11 4.34315 11 6C11 7.21763 10.5764 7.81767 9.6 8.55C9.07644 8.94267 9 9.05096 9 9.5V10H7ZM9.00066 11.9983C9.00066 12.5506 8.55279 12.9983 8.00033 12.9983C7.44786 12.9983 7 12.5506 7 11.9983C7 11.4461 7.44786 10.9983 8.00033 10.9983C8.55279 10.9983 9.00066 11.4461 9.00066 11.9983Z"
											fill="rgb(243, 244, 246)"
										/>
									</svg>
								</div>
							</div>
						) : (
							<p className="text-gray-100 font-semibold">None</p>
						)}
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
