import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import { IconNear, IconXCircle } from 'components/Icons'
import IconSender from 'components/Icons/component/IconSender'
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
						<IconNear className="rounded-full absolute h-6 w-6 top-0 bottom-0 left-3 m-auto" />
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
							<div className="absolute h-7 w-7 top-0 bottom-0 left-2 m-auto flex items-center justify-center">
								<IconSender size={24} />
							</div>
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
