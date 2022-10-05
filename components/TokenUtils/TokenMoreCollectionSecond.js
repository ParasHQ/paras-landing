import Button from 'components/Common/Button'
import IconEmptyMoreCollection from 'components/Icons/component/IconEmptyMoreCollection'
import { useState } from 'react'

const TokenMoreCollectionSecond = () => {
	const [moreFromCollections, setMoreFromCollections] = useState([])

	return (
		<div className="relative max-w-6xl m-auto pt-10 pb-14">
			<p className="text-xl text-white font-bold mb-5">More from this Collection</p>
			<div className="mb-5">
				{moreFromCollections.length <= 0 ? (
					<div className="bg-neutral-01 border border-neutral-05 rounded-lg py-10">
						<IconEmptyMoreCollection size={150} className="mx-auto" />
					</div>
				) : (
					<div></div>
				)}
			</div>
			<div className="text-center">
				<Button variant="second">View Collection</Button>
			</div>
		</div>
	)
}

export default TokenMoreCollectionSecond
