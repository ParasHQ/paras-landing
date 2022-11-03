const LoyaltyTC = () => {
	return (
		<div className="bg-white p-8 pl-12 md:pl-16">
			<p className="text-3xl font-bold mb-2">Terms & Conditions</p>
			<ul className="list-decimal text-sm md:text-base text-justify">
				<div className="my-2">
					<li>
						Loyalty level will be determined based on the amount of $PARAS locked staking & the
						locked staking duration.
					</li>
					<div>
						<img
							className="my-4 mx-auto pointer-events-none"
							src="https://paras-cdn.imgix.net/bafkreie3jmgft7weljeiyadc7czxsxosqhfi3rly5xzlbc5jvjarx3tedy"
						/>
					</div>
					<p className="my-1">
						Users who lock $PARAS for 90 days will get additional raffle points of 25% of the user’s
						total staking amount.
					</p>
					<div>
						<img
							className="my-4 mx-auto pointer-events-none"
							src="https://paras-cdn.imgix.net/bafkreieekr3cswi6ojuuaej2fadeykbqno3iwlh42lydlu4tuhg4dhv2ry"
						/>
					</div>
				</div>
				<div className="my-2">
					<li>Users who stake $PARAS without locking it will be considered Bronze level.</li>
				</div>
				<div className="my-2">
					<li>
						During the determined raffle registration period, Silver, Gold, and Platinum members
						will have a chance to sign up and enter an exclusive raffle.
					</li>
				</div>
				<div className="my-2">
					<li>
						Silver, Gold, and Platinum members can log in to Paras Marketplace, and sign up for the
						exclusive raffle through a pop-up banner on Paras homepage or a raffle registration
						notification.
					</li>
				</div>
				<div className="my-2">
					<li>
						Silver, Gold, and Platinum members have to click ‘Sign Up’ on the pop-up banner or the
						notification box to join the exclusive raffle.
					</li>
				</div>
				<div className="my-2">
					<li>
						Silver, Gold, and Platinum members who are eligible to join the raffle but do not click
						the ‘Sign Up’ button on the pop-up banner or the notification box will not be included
						in the raffle.
					</li>
				</div>
				<div className="my-2">
					<li>
						Users whose loyalty membership level drop after signing up for a raffle will be
						automatically enrolled in the raffle for their current level. However, if the users
						membership level drops to Bronze, they will not be included in any raffle.
					</li>
				</div>
				<div className="my-2">
					<li>
						Silver and Gold members who top up their locked staking and level up during the raffle
						registration period are eligible to re-register for the higher level raffle. If they do
						not sign up for the new level, they will be automatically enrolled in the previous level
						(Silver or Gold).
					</li>
				</div>
				<div className="my-2">
					<li>1 (one) user can only win 1 (one) raffle prize per month.</li>
				</div>
				<div className="my-2">
					<li>More details about locked staking:</li>
					<ul className="list-disc ml-4">
						<li>
							Locked staking does not allow users to unlock before the end date of the locked
							staking period.
						</li>
						<li>When users top up the locked staking amount, the period will be reset.</li>
						<li>
							When users do not unstake their $PARAS after the locked staking period ends, the
							$PARAS will automatically move into flexible staking within 1x24 hours after the
							locked staking period ends.
						</li>
						<li>
							Users can do locked staking without reducing their $PARAS on the flexible staking by
							using the remaining $PARAS in their wallet.
						</li>
						<li>
							Users can directly put the existing $PARAS in their wallet into locked staking without
							joining the flexible staking.
						</li>
						<li>
							The amount of &apos;Claimable Rewards&apos; on the staking page is an accumulation of
							flexible staking and locked staking rewards. Users can claim the rewards without
							unlocking $PARAS.
						</li>
					</ul>
				</div>
				<div className="my-2">
					<li>
						By participating in this program, you agree to the Terms & Conditions of Paras Loyalty.
					</li>
				</div>
				<div className="my-2">
					<li>
						The terms and conditions of this program are subject to changes at any time without
						prior notice.
					</li>
				</div>
				<div className="my-2">
					<li>
						Paras’ decision regarding the raffle and the winner list is considered final and cannot
						be appealed nor contested.
					</li>
				</div>
			</ul>
		</div>
	)
}

export default LoyaltyTC
