import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import { IconXCircle } from 'components/Icons'
import { useRouter } from 'next/router'
import { useIntl } from 'hooks/useIntl'
const LoginModal = ({ show, onClose, title = 'Please Login First' }) => {
	const router = useRouter()
	const { localeLn } = useIntl()
	return (
		<Modal isShow={show} close={onClose}>
			<div className="max-w-sm m-4 md:m-auto w-full relative bg-gray-800 p-4 text-center rounded-md">
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
					<p className="text-gray-400 text-sm mb-2 text-center">{localeLn('WillBeRedirectedTo')}</p>
					<Button className="mt-2 px-1" size="md" isFullWidth onClick={() => router.push('/login')}>
						{localeLn('GoToLogin')}
					</Button>
				</div>
				<div className="absolute -top-4 -right-4 cursor-pointer" onClick={onClose}>
					<IconXCircle size={32} />
				</div>
			</div>
		</Modal>
	)
}

export default LoginModal
