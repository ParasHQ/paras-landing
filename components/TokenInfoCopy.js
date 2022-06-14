import { useState } from 'react'
import CopyLink from './Common/CopyLink'
import { IconCopied, IconCopy } from './Icons'

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
						<IconCopied size={16} color="rgba(243, 244, 246)" />
					) : (
						<IconCopy size={16} color="rgba(243, 244, 246)" />
					)}
				</div>
			</CopyLink>
		</div>
	)
}

export default TokenInfoCopy
