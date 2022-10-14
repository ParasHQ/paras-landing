import Modal from 'components/Common/Modal'
import Media from 'components/Common/Media'
import { IconX } from 'components/Icons'

const MediaModal = ({ show, imgUrl, audioUrl, threeDUrl, iframe, imgBlur, token, onClose }) => {
	return (
		<>
			<Modal isShow={show} closeOnBgClick={true} closeOnEscape={true} close={onClose}>
				<button
					className="absolute bg-neutral-05 z-50 rounded-md right-10 top-10 cursor-pointer"
					onClick={onClose}
				>
					<IconX size={30} className={'ml-1 mt-1'} />
				</button>
				<Media
					className="mx-auto h-full object-contain relative z-10"
					url={imgUrl}
					audioUrl={audioUrl}
					animationUrlforVideo={token?.animation_url}
					videoControls={false}
					videoMuted={true}
					videoLoop={true}
					mimeType={token?.mime_type}
					isAuction={token?.is_auction}
				/>
			</Modal>
		</>
	)
}

export default MediaModal
