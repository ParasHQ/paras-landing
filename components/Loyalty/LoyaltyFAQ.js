const LoyaltyFAQ = () => {
	return (
		<div className="bg-white p-8 pl-12 md:pl-16">
			<p className="text-3xl font-bold mb-2">FAQs</p>
			<ul className="list-decimal list-outside text-justify">
				<div className="my-4">
					<li className="font-bold md:text-lg">
						&quot;The more $PARAS you lock, the higher your probability of winning the raffle.&quot;
						How does this work? If I stake 6,000 $PARAS will I have a better chance than someone who
						stakes 3,000 $PARAS? Or is everyone with a Platinum seat equal, regardless of how much
						they stake past 3,000 Paras?
					</li>
					<p className="text-sm md:text-base my-3">
						The proportion of winning depends on how many $PARAS you stake. So, yes, the more you
						stake, the bigger your chance to win.
					</p>
					<p className="text-sm md:text-base my-3">
						We want to minimize the possibility of fraud, such as users creating multiple accounts
						to win the raffle. By doing this, we hope you can put your mind at ease and focus on
						managing 1 wallet for the Paras Loyalty.
					</p>
				</div>

				<div className="my-4">
					<li className="font-bold md:text-lg">
						Is there any benefit of locking for 90 days instead of 30 days?
					</li>
					<p className="text-sm md:text-base my-3">
						Yes. You will get additional raffle points of 25% of your total staking amount.
					</p>
				</div>
				<div className="my-4">
					<li className="font-bold md:text-lg">What does it mean to have a Bronze member badge?</li>
					<p className="text-sm md:text-base my-3">
						Bronze level is for users who lock less than 500 $PARAS.
					</p>
				</div>
				<div className="my-4">
					<li className="font-bold md:text-lg">
						I am a platinum member. How do I sign up for the raffles?
					</li>
					<p className="text-sm md:text-base my-3">
						You can check the raffle registration mechanism & period{' '}
						<a
							className="text-blue-700 underline cursor-pointer"
							onClick={() => {
								const section = document.querySelector('#mechanism')
								section.scrollIntoView({ behavior: 'smooth', block: 'start' })
							}}
						>
							above
						</a>
						.
					</p>
					<p className="text-sm md:text-base my-3">
						For November’s raffle, you can register from the 15th until 27th November, 2022.
					</p>
					<p className="text-sm md:text-base my-3">
						Silver, Gold, and Platinum members will receive a pop-up message or notification to sign
						up for the raffle during the registration period
					</p>
				</div>
				<div className="my-4">
					<li className="font-bold md:text-lg">
						Do I have to do the flexible staking before locking my $PARAS?
					</li>
					<p className="text-sm md:text-base my-3">
						No, you can directly put the existing $PARAS in your wallet into locked staking without
						joining the flexible staking.
					</p>
				</div>
				<div className="my-4">
					<li className="font-bold md:text-lg">How do I claim the locked staking rewards?</li>
					<p className="text-sm md:text-base my-3">
						The amount of &apos;Claimable Rewards&apos; on the staking page is an accumulation of
						your flexible staking and locked staking rewards. You can claim the rewards without
						unstaking your $PARAS.
					</p>
				</div>
				<div className="my-4 text-sm">
					<p className="my-3">
						If you have more questions, please reach out to our social media channels:
					</p>
					<ul className="list-disc">
						<li>
							Discord:{' '}
							<a
								href="https://discord.com/invite/vWR2XBNupg"
								target="_blank"
								rel="noopener noreferrer"
							>
								https://discord.com/invite/vWR2XBNupg
							</a>
						</li>
						<li>
							Telegram:{' '}
							<a href="https://t.me/parashq" target="_blank" rel="noopener noreferrer">
								https://t.me/parashq
							</a>
						</li>
						<li>
							Twitter:{' '}
							<a href="https://twitter.com/ParasHQ" target="_blank" rel="noopener noreferrer">
								https://twitter.com/ParasHQ
							</a>
						</li>
						<li>
							Instagram:{' '}
							<a
								href="https://www.instagram.com/paras.hq/"
								target="_blank"
								rel="noopener noreferrer"
							>
								https://www.instagram.com/paras.hq/
							</a>
						</li>
					</ul>
				</div>
			</ul>
		</div>
	)
}

export default LoyaltyFAQ
