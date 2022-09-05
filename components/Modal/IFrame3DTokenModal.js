import { Canvas } from '@react-three/fiber'
import axios from 'axios'
import Media from 'components/Common/Media'
import { IconInfo, IconLoader, IconX } from 'components/Icons'
import { Model1 } from 'components/Model3D/ThreeDModel'
import { useIntl } from 'hooks/useIntl'
import { Suspense, useEffect, useState } from 'react'
import { parseImgUrl, prettyBalance, prettyTruncate } from 'utils/common'
import FileType from 'file-type/browser'
import Modal from 'components/Common/Modal'
import JSBI from 'jsbi'
import useStore from 'lib/store'
import Icon3DNew from 'components/Icons/component/Icon3DNew'

const IFrame3DTokenModal = ({ token, typeToken, show, onClose }) => {
	const [fileType, setFileType] = useState(token?.metadata?.mime_type)
	const [threeDUrl, setThreeDUrl] = useState('')
	const [showTooltip, setShowTooltip] = useState(false)

	const { localeLn } = useIntl()
	const store = useStore()

	useEffect(() => {
		if (token?.metadata?.animation_url && token.metadata?.mime_type?.includes('model')) {
			get3DModel(token?.metadata?.animation_url)
		}
	}, [JSON.stringify(token)])

	const get3DModel = async (url) => {
		const resp = await axios.get(`${parseImgUrl(url, undefined)}`, {
			responseType: `blob`,
		})
		const fileType = await FileType.fromBlob(resp.data)
		setFileType(fileType.mime)
		const objectUrl = URL.createObjectURL(resp.data)
		setThreeDUrl(objectUrl)
	}

	return (
		<Modal isShow={show} close={onClose} closeOnBgClick={true} backgroundColor={'rgba(0,0,0,0.95)'}>
			<div className="hidden relative md:flex gap-x-8 w-full h-1/2 lg:h-4/6 max-w-6xl mx-auto p-10 rounded-2xl bg-slate-800">
				<div className="absolute top-2 right-4 cursor-pointer" onClick={onClose}>
					<IconX size={40} />
				</div>
				<p className="absolute top-2 text-2xl font-bold text-gray-300 truncate mb-2">
					{token.metadata.title}
				</p>
				<div className="w-1/2 h-full">
					<div className="h-full bg-gray-700">
						<div className="relative w-full h-full">
							{token?.metadata.animation_url ? (
								<>
									{fileType && fileType.includes('model') && threeDUrl && (
										<Suspense
											fallback={
												<div className="flex items-center justify-center w-full h-full">
													<IconLoader />
												</div>
											}
										>
											<Canvas>
												<Model1 threeDUrl={threeDUrl} />
											</Canvas>
										</Suspense>
									)}
									{fileType && fileType.includes('iframe') && (
										<iframe
											src={token?.metadata.animation_url}
											sandbox="allow-scripts"
											className="object-contain w-full h-5/6 md:h-full"
										/>
									)}
									{!fileType && (
										<Media
											className="rounded-lg overflow-hidden"
											url={
												token.metadata?.mime_type
													? parseImgUrl(token.metadata.media)
													: token.metadata.media
											}
											videoControls={true}
											videoLoop={true}
											videoMuted={true}
											videoPadding={true}
											mimeType={token?.metadata?.mime_type}
											seeDetails={true}
											isMediaCdn={token?.isMediaCdn}
											animationUrlforVideo={token?.metadata?.animation_url}
										/>
									)}
								</>
							) : (
								<Media
									className="rounded-lg overflow-hidden"
									url={
										token.metadata?.mime_type
											? parseImgUrl(token.metadata.media)
											: token.metadata.media
									}
									videoControls={true}
									videoLoop={true}
									videoMuted={true}
									videoPadding={true}
									mimeType={token?.metadata?.mime_type}
									seeDetails={true}
									isMediaCdn={token?.isMediaCdn}
								/>
							)}
						</div>
					</div>
				</div>
				<div className="relative">
					{typeToken !== 'token-series' ? (
						<p className="text-gray-300 text-lg ">
							NFT //{' '}
							{prettyTruncate(
								token.contract_id === process.env.NFT_CONTRACT_ID
									? `#${token.edition_id} of ${token.metadata.copies}`
									: `#${token.token_id}`,
								25
							)}
						</p>
					) : (
						<p className="text-gray-300 text-lg truncate">
							{localeLn('SERIES')} {'// '}
							{token.metadata.copies ? `Edition of ${token.metadata.copies}` : `Open Edition`}
						</p>
					)}
					<div className="my-2 text-gray-300">
						{token.owner_id ? (
							<p>
								owned by <span>{token.owner_id}</span>
							</p>
						) : (
							<p className="text-sm">No owners, become the first one!</p>
						)}
					</div>
					<div>
						<p className="flex items-center gap-1 text-4xl font-bold">
							{token.price ? (
								<div className="flex">
									{token.price === '0'
										? localeLn('Free')
										: token.price && (
												<p className="text-gray-300">
													{prettyBalance(token.price, 24, 4)}
													<span className="pl-1">Ⓝ</span>
													<span className="text-[10px] font-normal text-gray-400 pt-2">
														($
														{prettyBalance(JSBI.BigInt(token.price * store.nearUsdPrice), 24, 4)})
													</span>
												</p>
										  )}
								</div>
							) : (
								<div>
									<div className="line-through text-red-600">
										<span className="text-gray-300">{localeLn('SALE')}</span>
									</div>
								</div>
							)}
						</p>
					</div>
					<div className="absolute bottom-0 left-0">
						<div>
							<Icon3DNew
								size={35}
								color="white"
								onMouseEnter={() => setShowTooltip(true)}
								onMouseLeave={() => setShowTooltip(false)}
							/>
						</div>
					</div>
					{showTooltip && (
						<div className="absolute bottom-10 flex gap-x-2 p-2 text-gray-300 border rounded-md">
							<IconInfo size={40} />
							<p className="text-xs text-justify">
								Hold and move your mouse in various directions to see the 3D interaction
							</p>
						</div>
					)}
				</div>
			</div>
			<div className="md:hidden w-screen h-screen">
				<div className="mt-16 mb-5 cursor-pointer" onClick={onClose}>
					<IconX size={40} />
				</div>
				<p className="text-2xl font-bold text-gray-300 truncate">{token.metadata.title}</p>
				{typeToken !== 'token-series' ? (
					<p className="text-gray-300 text-lg ">
						NFT //{' '}
						{prettyTruncate(
							token.contract_id === process.env.NFT_CONTRACT_ID
								? `#${token.edition_id} of ${token.metadata.copies}`
								: `#${token.token_id}`,
							25
						)}
					</p>
				) : (
					<p className="text-gray-300 text-lg my-2 truncate">
						{localeLn('SERIES')} {'// '}
						{token.metadata.copies ? `Edition of ${token.metadata.copies}` : `Open Edition`}
					</p>
				)}
				<div>
					<p className="flex items-center gap-1 text-4xl font-bold">
						{token.price ? (
							<div className="flex">
								{token.price === '0'
									? localeLn('Free')
									: token.price && (
											<p className="text-gray-300">
												{prettyBalance(token.price, 24, 4)}
												<span className="pl-1">Ⓝ</span>
												<span className="text-[10px] font-normal text-gray-400 pt-2">
													($
													{prettyBalance(JSBI.BigInt(token.price * store.nearUsdPrice), 24, 4)})
												</span>
											</p>
									  )}
							</div>
						) : (
							<div>
								<div className="line-through text-red-600">
									<span className="text-gray-300">{localeLn('SALE')}</span>
								</div>
							</div>
						)}
					</p>
				</div>
				<div className="w-screen h-1/2 -mx-4">
					<div className={`h-full ${fileType && fileType.includes('model') && 'bg-gray-700'}`}>
						<div className="relative w-full h-full">
							{token?.metadata.animation_url ? (
								<>
									{fileType && fileType.includes('model') && threeDUrl && (
										<Suspense
											fallback={
												<div className="flex items-center justify-center w-full h-full">
													<IconLoader />
												</div>
											}
										>
											<Canvas>
												<Model1 threeDUrl={threeDUrl} />
											</Canvas>
										</Suspense>
									)}
									{fileType && fileType.includes('iframe') && (
										<iframe
											src={token?.metadata.animation_url}
											sandbox="allow-scripts"
											className="object-contain w-full h-5/6 md:h-full"
										/>
									)}
									{!fileType && (
										<Media
											className="rounded-lg overflow-hidden"
											url={
												token.metadata?.mime_type
													? parseImgUrl(token.metadata.media)
													: token.metadata.media
											}
											videoControls={true}
											videoLoop={true}
											videoMuted={true}
											videoPadding={true}
											mimeType={token?.metadata?.mime_type}
											seeDetails={true}
											isMediaCdn={token?.isMediaCdn}
											animationUrlforVideo={token?.metadata?.animation_url}
										/>
									)}
								</>
							) : (
								<Media
									className="rounded-lg overflow-hidden"
									url={
										token.metadata?.mime_type
											? parseImgUrl(token.metadata.media)
											: token.metadata.media
									}
									videoControls={true}
									videoLoop={true}
									videoMuted={true}
									videoPadding={true}
									mimeType={token?.metadata?.mime_type}
									seeDetails={true}
									isMediaCdn={token?.isMediaCdn}
								/>
							)}
						</div>
					</div>
				</div>
				<div className="absolute right-6 mt-4">
					<div>
						<Icon3DNew
							size={35}
							color="white"
							onMouseEnter={() => setShowTooltip(true)}
							onMouseLeave={() => setShowTooltip(false)}
						/>
					</div>
				</div>
				{showTooltip && (
					<div className="absolute bottom-24 mx-4 flex items-center gap-2 -ml-0 p-2 text-gray-300 border rounded-md z-50">
						<IconInfo size={40} />
						<p className="text-xs text-justify">
							Hold and move your mouse in various directions to see the 3D interaction
						</p>
					</div>
				)}
			</div>
		</Modal>
	)
}

export default IFrame3DTokenModal
