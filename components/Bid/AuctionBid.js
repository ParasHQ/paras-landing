import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import useStore from 'lib/store'
import Link from 'next/link'
import Card from 'components/Card/Card'
import CancelBid from 'components/Modal/CancelBid'
import TokenDetailModal from 'components/Token/TokenDetailModal'
import TokenAuctionBidModal from 'components/Modal/TokenAuctionBidModal'
import { parseImgUrl, prettyTruncate, prettyBalance } from 'utils/common'
import { useWalletSelector } from 'components/Common/WalletSelector'
import { useToast } from 'hooks/useToast'
import { sentryCaptureException } from 'lib/sentry'
import { useIntl } from 'hooks/useIntl'
import { GAS_FEE } from 'config/constants'

const AuctionBid = ({ token, freshFetch }) => {
	const router = useRouter()
	const store = useStore()
	const toast = useToast()
	const { selector } = useWalletSelector()
	const { localeLn } = useIntl()
	const [bid, setBid] = useState({})
	const [highestBid, setHighestBid] = useState({})
	const [showModal, setShowModal] = useState({})

	useEffect(() => {
		filterBid()
	}, [token])

	const filterBid = () => {
		const filteredBid = token.bidder_list.filter((bid) => bid.bidder === store.currentUser)
		const currentUserBid = filteredBid[0]
		const bidState = {
			bidder: currentUserBid.bidder,
			amount: currentUserBid.amount,
			issued_at: currentUserBid.issued_at,
		}

		const filteredHighestBid = token.bidder_list[0]

		setBid(bidState)
		setHighestBid(filteredHighestBid)
	}

	const cancelBid = async () => {
		const cancelBidArgs = {
			nft_contract_id: token.contract_id,
			token_id: token.token_id,
			account_id: store.currentUser,
		}

		try {
			const wallet = await selector.wallet()
			const res = await wallet.signAndSendTransaction({
				receiverId: process.env.MARKETPLACE_CONTRACT_ID,
				actions: [
					{
						type: 'FunctionCall',
						params: {
							methodName: 'cancel_bid',
							args: cancelBidArgs,
							gas: GAS_FEE,
							deposit: '1',
						},
					},
				],
			})

			if (res) {
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">{`Successfully cancel bid`}</div>
					),
					type: 'success',
					duration: 2500,
				})
				setTimeout(freshFetch, 2500)
			}
		} catch (error) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{error.message || localeLn('SomethingWentWrong')}
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			sentryCaptureException(error)
		}
	}

	const onDismissModal = () => {
		setShowModal(null)
	}

	return (
		<>
			<TokenDetailModal tokens={[token]} />
			<TokenAuctionBidModal
				show={showModal === 'placeauction'}
				data={token}
				onClose={onDismissModal}
				setShowModal={setShowModal}
			/>
			{showModal === 'cancelBid' && (
				<CancelBid
					onClose={() => setShowModal('')}
					show={showModal === 'cancelBid'}
					onDelete={cancelBid}
				/>
			)}

			<div className="border-2 border-dashed my-4 p-4 md:py-6 md:px-8 md:h-80 rounded-md border-gray-800">
				<div className="flex flex-col md:flex-row">
					<div className="hidden md:block w-40 h-full">
						<Card
							imgUrl={parseImgUrl(token.metadata.media, null, {
								width: `600`,
								useOriginal: process.env.APP_ENV === 'production' ? false : true,
								isMediaCdn: token.isMediaCdn,
							})}
							onClick={() => {
								router.push(
									{
										pathname: router.pathname,
										query: {
											...router.query,
											tokenId: token.token_id,
											contractId: token.contract_id,
										},
									},
									token.token_id
										? `/token/${token.contract_id}::${token.token_series_id}/${token.token_id}`
										: `/token/${token.contract_id}::${token.token_series_id}`,
									{
										shallow: true,
										scroll: false,
									}
								)
							}}
							imgBlur={token.metadata.blurhash}
							token={{
								title: token.metadata.title,
								collection: token.metadata.collection || token.contract_id,
								copies: token.metadata.copies,
								creatorId: token.metadata.creator_id || token.contract_id,
								is_creator: token.is_creator,
							}}
						/>
					</div>
					<div className="block md:hidden w-40 h-full mx-auto">
						<div className="cursor-pointer">
							<Card
								imgUrl={parseImgUrl(token.metadata.media, null, {
									width: `600`,
									useOriginal: process.env.APP_ENV === 'production' ? false : true,
									isMediaCdn: token.isMediaCdn,
								})}
								onClick={() => {
									router.push(
										{
											pathname: router.pathname,
											query: {
												...router.query,
												tokenSeriesId: token.token_series_id,
												tokenId: token.token_id,
												contractId: token.contract_id,
											},
										},
										token.token_id
											? `/token/${token.contract_id}::${token.token_series_id}/${token.token_id}`
											: `/token/${token.contract_id}::${token.token_series_id}`,
										{
											shallow: true,
											scroll: false,
										}
									)
								}}
								imgBlur={token.metadata.blurhash}
								token={{
									title: token.metadata.title,
									collection: token.metadata.collection || token.contract_id,
									copies: token.metadata.copies,
									creatorId: token.metadata.creator_id || token.contract_id,
									is_creator: token.is_creator,
								}}
							/>
						</div>
					</div>

					<div className="flex-1 items-start md:items-center mt-8 md:mt-0 md:flex ml-4 md:ml-6 justify-between">
						<div className="text-gray-100">
							<div className="font-bold text-2xl">
								<Link
									href={{
										pathname: router.pathname,
										query: {
											...router.query,
											tokenId: token.token_id,
											contractId: token.contract_id,
										},
									}}
									as={
										token.token_id
											? `/token/${token.contract_id}::${token.token_series_id}/${token.token_id}`
											: `/token/${token.contract_id}::${token.token_series_id}`
									}
									scroll={false}
									shallow
								>
									<a className="font-bold">{prettyTruncate(token?.metadata?.title, 25)}</a>
								</Link>
							</div>
							<p className="opacity-75">{prettyTruncate(token?.metadata?.collection, 30)}</p>
							<div className="mt-4 mb-3">{`Your bid : ${prettyBalance(bid.amount, 24, 4)} Ⓝ`}</div>
							<div className="mb-6">{`Token highest bid : ${prettyBalance(
								highestBid.amount,
								24,
								4
							)} Ⓝ`}</div>
						</div>
					</div>
					<div className="flex flex-col items-center md:my-auto">
						<button
							onClick={() => setShowModal(`placeauction`)}
							className="font-semibold w-32 rounded-md border-2 border-primary bg-primary text-white mb-2"
						>
							{localeLn('Update')}
						</button>
						<button
							className="font-semibold w-32 rounded-md border-2 bg-red-600 text-white border-red-600 mb-2"
							onClick={() => setShowModal('cancelBid')}
						>
							{localeLn('Cancel')}
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default AuctionBid
