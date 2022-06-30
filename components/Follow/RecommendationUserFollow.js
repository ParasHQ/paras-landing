import Button from 'components/Common/Button'
import { parseImgUrl } from 'utils/common'

const dataProfile = {
	_id: '61dead9e29f70266b43c7b5b',
	accountId: 'kenzeroart.near',
	bio: 'Creator of Near Doodle\r\nhttps://discord.com/invite/E5T7HvRGfJ',
	createdAt: 1641983390501,
	instagramId: 'kenzeroart',
	twitterId: 'kenzero14',
	website: 'https://kenzeroart.editorx.io/neardoodle',
	weiboUrl: '',
	imgUrl: 'ipfs://bafybeif7hnppq5k5c55tjp3ukeplkw6wuf2z3dopes5bj7vjbys6vxwbei',
	isEmailVerified: true,
	has_notification: true,
	isCreator: true,
	coverUrl: 'ipfs://bafybeihchw35bckquvm5yexwc3v3nag2las3i3cn6fl5bfhsjfcmus7x7a',
	followers: 5,
	following: 2,
}

const RecommendationUserFollow = () => {
	return (
		<div className="border-[0.5px] border-gray-600 rounded-xl">
			<div
				className={`object-cover w-full md:h-20 h-full p-1 rounded-xl ${
					!dataProfile?.coverUrl ? 'bg-primary' : 'bg-dark-primary-2'
				}`}
				style={{
					backgroundImage: `url(${parseImgUrl(dataProfile?.coverUrl, null)})`,
					backgroundPosition: 'center',
					backgroundSize: 'cover',
				}}
			/>
			<div className="mt-2 mx-2">
				<div className="relative">
					<div
						className={`absolute w-12 h-12 -top-6 overflow-hidden border-4 border-black ${
							!dataProfile.imgUrl ? 'bg-primary' : 'bg-dark-primary-2'
						} rounded-full`}
					>
						<img
							src={parseImgUrl(dataProfile?.imgUrl, null, {
								width: `300`,
							})}
							className="w-full object-cover rounded-full"
						/>
					</div>
				</div>
				<p className="text-white font-bold text-right">ahnaf.near</p>
			</div>
			<div className="flex justify-between items-end gap-2 mx-2 mt-1 mb-2">
				<div>
					<p className="text-gray-400 text-[0.6rem]">Last 7 days volume</p>
					<p className="text-white font-bold">18,0324 N</p>
				</div>
				<div>
					<p className="text-gray-400 text-[0.6rem]">Followers</p>
					<p className="text-white font-bold">500</p>
				</div>
				<div>
					<Button size="sm">Follow</Button>
				</div>
			</div>
		</div>
	)
}
export default RecommendationUserFollow
