import { IconX } from '../Icons'
const LaunchpadRemindModal = ({ onGoToSetting, onClose }) => {
	return (
		<>
			<div className="max-w-md w-full m-auto bg-dark-primary-2 rounded-md p-4 border-blue-800 border-2">
				<div className="m-auto">
					<div className="flex justify-between">
						<h1 className="text-3xl font-bold text-gray-100 tracking-tight mb-1">&nbsp;</h1>
						<div onClick={onClose}>
							<IconX size={24} className="cursor-pointer" />
						</div>
					</div>
					<div className="flex justify-between flex-1 flex-col text-gray-200 flex-column">
						<div className="text-center">
							You need to add your email in &quot;Settings&quot; <br />
							before you can receive notification.
						</div>
						<div>
							<button
								onClick={onGoToSetting}
								className="outline-none h-12 w-full mt-4 rounded-md text-sm font-semibold border-none px-4 py-2 bg-primary text-gray-100"
							>
								Go To Settings
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
export default LaunchpadRemindModal
