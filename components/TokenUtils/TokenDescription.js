import { useState } from 'react'
import { useIntl } from 'hooks/useIntl'
import { IconDownArrow } from 'components/Icons'
import ReactLinkify from 'react-linkify'
import { trackCloseDescription, trackOpenDescription } from 'lib/ga'

const TokenDescription = ({ localToken, className }) => {
	const { localeLn } = useIntl()
	const [isDropDown, setIsDropDown] = useState(false)

	const onClickDropdown = () => {
		setIsDropDown(!isDropDown)
		if (isDropDown) {
			trackOpenDescription(localToken.token_id || localToken.token_series_id)
			return
		}
		trackCloseDescription(localToken.token_id || localToken.token_series_id)
	}

	return (
		<div className={className}>
			<div
				className={`text-white bg-cyan-blue-3 ${
					isDropDown ? 'rounded-t-xl' : 'rounded-xl'
				} hover:cursor-pointer mt-3`}
			>
				<div
					className="flex justify-between items-center pr-2 pl-6 hover:cursor-pointer"
					onClick={() => onClickDropdown()}
				>
					<p className="text-xl py-3">Description</p>
					<div className={`${!isDropDown && 'rotate-180'}`}>
						<IconDownArrow size={30} />
					</div>
				</div>
			</div>
			{isDropDown && (
				<div>
					{localToken.metadata.description ? (
						<div className="text-white text-lg bg-cyan-blue-1 rounded-b-xl border-b-[14px] border-cyan-blue-1 px-6 py-4 overflow-auto h-56">
							<ReactLinkify
								componentDecorator={(decoratedHref, decoratedText, key) => (
									<a target="blank" href={decoratedHref} key={key}>
										{decoratedText}
									</a>
								)}
							>
								<p
									className="text-gray-100 whitespace-pre-line"
									style={{
										wordBreak: 'break-word',
									}}
								>
									{localToken.metadata.description?.replace(/\n\s*\n\s*\n/g, '\n\n')}
								</p>
							</ReactLinkify>
						</div>
					) : (
						<div className="text-white bg-cyan-blue-1 rounded-b-xl px-6 text-center py-20">
							<div className="text-white">{localeLn('NoTokenDescription')}</div>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default TokenDescription
