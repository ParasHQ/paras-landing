import Modal from 'components/Common/Modal'

const ListModal = ({
	show,
	onClose,
	list = [
		{
			name: 'Copy Link',
			onClick: () => {},
		},
		{
			name: 'Share to...',
			onClick: () => {},
		},
		{
			name: 'Burn',
			onClick: () => {},
		},
	],
}) => {
	return (
		<Modal isShow={show} close={onClose} closeOnBgClick closeOnEscape>
			<div className="px-4 py-2 bg-gray-800 max-w-xs w-full rounded-md m-auto">
				{list.map((item, index) => (
					<div key={index} className="py-2 text-white cursor-pointer" onClick={item.onClick}>
						{item.name}
					</div>
				))}
			</div>
		</Modal>
	)
}

export default ListModal
