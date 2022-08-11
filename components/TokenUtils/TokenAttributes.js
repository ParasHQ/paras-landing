import { useEffect, useState } from 'react'
import cachios from 'cachios'
import { IconDownArrow } from 'components/Icons'
import { useIntl } from 'hooks/useIntl'
import { trackClickAttributes } from 'lib/ga'

const TokenAttributes = ({ localToken, className }) => {
	const [isDropDown, setIsDropDown] = useState(true)
	const [attributeRarity, setAttributeRarity] = useState([])
	const collection = localToken.metadata.collection_id
		? {
				id: localToken.metadata.collection_id,
				name: localToken.metadata.collection,
		  }
		: {
				id: localToken.contract_id,
				name: localToken.contract_id,
		  }

	const { localeLn } = useIntl()

	useEffect(() => {
		if (localToken.metadata.attributes && attributeRarity.length === 0) {
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
		setAttributeRarity(newAttribute)
	}

	return (
		<div className={className}>
			<div
				className={`text-white bg-cyan-blue-3 ${
					isDropDown ? 'rounded-t-xl' : 'rounded-xl'
				} hover:cursor-pointer mt-3`}
			>
				<div
					className="flex justify-between items-center pr-2 pl-6 hover:cursor-pointer"
					onClick={() => setIsDropDown(!isDropDown)}
				>
					<p className="text-xl py-3">Attributes</p>
					<div className={`${isDropDown && 'rotate-180'}`}>
						<IconDownArrow size={30} />
					</div>
				</div>
			</div>
			{isDropDown && (
				<>
					{localToken.metadata.attributes ? (
						<div className="text-white text-lg bg-cyan-blue-1 rounded-b-xl border-b-[14px] border-cyan-blue-1 px-6 py-4 overflow-auto h-64">
							<div>
								<div className="grid grid-cols-3 gap-3 whitespace-nowrap">
									{attributeRarity?.map((attr, idx) => (
										<div
											key={idx}
											className="p-2 rounded-md border-2 text-center border-cyan-blue-2 space-x-1 overflow-x-visible hover:border-gray-400"
											onClick={() =>
												trackClickAttributes(
													localToken.token_id || localToken.token_series_id,
													attr.trait_type,
													attr.value
												)
											}
										>
											<a
												href={`/collection/${collection.id}/?attributes=[${JSON.stringify({
													[attr.trait_type]: attr.value,
												})}]`}
											>
												<p className="text-white font-light opacity-70 text-sm truncate">
													{attr.trait_type}
												</p>
												<p className="text-white font-medium text-sm truncate mb-1">{attr.value}</p>
												<p className="text-gray-300 font-light opacity-70 text-sm">
													{attr.rarity?.rarity > 1
														? Math.round(attr.rarity?.rarity)
														: attr.rarity?.rarity.toFixed(2)}
													% rarity
												</p>
											</a>
										</div>
									))}
								</div>
								{localToken.metadata?.rank && (
									<div className="mt-3">
										<p className="text-white text-sm">
											Rank: <b> {localToken.metadata?.rank}</b>
										</p>
									</div>
								)}
								{localToken.metadata?.score && (
									<div className="mt-3">
										<p className="text-white text-sm">
											Rarity Score : <b> {localToken.metadata?.score.toFixed(2)}</b>
										</p>
									</div>
								)}
							</div>
						</div>
					) : (
						<div className="text-white bg-cyan-blue-1 rounded-b-xl px-6 text-center py-20">
							<div className="text-white">{localeLn('NoTokenAttributes')}</div>
						</div>
					)}
				</>
			)}
		</div>
	)
}

export default TokenAttributes
