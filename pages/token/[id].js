import axios from 'axios'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Nav from '../../components/Nav'
import near from '../../lib/near'
import useStore from '../../store'
import { prettyBalance } from '../../utils/common'

const TokenDetail = ({ token }) => {
	const store = useStore()
	const router = useRouter()

	const [listingQuantity, setListingQuantity] = useState(0)
	const [listingPrice, setListingPrice] = useState('')

	console.log(router.query)

	console.log(token)

	const _buy = async (ownership) => {
		//   ownerId: AccountId,
		// tokenId: TokenId,
		// quantity: u128
		const params = {
			ownerId: ownership.ownerId,
			tokenId: ownership.tokenId,
			quantity: '1',
		}

		try {
			await near.contract.buy(
				params,
				'30000000000000',
				ownership.marketData.amount
			)
		} catch (err) {
			console.log(err)
		}
	}

	const _updatePrice = async (ownership) => {
		// export function updateMarketData(
		//   ownerId: AccountId,
		//   tokenId: TokenId,
		//   quantity: u128,
		//   amount: u128
		const params = {
			ownerId: store.currentUser,
			tokenId: router.query.id,
			quantity: listingQuantity.toString(),
			amount: parseNearAmount(listingPrice),
		}

		try {
			await near.contract.updateMarketData(params)
		} catch (err) {
			console.log(err)
		}
  }

  const _removePrice = async (ownership) => {
		// export function updateMarketData(
		//   ownerId: AccountId,
		//   tokenId: TokenId,
		//   quantity: u128,
		//   amount: u128
		const params = {
			ownerId: store.currentUser,
			tokenId: router.query.id
		}

		try {
			await near.contract.deleteMarketData(params)
		} catch (err) {
			console.log(err)
		}
  }

	return (
		<div>
			<Nav />
			Token Detail
			<div>
				<p>Add/update listing</p>
				<div>
					<label>Quantity</label>
					<input
						type="number"
						value={listingQuantity}
						onChange={(e) => setListingQuantity(e.target.value)}
					/>
				</div>
				<div>
					<label>Price</label>
					<input
						type="string"
						value={listingPrice}
						onChange={(e) => setListingPrice(e.target.value)}
					/>
				</div>
				<button onClick={_updatePrice}>Update Listing</button>
			</div>
      <div>
				<button onClick={_removePrice}>Remove Listing</button>
			</div>
			{token.ownerships.map((ownership, idx) => {
				return (
					<div>
						<p>
							{ownership.ownerId} have {ownership.quantity}
						</p>
						{ownership.marketData && (
							<div>
								<p>
									is selling for{' '}
									{prettyBalance(ownership.marketData.amount, 24, 4)}
								</p>
								<p>Available {ownership.marketData.quantity}</p>

								<button onClick={(_) => _buy(ownership)}>Buy</button>
							</div>
						)}
					</div>
				)
			})}
		</div>
	)
}

export async function getServerSideProps({ params }) {
	const res = await axios(`http://localhost:9090/tokens?tokenId=${params.id}`)
	const token = await res.data.data.results[0]

	return { props: { token } }
}

export default TokenDetail
