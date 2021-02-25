import Link from 'next/link'

export const PublicationType = ({ path }) => {
	return (
		<div className="flex flex-wrap -mx-4">
			<Link href="/publication/editorial">
				<h1
					className={`text-3xl md:text-4xl text-gray-100 cursor-pointer px-4 ${
						path === '/publication/editorial' ? 'font-bold' : null
					}`}
				>
					Editorial
				</h1>
			</Link>
			<Link href="/publication/community">
				<h1
					className={`text-3xl md:text-4xl text-gray-100 cursor-pointer px-4 ${
						path === '/publication/community' ? 'font-bold' : null
					}`}
				>
					Community
				</h1>
			</Link>
		</div>
	)
}
