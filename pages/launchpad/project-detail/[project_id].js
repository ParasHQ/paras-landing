import axios from 'axios'
import Card from 'components/Card/Card'
import Button from 'components/Common/Button'
import Footer from 'components/Footer'
import { IconDiscord, IconTwitter, IconWebsite } from 'components/Icons'
import Nav from 'components/Nav'
import { generateFromString } from 'generate-avatar'
import Head from 'next/head'
import { useState } from 'react'
import { parseImgUrl } from 'utils/common'

const ProjectPage = ({ project }) => {
	const [tabActive, setTabActive] = useState('story')

	const headMeta = {
		title: project.collection,
		description: project.description,
		image: parseImgUrl(project.media, null, { useOriginal: true }),
		cover: parseImgUrl(project.cover, null, { useOriginal: true }),
	}

	return (
		<div className="min-h-screen bg-black">
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
				<title>{headMeta.title}</title>
				<meta name="description" content={headMeta.description} />

				<meta name="twitter:title" content={headMeta.title} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@ParasHQ" />
				<meta name="twitter:url" content="https://paras.id" />
				<meta name="twitter:description" content={headMeta.description} />
				<meta name="twitter:image" content={headMeta.image} />
				<meta property="og:type" content="website" />
				<meta property="og:title" content={headMeta.title} />
				<meta property="og:site_name" content={headMeta.title} />
				<meta property="og:description" content={headMeta.description} />
				<meta property="og:url" content="https://paras.id" />
				<meta property="og:image" content={headMeta.image} />
			</Head>
			<Nav />
			<div className="max-w-6xl relative m-auto md:mt-20 py-12">
				<div className="flex items-center m-auto justify-center mb-4">
					{project.cover === null && (
						<div className="absolute top-0 left-0 w-full h-36 md:h-72 bg-black bg-opacity-10 backdrop-filter backdrop-blur-lg backdrop-saturate-200 -z-10" />
					)}
					<div
						className="absolute top-0 left-0 w-full h-36 md:h-72 bg-center bg-cover bg-dark-primary-2 rounded-3xl"
						style={{
							backgroundImage: `url(${parseImgUrl(project.cover ? project.cover : project.image)})`,
						}}
					/>
					<div
						className={`w-36 h-36 overflow-hidden ${
							headMeta.image === null ? 'bg-primary' : 'bg-dark-primary-2'
						} z-0 shadow-inner rounded-full mt-8 md:mt-44`}
					>
						<img
							src={parseImgUrl(
								project?.media ||
									`data:image/svg+xml;utf8,${generateFromString(project.collection_id)}`,
								{
									width: `300`,
								}
							)}
							className="w-full object-cover rounded-full border-8 border-black"
						/>
					</div>
				</div>
				<h1 className="text-4xl font-bold text-gray-100 text-center break-words mb-10">
					{project?.collection}
				</h1>
				<div className="max-w-3xl mx-auto mb-16 grid grid-cols-2 md:flex md:flex-wrap md:items-center md:justify-between text-gray-200">
					<div className="text-center mb-5 md:mb-0">
						<p className="text-2xl font-bold text-green-500">Ongoing</p>
						<p>Mint Start</p>
					</div>
					<div className="text-center">
						<p className="text-2xl font-bold">2h 00m 00s</p>
						<p>Mint Duration</p>
					</div>
					<div className="text-center">
						<p className="text-2xl font-bold">20 N</p>
						<p>Starting Price</p>
					</div>
					<div className="text-center">
						<p className="text-2xl font-bold">2000</p>
						<p>Items</p>
					</div>
				</div>
				<div className="max-w-3xl mx-auto md:flex md:justify-start">
					<div className="mx-4 mb-6 md:mb-0 md:w-4/12">
						<Card
							imgUrl={parseImgUrl(project.media, null, {
								width: `600`,
							})}
							token={{
								title: project.collection,
								collection: project.collection,
								copies: 1,
								royalty: {},
							}}
							isAbleToLike
						/>
					</div>
					<div className="mx-6 md:ml-10 md:w-8/12">
						<div className="flex justify-center md:justify-start gap-10 mb-6 text-gray-200">
							<div className="text-2xl">
								<span className="cursor-pointer" onClick={() => setTabActive('story')}>
									Story
									{tabActive === 'story' && <div className="w-full h-1 bg-gray-200" />}
								</span>
							</div>
							<div className="text-2xl">
								<span className="cursor-pointer" onClick={() => setTabActive('roadmap')}>
									Roadmap
									{tabActive === 'roadmap' && <div className="w-full h-1 bg-gray-200" />}
								</span>
							</div>
							<div className="text-2xl">
								<span className="cursor-pointer" onClick={() => setTabActive('team')}>
									Team
									{tabActive === 'team' && <div className="w-full h-1 bg-gray-200" />}
								</span>
							</div>
						</div>
						<div className="text-gray-200 text-justify">
							{tabActive === 'story' && (
								<>
									<p className="mb-4">
										It is based on the book series of the same name by Polish writer Andrzej
										Sapkowski. The Witcher follows the story of Geralt of Rivia, a solitary monster
										hunter, who struggles to find his place in a world where people often prove more
										wicked than monsters and beasts.
									</p>
									<p>
										Geralt of Rivia is a witcher, a mutant with special powers who kills monsters
										for money. The land is in a state of turmoil, due to the empire of Nilfgaard
										seeking to enlarge its territory. Among the refugees of this struggle is
										Cirilla, the Princess of Cintra, one of Nilfgaard{"'"}s victims. She and Geralt
										share a destiny. Meanwhile, another figure looms large in Geralt{"'"}s
										adventures: Yennefer, a sorceress.
									</p>
								</>
							)}
							{tabActive === 'roadmap' && (
								<>
									<p className="mb-4 font-bold text-xl">Formation of The Witcher Partnerships</p>
									<p className="mb-4">
										The Witcher is a role-playing game set in a dark fantasy world where moral
										ambiguity reigns. Shattering the line between good and evil, the game emphasizes
										story and character development, while incorporating a tactically-deep,
										real-time combat system.
									</p>
									<p className="mb-4 font-bold text-xl">Capital Club Creation</p>
									<p className="mb-4">
										Become The Witcher, Geralt of Rivia, and get caught in a web of intrigue woven
										by forces vying for control of the world. Make difficult decisions and live with
										the consequences in a game that will immerse you in an extraordinary tale like
										no other.
									</p>
									<p className="mb-4 font-bold text-xl">Staking for $WITCHER</p>
									<p className="mb-4">
										The Witcher is a role-playing game set in a dark fantasy world where moral
										ambiguity reigns. Shattering the line between good and evil, the game emphasizes
										story and character development, while incorporating a tactically-deep,
										real-time combat system.
									</p>
								</>
							)}
							{tabActive === 'team' && (
								<>
									<p className="font-bold mb-1">Geralts of The Witcher</p>
									<p className="mb-1 text-primary">Co-Founder and Operations Lead</p>
									<p className="mb-4">
										Take on the role of Geralt of Rivia: a charismatic swordmaster and professional
										monster slayer.
									</p>
									<p className="font-bold mb-1">Ciri</p>
									<p className="mb-1 text-primary">Co-Founder and Community Lead</p>
									<p className="mb-4">
										The Witcher is a Polish-American fantasy drama television series created by
										Lauren Schmidt Hissrich for the streaming service Netflix
									</p>
									<p className="font-bold mb-1">Yennefer</p>
									<p className="mb-1 text-primary">Co-Founder and Marketing Lead</p>
									<p className="mb-4">
										Wild Hunt is an open world RPG that sees Geralt of Rivia return to take on the
										most important quest of his life
									</p>
									<p className="font-bold mb-1">Dandelion</p>
									<p className="mb-1 text-primary">Co-Founder and Finance Lead</p>
									<p>
										Become The Witcher, Geralt of Rivia, a legendary monster slayer caught in a web
										of intrigue woven by forces vying for control of the world.
									</p>
								</>
							)}
						</div>
						<div className="md:flex justify-between items-center mt-10 text-center">
							<Button>Mint here</Button>
							<div className="flex justify-center gap-3.5 mt-10 md:mt-0">
								<a
									href={'https://twitter.com/' + project?.socialMedia?.website}
									target="_blank"
									rel="noreferrer"
								>
									<IconWebsite size={25} color="#cbd5e0" />
								</a>
								<a
									href={'https://twitter.com/' + project?.socialMedia?.discord}
									target="_blank"
									rel="noreferrer"
								>
									<IconDiscord size={25} />
								</a>
								<a
									href={'https://twitter.com/' + project?.socialMedia?.twitter}
									target="_blank"
									rel="noreferrer"
								>
									<IconTwitter size={25} color="#cbd5e0" />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default ProjectPage

export async function getServerSideProps({ params }) {
	if (params.project_id === 'x.paras.near') {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

	const resp = await axios.get(`${process.env.V2_API_URL}/collections`, {
		params: {
			collection_id: params.project_id,
		},
	})

	if (!resp.data.data.results[0]) {
		return {
			notFound: true,
		}
	}

	return {
		props: {
			project: resp.data.data.results[0],
		},
	}
}
