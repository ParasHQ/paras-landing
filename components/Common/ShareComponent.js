import {
	FacebookIcon,
	FacebookShareButton,
	TelegramIcon,
	TelegramShareButton,
	TwitterIcon,
	TwitterShareButton,
} from 'react-share'
import { useIntl } from 'hooks/useIntl'
const ShareComponent = ({ title, shareUrl }) => {
	const { localeLn } = useIntl()
	return (
		<div className="flex items-center space-x-2 justify-between">
			<div className="text-white text-sm opacity-80 pr-4">{localeLn('ShareNow')}</div>
			<div className="flex space-x-3">
				<FacebookShareButton
					url={shareUrl}
					quote={title}
					className="Demo__some-network__share-button"
				>
					<FacebookIcon size={24} round />
				</FacebookShareButton>

				<TwitterShareButton
					url={shareUrl}
					title={title}
					className="Demo__some-network__share-button"
				>
					<TwitterIcon size={24} round />
				</TwitterShareButton>
				<TelegramShareButton
					url={shareUrl}
					title={title}
					className="Demo__some-network__share-button"
				>
					<TelegramIcon size={24} round />
				</TelegramShareButton>
			</div>
		</div>
	)
}

export default ShareComponent
