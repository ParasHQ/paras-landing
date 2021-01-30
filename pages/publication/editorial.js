import Head from 'next/head'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import axios from 'axios'
import LinkToProfile from '../../components/LinkToProfile'
import { useRouter } from 'next/router'
import { PublicationType } from '../../components/PublicationType'

const LIMIT = 5

const Publication = ({ pubList }) => {
	const router = useRouter()

	return (
		<div
			className="min-h-screen relative bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Head>
				<title>Publication — Paras</title>
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
				<meta
					property="og:site_name"
					content="Paras — Digital Art Cards Market"
				/>
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
			<div className="max-w-4xl relative m-auto py-12 md:p-0 p-4">
				<PublicationType path={router.pathname} />
				<div className="mt-8">
					{pubList.map((pub) => (
						<PublicationList data={pub} />
					))}
					{/* <PublicationList />
					<PublicationList />
					<PublicationList /> */}
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default Publication

const PublicationList = ({ data }) => {
	const data3 = {
		_id: '6013878728cb354ea2346321',
		slug: 'sadfdsaf',
		title: 'Ini sebuah cerita yang mana mengisahkan sebuah',
		thumbnail: 'thub',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam id arcu tempus nisl laoreet lobortis. Nulla convallis in justo consectetur pulvinar. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
		authorId: 'lalalalala.testnet',
		content: {
			blocks: [
				{
					key: 'foo',
					text: 'sdf',
					type: 'unstyled',
					depth: 0,
					inlineStyleRanges: [],
					entityRanges: [],
					data: {},
				},
			],
			entityMap: {},
		},
		tokenIds: null,
		type: 'community',
		createdAt: 1611892615445,
		updatedAt: 1611892615445,
	}

	return (
		<div className="md:flex max-w-4xl m-auto mt-8">
			<div className="md:w-1/4 md:mr-8">
				<div className="md:w-56 md:h-48 w-full h-64 bg-gray-700"></div>
			</div>
			<div className="md:w-3/4 m-auto">
				<Link href={`/publication/${data.type}/${data.slug}-${data._id}`}>
					<h1 className="text-white text-2xl font-bold border-b-2 border-transparent cursor-pointer">
						{data.title}
					</h1>
				</Link>
				<p className="text-white mt-2">{data.description}</p>
				<div className="mt-2 flex m-auto">
					<p className="text-white">
						<span> Community | </span>
						<LinkToProfile
							accountId={data.authorId}
							className="text-white font-bold hover:border-white"
						/>
					</p>
				</div>
			</div>
		</div>
	)
}

export async function getServerSideProps() {
	const res = await axios(
		`${process.env.API_URL}/publications?type=community&__limit=${LIMIT}`
	)
	const pubList = await res.data.data.results

	return { props: { pubList } }
}
