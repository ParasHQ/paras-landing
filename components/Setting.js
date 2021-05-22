import { useState } from 'react'

const Setting = ({ close }) => {
	const [email, setEmail] = useState('')

	return (
		<>
			<div className="max-w-md w-full m-auto bg-dark-primary-2 rounded-md overflow-hidden p-4">
				<div className="m-auto">
					<div className="flex justify-between">
						<h1 className="text-3xl font-bold text-gray-100 tracking-tight mb-4">
							Setting
						</h1>
						<div onClick={close}>
							<svg
								className="cursor-pointer"
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M8.00008 9.41423L3.70718 13.7071L2.29297 12.2929L6.58586 8.00001L2.29297 3.70712L3.70718 2.29291L8.00008 6.5858L12.293 2.29291L13.7072 3.70712L9.41429 8.00001L13.7072 12.2929L12.293 13.7071L8.00008 9.41423Z"
									fill="white"
								/>
							</svg>
						</div>
					</div>
					<div>
						<label className="font-bold text-xl my-2 text-gray-100">
							Add Email
						</label>
						<input
							type="text"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={`resize-none h-auto focus:border-gray-100`}
							placeholder="Email"
						/>
					</div>
					<div className="text-gray-100 font-bold text-xl mt-4 my-2">
						Notification preferences
					</div>
					<div className="text-gray-100 flex justify-between items-center my-2">
						<div>
							<div className="text-lg">Newsletters</div>
							<div className="text-gray-100 opacity-75">
								Get first notified for any paras Info
							</div>
						</div>
						<Toggle />
					</div>
					<div className="text-gray-100 flex justify-between items-center my-2">
						<div>
							<div className="text-lg">NFT Drops</div>
							<div className="text-gray-100 opacity-75">
								Get first notified for upcoming drops!
							</div>
						</div>
						<Toggle />
					</div>
					<button
						// disabled={isSubmitting}
						className="outline-none h-12 w-full mt-4 rounded-md bg-transparent text-sm font-semibold border-none px-4 py-2 bg-primary text-gray-100"
						// onClick={_submit}
					>
						Save
					</button>
				</div>
			</div>
		</>
	)
}

export default Setting

const Toggle = () => {
	return (
		<div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
			<input
				type="checkbox"
				name="toggle"
				id="toggle"
				class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer focus:outline-none outline-none border-none"
			/>
			<label
				for="toggle"
				class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
			></label>
		</div>
	)
}
