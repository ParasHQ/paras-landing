import ParasRequest from 'lib/ParasRequest'
import Button from 'components/Common/Button'
import Media from 'components/Common/Media'
import Modal from 'components/Common/Modal'
import { IconX } from 'components/Icons'
import getConfig from 'config/near'
import { useToast } from 'hooks/useToast'
import useStore from 'lib/store'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { sentryCaptureException } from 'lib/sentry'
import {
	FacebookIcon,
	FacebookShareButton,
	TelegramIcon,
	TelegramShareButton,
	TwitterIcon,
	TwitterShareButton,
} from 'react-share'
import { mutate } from 'swr'
import { parseImgUrl, decodeBase64, prettyBalance, prettyTruncate } from 'utils/common'
import retry from 'async-retry'
import { providers } from 'near-api-js'
import Card from 'components/Card/Card'

const SuccessTransactionModalSecond = () => {
	const DUMMY = {
		_id: {
			$oid: '612f3b189523cb06e3887740',
		},
		contract_id: 'paras-token-v1.testnet',
		token_id: '1:2',
		owner_id: 'johnnear.testnet',
		token_series_id: '1',
		edition_id: '2',
		metadata: {
			title: 'Dragon Slayer #2',
			description: 'Killing a dragon is not an easy job',
			media: 'bafybeihdvqgsoab4wbaeziot2i23zca4o3hnrdg5z6y7xtprxsfynw3k34',
			media_hash: null,
			copies: 5,
			issued_at: '1609834941794',
			expires_at: null,
			starts_at: null,
			updated_at: null,
			extra: null,
			reference: 'bafybeigurmyt46hvno5754sf3toahihumvphgsn2tapaifxo7hmmq43kiu',
			reference_hash: null,
			collection: 'Mythical Warrior',
			collectionId: 'mythical-warrior-by-hdriqi',
			creatorId: 'hdriqi',
			blurhash: 'UAAnGO*G.P?spGE1IAk8uN.6tkM|NMH[bJai',
			creator_id: 'hdriqi',
			score: 0,
			rank: 263,
		},
		royalty: {},
		price: '1000000000000000000000000000000000',
		approval_id: null,
		ft_token_id: null,
		is_creator: true,
		has_rank: true,
	}
	const toast = useToast()
	const router = useRouter()
	const { currentUser, transactionRes, setTransactionRes } = useStore()

	const [showModal, setShowModal] = useState(true)
	const [txDetail, setTxDetail] = useState(null)
	const [token, setToken] = useState(DUMMY)
	const [tokenUrl, setTokenUrl] = useState('')

	useEffect(() => {
		const tokenUrl = `${window.location.hostname}/token/${token.contract_id}::${encodeURIComponent(
			token.token_series_id
		)}${token.token_id ? `/${encodeURIComponent(token.token_id)}` : ''}`
	}, token)

	const explorerUrl = (txhash) =>
		getConfig(process.env.APP_ENV || 'development').explorerUrl + '/transactions/' + txhash

	const onCloseModal = () => {
		// const key = `${token.contract_id}::${token.token_series_id}${
		// 	token.token_id ? `/${token.token_id}` : ''
		// }`
		// mutate(key)
		setShowModal(false)
		// setToken(null)
		// setTransactionRes(null)
		// removeTxHash()
	}

	const removeTxHash = () => {
		const query = router.query
		delete query.transactionHashes
		router.replace({ pathname: router.pathname, query }, undefined, { shallow: true })
	}

	const onClickSeeToken = () => {
		const url = `/token/${token.contract_id}::${encodeURIComponent(token.token_series_id)}${
			token.token_id ? `/${encodeURIComponent(token.token_id)}` : ''
		}${txDetail.method_name === 'add_offer' ? '?tab=offers' : ''}`
		router.push(url)
		onCloseModal()
	}

	const parseTitle = () => {}

	return (
		<Modal isShow={showModal} close={onCloseModal} className="p-8">
			<div className="max-w-sm w-full p-4 bg-neutral-03 md:m-auto rounded-md relative">
				<div className="absolute right-0 top-0 pr-4 pt-4">
					<div className="cursor-pointer" onClick={onCloseModal}>
						<IconX />
					</div>
				</div>
				<div>
					<h1 className="text-2xl font-bold text-white tracking-tight">{parseTitle()}</h1>
					<div className="p-4">
						<div className="w-2/3 m-auto h-56">
							<Card
								imgUrl={parseImgUrl(token?.metadata.media, null, {
									width: `600`,
									useOriginal: process.env.APP_ENV === 'production' ? false : true,
									isMediaCdn: token.isMediaCdn,
								})}
								audioUrl={
									token.metadata.mime_type &&
									token.metadata.mime_type.includes('audio') &&
									token.metadata?.animation_url
								}
								threeDUrl={
									token.metadata.mime_type &&
									token.metadata.mime_type.includes('model') &&
									token.metadata.animation_url
								}
								iframeUrl={
									token.metadata.mime_type &&
									token.metadata.mime_type.includes('iframe') &&
									token.metadata.animation_url
								}
								imgBlur={token.metadata.blurhash}
								token={{
									title: token.metadata.title,
									collection: token.metadata.collection || token.contract_id,
									copies: token.metadata.copies,
									creatorId: token.metadata.creator_id || token.contract_id,
									is_creator: token.is_creator,
									mime_type: token.metadata.mime_type,
								}}
								isNewDesign={true}
							/>
						</div>
					</div>
					{router.query.transactionHashes && (
						<div className="p-3 bg-gray-700 rounded-md mt-2 mb-4">
							<p className="text-gray-300 text-sm">Transaction Hash</p>
							{router.query.transactionHashes.split(',').map((txhash) => (
								<a href={explorerUrl(txhash)} key={txhash} target="_blank" rel="noreferrer">
									<p className="text-white hover:underline cursor-pointer overflow-hidden text-ellipsis">
										{txhash}
									</p>
								</a>
							))}
						</div>
					)}
					<div className="flex justify-between px-1 mb-4">
						<p className="text-sm text-white">Share to:</p>
						<div className="flex gap-2">
							<FacebookShareButton url={tokenUrl} className="flex text-white">
								<FacebookIcon size={24} round />
							</FacebookShareButton>
							<TelegramShareButton url={tokenUrl} className="flex text-white">
								<TelegramIcon size={24} round />
							</TelegramShareButton>{' '}
							<TwitterShareButton
								title={`Checkout ${token.metadata.title} from collection ${token.metadata.collection} on @ParasHQ\n\n#paras #cryptoart #digitalart #tradingcards`}
								url={tokenUrl}
								className="flex text-white"
							>
								<TwitterIcon size={24} round />
							</TwitterShareButton>
						</div>
					</div>
					<Button variant="second" isFullWidth onClick={onCloseModal}>
						Close
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export default SuccessTransactionModalSecond
