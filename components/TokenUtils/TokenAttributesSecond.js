import cachios from 'cachios'
import { useState, useEffect } from 'react'
import IconEmptyAttribute from 'components/Icons/component/IconEmptyAttribute'
import Link from 'next/link'
import { trackClickAttributes } from 'lib/ga'
import { IconArrowSmall } from 'components/Icons'

const TokenAttributesSecond = ({ localToken }) => {
	const [attributes, setAttributes] = useState([])
	const collection = localToken.metadata.collection_id
		? {
				id: localToken.metadata.collection_id,
				name: localToken.metadata.collection,
		  }
		: {
				id: localToken.contract_id,
				name: localToken.contract_id,
		  }

	useEffect(() => {
		if (localToken.metadata.attributes) {
			getRarity(localToken.metadata.attributes)
		}
	}, [localToken])

	const getRarity = async (attributes) => {
		const res = await cachios.post(`${process.env.V2_API_URL}/rarity`, {
			collection_id: collection.id,
			attributes: attributes,
			ttl: 120,
		})

		const newAttribute = await res.data.data
		setAttributes(newAttribute)
	}

	return (
		<div className="bg-neutral-03 text-white rounded-lg border border-neutral-05 py-6 px-5 mb-8">
			<p className="font-bold text-xl mb-2">Attributes</p>
			<p className="font-normal text-xs mb-6">
				Some of the characteristics that determine the rarity score
			</p>
			<div className="flex flex-row justify-between items-center mb-2">
				<div className="border border-neutral-05 rounded-lg text-sm font-bold p-2">
					{' '}
					Rarity Score: {localToken.metadata?.score
						? localToken.metadata?.score?.toFixed(2)
						: 0}{' '}
				</div>
			</div>

			<div className="max-h-80 overflow-y-auto">
				{attributes.length <= 0 ? (
					<IconEmptyAttribute size={100} className="mx-auto my-4" />
				) : (
					attributes.map((attribute) => (
						<Link
							key={attribute}
							href={`/collection/${collection.id}/?attributes=[${JSON.stringify({
								[attribute.trait_type]: attribute.value,
							})}]`}
						>
							<a
								className="flex flex-row justify-between items-center bg-neutral-01 border border-neutral-05 rounded-lg px-3 py-4 my-2"
								onClick={() =>
									trackClickAttributes(
										localToken.token_id || localToken.token_series_id,
										attribute.trait_type,
										attribute.value
									)
								}
							>
								<div>
									<p className="text-neutral-08">{attribute.trait_type} :</p>
									<p className="text-neutral-09">{attribute.value}</p>
								</div>
								<div className="inline-flex">
									<p className="text-sm text-neutral-09 text-right bg-neutral-03 rounded-lg p-1">
										{attribute.rarity?.rarity?.toFixed(2)} % Rarity
									</p>
									<IconArrowSmall size={24} />
								</div>
							</a>
						</Link>
					))
				)}
			</div>
		</div>
	)
}

export default TokenAttributesSecond
