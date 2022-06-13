import { IconSpin } from 'components/Icons'

const LoadingTracker = () => {
	return (
		<div className="md:grid grid-cols-2">
			<LoadingTrackerIcon />
			<LoadingTrackerIcon />
			<LoadingTrackerIcon />
			<LoadingTrackerIcon />
		</div>
	)
}

const LoadingTrackerIcon = () => {
	return (
		<div className="flex items-center justify-center w-full h-80">
			<IconSpin />
		</div>
	)
}

export default LoadingTracker
