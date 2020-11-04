import Modal from '../components/Modal'

const { createContext, useState, useContext } = require('react')

const toastContext = createContext()

export const useToast = () => useContext(toastContext)

const { Provider } = toastContext

const ToastProvider = ({ children }) => {
	const [reveal, setReveal] = useState(false)
	// const [text, setText] = useState('')
	const [config, setConfig] = useState({
		text: '',
		type: 'info',
		duration: 2500,
	})

	const show = (newConfig) => {
		const updateConfig = { ...config, ...newConfig }
		setConfig(updateConfig)
		setReveal(true)

		if (updateConfig.duration) {
			setTimeout(() => {
				setReveal(false)
			}, config.duration)
		}
	}

	const _backgroundStyle = () => {
		if (config.type === 'error') {
			return `text-red-600 bg-red-300 border border-red-500 rounded-md`
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
