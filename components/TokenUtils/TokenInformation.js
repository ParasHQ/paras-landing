import { IconCopied, IconInfo } from 'components/Icons'
import IconCopySecond from 'components/Icons/component/IconCopySecond'
import IconInfoSecond from 'components/Icons/component/IconInfoSecond'
import IconOut from 'components/Icons/component/IconOut'
import { useState, useEffect } from 'react'

const TokenInformation = ({ localToken }) => {
	return (
		<div className="bg-neutral-04 border border-neutral-05 rounded-lg my-6 px-5 py-6">
			<div className="mb-6">
				<p className="font-bold text-xl text-neutral-10">General Informations</p>
				<p className="font-normal text-xs text-neutral-10 mt-2">
					Find your NFT initial information here. Make your offer and watch the move.
				</p>
			</div>
			<div className="grid grid-cols-4 bg-neutral-01 border border-neutral-05 rounded-lg p-2 mb-2">
				<button className="bg-neutral-03 border border-neutral-05 rounded-md text-white text-xs text-center px-6 py-2">
					Info
				</button>
				<button className="bg-neutral-03 border border-neutral-05 rounded-md text-white text-xs text-center px-6 py-2">
					Description
				</button>
				<button className="bg-neutral-03 border border-neutral-05 rounded-md text-white text-xs text-center px-6 py-2">
					Owners (24)
					{/* TODO */}
				</button>
				<button className="bg-neutral-03 border border-neutral-05 rounded-md text-white text-xs text-center px-6 py-2">
					Offers (2)
					{/* TODO */}
				</button>
			</div>
			<div className="grid grid-rows-6 bg-neutral-01 border border-neutral-05 rounded-lg p-2 pb-10  ">
				<div className="inline-flex justify-between items-center p-1">
					<div className="w-1/3">
						<p className="text-white text-sm">Collection</p>
					</div>
					<div className="w-2/3 inline-flex flex-row justify-between bg-neutral-01 border border-neutral-05 rounded-lg p-2">
						<p className="text-white text-sm">Skullpunkk</p>
						<IconOut size={20} stroke={'#F9F9F9'} className="text-right" />
					</div>
				</div>
				<div className="inline-flex justify-between items-center p-1">
					<div className="w-1/3">
						<p className="text-white text-sm">Royalty</p>
					</div>
					<div className="w-2/3 inline-flex flex-row justify-between bg-neutral-01 border border-neutral-05 rounded-lg p-2">
						<p className="text-white text-sm">10 %</p>
						<IconInfoSecond size={20} color={'#F9F9F9'} />
					</div>
				</div>
				<div className="inline-flex justify-between items-center p-1">
					<div className="w-1/3">
						<p className="text-white text-sm">Token ID</p>
					</div>
					<div className="w-2/3 inline-flex flex-row justify-between bg-neutral-01 border border-neutral-05 rounded-lg p-2">
						<p className="text-white text-sm">55018:1</p>
						<IconCopySecond size={20} color={'#F9F9F9'} />
					</div>
				</div>
				<div className="inline-flex justify-between items-center p-1">
					<div className="w-1/3">
						<p className="text-white text-sm">Smart Contract</p>
					</div>
					<div className="w-2/3 inline-flex flex-row justify-between bg-neutral-01 border border-neutral-05 rounded-lg p-2">
						<p className="text-white text-sm">x.paras.near</p>
						<IconCopySecond size={20} color={'#F9F9F9'} />
					</div>
				</div>
				<div className="inline-flex justify-between items-center p-1">
					<div className="w-1/3">
						<p className="text-white text-sm">NFT Link</p>
					</div>
					<div className="w-2/3 inline-flex flex-row justify-between bg-neutral-01 border border-neutral-05 rounded-lg p-2">
						<p className="text-white text-sm">https://ipfs.fleek.co/ipfs/baf...</p>
						<IconCopySecond size={20} color={'#F9F9F9'} />
					</div>
				</div>
				<div className="inline-flex justify-between items-center p-1">
					<div className="w-1/3">
						<p className="text-white text-sm">Locked Fee</p>
					</div>
					<div className="w-2/3 inline-flex flex-row justify-between bg-neutral-01 border border-neutral-05 rounded-lg p-2">
						<p className="text-white text-sm">2 %</p>
						<IconInfoSecond size={20} color={'#F9F9F9'} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default TokenInformation
