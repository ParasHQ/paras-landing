import axios from 'axios'
import Head from 'next/head'

import Nav from 'components/Nav'
import Footer from 'components/Footer'
import PublicationEditor from 'components/Publication/PublicationEditor'

const Edit = ({ pubDetail }) => {
	return (
		<div className="min-h-screen relative bg-black">
			<div
				className="fixed inset-0 opacity-75"
				style={{
					zIndex: 0,
					backgroundImage: `url('/bg.jpg')`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
				}}
			></div>
			<Head>
				<title>Edit Publication — Paras</title>
				<meta
					name="description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>

				<meta name="twitter:title" content="Paras — Digital Art Cards Market" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta
					name="twitter:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta
					name="twitter:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Paras — Digital Art Cards Market" />
				<meta property="og:site_name" content="Paras — Digital Art Cards Market" />
				<meta
					property="og:description"
					content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
				/>
				<meta property="og:url" content="https://paras.id" />
				<meta
					property="og:image"
					content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
				/>
			</Head>
			<Nav />
			<div className="relative">
				<PublicationEditor isEdit={true} pubDetail={pubDetail} />
			</div>
			<Footer />
		</div>
	)
}

export async function getServerSideProps({ params }) {
	const { pubId } = params
	const resp = await axios(`${process.env.V2_API_URL}/publications?_id=${pubId}`)
	const pubDetail = (await resp.data?.data?.results[0]) || null

	return { props: { pubDetail } }
}

export default Edit
