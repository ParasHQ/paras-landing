import { Suspense, useState, useEffect } from 'react'
import { IconLoader } from 'components/Icons'
import { Canvas } from '@react-three/fiber'
import { Model1 } from 'components/Model3D/ThreeDModel'
import Modal from 'components/Common/Modal'
import Media from 'components/Common/Media'
import { IconX } from 'components/Icons'
import axios from 'axios'
import FileType from 'file-type/browser'
import { parseImgUrl } from 'utils/common'

const MediaModal = ({ show, token, onClose }) => {
	const [fileType, setFileType] = useState(token?.metadata?.mime_type)
	const [threeDUrlMedia, setThreeDUrlMedia] = useState('')

	useEffect(() => {
		if (token?.metadata?.animation_url && token.metadata?.mime_type?.includes('model')) {
			get3DModel(token?.metadata?.animation_url)
		}
		if (token?.metadata?.animation_url && token.metadata?.mime_type?.includes('audio')) {
			getAudio(token?.metadata?.animation_url)
		}
		if (token?.metadata?.animation_url && token.metadata?.mime_type?.includes('iframe')) {
			getIframe()
		}
	}, [])

	const get3DModel = async (url) => {
		const resp = await axios.get(`${parseImgUrl(url, undefined)}`, {
			responseType: `blob`,
		})
		const fileType = await FileType.fromBlob(resp.data)
		setFileType(fileType?.mime)
		const objectUrl = URL.createObjectURL(resp.data)
		setThreeDUrlMedia(objectUrl)
	}

	const getAudio = async (url) => {
		const resp = await axios.get(`${parseImgUrl(url, undefined)}`, {
			responseType: `blob`,
		})
		const fileType = await FileType.fromBlob(resp.data)
		setFileType(fileType?.mime)
	}

	const getIframe = () => {
		setFileType(token?.metadata?.mime_type)
	}

	if (!show) return null

	return (
		<>
			<Modal isShow={show} closeOnBgClick={true} closeOnEscape={true} close={onClose}>
				<button
					className="absolute bg-neutral-05 z-50 rounded-md right-10 top-10 cursor-pointer"
					onClick={onClose}
				>
					<IconX size={30} className={'ml-1 mt-1'} />
				</button>
				<div className="relative h-full w-full">
					{token?.metadata?.animation_url ? (
						<>
							{fileType?.includes('audio') && (
								<div className="max-h-80 md:max-h-52 lg:max-h-96 w-full mx-2 md:mx-0">
									<div className="w-1/2 md:w-full h-full m-auto">
										<Media
											className="rounded-lg overflow-hidden max-h-80 md:max-h-52 lg:max-h-96"
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
									</div>
									<div className="w-full m-auto">
										<div className="my-3 flex items-center justify-center w-full">
											<audio controls className="w-full">
												<source src={parseImgUrl(token?.metadata.animation_url)}></source>
											</audio>
										</div>
									</div>
								</div>
							)}
							{fileType?.includes(`model`) && threeDUrlMedia && (
								<Suspense
									fallback={
										<div className="flex h-full w-full items-center justify-center">
											<IconLoader />
										</div>
									}
								>
									<Canvas>
										<Model1 threeDUrl={threeDUrlMedia} />
									</Canvas>
								</Suspense>
							)}
							{fileType?.includes('iframe') && (
								<iframe
									src={token?.metadata.animation_url}
									sandbox="allow-scripts"
									className="object-contain w-full h-full"
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
									? parseImgUrl(token.metadata.media, undefined, { seeDetails: true })
									: token.metadata.media
							}
							videoControls={true}
							videoLoop={true}
							videoMuted={true}
							videoPadding={false}
							mimeType={token?.metadata?.mime_type}
							seeDetails={true}
							isMediaCdn={token?.isMediaCdn}
							animationUrlforVideo={token?.metadata?.animation_url}
						/>
					)}
				</div>
				{/* <Media
					className="mx-auto h-full object-contain relative z-10"
					url={imgUrl}
					audioUrl={audioUrl}
					animationUrlforVideo={token?.animation_url}
					videoControls={false}
					videoMuted={true}
					videoLoop={true}
					mimeType={token?.mime_type}
					isAuction={token?.is_auction}
				/> */}
			</Modal>
		</>
	)
}

export default MediaModal
