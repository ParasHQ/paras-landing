import { trackClickHowToLoyalty, trackClickTCLoyalty } from 'lib/ga'

const LoyaltyMechanism = () => {
	return (
		<div id="mechanism" className="m-4 md:m-6 mt-16 md:mt-16 bg-white pb-8 rounded-xl">
			<div>
				<p className="font-bold text-center text-2xl text-white py-4 bg-[#674EA7] rounded-xl">
					Loyalty Program Mechanism
				</p>
			</div>

			<div className="mx-4 md:mx-16 my-6">
				<div className="my-6">
					<div className="flex relative">
						<img
							className="pointer-events-none absolute w-12 -left-8"
							src="https://paras-cdn.imgix.net/bafkreieuoyaupjag5dgjkz76l2e2v4qdcfn6cq33wvrtdbunpy2aas5yya"
						/>
						<p className="loyalty-mechanism-number">1</p>
						<p className="loyalty-mechanism-text">
							Loyalty level will be determined based on the amount of $PARAS locked & the locked
							staking duration.
						</p>
					</div>
					<div className="text-center my-4">
						<div>
							<img
								className="my-4 md:my-12 mx-auto pointer-events-none"
								src="https://paras-cdn.imgix.net/bafkreie3jmgft7weljeiyadc7czxsxosqhfi3rly5xzlbc5jvjarx3tedy"
							/>
						</div>
						<p>Users who stake $PARAS without locking it will be considered as Bronze level.</p>
						<p>
							Learn more on how to do locked staking{' '}
							<a
								href="https://paras.id/publication/how-to-do-locked-staking-6311c2d10de00d001cd7a05a"
								className="text-blue-700 underline"
								onClick={trackClickHowToLoyalty}
							>
								here
							</a>
							.
						</p>
						<div>
							<img
								className="my-4 md:my-12 mx-auto pointer-events-none"
								src="https://paras-cdn.imgix.net/bafkreid4lbtqrqgw5clj7owy5hpjtuih7benm3fs46xcv5epvkxa5tc4ai"
							/>
						</div>
					</div>
				</div>

				<div className="my-6">
					<div className="flex relative">
						<img
							className="pointer-events-none absolute w-12 -left-8"
							src="https://paras-cdn.imgix.net/bafkreieuoyaupjag5dgjkz76l2e2v4qdcfn6cq33wvrtdbunpy2aas5yya"
						/>
						<p className="loyalty-mechanism-number">2</p>
						<p className="loyalty-mechanism-text">
							Silver, Gold, and Platinum members will have a chance to sign up and enter an
							exclusive raffle on the 14th–27th of November.
						</p>
					</div>
					<div>
						<div className="text-center my-4">
							<p className="md:w-3/4 md:m-auto">
								Silver, Gold, Platinum members can log in to{' '}
								<span>
									<a href="https://paras.id" className="text-blue-700 underline">
										Paras Marketplace
									</a>
								</span>
								, and sign up to the exclusive raffle through a whitelisted pop up banner that will
								appear on the home screen.
							</p>
							<img
								className="m-auto my-4 pointer-events-none"
								src="https://paras-cdn.imgix.net/bafkreidr72bc26na4qgsr3pprbcxghefz7qri2arztexhvr6qot46zs7jy"
							/>
						</div>
						<div className="text-center my-4 ">
							<p className="md:w-3/4 md:m-auto">
								If you’re missing the pop-up banner, check your notification box and look for the
								raffle announcement. Click ‘Sign Up’ to join the exclusive raffle.
							</p>
							<img
								className="m-auto my-4 pointer-events-none"
								src="https://paras-cdn.imgix.net/bafkreifr6uiqs5m6nc5k25zmwtzuk5elbmfqjp2a4rwg3amzrj2ylpio3i"
							/>
						</div>
					</div>
				</div>

				<div className="my-6">
					<div className="flex">
						<p className="loyalty-mechanism-number">3</p>
						<p className="loyalty-mechanism-text">
							All Silver, Gold, and Platinum members who has signed up for the raffle will be put
							into separate raffle pools.
						</p>
					</div>
					<div className="md:flex text-center justify-center items-center mt-8">
						<img
							className="m-auto pointer-events-none"
							src="https://paras-cdn.imgix.net/bafkreihnolfcz3uxsw67bhfdq4hilg4axsqhzp5jirgz5iel5fyurnq5vi"
						/>
						<img
							className="m-auto pointer-events-none"
							src="https://paras-cdn.imgix.net/bafkreiecmt6ab5az2yqfwn4au6o2xikuxphv2n5akvfrdpskmd5qosz7mi"
						/>
						<img
							className="m-auto pointer-events-none"
							src="https://paras-cdn.imgix.net/bafkreib5somhf4ht7d4ygnon6tgls45ytxharnod7k3yldhxdvw2axnps4"
						/>
					</div>
					<p className="text-center">
						The more $PARAS you lock & the longer your locked staking period, the higher your
						probability to win the raffle
					</p>
				</div>
				<div>
					<div className="flex">
						<p className="loyalty-mechanism-number">4</p>
						<p className="loyalty-mechanism-text">Each raffle pool will have different rewards.</p>
					</div>
					<div>
						<img
							className="my-4 md:my-12 mx-auto pointer-events-none"
							src="https://paras-cdn.imgix.net/bafkreih5u4fdm2jytr5xqs2ujq73cpklrac7qbtps76qzi7lc3flq7pxni"
						/>
					</div>
				</div>

				<div className="my-6">
					<div className="flex">
						<p className="loyalty-mechanism-number">5</p>
						<p className="loyalty-mechanism-text">
							November raffle period will be held as follows:
						</p>
					</div>
					<div className="my-4 md:my-12 mx-auto">
						<img
							className="mx-auto mb-4 pointer-events-none"
							src="https://paras-cdn.imgix.net/bafkreihzpbir2qzrfb4l7dveltb5lvvacz63uybbjconm3xlizhif6qllu"
						/>
						<p className="text-center">
							Please check the{' '}
							<a
								href="https://guide.paras.id/terms-and-conditions/loyalty-program"
								className="text-blue-700 underline"
								onClick={trackClickTCLoyalty}
							>
								Terms & Conditions of Paras Loyalty.
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default LoyaltyMechanism
