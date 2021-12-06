import Modal from 'components/Common/Modal'
import { IconArrowSmall, IconX } from 'components/Icons'
import LinkToProfile from 'components/LinkToProfile'
import Scrollbars from 'react-custom-scrollbars'

const TokenRoyaltyModal = ({ royalty, show, onClose }) => {
	return (
		<Modal isShow={show} closeOnBgClick={true} closeOnEscape={true} close={onClose}>
			<div className="max-w-sm py-4 w-full bg-gray-800 m-auto rounded-md relative">
				<div className="absolute right-0 top-0 pr-4 pt-4">
					<div className="cursor-pointer" onClick={onClose}>
						<IconX />
					</div>
				</div>
				<div className="px-4">
					<p className="text-2xl font-semibold text-gray-100">Royalty</p>
				</div>
				<div>
					<Scrollbars autoHeight autoHeightMax="20vh">
						<div className="ml-2">
							{Object.keys(royalty).map((accountId, idx) => {
								return (
									<div className="flex mt-2" key={idx}>
										<div className="w-2/3 flex text-gray-100">
											<IconArrowSmall />
											<LinkToProfile
												className="text-gray-100 hover:border-gray-100"
												accountId={accountId}
											/>
										</div>
										<div className="w-1/3 text-right pr-6">
											<p className="text-gray-300">{royalty[accountId] / 100}%</p>
										</div>
									</div>
								)
							})}
						</div>
					</Scrollbars>
				</div>
			</div>
		</Modal>
	)
}

export default TokenRoyaltyModal
