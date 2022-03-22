import Link from 'next/link'
import { prettyTruncate } from 'utils/common'

const LinkToProfile = ({ className, accountId, isComic, len = 24 }) => {
	return (
		<Link href={isComic ? `https://comic.paras.id/${accountId}` : `/${accountId}`}>
			<a
				title={accountId}
				className={`font-semibold border-b-2 border-transparent ${
					className || 'text-black hover:border-gray-900'
				}`}
				target={isComic && '_blank'}
			>
				{prettyTruncate(accountId, len, 'address')}
			</a>
		</Link>
	)
}

export default LinkToProfile
