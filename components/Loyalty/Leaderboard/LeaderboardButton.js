import clsx from 'clsx'

const LeaderboardButton = ({ activeTab, setActiveTab }) => {
	return (
		<>
			<div className="flex items-center justify-center gap-3 w-full -mt-12 md:hidden">
				<button
					className={clsx('active:scale-95', activeTab !== 'platinum' && 'opacity-50')}
					onClick={() => setActiveTab('platinum')}
				>
					<img
						className="pointer-events-none w-48"
						src="https://paras-cdn.imgix.net/bafkreieycwsamkguego6hkmojdd54lgv52b3k7lfrmb233tbepksm422su"
					/>
				</button>
				<button
					className={clsx('active:scale-95', activeTab !== 'gold' && 'opacity-50')}
					onClick={() => setActiveTab('gold')}
				>
					<img
						className="pointer-events-none w-48"
						src="https://paras-cdn.imgix.net/bafkreicjj7lwenr7fupvapnntg6spuclbqpmlrepcj7xmzszcxwk6i6c6e"
					/>
				</button>
				<button
					className={clsx('active:scale-95', activeTab !== 'silver' && 'opacity-50')}
					onClick={() => setActiveTab('silver')}
				>
					<img
						className="pointer-events-none w-48"
						src="https://paras-cdn.imgix.net/bafkreiet3ausdki3rjhyjpjlaf3vrqfmp3i5wvna56h24tu3o4uzwclsgq"
					/>
				</button>
			</div>

			{/* CHOOSE LB BUTTON DESKTOP*/}
			<div className="md:flex items-center justify-center gap-3 w-full -mt-12 hidden">
				<button
					className={clsx('active:scale-95', activeTab !== 'platinum' && 'opacity-50')}
					onClick={() => setActiveTab('platinum')}
				>
					<img
						className="pointer-events-none w-48"
						src="https://paras-cdn.imgix.net/bafkreihqrqmdoh3vj74733tvumf5ukhoxt4miqydwpkmlliulfxmw7ukwq"
					/>
				</button>
				<button
					className={clsx('active:scale-95', activeTab !== 'gold' && 'opacity-50')}
					onClick={() => setActiveTab('gold')}
				>
					<img
						className="pointer-events-none w-48"
						src="https://paras-cdn.imgix.net/bafkreidtfmk32fg355oe44h22ecwgkximo7totpvqzg5u2nrilgv4dawda"
					/>
				</button>
				<button
					className={clsx('active:scale-95', activeTab !== 'silver' && 'opacity-50')}
					onClick={() => setActiveTab('silver')}
				>
					<img
						className="pointer-events-none w-48"
						src="https://paras-cdn.imgix.net/bafkreieh3bemyhlz3si6wo43uxl6f5mowzfmsvr4vkxyln3d4zio6qg22e"
					/>
				</button>
			</div>
		</>
	)
}

export default LeaderboardButton
