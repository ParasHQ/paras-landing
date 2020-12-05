import Link from 'next/link'

const Footer = () => {
	return (
		<div className="max-w-6xl m-auto px-4 flex flex-wrap justify-center md:justify-between mt-20 text-sm text-gray-400">
			<div className="py-2">
				<div className="flex flex-wrap justify-center md:justify-start -mx-2">
					<div className="flex items-center pt-2 px-2">
						<Link href="/market">
							<a className="flex cursor-pointer ">Market</a>
						</Link>
					</div>
					<div className="flex items-center pt-2 px-2">
						<Link href="/activity">
							<a className="flex cursor-pointer ">Activity</a>
						</Link>
					</div>
					<div className="flex items-center pt-2 px-2">
						<Link href="/license">
							<a className="flex cursor-pointer ">License</a>
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
							href="https://medium.com/paras-media"
							target="_blank"
							className="flex cursor-pointer "
						>
							Blog
						</a>
					</div>
					<div className="flex items-center pt-2 px-2">
						<a
							href="https://twitter.com/ParasHQ"
							target="_blank"
							className="flex cursor-pointer "
						>
							Twitter
						</a>
					</div>
					<div className="flex items-center pt-2 px-2">
						<a
							href="https://discord.gg/vWR2XBNupg"
							target="_blank"
							className="flex cursor-pointer "
						>
							Discord
						</a>
					</div>
					<div className="flex items-center pt-2 px-2">
						<a
							href="https://forms.gle/QsZHqa2MKXpjckj98"
							target="_blank"
							className="flex cursor-pointer "
						>
							Apply as an Artist
						</a>
					</div>
				</div>
			</div>
			<div className="mt-2 flex items-center">
				<p>2020 Paras</p>
				<p className="mx-2">|</p>
				<div className="flex items-center text-sm">
					<p>Powered by</p>
					<a href="https://near.org" target="_blank">
						<svg
							className="mx-2"
							width="24"
							height="24"
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
					<p className="text-4xl">+</p>
					<a href="https://ipfs.io" target="_blank">
						<svg
							width="30"
							height="30"
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
	)
}

export default Footer
