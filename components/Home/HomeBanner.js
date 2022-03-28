import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { parseImgUrl } from 'utils/common'

const HomeBanner = () => {
	if (BannerData.length === 0) {
		return
	}

	return (
		<div className="rounded-xl overflow-hidden mb-12">
			<Carousel showStatus={false} showThumbs={false} autoPlay infiniteLoop>
				{BannerData.map((item, idx) => (
					<a key={idx} href={`${item.openLink}`} target="_blank" rel="noreferrer">
						<div className="hidden md:block w-full aspect-[2/1] md:aspect-[5/2]">
							<img
								className="object-cover h-full focus:outline-none active:outline-none"
								src={parseImgUrl(item.bannerDesktop, null, {
									width: 1200,
								})}
							/>
						</div>
						<div className="md:hidden w-full aspect-[2/1] md:aspect-[5/2]">
							<img
								className="object-cover h-full focus:outline-none active:outline-none"
								src={parseImgUrl(item.bannerMobile, null, {
									width: 1200,
								})}
							/>
						</div>
					</a>
				))}
			</Carousel>
		</div>
	)
}

export default HomeBanner

const BannerData = [
	{
		bannerDesktop: 'bafkreidlneo32hgod2vxbtsosugcdyti533zbuiumbra6vgevo6s5brvni',
		bannerMobile: 'bafybeigvbovollwy5zxsiug4qjxwywx4k3dgwdkcq7fcurxn5ksi2u7bzm',
		openLink: '/submission/artist',
	},
	{
		bannerDesktop: 'bafybeibjx4oixk3kcqxhtwlkwymnpnvnvju2swio737ax5kls6oqccrdp4',
		bannerMobile: 'bafkreih5fauwp3nnbbkumgvaingshfivhqfqywv2kcfxplwtbw5rgtj3ra',
		openLink: '/submission/artist',
	},
	{
		bannerDesktop: 'bafybeieb2cfawaqndseawbw5xglndz5scjesnwa3nhn2ev4def56mnjnru',
		bannerMobile: 'bafybeib67rb3ay3pfsluwj6lfdupa7fk64vhlwetybmsvz2onpb4wc3b2e',
		openLink: '/submission/artist',
	},
]
