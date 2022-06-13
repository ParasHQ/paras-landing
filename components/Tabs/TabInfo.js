import TokenInfoCopy from 'components/TokenInfoCopy'
import Link from 'next/link'
import ReactLinkify from 'react-linkify'
import { parseImgUrl, prettyTruncate } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import TokenRoyaltyModal from 'components/Modal/TokenRoyaltyModal'
import cachios from 'cachios'
import StillReferenceModal from 'components/Modal/StillReferenceModal'
import Tooltip from 'components/Common/Tooltip'
import { IconInfo, IconQuestion, IconSpin } from 'components/Icons'

const TabInfo = ({ localToken, isNFT }) => {
	const { localeLn } = useIntl()
	const router = useRouter()
	const [showModal, setShowModal] = useState('')
	const [attributeRarity, setAttributeRarity] = useState([])
	const [lockedTxFee, setLockedTxFee] = useState('')
	const tooltipLockedFeeText = `This is the current locked transaction fee. Every update to the NFT price will also update the value according to the global transaction fee.`

	const collection = localToken.metadata.collection_id
		? {
				id: localToken.metadata.collection_id,
				name: localToken.metadata.collection,
		  }
		: {
				id: localToken.contract_id,
				name: localToken.contract_id,
		  }

	useEffect(() => {
		if (localToken.metadata.attributes && attributeRarity.length === 0) {
			getRarity(localToken.metadata.attributes)
		}
	}, [attributeRarity])

	const getRarity = async (attributes) => {
		const res = await cachios.post(`${process.env.V2_API_URL}/rarity`, {
			collection_id: collection.id,
			attributes: attributes,
			ttl: 120,
		})

		const newAttribute = await res.data.data
		setAttributeRarity(newAttribute)
	}

	useEffect(() => {
		if (!localToken.transaction_fee) return
		const calcLockedTxFee = (localToken?.transaction_fee / 10000) * 100
		setLockedTxFee(calcLockedTxFee.toString())
	}, [localToken.transaction_fee])

	return (
		<div>
			{typeof localToken._is_the_reference_merged !== 'undefined' &&
				!localToken._is_the_reference_merged && (
					<div className="flex justify-center gap-2 text-white text-center mt-2 rounded-md p-2">
						<IconSpin />
						<div
							className="flex items-center cursor-pointer hover:opacity-80"
							onClick={() => setShowModal('reference')}
						>
							<h4>The metadata is still indexing</h4>
							<div className="pl-1">
								<IconInfo size={16} />
							</div>
						</div>
					</div>
				)}
			{showModal === 'royalty' && (
				<TokenRoyaltyModal
					show={true}
					royalty={localToken.royalty}
					onClose={() => setShowModal('')}
				/>
			)}
			{showModal === 'reference' && (
				<StillReferenceModal show={true} onClose={() => setShowModal('')} />
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
							<a className="text-gray-100 font-semibold hover:opacity-80 truncate">
								{prettyTruncate(localToken.owner_id, 30, 'address')}
							</a>
						</Link>
					</div>
				</div>
			)}
			<div className="flex bg-gray-800 mt-3 p-3 rounded-md shadow-md">
				<div>
					<p className="text-sm text-white font-bold">{localeLn('Collection')}</p>
					<Link href={`/collection/${collection.id}`}>
						<a className="text-gray-100 font-semibold hover:opacity-80">
							{prettyTruncate(collection.name, 30, 'address')}
						</a>
					</Link>
				</div>
			</div>
			{localToken.categories && localToken.categories.length !== 0 && (
				<div className="flex bg-gray-800 mt-3 p-3 rounded-md shadow-md">
					<div>
						<p className="text-sm text-white font-bold">{localeLn('FeaturedIn')}</p>
						{localToken.categories?.map((cat, idx) => (
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
									<IconQuestion size={16} />
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
				<div className="flex flex-1 bg-gray-800 mt-3 p-3 rounded-md shadow-md">
					<div>
						<p className="text-sm text-white font-bold">{localeLn('Views')}</p>
						<div className="text-gray-100 font-semibold">
							<div className="flex gap-1 items-start">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									></path>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									></path>
								</svg>
								{!localToken.view ? '0' : localToken.view}
							</div>
						</div>
					</div>
				</div>
			</div>
			{localToken.metadata.attributes && (
				<div className="flex bg-gray-800 mt-3 p-3 rounded-md shadow-md">
					<div>
						<p className="text-sm text-white font-bold mb-2">{localeLn('Attributes')}</p>
						<div className="grid grid-cols-3 gap-3 whitespace-nowrap">
							{attributeRarity?.map((attr, idx) => (
								<div
									key={idx}
									className="p-2 rounded-md border text-center border-gray-700 space-x-1 overflow-x-visible hover:border-gray-400"
								>
									<a
										href={`/collection/${collection.id}/?attributes=[${JSON.stringify({
											[attr.trait_type]: attr.value,
										})}]`}
									>
										<p className="text-white font-light opacity-70 text-sm truncate">
											{attr.trait_type}
										</p>
										<p className="text-white font-medium text-sm truncate mb-1">{attr.value}</p>
										<p className="text-gray-300 font-light opacity-70 text-sm">
											{attr.rarity?.rarity > 1
												? Math.round(attr.rarity?.rarity)
												: attr.rarity?.rarity.toFixed(2)}
											% rarity
										</p>
									</a>
								</div>
							))}
						</div>
						{localToken.metadata?.score && (
							<div className="mt-3">
								<p className="text-white text-sm">
									Rarity Score : <b> {localToken.metadata?.score.toFixed(2)}</b>
								</p>
							</div>
						)}
					</div>
				</div>
			)}
			<div className="bg-gray-800 text-gray-100  mt-3 p-3 rounded-md shadow-md">
				<p className="text-sm text-white font-bold mb-2">{localeLn('TokenInfo')}</p>
				<div className="flex justify-between text-sm">
					<p>Smart Contract</p>
					<TokenInfoCopy text={localToken.contract_id} small />
				</div>
				<div className="flex justify-between text-sm overflow-hidden">
					<p>{localeLn('ImageLink')}</p>
					<TokenInfoCopy
						text={parseImgUrl(localToken.metadata.media, null, {
							useOriginal: process.env.APP_ENV === 'production' ? true : false,
						})}
					/>
				</div>
				{localToken.transaction_fee && (
					<div className="flex items-center justify-between relative z-10 text-sm">
						<p className="text-white">{localeLn('LockedFee')} </p>
						<div className="text-xs flex items-center gap-2">
							<p className="text-white">{lockedTxFee} %</p>
							<Tooltip
								id="locked-fee"
								show={true}
								text={tooltipLockedFeeText}
								className="font-normal w-full flex items-center"
								type="light"
								place="top"
							>
								<IconInfo size={16} color="#ffffff" className="inline mb-1" />
							</Tooltip>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default TabInfo
