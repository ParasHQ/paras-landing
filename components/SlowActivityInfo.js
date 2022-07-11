import React from 'react'
import useStore from 'lib/store'
import { useRouter } from 'next/router'

const SlowActivityInfo = ({ refresh = false }) => {
	const store = useStore()
	const router = useRouter()
	return (
		<div>
			<div
				className={`text-white text-center overflow-hidden text-sm md:leading-8 m-auto bg-primary bg-opacity-50 z-50 items-center justify-center transition-height duration-500 px-3 md:px-0 sticky`}
			>
				<div className="relative w-full h-full">
					<div className="px-4 md:px-0 py-2 w-11/12 md:w-8/12 mx-auto">
						Our server is still catching up with the latest activity. The recent transaction may be
						delayed.{` `}
						{refresh && (
							<span>
								Please{' '}
								<span
									onClick={() => {
										router.reload()
									}}
									className="font-bold cursor-pointer hover:underline"
								>
									refresh
								</span>{' '}
								the page to see updated transactions.
							</span>
						)}
					</div>
					<div
						className="absolute top-0 right-0 mx-2 md:mx-5 h-full flex items-center justify-center cursor-pointer"
						onClick={() => {
							store.setActivitySlowUpdate(false)
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="icon icon-tabler icon-tabler-circle-x"
							width={25}
							height={25}
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="#fff"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<circle cx={12} cy={12} r={9} />
							<path d="M10 10l4 4m0 -4l-4 4" />
						</svg>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SlowActivityInfo
