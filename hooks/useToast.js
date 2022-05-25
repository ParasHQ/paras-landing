import Modal from 'components/Modal'

const { createContext, useState, useContext } = require('react')

const toastContext = createContext()

export const useToast = () => useContext(toastContext)

const { Provider } = toastContext

let timeout

const ToastProvider = ({ children }) => {
	const [reveal, setReveal] = useState(false)
	const [config, setConfig] = useState({
		text: '',
		type: 'info',
		duration: 2500,
	})

	const show = (newConfig) => {
		clearTimeout(timeout)
		const updateConfig = { ...config, ...newConfig }
		setConfig(updateConfig)
		setReveal(true)

		if (updateConfig.duration) {
			timeout = setTimeout(() => {
				setReveal(false)
			}, config.duration)
		}
	}

	const _backgroundStyle = () => {
		if (config.type === 'error') {
			return `text-red-600 bg-red-300 border border-red-500 rounded-md`
		} else if (config.type === 'success') {
			return `text-green-600 bg-green-300 border border-green-500 rounded-md`
		} else if (config.type === 'updatingAuction') {
			return `text-white bg-gray-800 border border-gray-800 rounded-md`
		} else {
			return `bg-gray-100 rounded-md`
		}
	}

	const value = { show }

	return (
		<Provider value={value}>
			{reveal && (
				<Modal
					close={(_) => setReveal(false)}
					style={{
						zIndex: 100,
					}}
				>
					<div className="hidden text-red-600 bg-red-300 border border-red-500"></div>
					<div className="hidden text-green-600 bg-green-300 border border-green-500"></div>
					<div className="hidden bg-gray-100 rounded-md"></div>
					<div className="w-full max-w-xs m-auto overflow-y-auto max-h-screen">
						<div className={_backgroundStyle()}>
							<div className="p-4">{config.text}</div>
						</div>
					</div>
				</Modal>
			)}
			<div>{children}</div>
		</Provider>
	)
}

export default ToastProvider
