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
				<title>Paras X Boo - NFT Drops</title>
				<meta
					name="description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta name="twitter:title" content="Paras X Boo - NFT Drops" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta
					name="twitter:image"
					content="https://ipfs.fleek.co/ipfs/bafybeig4lyaarq6izm27rx5cf57geb6setyqvk3ojb77sta5gyg3navaq4"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Paras X Boo - NFT Drops" />
				<meta property="og:site_name" content="Paras X Boo - NFT Drops" />
				<meta
					property="og:description"
					content="Create, Trade, and Collect Digital Collectibles. All-in-one social NFT marketplace for creators and collectors. Discover the best and latest NFT collectibles on NEAR."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://ipfs.fleek.co/ipfs/bafybeig4lyaarq6izm27rx5cf57geb6setyqvk3ojb77sta5gyg3navaq4"
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
