import Button from 'components/Common/Button'
import { InputText } from 'components/Common/form'
import Modal from 'components/Common/Modal'

const TokenDetailUpdateModal = ({ show, onClose }) => {
  return (
    <Modal
      isShow={show}
      closeOnBgClick={false}
      closeOnEscape={false}
      close={onClose}
    >
      <div className="max-w-sm w-full p-4 bg-blueGray-800 m-auto rounded-md">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Card Listing
          </h1>
          <form>
            {/* <form onSubmit={handleSubmit(_updatePrice)}> */}
            <div className="mt-4">
              <label className="block text-sm text-white mb-2">
                Sale quantity (Owned:{' '}
                {/* {_getUserOwnership(store.currentUser)
                  ? _getUserOwnership(store.currentUser).quantity
                  : 0}
                ) */}
              </label>
              <InputText
                type="number"
                name="quantity"
                // ref={register({
                //   required: true,
                //   validate: (value) => Number.isInteger(Number(value)),
                //   min: 0,
                //   max: _getUserOwnership(store.currentUser)
                //     ? _getUserOwnership(store.currentUser).quantity
                //     : 0,
                // })}
                // className={`${errors.quantity && 'error'}`}
                placeholder="Number of card on sale"
              />
              <div className="mt-2 text-sm text-red-500">
                {/* {errors.quantity?.type === 'required' &&
                  `Sale quantity is required`}
                {errors.quantity?.type === 'min' && `Minimum 0`}
                {errors.quantity?.type === 'max' && `Must be less than owned`}
                {errors.quantity?.type === 'validate' &&
                  'Only use rounded number'} */}
              </div>
              <div className="mt-2">
                <p className="text-gray-200 text-sm">
                  Set sale quantity to <b>0</b> if you only want to remove this
                  card from listing
                </p>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-white mb-2">
                Sale price
              </label>
              <div
                className={`flex justify-between rounded-md border-transparent w-full relative ${
                  null // errors.amount && 'error'
                }`}
              >
                <InputText
                  type="number"
                  name="amount"
                  step="any"
                  // ref={register({
                  //   required: true,
                  //   min: 0,
                  // })}
                  className="clear pr-2"
                  placeholder="Card price per pcs"
                />
                <div className="absolute inset-y-0 right-3 flex items-center text-white">
                  Ⓝ
                </div>
              </div>
              <p className="text-sm mt-2 text-gray-200">
                Receive: 40
                {/* {prettyBalance(
                  Number(
                    watch('amount', 0) *
                      (0.95 - (localToken.metadata.royalty || 0) / 100)
                  )
                    .toPrecision(4)
                    .toString(),
                  0,
                  4
                )}{' '} */}
                Ⓝ (~$ 20
                {/* {prettyBalance(
                  Number(
                    store.nearUsdPrice *
                      watch('amount', 0) *
                      (0.95 - (localToken.metadata.royalty || 0) / 100)
                  )
                    .toPrecision(4)
                    .toString(),
                  0,
                  4
                )} */}
                )
              </p>
              <p className="text-sm text-gray-200">
                Royalty:{' '}
                {/* {prettyBalance(
                  Number(
                    watch('amount', 0) *
                      ((localToken.metadata.royalty || 0) / 100)
                  )
                    .toPrecision(4)
                    .toString(),
                  0,
                  4
                )}{' '}
                Ⓝ (~$
                {prettyBalance(
                  Number(
                    store.nearUsdPrice *
                      watch('amount', 0) *
                      ((localToken.metadata.royalty || 0) / 100)
                  )
                    .toPrecision(4)
                    .toString(),
                  0,
                  4
                )}
                ) */}
              </p>
              <p className="text-sm text-gray-200">
                Fee:{' '}
                {/* {prettyBalance(
                  Number(watch('amount', 0) * 0.05)
                    .toPrecision(4)
                    .toString(),
                  0,
                  4
                )}{' '}
                Ⓝ (~$
                {prettyBalance(
                  Number(store.nearUsdPrice * watch('amount', 0) * 0.05)
                    .toPrecision(4)
                    .toString(),
                  0,
                  4
                )} */}
                )
              </p>
              <div className="mt-2 text-sm text-red-500">
                {/* {errors.amount?.type === 'required' && `Sale price is required`}
                {errors.amount?.type === 'min' && `Minimum 0`} */}
              </div>
            </div>
            <div className="mt-6">
              <Button size="md" isFullWidth>
                Buy
              </Button>
              <Button
                variant="ghost"
                size="md"
                isFullWidth
                className="mt-4"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}

export default TokenDetailUpdateModal
