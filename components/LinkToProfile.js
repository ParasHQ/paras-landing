import Link from 'next/link'
import { prettyTruncate } from '../utils/common'

const LinkToProfile = ({ className, accountId, len = 24 }) => {
	return (
		<Link href={`/${accountId}`}>
			<a
				title={accountId}
				className={`font-semibold border-b-2 border-transparent ${
					className || 'text-black hover:border-gray-900'
				}`}
			>
				{prettyTruncate(accountId, len, 'address')}
			</a>
		</Link>
	)
}

export default LinkToProfile
