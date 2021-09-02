import useStore from 'lib/store'
import Link from 'next/link'

const Footer = () => {
  const setToastConfig = useStore((state) => state.setToastConfig)

  const _showBetaInfo = () => {
    setToastConfig({
      text: (
        <div className="text-sm text-gray-900">
          <p>
            Paras' smart contract is not yet audited by well-known security
            organization or firm. Use at your own risk!
          </p>
        </div>
      ),
      type: 'info',
      duration: null,
    })
  }

  return (
    <div className="max-w-6xl w-full m-auto px-4 flex flex-wrap items-end justify-center md:justify-between mt-20 text-sm text-gray-200 z-10 relative pb-4">
      <div className="py-2">
        <div className="flex flex-wrap justify-center md:justify-start -mx-2">
          <div className="flex items-center pt-2 px-2">
            <Link href="/comics">
              <a className="flex cursor-pointer ">Comics</a>
            </Link>
          </div>
          <div className="flex items-center pt-2 px-2">
            <Link href="/market">
              <a className="flex cursor-pointer ">Market</a>
            </Link>
          </div>
          <div className="flex items-center pt-2 px-2">
            <Link href="/faq">
              <a className="flex cursor-pointer ">FAQ</a>
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap justify-center -mx-2">
          <div className="flex items-center pt-2 px-2">
            <a
              href="https://twitter.com/ParasHQ"
              target="_blank"
              className="flex cursor-pointer "
              rel="noreferrer"
            >
              Twitter
            </a>
          </div>
          <div className="flex items-center pt-2 px-2">
            <a
              href="https://instagram.com/paras.hq"
              target="_blank"
              className="flex cursor-pointer "
              rel="noreferrer"
            >
              Instagram
            </a>
          </div>
          <div className="flex items-center pt-2 px-2">
            <a
              href="https://t.me/parashq"
              target="_blank"
              className="flex cursor-pointer "
              rel="noreferrer"
            >
              Telegram
            </a>
          </div>
          <div className="flex items-center pt-2 px-2">
            <a
              href="https://discord.gg/vWR2XBNupg"
              target="_blank"
              className="flex cursor-pointer "
              rel="noreferrer"
            >
              Discord
            </a>
          </div>
        </div>
      </div>
      <div className="py-2">
        <div className="flex items-center justify-center md:justify-start">
          <div className="flex">
            <p>This project is in public beta.</p>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="inline	ml-2 cursor-pointer opacity-75"
              onClick={_showBetaInfo}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8ZM14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8ZM7 10V9.5C7 8.28237 7.42356 7.68233 8.4 6.95C8.92356 6.55733 9 6.44904 9 6C9 5.44772 8.55229 5 8 5C7.44772 5 7 5.44772 7 6H5C5 4.34315 6.34315 3 8 3C9.65685 3 11 4.34315 11 6C11 7.21763 10.5764 7.81767 9.6 8.55C9.07644 8.94267 9 9.05096 9 9.5V10H7ZM9.00066 11.9983C9.00066 12.5506 8.55279 12.9983 8.00033 12.9983C7.44786 12.9983 7 12.5506 7 11.9983C7 11.4461 7.44786 10.9983 8.00033 10.9983C8.55279 10.9983 9.00066 11.4461 9.00066 11.9983Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
        <div className="mt-2 flex items-center">
          <p>2021 Paras</p>
          <p className="mx-2">|</p>
          <div className="flex items-center text-sm">
            <p>Powered by</p>
            <a href="https://near.org" target="_blank" rel="noreferrer">
              <svg
                className="mx-2"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0)">
                  <path
                    className="fill-current"
                    d="M19.1736 1.21319L14.2154 8.57143C13.8725 9.07253 14.5318 9.67912 15.0066 9.25714L19.8857 5.01099C20.0175 4.90549 20.2022 4.98462 20.2022 5.16923V18.4352C20.2022 18.6198 19.9648 18.6989 19.8593 18.567L5.09008 0.896703C4.61535 0.316484 3.92964 0 3.1648 0H2.63733C1.2659 0 0.131836 1.13407 0.131836 2.53187V21.2044C0.131836 22.6022 1.2659 23.7363 2.6637 23.7363C3.53403 23.7363 4.35162 23.2879 4.82634 22.5231L9.78458 15.1648C10.1274 14.6637 9.4681 14.0571 8.99337 14.4791L4.11425 18.6989C3.98239 18.8044 3.79777 18.7253 3.79777 18.5407V5.3011C3.79777 5.11648 4.03513 5.03736 4.14063 5.16923L18.9099 22.8396C19.3846 23.4198 20.0967 23.7363 20.8351 23.7363H21.3626C22.7604 23.7363 23.8945 22.6022 23.8945 21.2044V2.53187C23.8945 1.13407 22.7604 0 21.3626 0C20.4659 0 19.6483 0.448352 19.1736 1.21319V1.21319Z"
                  />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="24" height="23.7363" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </a>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13 11H22V13H13V22H11V13H2V11H11V2H13V11Z"
                fill="#cbd5e0"
              />
            </svg>
            <a href="https://ipfs.io" target="_blank" rel="noreferrer">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                className="mx-2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.60779 18L12 24L22.3922 18V6.00002L12 0.000488281L1.60779 6.00049V18Z"
                  fill="transparent"
                />
                <path
                  d="M10.9272 1.4458L3.39254 5.79608C3.4076 5.92988 3.4076 6.06492 3.39254 6.19871L10.9277 10.549C11.563 10.0802 12.4297 10.0802 13.0651 10.549L20.6002 6.19866C20.5852 6.06487 20.5851 5.92989 20.6002 5.7961L13.0655 1.44582C12.4301 1.91462 11.5634 1.91462 10.928 1.44582L10.9272 1.4458ZM21.3236 7.40033L13.7805 11.7991C13.8688 12.5837 13.4355 13.3343 12.7118 13.6501L12.7203 22.3023C12.8437 22.3562 12.9606 22.4237 13.0689 22.5036L20.6041 18.1534C20.5158 17.3687 20.9491 16.6181 21.6728 16.3023V7.6018C21.5494 7.54795 21.4324 7.48046 21.3241 7.40052L21.3236 7.40033ZM2.67629 7.44868C2.56796 7.52862 2.45104 7.59618 2.32764 7.65003V16.3505C3.05129 16.6663 3.48465 17.4169 3.39634 18.2015L10.931 22.5518C11.0394 22.4719 11.1564 22.4043 11.2797 22.3505V13.65C10.5561 13.3342 10.1227 12.5836 10.211 11.799L2.67636 7.4485L2.67629 7.44868Z"
                  className="fill-current"
                />
                <path
                  d="M12 24L22.3922 18V6L12 12V24Z"
                  fill="black"
                  fillOpacity="0.25098"
                />
                <path
                  d="M12.0001 24V12L1.60791 6V18L12.0001 24Z"
                  fill="black"
                  fillOpacity="0.039216"
                />
                <path
                  d="M1.60779 6L12 12L22.3922 6L12 0L1.60779 6Z"
                  fill="black"
                  fillOpacity="0.13018"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
