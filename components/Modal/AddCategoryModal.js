import axios from 'axios'
import { sentryCaptureException } from 'lib/sentry'
import { useState } from 'react'
import { useToast } from 'hooks/useToast'
import useStore from 'lib/store'
import { parseImgUrl } from 'utils/common'
import Card from 'components/Card/Card'
import Modal from 'components/Modal'
import { useIntl } from 'hooks/useIntl'
import WalletHelper from 'lib/WalletHelper'
import { IconX } from 'components/Icons'

const AddCategoryModal = ({ onClose, categoryName, categoryId, curators }) => {
	const { localeLn } = useIntl()
	const [tokenUrl, setTokenUrl] = useState('')
	const [tokenData, setTokenData] = useState(null)
	const [page, setPage] = useState(1)
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()
	const currentUser = useStore((state) => state.currentUser)

	const getCreatorId = () => {
		if (!tokenData) {
			return null
		}
		return tokenData.metadata.creator_id || tokenData.contract_id
	}

	const fetchToken = async () => {
		if (isLoading) {
			return
		}

		setIsLoading(true)

		try {
			const tokenUrlSplitted = tokenUrl.split('/')

			const contract_token_id = tokenUrlSplitted[4]

			if (!contract_token_id) {
				throw new Error('Invalid URL')
			}

			const [contractId, tokenSeriesId] = contract_token_id.split('::')

			const seriesResp = await axios.get(`${process.env.V2_API_URL}/token-series`, {
				params: {
					contract_id: contractId,
					token_series_id: tokenSeriesId,
				},
			})

			const series = seriesResp.data.data.results[0] || null
			if (series) {
				setTokenData(series)
				setPage(2)
			} else {
				throw new Error('Token not found')
			}
		} catch (err) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						<p>Please enter correct Token URL</p>
						<p className="mt-2 italic">e.g https://paras.id/token/token_id</p>
					</div>
				),
				type: 'error',
				duration: 2500,
			})
		}

		setIsLoading(false)
	}

	const submitCard = async () => {
		setIsLoading(true)

		if (currentUser !== getCreatorId() && !curators.includes(currentUser)) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">{localeLn('NotCreatorOfCard')}</div>
				),
				type: 'error',
				duration: 2500,
			})
			setIsLoading(false)
			return
		}

		// should always be true
		const [contractId, tokenSeriesId] = tokenUrl.split('/')[4].split('::')

		const params = {
			account_id: currentUser,
			contract_id: contractId,
			token_series_id: tokenSeriesId,
			category_id: categoryId,
			storeToSheet: categoryId === 'art-competition' ? 'true' : 'false',
		}

		try {
			await axios.post(`${process.env.V2_API_URL}/categories/tokens`, params, {
				headers: {
					authorization: await WalletHelper.authToken(),
				},
			})
			onClose()
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						<div>{localeLn('ThankForsubmission')}</div>
						<div>{localeLn('SubmitSucceed')}</div>
					</div>
				),
				type: 'success',
				duration: 25000,
			})
			setIsLoading(false)
		} catch (err) {
			sentryCaptureException(err)
			const msg = err.response?.data?.message || 'Something went wrong, try again later.'
			toast.show({
				text: <div className="font-semibold text-center text-sm">{msg}</div>,
				type: 'error',
				duration: 2500,
			})
			setIsLoading(false)
		}
	}

	return (
		<Modal close={onClose} closeOnBgClick={false} closeOnEscape={false}>
			<div className="max-w-xl w-full m-auto bg-dark-primary-1 p-4 text-gray-100 rounded-md relative">
				<div className="flex justify-between">
					<div className="font-bold text-2xl mb-4">
						{localeLn('SubmitCardTo')} {categoryName}
					</div>
					<div onClick={onClose}>
						<IconX className="cursor-pointer" />
					</div>
				</div>
				<div className="md:flex md:pl-2 md:space-x-4 pb-2 items-center">
					<div className="w-1/2 mb-4 md:mb-0 md:w-1/3 h-full text-black">
						<Card
							imgUrl={parseImgUrl(tokenData?.metadata.media, null, {
								width: `600`,
								useOriginal: process.env.APP_ENV === 'production' ? false : true,
							})}
							imgBlur={tokenData?.metadata.blurhash}
							token={{
								title: tokenData?.metadata.title,
								edition_id: tokenData?.edition_id,
								collection: tokenData?.metadata.collection || tokenData?.contract_id,
								copies: tokenData?.metadata.copies,
								creatorId: tokenData?.metadata.creator_id || tokenData?.contract_id,
								is_creator: tokenData?.is_creator,
							}}
						/>
					</div>
					<div className="md:w-2/3">
						{page === 1 && (
							<div>
								<input
									type="text"
									name="token-url"
									onChange={(e) => setTokenUrl(e.target.value)}
									value={tokenUrl}
									className={`resize-none h-auto focus:border-gray-100 mb-4 text-black`}
									placeholder="Token URL"
								/>
								<div className="opacity-75 mb-2 text-sm">{localeLn('CuratorsCardSubmission')}</div>
								<div className="opacity-75 mb-6 text-sm">
									*Only the creator that allowed to submit their NFT
								</div>
								<button type="button" className="flex justify-end items-center pr-2 float-right">
									<div className="rounded-md py-1 font-bold text-lg mr-1" onClick={fetchToken}>
										{localeLn('Next')}
									</div>
								</button>
							</div>
						)}
						{page === 2 && (
							<div>
								<div className="text-2xl font-bold">{tokenData?.metadata.title}</div>
								<div className="mb-6">
									{tokenData?.metadata.collection || tokenData?.contract_id}
								</div>
								<div className="mb-6">
									<span className="opacity-75">{localeLn('YouWillAdd')} </span>
									<span className="text-white font-bold opacity-100">
										{tokenData?.metadata.title}
									</span>
									<span> {localeLn('To')} </span>
									<span className="text-white font-bold opacity-100">{categoryName}</span>
								</div>
								<button
									className="rounded-md py-1 font-bold mr-1 w-32 border-2 border-primary bg-primary"
									disabled={isLoading}
									onClick={submitCard}
								>
									{isLoading ? 'Loading' : 'Submit'}
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default AddCategoryModal
