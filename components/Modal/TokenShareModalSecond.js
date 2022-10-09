import {
	FacebookIcon,
	FacebookShareButton,
	TelegramIcon,
	TelegramShareButton,
	TwitterIcon,
	TwitterShareButton,
} from 'react-share'
import axios from 'axios'
import { useEffect, useState } from 'react'
import IconCopySecond from 'components/Icons/component/IconCopySecond'
import CopyLink from 'components/Common/CopyLink'
import { IconCopied } from 'components/Icons'
import { IconX } from 'components/Icons'

const TokenShareModalSecond = ({ show, localToken, onClose }) => {
	if (typeof window == 'undefined') {
		return null
	}

	if (!show) {
		return null
	}

	return <ShareItem show={show} localToken={localToken} onClose={onClose} />
}

const ShareItem = ({ show, localToken, onClose }) => {
	const [collection, setCollection] = useState(null)
	const [isLinkCopied, setIsLinkCopied] = useState(false)

	useEffect(() => {
		if (show) {
			const fetchCollection = async () => {
				const res = await axios.get(`${process.env.V2_API_URL}/collections`, {
					params: {
						collection_id: localToken.metadata.collection_id || localToken.contract_id,
					},
				})

				const collectionName = res.data.data.results[0].collection || localToken.contract_id
				setCollection(collectionName)
			}

			fetchCollection()
		}
	}, [show])

	const shareList = [
		{
			key: 'copy',
			element: (
				<div className="flex flex-col justify-center items-center cursor-pointer text-center">
					<CopyLink
						link={window.location.href}
						afterCopy={() => {
							setIsLinkCopied(true)
							setTimeout(() => {
								setIsLinkCopied(false)
							}, 2500)
						}}
					>
						{isLinkCopied ? <IconCopied className="ml-5" /> : <IconCopySecond className="ml-5" />}
						<p className="text-neutral-10 text-xs z-10">Copy to clipboard</p>
					</CopyLink>
				</div>
			),
		},
		{
			key: 'twitter',
			element: (
				<div className="flex flex-col justify-center items-center cursor-pointer text-center z-10">
					<TwitterShareButton
						url={window.location.href}
						title={`Checkout ${localToken.metadata.title} from collection ${collection} on @ParasHQ\n\n#paras #cryptoart #digitalart #tradingcards`}
					>
						<TwitterIcon size={30} round className="ml-1" />
						<p className="text-neutral-10 text-xs">Twitter</p>
					</TwitterShareButton>
				</div>
			),
		},
		{
			key: 'facebook',
			element: (
				<div className="flex flex-col justify-center items-center cursor-pointer text-center">
					<FacebookShareButton url={window.location.href}>
						<FacebookIcon size={30} round className="ml-3" />
						<p className="text-neutral-10 text-xs">Facebook</p>
					</FacebookShareButton>
				</div>
			),
		},
		{
			key: 'telegram',
			element: (
				<div className="flex flex-col justify-center items-center cursor-pointer text-center">
					<TelegramShareButton url={window.location.href}>
						<TelegramIcon size={30} round className="ml-3" />
						<p className="text-neutral-10 text-xs">Telegram</p>
					</TelegramShareButton>
				</div>
			),
		},
	]

	return (
		<div className="w-44 absolute z-10 top-16 right-10 grid grid-cols-2 items-center justify-center gap-2 bg-neutral-01 border border-neutral-10 rounded-lg p-4 shadow-lg">
			<div className="relative col-span-2">
				<p className="text-center text-neutral-10 text-xs font-bold pt-3 pb-5">Share to</p>
				<button className="absolute bg-neutral-05 rounded-sm right-0 top-1" onClick={onClose}>
					<IconX className={'ml-1 mt-1'} />
				</button>
			</div>
			{shareList.map((element) => element.element)}
		</div>
	)
}

export default TokenShareModalSecond
