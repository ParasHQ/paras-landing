import { useEffect, useState } from 'react'
import { parseImgUrl } from 'utils/common'
import Link from 'next/link'
import ParasRequest from 'lib/ParasRequest'
import useSWR from 'swr'

const FloatingBanner = () => {
	const fetchFloatingBanner = () =>
		ParasRequest.get(`${process.env.V2_API_URL}/floating-banner`).then((res) => res.data.result[0])

	const { data, isValidating } = useSWR('floating-banner', fetchFloatingBanner)
	const [showFloating, setShowFloating] = useState(false)

	useEffect(() => {
		if (data?.is_active) {
			setShowFloating(true)
		} else {
			setShowFloating(false)
		}
	}, [data])

	if ((!data && isValidating) || data.length === 0) {
		return null
	}

	return (
		<>
			{showFloating && (
				<Link href={`${data?.open_link}`}>
					<div className="h-36 w-24 p-4 md:m-auto z-20 fixed right-36 bottom-5 left-1/2 transform -translate-x-1/2 md:left-auto md:transform-none cursor-pointer">
						<div className="absolute right-0">
							<div className="cursor-pointer">
								<img src={parseImgUrl(data.image)} />
							</div>
						</div>
					</div>
				</Link>
			)}
		</>
	)
}

export default FloatingBanner
