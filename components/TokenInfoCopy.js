import { useState } from 'react'
import CopyLink from './Common/CopyLink'

const TokenInfoCopy = ({ text, small = false }) => {
	const [isCopied, setIsCopied] = useState(false)
	return (
		<div>
			<CopyLink
				link={text}
				afterCopy={() => {
					setIsCopied(true)
					setTimeout(() => {
						setIsCopied(false)
					}, 2500)
				}}
			>
				<div className="flex">
					<p
						className={`whitespace-no-wrap truncate text-gray-100 text-right ${
							small ? 'w-32' : 'w-40'
						}`}
					>
						{text}
					</p>
					{isCopied ? (
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M9.70711 14.2929L19 5L20.4142 6.41421L9.70711 17.1213L4 11.4142L5.41421 10L9.70711 14.2929Z"
								fill="rgba(243, 244, 246)"
							/>
						</svg>
					) : (
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M10 2H20C21.1523 2 22 2.84772 22 4V14C22 15.1523 21.1523 16 20 16H16V20C16 21.1523 15.1523 22 14 22H4C2.84772 22 2 21.1523 2 20V10C2 8.84772 2.84772 8 4 8H8V4C8 2.84772 8.84772 2 10 2ZM8 10H4V20H14V16H10C8.84772 16 8 15.1523 8 14V10ZM10 4V14H20V4H10Z"
								fill="rgba(243, 244, 246)"
							/>
						</svg>
					)}
				</div>
			</CopyLink>
		</div>
	)
}

export default TokenInfoCopy
