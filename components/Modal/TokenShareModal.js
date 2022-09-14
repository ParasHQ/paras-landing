import {
	FacebookIcon,
	FacebookShareButton,
	TelegramIcon,
	TelegramShareButton,
	TwitterIcon,
	TwitterShareButton,
} from 'react-share'
import ListModal from './ListModal'
import axios from 'axios'
import { useEffect, useState } from 'react'

const Share = ({ show, onClose, tokenData }) => {
	const [collection, setCollection] = useState(null)

	useEffect(() => {
		if (show) {
			const fetchCollection = async () => {
				const res = await axios.get(`${process.env.V2_API_URL}/collections`, {
					params: {
						collection_id: tokenData.metadata.collection_id || tokenData.contract_id,
					},
				})

				const collectionName = res.data.data.results[0].collection || tokenData.contract_id
				setCollection(collectionName)
			}

			fetchCollection()
		}
	}, [show])

	const ShareList = [
		{
			name: (
				<FacebookShareButton url={window.location.href} className="flex text-white">
					<FacebookIcon size={24} round />
					<p className="ml-3">Facebook</p>
				</FacebookShareButton>
			),
			onClick: () => {},
		},
		{
			name: (
				<TwitterShareButton
					title={`Checkout ${tokenData.metadata.title} from collection ${collection} on @ParasHQ\n\n#paras #cryptoart #digitalart #tradingcards`}
					url={window.location.href}
					className="flex text-white"
				>
					<TwitterIcon size={24} round />
					<p className="ml-3">Twitter</p>
				</TwitterShareButton>
			),
			onClick: () => {},
		},
		{
			name: (
				<TelegramShareButton url={window.location.href} className="flex text-white">
					<TelegramIcon size={24} round />
					<p className="ml-3">Telegram</p>
				</TelegramShareButton>
			),
			onClick: () => {},
		},
	]

	return (
		<ListModal
			show={show}
			onClose={onClose}
			list={ShareList}
			isFetching={!collection ? true : false}
		/>
	)
}

const TokenShareModal = ({ show, onClose, tokenData }) => {
	if (typeof window == 'undefined') {
		return null
	}

	return <Share show={show} onClose={onClose} tokenData={tokenData} />
}

export default TokenShareModal
