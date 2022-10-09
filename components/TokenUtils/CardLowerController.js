import { useState, useEffect } from 'react'
import { useIntl } from 'hooks/useIntl'
import { mutate } from 'swr'
import { trackLikeToken, trackUnlikeToken } from 'lib/ga'
import { abbrNum } from 'utils/common'
import ButtonOutline from 'components/Common/ButtonOutline'
import IconLove from 'components/Icons/component/IconLove'
import IconFullscreen from 'components/Icons/component/IconFullscreen'
import IconView from 'components/Icons/component/IconView'
import useStore from 'lib/store'
import ParasRequest from 'lib/ParasRequest'
import LoginModal from 'components/Modal/LoginModal'

const CardLowerController = ({ localToken }) => {
	const { localeLn } = useIntl()
	const currentUser = useStore((state) => state.currentUser)

	const [isLiked, setIsLiked] = useState(false)
	const [defaultLikes, setDefaultLikes] = useState(false)
	const [showLoginModal, setShowLoginModal] = useState(false)

	useEffect(() => {
		if (localToken?.total_likes) {
			if (localToken.likes) {
				setIsLiked(true)
			}

			setDefaultLikes(localToken?.total_likes)
		}
	}, localToken)

	const onCloseLoginModal = () => {
		setShowLoginModal(false)
	}

	const likeToken = async (contract_id, token_series_id, source) => {
		if (!currentUser) {
			setShowLoginModal(true)
			return
		}

		setIsLiked(true)
		setDefaultLikes(defaultLikes + 1)
		const params = {
			account_id: currentUser,
		}

		const res = await ParasRequest.put(
			`${process.env.V2_API_URL}/like/${contract_id}/${token_series_id}`,
			params
		)

		mutate(`${localToken.contract_id}::${localToken.token_series_id}`)
		mutate(`${localToken.contract_id}::${localToken.token_series_id}/${localToken.token_id}`)
		if (res.status !== 200) {
			setIsLiked(false)
			setDefaultLikes(defaultLikes - 1)
			return
		}

		trackLikeToken(`${contract_id}::${token_series_id}`, source)
	}

	const unlikeToken = async (contract_id, token_series_id, source) => {
		if (!currentUser) {
			setShowLoginModal(true)
			return
		}

		setIsLiked(false)
		setDefaultLikes(defaultLikes - 1)
		const params = {
			account_id: currentUser,
		}

		const res = await ParasRequest.put(
			`${process.env.V2_API_URL}/unlike/${contract_id}/${token_series_id}`,
			params
		)

		mutate(`${localToken.contract_id}::${localToken.token_series_id}`)
		mutate(`${localToken.contract_id}::${localToken.token_series_id}/${localToken.token_id}`)
		if (res.status !== 200) {
			setIsLiked(true)
			setDefaultLikes(defaultLikes + 1)
			return
		}

		trackUnlikeToken(`${contract_id}::${token_series_id}`, source)
	}

	return (
		<div className="flex flex-row justify-between items-center mb-8">
			<div className="flex flex-row text-white items-center">
				<ButtonOutline
					content={
						<div
							className="flex flex-row items-center"
							onClick={() => {
								isLiked
									? unlikeToken(localToken.contract_id, localToken.token_series_id, 'detail')
									: likeToken(localToken.contract_id, localToken.token_series_id, 'detail')
							}}
						>
							{/* <IconLoveOutline stroke={'#F9F9F9'} size={20} /> */}
							<IconLove
								size={17}
								color={isLiked ? '#c51104' : 'transparent'}
								stroke={isLiked ? 'none' : 'white'}
								className="mr-2"
							/>
							<p className="text-neutral-10 text-sm">{abbrNum(defaultLikes ?? 0, 1)} Likes</p>
						</div>
					}
				/>
				<div className="mx-2">
					<IconView stroke={'#F9F9F9'} size={24} />
				</div>
				<p>{localToken.view || 0} </p>
				<p>{localeLn('Views')}</p>
			</div>

			<div className="justify-self-end">
				<ButtonOutline
					content={
						<div className="flex flex-row items-center">
							<IconFullscreen size={20} stroke={'#F9F9F9'} />
							<p className="ml-3">View art</p>
						</div>
					}
				/>
			</div>
			<LoginModal show={showLoginModal} onClose={onCloseLoginModal} />
		</div>
	)
}

export default CardLowerController
