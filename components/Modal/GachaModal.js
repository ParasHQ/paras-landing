import Button from 'components/Common/Button'
import { IconX } from 'components/Icons'
import { GAS_FEE_150 } from 'config/constants'
import useStore from 'lib/store'
import { useEffect, useState } from 'react'
import { sentryCaptureException } from 'lib/sentry'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import Modal from 'components/Modal'
import Scrollbars from 'react-custom-scrollbars'
import { parseImgUrl } from 'utils/common'
import WalletHelper from 'lib/WalletHelper'
import LoginModal from './LoginModal'

const GachaModal = () => {
	const [showFloating, setShowFloating] = useState(false)
	const [showModalDetail, setShowModalDetail] = useState(false)
	const currentUser = useStore((state) => state.currentUser)
	const countBundle = useStore((state) => state.gachaCountBundle)
	const setCountBundle = useStore((state) => state.setGachaCountBundle)
	const setTransactionRes = useStore((state) => state.setTransactionRes)

	useEffect(() => {
		if (currentUser === null) {
			setShowFloating(true)
		}

		if (currentUser) getBoughtCountBundle()

		if (currentUser && countBundle === 0) {
			if (typeof window !== 'undefined') {
				const gachaModal = window.localStorage.getItem('gachaModal')

				if (gachaModal) setShowFloating(false)
				else setShowFloating(true)
			}
		} else if (countBundle !== null) {
			setShowFloating(false)
		}
	}, [currentUser, countBundle])

	const getBoughtCountBundle = async () => {
		try {
			const params = {
				mint_bundle_id: 'bob-boom-mystery-box',
				account_id: currentUser,
			}

			const response = await WalletHelper.viewFunction({
				methodName: `get_buy_count_mint_bundle`,
				contractId: process.env.COMIC_CONTRACT_ID,
				args: params,
			})

			setCountBundle(response)
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const buyMintBundle = async () => {
		try {
			const params = {
				mint_bundle_id: 'bob-boom-mystery-box',
				nft_contract_id: process.env.COMIC_CONTRACT_ID,
				receiver_id: currentUser,
			}

			const res = await WalletHelper.callFunction({
				contractId: process.env.COMIC_CONTRACT_ID,
				methodName: `buy_mint_bundle`,
				args: params,
				gas: GAS_FEE_150,
				deposit: parseNearAmount(`0.01128`),
			})

			if (res?.response) {
				onCloseFloating()
				setTransactionRes(res?.response)
			}
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
					className="h-32 w-60 p-4 md:m-auto bg-center bg-cover rounded-md z-20 fixed right-6 bottom-2 left-1/2 transform -translate-x-1/2 md:left-auto md:transform-none cursor-pointer border-2"
					style={{
						backgroundImage: `url(${parseImgUrl(
							`bafkreifvrd4f6bfeqo2bucxxa6ptw7jtq3w35z77t5r3gui45j4yu2gtwm`
						)})`,
						backgroundPositionY: '-47px',
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
	const currentUser = useStore((state) => state.currentUser)
	const [showLogin, setShowLogin] = useState(false)

	return (
		<>
			<Modal isShow={true} closeOnBgClick={true} closeOnEscape={true} close={onClose}>
				<div className="max-w-xl w-full bg-gray-800 m-auto rounded-md relative">
					<div
						className="bg-cover bg-center h-40 md:h-60 rounded-t-md"
						style={{
							backgroundImage: `url(${parseImgUrl(
								`bafkreifa7oppjksaa2euocnedsww6u7grjmfja6zkdm5u3mjjdvwkm54me`
							)})`,
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
							<p className="text-2xl font-semibold pb-2">Bob Boom Giveaway Limited Edition NFTs</p>
							<p className="mb-4">
								Exclusive limited edition Bob Boom! collectible NFTs, one of three designs with six
								variations each. Bob Boom! comics and collectibles are available now at{' '}
								<a
									href="https://comic.paras.id/comics/bob-boom/chapter"
									className="underline"
									target="_blank"
									rel="noreferrer"
								>
									comic.paras.id/comics/bob-boom/chapter
								</a>
							</p>
						</div>
						<div className="flex justify-center mx-10 md:mx-40 rounded-md mt-5 pr-8 pl-4 md:pr-4 mb-6 md:mb-4">
							{currentUser ? (
								<Button size="sm" isFullWidth onClick={claimGacha}>
									CLAIM
								</Button>
							) : (
								<Button size="sm" isFullWidth onClick={() => setShowLogin(true)}>
									Please Login First
								</Button>
							)}
						</div>
					</Scrollbars>
				</div>
			</Modal>
			<LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
		</>
	)
}
