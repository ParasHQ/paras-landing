import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import { IconXCircle } from 'components/Icons'
import near from 'lib/near'

const LoginModal = ({ show, onClose, title = 'Login to buy this chapter' }) => {
  return (
    <Modal isShow={show} close={onClose}>
      <div className="max-w-sm m-4 md:m-auto w-full relative bg-blueGray-800 px-4 py-8 text-center rounded-md">
        <div className="flex-1 h-48 md:h-64 mb-4">
          <img className="h-full mx-auto" src="/login.png" />
        </div>
        <h3 className="mb-4 text-2xl text-white font-semibold">{title}</h3>
        <p className="mt-1 text-white opacity-80">
          Read and truly own your digital comics. Interact, engage, and support
          the creators through collectibles NFTs.
        </p>
        <div className="mt-6">
          <p className="text-blueGray-400 text-xs mb-2 text-center">
            You will be redirected to NEAR Wallet
          </p>
          <Button
            className="mt-2 px-1"
            size="md"
            isFullWidth
            onClick={() => near.signIn()}
          >
            Login with NEAR
          </Button>
        </div>
        <div
          className="absolute -top-4 -right-4 cursor-pointer"
          onClick={onClose}
        >
          <IconXCircle size={32} />
        </div>
      </div>
    </Modal>
  )
}

export default LoginModal
