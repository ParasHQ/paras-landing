import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import HamburgerMenu from 'react-hamburger-menu'
import { useRouter } from 'next/router'
import near from 'lib/near'

import Button from './Button'
import Avatar from './Avatar'

import { IconLogout } from 'components/Icons'
import { parseImgUrl, prettyBalance } from 'utils/common'
import useStore from 'lib/store'
import LoginModal from 'components/Modal/LoginModal'

const Nav = () => {
  const profileModalRef = useRef()
  const mobileMenuRef = useRef()
  const router = useRouter()
  const currentUser = useStore((state) => state.currentUser)

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const onClickEv = (e) => {
      if (profileModalRef && !profileModalRef?.current?.contains(e.target)) {
        setShowProfileModal(false)
      }
    }

    if (showProfileModal) {
      document.body.addEventListener('click', onClickEv)
    }

    return () => {
      document.body.removeEventListener('click', onClickEv)
    }
  }, [showProfileModal])

  useEffect(() => {
    const onClickEv = (e) => {
      if (mobileMenuRef && !mobileMenuRef?.current?.contains(e.target)) {
        setShowHamburgerMenu(false)
      }
    }

    if (showHamburgerMenu) {
      document.body.addEventListener('click', onClickEv)
    }

    return () => {
      document.body.removeEventListener('click', onClickEv)
    }
  }, [showHamburgerMenu])

  const onClickProfile = () => {
    setShowProfileModal(!showProfileModal)
  }

  const onClickHamburger = () => {
    setShowHamburgerMenu(!showHamburgerMenu)
  }

  const onClickViewProfile = () => {
    router.push(`/${near.getAccount().accountId}`)
  }

  const ProfileModal = () => {
    return (
      <div className="absolute right-0 mt-3 z-30">
        <div className="min-w-max w-64 bg-blueGray-800 p-3 rounded-md shadow-xl">
          <div className="flex items-center">
            <Avatar
              size="lg"
              className="mr-3"
              entityName={near.getAccount().accountId}
              src={parseImgUrl(currentUser.imgUrl || '')}
            />
            <div>
              <p className="font-medium text-white">
                {near.getAccount().accountId}
              </p>
              <p className="font-light text-sm text-white opacity-75">
                {prettyBalance(near.getAccount().balance.available, 24, 4)} Ⓝ
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            isFullWidth
            className="mt-3"
            onClick={onClickViewProfile}
          >
            View Profile
          </Button>
          <hr className="opacity-10 -mx-2 my-3" />
          <div
            className="flex flex-shrink-0 items-center space-x-2 cursor-pointer"
            onClick={() => near.signOut()}
          >
            <IconLogout size={18} className="text-white opacity-80" />
            <p className="text-white opacity-80">Logout</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <LoginModal
        title={`Login to Paras Comic`}
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <div ref={mobileMenuRef} className="bg-background sticky z-30 top-0">
        <div className="relative bg-background max-w-6xl m-auto flex p-4 items-center justify-between z-40">
          <div className="flex items-center md:hidden">
            <HamburgerMenu
              isOpen={showHamburgerMenu}
              menuClicked={onClickHamburger}
              width={21}
              height={15}
              strokeWidth={2}
              rotate={0}
              color="white"
              borderRadius={0}
              animationDuration={0.3}
            />
            <div className="pl-4">
              <Link href="/">
                <a className="block w-24">
                  <img className="hover:opacity-80" src="/logo.svg" />
                </a>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex space-x-12 text-xl font-normal text-white items-center">
            <div className="w-32">
              <Link href="/">
                <a>
                  <img className="hover:opacity-80" src="/logo.svg" />
                </a>
              </Link>
            </div>
            <Link href="/">
              <a className="block font-semibold hover:text-primary">
                <span className={router.pathname === '/' ? `text-primary` : ''}>
                  Home
                </span>
              </a>
            </Link>
            <Link href="/comics">
              <a className="block font-semibold hover:text-primary">
                <span
                  className={
                    router.pathname.split('/')[1] === 'comics'
                      ? `text-primary`
                      : ''
                  }
                >
                  Comics
                </span>
              </a>
            </Link>
            <Link href="/market">
              <a className="block font-semibold hover:text-primary">
                <span
                  className={
                    router.pathname.includes('/market') ? `text-primary` : ''
                  }
                >
                  Market
                </span>
              </a>
            </Link>
            <Link href="/partner-with-us">
              <a className="block font-semibold hover:text-primary">
                <span
                  className={
                    router.pathname === '/partner-with-us' ? `text-primary` : ''
                  }
                >
                  Partner
                </span>
              </a>
            </Link>
          </div>
          {near.isLoggedIn() ? (
            <div ref={profileModalRef} className="relative h-auto">
              <div
                className=" cursor-pointer flex items-center hover:opacity-80"
                onClick={onClickProfile}
              >
                <Avatar
                  className="w-10 h-10 align-middle"
                  size="md"
                  entityName={currentUser.accountId}
                  src={parseImgUrl(currentUser.imgUrl || '')}
                />
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.29303 7.29299C5.48056 7.10552 5.73487 7.0002 6.00003 7.0002C6.26519 7.0002 6.5195 7.10552 6.70703 7.29299L10 10.586L13.293 7.29299C13.3853 7.19748 13.4956 7.1213 13.6176 7.06889C13.7396 7.01648 13.8709 6.98889 14.0036 6.98774C14.1364 6.98659 14.2681 7.01189 14.391 7.06217C14.5139 7.11245 14.6255 7.1867 14.7194 7.28059C14.8133 7.37449 14.8876 7.48614 14.9379 7.60904C14.9881 7.73193 15.0134 7.86361 15.0123 7.99639C15.0111 8.12917 14.9835 8.26039 14.9311 8.38239C14.8787 8.5044 14.8025 8.61474 14.707 8.70699L10.707 12.707C10.5195 12.8945 10.2652 12.9998 10 12.9998C9.73487 12.9998 9.48056 12.8945 9.29303 12.707L5.29303 8.70699C5.10556 8.51946 5.00024 8.26515 5.00024 7.99999C5.00024 7.73483 5.10556 7.48052 5.29303 7.29299Z"
                    fill="white"
                  />
                </svg>
              </div>

              {showProfileModal && ProfileModal()}
            </div>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </Button>
          )}
        </div>
        <div className="relative">
          <div
            className={`absolute bg-background left-0 z-30 right-0 transform transition-transform duration-500 ${
              showHamburgerMenu ? 'translate-y-0' : '-translate-y-96'
            }`}
          >
            <div className="text-center text-white pb-3">
              <div className="p-3">
                <Link href="/">
                  <a className="font-semibold hover:text-primary">
                    <span
                      className={router.pathname === '/' ? `text-primary` : ''}
                    >
                      Home
                    </span>
                  </a>
                </Link>
              </div>
              <div className="p-3">
                <Link href="/comics">
                  <a className="font-semibold hover:text-primary">
                    <span
                      className={
                        router.pathname.includes('/comics')
                          ? `text-primary`
                          : ''
                      }
                    >
                      Comics
                    </span>
                  </a>
                </Link>
              </div>
              <div className="p-3">
                <Link href="/market">
                  <a className="font-semibold hover:text-primary">
                    <span
                      className={
                        router.pathname.includes('/market')
                          ? `text-primary`
                          : ''
                      }
                    >
                      Market
                    </span>
                  </a>
                </Link>
              </div>
              <div className="p-3">
                <Link href="/partner-with-us">
                  <a className="font-semibold hover:text-primary">
                    <span
                      className={
                        router.pathname === '/partner-with-us'
                          ? `text-primary`
                          : ''
                      }
                    >
                      Partner
                    </span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Nav
