import { useIntl } from 'hooks/useIntl'
import Link from 'next/link'

export const PublicationType = ({ path }) => {
	const { localeLn } = useIntl()
	return (
		<div className="flex flex-wrap -mx-4">
			<Link href="/publication/editorial">
				<h1
					className={`text-3xl md:text-4xl text-gray-100 cursor-pointer px-4 ${
						path === '/publication/editorial' ? 'font-bold' : null
					}`}
				>
					{localeLn('Editorial')}
				</h1>
			</Link>
			<Link href="/publication/community">
				<h1
					className={`text-3xl md:text-4xl text-gray-100 cursor-pointer px-4 ${
						path === '/publication/community' ? 'font-bold' : null
					}`}
				>
					{localeLn('Community')}
				</h1>
			</Link>
		</div>
	)
}
