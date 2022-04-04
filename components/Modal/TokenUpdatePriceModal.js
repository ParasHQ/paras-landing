import { useEffect, useState } from 'react'
import Modal from 'components/Common/Modal'
import { IconX } from 'components/Icons'
import { useIntl } from 'hooks/useIntl'
import { capitalize } from 'utils/common'
import { useRouter } from 'next/router'
import TabTokenUpdatePrice from 'components/Tabs/TabTokenUpdatePrice'
import TabCreateAuction from 'components/Tabs/TabCreateAuction'

const TokenUpdatePriceModal = ({ show, onClose, data }) => {
	const [activeTab, setActiveTab] = useState('updatePrice')
	const { localeLn } = useIntl()
	const router = useRouter()

	useEffect(() => {
		TabListing(router.query.tab)
	}, [router.query.tab])

	const TabListing = (tab) => {
		switch (tab) {
			case 'createAuction':
				setActiveTab('createAuction')
				break
			default:
				setActiveTab('updatePrice')
		}
	}

	const changeActiveTab = (tab) => {
		setActiveTab(tab)
	}

	const tabDetail = (tab) => {
		return (
			<div
				className={`cursor-pointer relative text-center ${
					activeTab === tab
						? 'text-gray-100 border-b-2 border-white font-semibold'
						: 'hover:bg-opacity-15 text-gray-100'
				}`}
				onClick={() => changeActiveTab(tab)}
			>
				<div className="capitalize">{localeLn(capitalize(tab))}</div>
			</div>
		)
	}

	return (
		<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
			<div className="max-w-sm w-full p-4 bg-gray-800 m-auto rounded-md relative">
				<div className="absolute right-0 top-0 pr-4 pt-4">
					<div className="cursor-pointer" onClick={onClose}>
						<IconX />
					</div>
				</div>
				<div>
					<h1 className="text-2xl font-bold text-white tracking-tight">
						{localeLn('CardListing')}
					</h1>
					<div className="flex mt-3 overflow-x-scroll space-x-4 flex-grow relative overflow-scroll flex-nowrap disable-scrollbars md:-mb-4">
						{tabDetail('updatePrice')}
						{tabDetail('createAuction')}
					</div>

					{activeTab === 'updatePrice' && (
						<TabTokenUpdatePrice show={show} onClose={onClose} data={data} />
					)}
					{activeTab === 'createAuction' && (
						<TabCreateAuction show={show} onClose={onClose} data={data} />
					)}
				</div>
			</div>
		</Modal>
	)
}

export default TokenUpdatePriceModal
