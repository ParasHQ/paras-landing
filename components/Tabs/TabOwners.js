import axios from 'axios'
import cachios from 'cachios'
import Avatar from 'components/Common/Avatar'
import Button from 'components/Common/Button'
import TokenBuyModal from 'components/Modal/TokenBuyModal'
import TokenStorageModal from 'components/Modal/TokenStorageModal'
import TokenUpdatePriceModal from 'components/Modal/TokenUpdatePriceModal'
import JSBI from 'jsbi'
import near from 'lib/near'
import useStore from 'lib/store'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { parseImgUrl, prettyTruncate } from 'utils/common'

const FETCH_TOKENS_LIMIT = 12

const TabOwners = ({ localToken }) => {
	const [tokens, setTokens] = useState([])
	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)
	const [activeToken, setActiveToken] = useState(null)
	const [showModal, setShowModal] = useState(null)
	const [needDeposit, setNeedDeposit] = useState(true)

	const { currentUser } = useStore()

	useEffect(() => {
		if (currentUser) {
			setTimeout(() => {
				checkStorageBalance()
			}, 250)
		}
	}, [currentUser])

	const checkStorageBalance = async () => {
		try {
			if (!localToken.approval_id) {
				const currentStorage = await near.wallet
					.account()
					.viewFunction(
						process.env.MARKETPLACE_CONTRACT_ID,
						`storage_balance_of`,
						{
							account_id: currentUser,
						}
					)

				const supplyPerOwner = await near.wallet
					.account()
					.viewFunction(
						process.env.MARKETPLACE_CONTRACT_ID,
						`get_supply_by_owner_id`,
						{
							account_id: currentUser,
						}
					)

				const usedStorage = JSBI.multiply(
					JSBI.BigInt(parseInt(supplyPerOwner) + 1),
					JSBI.BigInt(STORAGE_ADD_MARKET_FEE)
				)

				if (JSBI.greaterThanOrEqual(JSBI.BigInt(currentStorage), usedStorage)) {
					setNeedDeposit(false)
				}
			} else {
				setNeedDeposit(false)
			}
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		if (localToken.token_series_id) {
			fetchAllTokens()
		}
	}, [localToken])

	const fetchAllTokens = async () => {
		const _hasMore = await fetchTokens()

		if (_hasMore) {
			fetchAllTokens()
		}
	}

	const fetchTokens = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const resp = await cachios.get(`${process.env.V2_API_URL}/token`, {
			params: {
				token_series_id: localToken.token_series_id,
				__skip: page * FETCH_TOKENS_LIMIT,
				__limit: FETCH_TOKENS_LIMIT,
			},
			ttl: 30,
		})

		const newData = resp.data.data

		const newTokens = [...(tokens || []), ...newData.results]
		setTokens(newTokens)
		setPage(page + 1)
		const _hasMore = newData.results.length < FETCH_TOKENS_LIMIT ? false : true

		setHasMore(_hasMore)
		setIsFetching(false)

		return _hasMore
	}

	const onDismissModal = () => {
		setActiveToken(null)
		setShowModal(null)
	}

	return (
		<div>
			{!isFetching && !hasMore && tokens.length === 0 ? (
				<div className="text-white">No owners, become the first one!</div>
			) : (
				<InfiniteScroll
					dataLength={tokens.length}
					next={fetchTokens}
					hasMore={true}
				>
					{tokens.map((token) => (
						<Owner
							token={token}
							key={token.token_id}
							onBuy={(token) => {
								setShowModal('buy')
								setActiveToken(token)
							}}
							onUpdateListing={(token) => {
								if (needDeposit) {
									setShowModal('storage')
								} else {
									setShowModal('update')
								}
								setActiveToken(token)
							}}
						/>
					))}
				</InfiniteScroll>
			)}
			{showModal === 'buy' && (
				<TokenBuyModal
					show={showModal === 'buy'}
					onClose={onDismissModal}
					data={activeToken}
				/>
			)}
			{showModal === 'update' && (
				<TokenUpdatePriceModal
					show={showModal === 'update'}
					onClose={onDismissModal}
					data={activeToken}
				/>
			)}
			{showModal === 'storage' && (
				<TokenStorageModal
					show={showModal === 'storage'}
					onClose={onDismissModal}
					data={activeToken}
				/>
			)}
		</div>
	)
}

const Owner = ({ token = {}, onBuy, onUpdateListing }) => {
	const [profile, setProfile] = useState({})
	const { currentUser } = useStore()

	useEffect(() => {
		if (token.owner_id) {
			fetchOwnerProfile()
		}
	}, [token.owner_id])

	const fetchOwnerProfile = async () => {
		try {
			const resp = await cachios.get(`${process.env.V1_API_URL}/profiles`, {
				params: {
					accountId: token.owner_id,
				},
				ttl: 60,
			})
			const newData = resp.data.data.results[0] || {}
			setProfile(newData)
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div className="bg-gray-900 border border-blueGray-700 mt-3 p-3 rounded-md shadow-md">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<Link href={`/${token.owner_id}`}>
						<a className="hover:opacity-80">
							<Avatar
								size="md"
								src={parseImgUrl(profile.imgUrl)}
								className="align-bottom"
							/>
						</a>
					</Link>
					{token.owner_id ? (
						<div className="ml-2">
							<Link href={`/${token.owner_id}`}>
								<a className="hover:opacity-80">
									<p className="text-white font-semibold truncate">
										{prettyTruncate(token.owner_id, 16, 'address')}
									</p>
								</a>
							</Link>
						</div>
					) : (
						<p className="ml-2 text-white font-semibold">Burned</p>
					)}
				</div>
				<div>
					<Link
						href={`/token/${token.contract_id}::${token.token_series_id}/${token.token_id}`}
					>
						<a className="hover:opacity-80">
							<p className="text-white font-semibold">
								Edition #{token.edition_id}
							</p>
						</a>
					</Link>
				</div>
			</div>
			<div className="mt-1">
				<div className="flex items-center justify-between">
					{token.price ? (
						<p className="text-white">
							On sale {formatNearAmount(token.price)} Ⓝ
						</p>
					) : (
						<p className="text-white">Not for sale</p>
					)}
					{token.owner_id === currentUser ? (
						<div className="w-24">
							<Button
								onClick={() => onUpdateListing(token)}
								size="sm"
								variant="secondary"
								isFullWidth
							>
								Update
							</Button>
						</div>
					) : (
						token.price && (
							<div className="w-24">
								<Button onClick={() => onBuy(token)} size="sm" isFullWidth>
									Buy
								</Button>
							</div>
						)
					)}
				</div>
			</div>
		</div>
	)
}

export default TabOwners
