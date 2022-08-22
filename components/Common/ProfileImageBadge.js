import { ASSET_BADGE, ASSET_BADGE_COLOR } from 'constants/badge'
import { useEffect, useRef, useState } from 'react'
import { parseImgUrl } from 'utils/common'

const ProfileImageBadge = ({ level = 'bronze', imgUrl, className }) => {
	const [dimension, setDimension] = useState({ width: '', height: '' })
	const ref = useRef()

	useEffect(() => {
		setDimension({ width: ref.current.offsetWidth, height: ref.current.offsetHeight })
	}, [ref])

	return (
		<div
			className={`rounded-full bg-primary z-0 relative ${ASSET_BADGE_COLOR[level]} ${className}`}
			ref={ref}
			style={{ borderWidth: dimension.width / 18 }}
		>
			<img
				src={parseImgUrl(imgUrl, null, {
					width: `300`,
				})}
				className="object-cover rounded-full"
			/>
			<img
				src={parseImgUrl(ASSET_BADGE[level], null, {
					width: `100`,
				})}
				className="absolute right-0 left-0 m-auto"
				style={{
					width: dimension.width / 3,
					height: dimension.width / 3,
					bottom: -dimension.width / 5.5,
				}}
			/>
		</div>
	)
}

export default ProfileImageBadge
