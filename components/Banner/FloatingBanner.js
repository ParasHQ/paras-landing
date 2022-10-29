import { useEffect, useState } from 'react'
import { parseImgUrl } from 'utils/common'
import LoginModal from 'components/Modal/LoginModal'
import ParasRequest from 'lib/ParasRequest'
import useSWR from 'swr'
import useStore from 'lib/store'

const FloatingBanner = () => {
	const fetchFloatingBanner = () =>
		ParasRequest.get(`${process.env.V2_API_URL}/floating-banner`).then((res) => res.data.result[0])

	const currentUser = useStore((state) => state.currentUser)
	const { data, isValidating } = useSWR('floating-banner', fetchFloatingBanner)
	const [showFloating, setShowFloating] = useState(false)

	useEffect(() => {
		if (currentUser && data.is_active) {
			if (typeof window !== undefined) {
				const modalLocalStorage = window.localStorage.getItem(data?.event_name)

				if (modalLocalStorage) {
					setShowFloating(false)
				} else {
					setShowFloating(true)
				}
			}
		} else {
			setShowFloating(true)
		}
	}, [currentUser, data])

	const onClickBanner = async (e) => {
		e.stopPropagation()
		setShowFloating(false)
		localStorage.setItem(data.event_name, true)
	}

	if ((!data && isValidating) || data.length === 0) {
		return null
	}

	return (
		<>
			{showFloating && (
				<div
					className="h-32 w-20 p-4 md:m-auto z-20 fixed right-36 bottom-10 left-1/2 transform -translate-x-1/2 md:left-auto md:transform-none cursor-pointer"
					onClick={onClickBanner}
				>
					<div className="absolute right-0">
						<div className="cursor-pointer">
							<img src={parseImgUrl(data.image)} />
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default FloatingBanner
