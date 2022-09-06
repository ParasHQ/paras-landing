import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'

const SignMesssageModal = ({ show, onClick }) => {
	return (
		<Modal isShow={show}>
			<div className="bg-gray-800 text-white m-auto p-4 rounded-md max-w-sm text-sm">
				<p className="mb-2">
					{`You need to verify your account by signing in. Click "Sign" below and click "Send" in the
					pop-up. Please allow pop-ups for this website if you don't see one.`}
				</p>
				<p className="mb-4">
					Learn what {/* eslint-disable-next-line react/jsx-no-target-blank */}
					<a
						href="https://guide.paras.id/faq/marketplace#i-log-in-with-email-what-is-sign-mean-and-what-it-does"
						target={'_blank'}
						className="cursor-pointer font-semibold hover:underline"
					>
						Sign
					</a>{' '}
					means
				</p>
				<Button size="sm" className="px-12" onClick={onClick}>
					Sign
				</Button>
			</div>
		</Modal>
	)
}

export default SignMesssageModal
