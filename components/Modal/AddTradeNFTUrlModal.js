import axios from 'axios'
import Button from 'components/Common/Button'
import { IconX } from 'components/Icons'
import Modal from 'components/Modal'
import { useToast } from 'hooks/useToast'
import React, { useState } from 'react'
import { checkTokenUrl } from 'utils/common'
import useStore from 'lib/store'

const AddTradeNFTUrlModal = ({ setIsShow, onClose, setTradedToken }) => {
	const [isAdding, setIsAdding] = useState(false)
	const [urlToken, setUrlToken] = useState('')
	const toast = useToast()
	const currentUser = useStore((state) => state.currentUser)

	const onAdd = async (e) => {
		e.preventDefault()
		setIsAdding(true)
		let _urlToken = urlToken.replace(
			/^((https?|ftp|smtp):\/\/)?(www\.)?(paras\.id|localhost:\d+|marketplace-v2-testnet\.paras\.id|testnet\.paras\.id)\/token\//,
			''
		)
		if (urlToken === '') {
			toast.show({
				text: <div className="font-semibold text-center text-sm">Please fill your Token URL</div>,
				type: 'error',
				duration: 2500,
			})
			setIsAdding(false)
			return
		}

		if (urlToken && !checkTokenUrl(urlToken)) {
			toast.show({
				text: <div className="font-semibold text-center text-sm">Please enter valid Token URL</div>,
				type: 'error',
				duration: 2500,
			})
			setIsAdding(false)
			return
		}
		const [contract_id, token_id] = _urlToken.split('/')
		const _owner = await getOwnerTradedToken(contract_id, token_id)
		if (_owner?.length === 0) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">You are not the owner of the card</div>
				),
				type: 'error',
				duration: 2500,
			})
			setIsAdding(false)
			return
		}
		if (!_owner[0].is_creator) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						The creator of this card is not verified
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			setIsAdding(false)
			return
		}
		setTradedToken([_urlToken])
		setIsShow(false)
	}

	const getOwnerTradedToken = async (contractId, tokenId) => {
		const params = {
			contract_id: contractId.split('::')[0],
			token_id: tokenId ?? contractId.split('::')[1],
			owner_id: currentUser,
		}

		const resp = await axios.get(`${process.env.V2_API_URL}/token`, {
			params: params,
			ttl: 60,
		})
		return resp.data.data.results
	}

	return (
		<Modal close={() => setIsShow(false)}>
			<div className="w-full max-w-lg p-4 m-auto bg-gray-800 rounded-md overflow-y-auto max-h-screen relative">
				<h1 className="text-2xl font-bold text-white text-center tracking-tight">Add NFT</h1>
				<div className="absolute right-0 top-0 pr-4 pt-4">
					<div className="cursor-pointer" onClick={() => setIsShow(false)}>
						<IconX onClick={onClose} />
					</div>
				</div>
				<div className="mt-2">
					<input
						type="text"
						name="tokenUrl"
						onChange={(e) => {
							if (e.target.value.includes('%')) setUrlToken(decodeURIComponent(e.target.value))
							else setUrlToken(e.target.value)
						}}
						value={urlToken}
						className={`resize-none h-auto focus:border-gray-100 text-black`}
						placeholder="Token URL"
					/>{' '}
					<div className="mt-2">
						<a
							className="text-white hover:text-opacity-60 text-sm"
							href={`/${currentUser}`}
							target="_blank"
							rel="noreferrer"
						>
							Go To My Profile
						</a>
					</div>
					<div className="mt-2">
						<p className="text-gray-300 text-sm italic">Please input the link of your own token</p>
						<p className="text-gray-300 text-sm italic">https://paras.id/token/x.paras.near::1</p>
					</div>
				</div>
				<div className="mt-4">
					<Button isDisabled={isAdding} isFullWidth size="md" onClick={onAdd}>
						{isAdding ? `Adding...` : `Add`}
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export default AddTradeNFTUrlModal
