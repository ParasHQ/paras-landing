import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import { IconXCircle } from 'components/Icons'
import { useIntl } from 'hooks/useIntl'
import near from 'lib/near'
import senderWallet from 'lib/senderWallet'
import useStore from 'lib/store'
import { isChromeBrowser } from 'utils/common'

const LoginModal = ({ show, onClose, title = 'Please Login First' }) => {
	const { localeLn } = useIntl()
	const { setActiveWallet } = useStore()

	const loginSenderWallet = async () => {
		if (typeof window.near !== 'undefined' && window.near.isSender) {
			await senderWallet.signIn()
			onClose()
			setActiveWallet('senderWallet')
		} else {
			window.open('https://senderwallet.io/')
		}
	}

	return (
		<Modal isShow={show} close={onClose}>
			<div className="max-w-sm m-4 md:m-auto w-full relative bg-gray-800 p-4 text-center rounded-md pb-6">
				<div className="flex mb-4 items-center justify-center">
					<svg
						width="80"
						height="80"
						viewBox="0 0 256 256"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect width="256" height="256" rx="10" fill="#0000BA" />
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M80.9048 210L59 46L151.548 62.4C155.482 63.4335 159.124 64.2644 162.478 65.0295C175.091 67.9065 183.624 69.8529 188.238 78.144C194.079 88.5671 197 101.396 197 116.629C197 131.936 194.079 144.801 188.238 155.224C182.397 165.647 170.167 170.859 151.548 170.859H111.462L119.129 210H80.9048ZM92.9524 79.8933L142.899 88.6534C145.022 89.2055 146.988 89.6493 148.798 90.0579C155.605 91.5947 160.21 92.6343 162.7 97.0631C165.852 102.631 167.429 109.483 167.429 117.62C167.429 125.796 165.852 132.668 162.7 138.235C159.547 143.803 152.947 146.587 142.899 146.587H120.083L106.334 145.493L92.9524 79.8933Z"
							fill="white"
						/>
					</svg>
				</div>
				<h3 className="mb-4 text-2xl text-white font-semibold">{title}</h3>
				<p className="mt-1 text-white opacity-80">{localeLn('CollectNFTTrulyOwn')}</p>
				<div className="mt-6">
					<p className="text-gray-400 text-sm mb-2 text-center">
						{localeLn('You need NEAR account to login')}
					</p>
					<Button className="mt-2 px-1 h-12" size="md" isFullWidth onClick={() => near.login()}>
						<svg
							width="50"
							height="50"
							className="rounded-full absolute h-6 w-6 top-0 bottom-0 left-3 m-auto"
							viewBox="0 0 50 50"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle cx="25" cy="25" r="25" fill="white"></circle>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M16.1053 17.7695V31.4934L22.9474 26.25L23.6316 26.8654L17.894 35.1541C15.7622 37.16 12 35.8028 12 33.0278V16.0832C12 13.2131 15.9825 11.9058 18.0379 14.1012L33.8947 31.038V17.8772L27.7368 22.5575L27.0526 21.9421L31.9327 14.2049C33.9696 11.9688 38 13.2643 38 16.1551V32.7243C38 35.5944 34.0175 36.9017 31.9621 34.7063L16.1053 17.7695Z"
								fill="black"
							></path>
						</svg>
						{localeLn('Login with NEAR')}
					</Button>
					{isChromeBrowser && (
						<Button
							className="mt-4 px-1 hidden md:block"
							size="md"
							variant="white"
							isFullWidth
							onClick={loginSenderWallet}
						>
							<img
								src="https://paras-cdn.imgix.net/bafkreihjoi6la3yv2aj7whhilevkbwteyrcrjjmxwn2axvhrgghhuleqn4"
								className="rounded-full absolute h-7 w-7 top-0 bottom-0 left-2 m-auto"
							/>
							{localeLn('Login with Sender Wallet')}
							<span
								className="bg-white text-primary font-bold rounded-full px-2 text-sm absolute right-2"
								style={{ boxShadow: `rgb(83 97 255) 0px 0px 5px 1px` }}
							>
								beta
							</span>
						</Button>
					)}
				</div>
				<div className="absolute -top-4 -right-4 cursor-pointer" onClick={onClose}>
					<IconXCircle size={32} />
				</div>
			</div>
		</Modal>
	)
}

export default LoginModal
