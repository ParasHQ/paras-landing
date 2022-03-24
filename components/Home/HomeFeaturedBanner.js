import { useRef, useState } from 'react'
import { parseImgUrl } from 'utils/common'

const HomeFeaturedBanner = () => {
	const [showLeftClick, setShowLeftClick] = useState(false)
	const [showRightClick, setShowRightClick] = useState(true)

	const ref = useRef(null)

	const scrollToRight = () => {
		if (showRightClick) {
			ref.current.scrollTo({
				left: ref.current.scrollLeft + 400,
				behavior: 'smooth',
			})
		}
	}

	const scrollToLeft = () => {
		if (showLeftClick) {
			ref.current.scrollTo({
				left: ref.current.scrollLeft - 400,
				behavior: 'smooth',
			})
		}
	}

	const onScroll = (e) => {
		if (e.target.scrollLeft === 0) {
			setShowLeftClick(false)
		} else if (ref.current.scrollWidth - ref.current.clientWidth <= e.target.scrollLeft) {
			setShowRightClick(false)
		} else {
			setShowLeftClick(true)
			setShowRightClick(true)
		}
	}

	return (
		<div className="relative overflow-x-hidden group">
			<FeaturedOfficialParas data={FeaturedData[0]} className="md:hidden" />
			<div
				ref={ref}
				onScroll={onScroll}
				className="mb-8 mt-6 flex flex-nowrap overflow-scroll md:-mx-4 snap-x md:scroll-px-1 no-scrollbar"
			>
				<FeaturedOfficialParas data={FeaturedData[0]} className="hidden md:block" />
				{FeaturedData.slice(1).map((data, idx) => {
					if (idx % 2 == 0) return null
					return <FeaturedCommunity key={data._id} data={FeaturedData} idx={idx} />
				})}
			</div>
			<div className="absolute left-0 top-0 bottom-0 gap-4 flex items-center">
				<div
					className={`transition ease-in-out duration-200 opacity-0 ${
						showLeftClick
							? 'text-gray-200 cursor-pointer group-hover:opacity-100'
							: 'hidden cursor-not-allowed opacity-0'
					}`}
					onClick={scrollToLeft}
				>
					<svg
						className="w-10 h-10 text-white cursor-pointer"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
							clipRule="evenodd"
						></path>
					</svg>
				</div>
			</div>
			<div className="absolute right-0 top-0 bottom-0 gap-4 flex items-center">
				<div
					className={`transition ease-in-out duration-200 opacity-0 ${
						showRightClick
							? 'text-gray-200 cursor-pointer group-hover:opacity-100'
							: 'hidden cursor-not-allowed opacity-0'
					}`}
					onClick={scrollToRight}
				>
					<svg
						className="w-10 h-10 text-white cursor-pointer"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
							clipRule="evenodd"
						></path>
					</svg>
				</div>
			</div>
		</div>
	)
}

const clampStyle = {
	textOverflow: 'ellipsis',
	overflow: 'hidden',
	display: '-webkit-box',
	WebkitLineClamp: 3,
	lineClamp: 3,
	WebkitBoxOrient: 'vertical',
}

const FeaturedOfficialParas = ({ data, className }) => {
	return (
		<div
			className={`${className} w-full md:w-1/2 rounded-lg overflow-hidden flex-shrink-0 p-2 md:p-4 md:pr-2 snap-start cursor-pointer`}
			onClick={() => window.open(data.url)}
		>
			<div className="rounded-lg overflow-hidden shadow-xl drop-shadow-xl">
				<div className="w-full bg-primary aspect-[3/2]">
					<img
						src={parseImgUrl(data.image, null, {
							width: `800`,
							useOriginal: process.env.APP_ENV === 'production' ? false : true,
						})}
						className="object-cover h-full w-full publication-card-img"
					/>
				</div>
				<div className="w-full p-3 bg-gray-900 bg-opacity-50 h-[7.5rem]">
					<h1 className="text-white font-semibold text-2xl capitalize">{data.title}</h1>
					<p className="text-gray-200 text-sm" style={clampStyle}>
						{data.description}
					</p>
				</div>
			</div>
		</div>
	)
}

