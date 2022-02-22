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
				<title>Paras X Nearnauts - NFT Drops</title>
				<meta
					name="description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta name="twitter:title" content="Paras X Nearnauts - NFT Drops" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta
					name="twitter:image"
					content="https://paras-cdn.imgix.net/bafybeiada5x2kaap2s5pttxo2yfie5wyclfah5t4azywqpgnkjyd67ltt4"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Paras X Nearnauts - NFT Drops" />
				<meta property="og:site_name" content="Paras X Nearnauts - NFT Drops" />
				<meta
					property="og:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-cdn.imgix.net/bafybeiada5x2kaap2s5pttxo2yfie5wyclfah5t4azywqpgnkjyd67ltt4"
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
