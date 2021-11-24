import Nav from 'components/Nav'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Drops = () => {
	const router = useRouter()
	useEffect(() => {
		router.push('/drops')
	}, [])

	return (
		<div
			className="min-h-screen relative bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Head>
				<title>Paras X Degens Syndicate - NFT Drops</title>
				<meta
					name="description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta name="twitter:title" content="Paras X Degens Syndicate - NFT Drops" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta
					name="twitter:image"
					content="https://paras-cdn.imgix.net/bafybeigmp4oakbzngzf6sbrogylzmbux6s56rlhjaacelapoqak6xg5cuq"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Paras X Degens Syndicate - NFT Drops" />
				<meta property="og:site_name" content="Paras X Degens Syndicate - NFT Drops" />
				<meta
					property="og:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-cdn.imgix.net/bafybeigmp4oakbzngzf6sbrogylzmbux6s56rlhjaacelapoqak6xg5cuq"
				/>
			</Head>
			<Nav />
			<div
				className="fixed inset-0 opacity-75"
				style={{
					zIndex: 0,
					backgroundImage: `url('/bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			/>
		</div>
	)
}

export default Drops