const FeaturedCommunity = ({ data, idx }) => {
	return (
		<div className="w-full md:w-[30%] rounded-lg overflow-hidden flex-shrink-0 flex snap-start">
			<div className="w-full">
				<div className="pt-4 px-2 cursor-pointer" onClick={() => window.open(data[idx].url)}>
					<div className="rounded-md overflow-hidden shadow-xl drop-shadow-xl">
						<div className="w-full aspect-[2/1]">
							<img
								src={parseImgUrl(data[idx].image, null, {
									width: `400`,
									useOriginal: process.env.APP_ENV === 'production' ? false : true,
								})}
								className="object-cover h-full w-full publication-card-img"
							/>
						</div>
						<div className="w-full p-3 bg-gray-900 bg-opacity-50">
							<h1 className="text-white font-semibold text-lg capitalize truncate">
								{data[idx].title}
							</h1>
							<p className="text-gray-200 text-sm truncate">{data[idx].description}</p>
						</div>
					</div>
				</div>
				<div className="pt-4 px-2 cursor-pointer" onClick={() => window.open(data[idx + 1].url)}>
					<div className="rounded-md overflow-hidden shadow-xl drop-shadow-xl">
						<div className="w-full aspect-[2/1]">
							<img
								src={parseImgUrl(data[idx + 1].image, null, {
									width: `400`,
									useOriginal: process.env.APP_ENV === 'production' ? false : true,
								})}
								className="object-cover h-full w-full publication-card-img"
							/>
						</div>
						<div className="w-full p-3 bg-gray-900 bg-opacity-50">
							<h1 className="text-white font-semibold text-lg capitalize truncate">
								{data[idx + 1].title}
							</h1>
							<p className="text-gray-200 text-sm truncate">{data[idx + 1].description}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HomeFeaturedBanner

const FeaturedData = [
	{
		_id: '6231fd168e3c26d8cf3fe117',
		title: 'New Verification System on Paras',
		image: 'ipfs://bafkreig4hx2wwg2mdbq7ikguow5s53il2krqtqecoc273rdoelyzcryq6i',
		description:
			'With the new verification system, creators or artists can get the verified creator badge without much hassle. Launch on March 23rd, 2022 at 4 PM UTC.',
		url: 'https://paras.id/publication/new-verification-system-on-paras-623b0ba13985e7cfb4a5c7fb',
		createdAt: 1647286514666,
	},
	{
		_id: '6207d075211add8143b06b2a',
		title: "Paras Comic's New Title is Coming: ATMA",
		image: 'ipfs://bafkreig5fa3vjl7t3tlapwuvh4rulhawq5sek4jqdrfhq4wojdic7uddju',
		description:
			'Born tough and strong-willed, Kheelan only has one set of goals. Sukma, his long-time best friend, has vanished, and he wants to know why.',
		url: 'https://paras.id/publication/new-title-is-coming-atma-623453bc7f2eef252545882c',
		createdAt: 1644416305415,
	},
	{
		_id: '6203cf2fc81b060c9f876d24',
		title: '2nd wave of Pioneer Portrait is coming',
		image: 'ipfs://bafkreicrlwtcbj3biglra6tfadorxuo3gorjyqrzas4cl2d2z54ijynmo4',
		description:
			'By purchasing the 1st wave of Pioneer Portrait, you will receive a 10% discount on the 2nd wave and so on.',
		url: 'https://paras.id/publication/2nd-wave-of-pioneer-portrait-is-coming-622ac90ab8ffee0df18a1306',
		createdAt: 1644416305414,
	},
	{
		_id: '61ff474ea5a49cd3620ef217',
		title: 'Auction for the First Special Avatar in the Haute Gang - DJ Patty Tiu!',
		image: 'ipfs://bafybeigyefbc4fbdrqczjfr5lz56mp7j7yguq5gq47n4zglxavwsd4looq',
		description:
			"NEAR Gang Couture's partner DJ Patty Tiu is auctioning off her music card No.8 plus the first 5 Star Avatar to grace the Haute Gang!",
		url: 'https://paras.id/publication/auction-for-the-first-special-avatar-in-the-haute-gang-dj-patty-tiu-6238e585dbdee887e2811a79',
		createdAt: 1644120099000,
	},
	{
		_id: '61fb93a9b70799098ecd9b77',
		title: 'Free giveaway and New Drop to collection!!',
		image: 'ipfs://bafybeif7rov7tpye3o25tpouta5ip6m526nx3zqlc7b24ejtwculefgzna',
		description: 'PKR64x',
		url: 'https://paras.id/publication/free-giveaway-and-new-drop-to-collection-62335eb0528d3e0f1182a167',
		createdAt: 1643844034722,
	},
	{
		_id: '61f91e41ab7b0bec2bb19c69',
		title:
			'Time Traveler : 8 Giants Ramayana Set นักเดินทางข้ามเวลา ชุด 8 ยักษ์รามายณะ Part 2 #21 - #28',
		image: 'ipfs://bafkreic4geofbsfxg7mxfs3fqqoutrydbmti265q33nywlubxuefoi7no4',
		description: 'Update prices #21 - 28 Now!',
		url: 'https://paras.id/publication/time-traveler-8-giants-ramayana-set-8-part-2-21-28-622e0be862ef9e4c448415d0',
		createdAt: 1643712400755,
	},
	{
		_id: '61fb86cdb70799098ecd9b75',
		title: 'DEPRESSING MIND 👽',
		image: 'ipfs://bafybeiczkvsserdqforxche5llicyq7i23jcsb6kvsdpe5l5mtmvnoupwi',
		description:
			'DEPRESSING MINDers are all the 999 citizens of the DEPRESSING UNIVERSE whose characters are very unique and outstanding.\n( 1/1 NFTs Profile Picture Style ✨)',
		url: 'https://paras.id/publication/depressing-mind-622e14d7e41e5b7e3fd07ad6',
		createdAt: 1643712400754,
	},
	{
		_id: '61f161e56ded9716c5951fe0',
		title: '🚨Urgent News🚨-New Moons found',
		image: 'ipfs://bafybeibllngcq3vuzbkc4nanekaycshnqr5eo6gfloszvfsm6kar2if7x4',
		description: 'Nearanian Moons have been found by Near Scientists.',
		url: 'https://paras.id/publication/urgent-news-new-moons-found-622ffffa0f9998ba31548a1d',
		createdAt: 1643078014169,
	},
	{
		_id: '61ef618269abc54df450bd34',
		title: 'Daily life of apocalypse',
		image: 'ipfs://bafybeidxqzysei25ykdxvjrftmi3ukwvnunkumpthgpw4mv67w2zvadmea',
		description: 'Check it out !!!',
		url: 'https://paras.id/publication/daily-life-of-apocalypse-6239e6f11892e69d05790e24',
		createdAt: 1642690317743,
	},
	{
		_id: '61c03154c3c3aabccdaa017e',
		image: 'ipfs://bafkreigojtkwbc77psupfpfbprh3x6tywo5mtp4yw4clxtpg2r4ilichya',
		title: 'Sonoson Marker News the newspaper for sono community !',
		description:
			'Our Sono community have a lot of funny system more than collect and flip your nft hope you come to see and join us here !!',
		url: 'https://paras.id/publication/sonoson-marker-news-the-newspaper-for-sono-community-623ad7fe1892e69d0579760f',
		createdAt: 1639985464458,
	},
	{
		_id: '61ff474ea5a49cd3620ef217',
		title: 'Auction for the First Special Avatar in the Haute Gang - DJ Patty Tiu!',
		image: 'ipfs://bafybeigyefbc4fbdrqczjfr5lz56mp7j7yguq5gq47n4zglxavwsd4looq',
		description:
			"NEAR Gang Couture's partner DJ Patty Tiu is auctioning off her music card No.8 plus the first 5 Star Avatar to grace the Haute Gang!",
		url: 'https://paras.id/publication/auction-for-the-first-special-avatar-in-the-haute-gang-dj-patty-tiu-6238e585dbdee887e2811a79',
		createdAt: 1644120099000,
	},
	{
		_id: '61fb93a9b70799098ecd9b77',
		title: 'Free giveaway and New Drop to collection!!',
		image: 'ipfs://bafybeif7rov7tpye3o25tpouta5ip6m526nx3zqlc7b24ejtwculefgzna',
		description: 'PKR64x',
		url: 'https://paras.id/publication/free-giveaway-and-new-drop-to-collection-62335eb0528d3e0f1182a167',
		createdAt: 1643844034722,
	},
	{
		_id: '61f91e41ab7b0bec2bb19c69',
		title:
			'Time Traveler : 8 Giants Ramayana Set นักเดินทางข้ามเวลา ชุด 8 ยักษ์รามายณะ Part 2 #21 - #28',
		image: 'ipfs://bafkreic4geofbsfxg7mxfs3fqqoutrydbmti265q33nywlubxuefoi7no4',
		description: 'Update prices #21 - 28 Now!',
		url: 'https://paras.id/publication/time-traveler-8-giants-ramayana-set-8-part-2-21-28-622e0be862ef9e4c448415d0',
		createdAt: 1643712400755,
	},
]
