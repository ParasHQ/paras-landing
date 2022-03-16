import Button from 'components/Common/Button'
import { IconX } from 'components/Icons'
import near from 'lib/near'
import { GAS_FEE_150 } from 'config/constants'
import useStore from 'lib/store'
import { useEffect, useState } from 'react'
import { sentryCaptureException } from 'lib/sentry'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import Modal from 'components/Modal'
import Scrollbars from 'react-custom-scrollbars'

const GachaModal = () => {
	const [showFloating, setShowFloating] = useState(false)
	const [showModalDetail, setShowModalDetail] = useState(false)
	const currentUser = useStore((state) => state.currentUser)
	const countBundle = useStore((state) => state.gachaCountBundle)
	const setCountBundle = useStore((state) => state.setGachaCountBundle)

	useEffect(() => {
		if (currentUser) getBoughtCountBundle()

		if (currentUser && countBundle === 0) {
			if (typeof window !== 'undefined') {
				const gachaModal = window.localStorage.getItem('gachaModal')

				if (gachaModal) setShowFloating(false)
				else setShowFloating(true)
			}
		}
	}, [currentUser, countBundle])

	const getBoughtCountBundle = async () => {
		try {
			const params = {
				mint_bundle_id: 'gacha-test',
				account_id: currentUser,
			}

			const response = await near.wallet
				.account()
				.viewFunction(process.env.COMIC_CONTRACT_ID, `get_buy_count_mint_bundle`, params)

			setCountBundle(response)
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const buyMintBundle = async () => {
		try {
			const params = {
				mint_bundle_id: 'gacha-test',
				nft_contract_id: process.env.COMIC_CONTRACT_ID,
				receiver_id: currentUser,
			}

			await near.wallet.account().functionCall({
				contractId: process.env.COMIC_CONTRACT_ID,
				methodName: `buy_mint_bundle`,
				args: params,
				gas: GAS_FEE_150,
				attachedDeposit: parseNearAmount(`0.01128`),
			})
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const onCloseFloating = (e) => {
		e.stopPropagation()
		setShowFloating(false)
		localStorage.setItem('gachaModal', false)
	}

	const onCloseModal = () => {
		setShowModalDetail(false)
	}

	const onShowModalDetail = () => {
		setShowModalDetail(true)
	}

	return (
		<>
			{showFloating && (
				<div
					className="h-32 w-60 p-4 md:m-auto bg-center bg-cover rounded-md z-50 fixed right-6 bottom-2 left-1/2 transform -translate-x-1/2 md:left-auto md:transform-none cursor-pointer"
					style={{
						backgroundImage: `url(https://paras-cdn.imgix.net/bafkreib5xzciumyexeggz3xh5b7ky3a2ebyvcnrfintfgu3xx65zt5xmui?w=800&auto=format,compress)`,
					}}
					onClick={onShowModalDetail}
				>
					<div className="absolute right-0 top-1">
						<div className="cursor-pointer">
							<IconX
								className="rounded-full text-center"
								color={'white'}
								onClick={(e) => onCloseFloating(e)}
							/>
						</div>
					</div>
				</div>
			)}
			{showModalDetail && (
				<GachaModalDetail
					show={showModalDetail}
					onClose={onCloseModal}
					claimGacha={() => buyMintBundle()}
				/>
			)}
		</>
	)
}

export default GachaModal

const GachaModalDetail = ({ claimGacha, onClose }) => {
	return (
		<Modal isShow={true} closeOnBgClick={true} closeOnEscape={true} close={onClose}>
			<div className="max-w-xl w-full bg-gray-800 m-auto rounded-md relative">
				<div
					className="bg-cover bg-center h-40 md:h-60 rounded-t-md"
					style={{
						backgroundImage: `url(https://paras-cdn.imgix.net/bafkreib5xzciumyexeggz3xh5b7ky3a2ebyvcnrfintfgu3xx65zt5xmui?w=800&auto=format,compress)`,
					}}
				>
					<div className="absolute right-0 top-0 pr-4 pt-4">
						<div className="cursor-pointer" onClick={onClose}>
							<IconX />
						</div>
					</div>
				</div>
				<Scrollbars autoHeight>
					<div className="pt-5 pr-8 pl-4 md:pr-4 text-gray-100 text-justify">
						<p className="text-2xl font-semibold pb-5">Gacha Comic Event</p>
						<p className="mb-4">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
							incididunt ut labore et dolore magna aliqua. Lacus vestibulum sed arcu non odio
							euismod. Purus in massa tempor nec feugiat nisl pretium fusce id. Semper eget duis at
							tellus at urna condimentum mattis pellentesque. Facilisi nullam vehicula ipsum a arcu
							cursus vitae congue mauris. Tristique senectus et netus et malesuada fames ac turpis.
							Quisque egestas diam in arcu. Erat pellentesque adipiscing commodo elit at imperdiet.
							Mauris nunc congue nisi vitae suscipit tellus mauris a. Consectetur a erat nam at
							lectus. Dignissim convallis aenean et tortor at risus. Habitasse platea dictumst
							vestibulum rhoncus est pellentesque elit. Scelerisque eu ultrices vitae auctor. Ac
							turpis egestas maecenas pharetra convallis posuere morbi leo urna. In nibh mauris
							cursus mattis. Ac ut consequat semper viverra nam libero. Sed vulputate mi sit amet
							mauris commodo quis imperdiet massa.
						</p>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
							incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
							exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
							dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
							Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
							mollit anim id est laborum.
						</p>
					</div>
					<div className="flex justify-center mx-10 md:mx-40 rounded-md mt-5 pr-8 pl-4 md:pr-4 mb-6 md:mb-4">
						<Button size="sm" isFullWidth onClick={claimGacha}>
							CLAIM
						</Button>
					</div>
				</Scrollbars>
			</div>
		</Modal>
	)
}
