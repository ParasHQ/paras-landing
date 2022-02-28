import { useRef, useState } from 'react'
import ReactLinkify from 'react-linkify'
import { useIntl } from 'hooks/useIntl'

const LineClampText = ({ text = '', lineClamp = 8, style = {}, className = '' }) => {
	const [clamp, setClamp] = useState(true)
	const ref = useRef()
	const { localeLn } = useIntl()

	const clampStyle = {
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		display: '-webkit-box',
		WebkitLineClamp: lineClamp,
		lineClamp: lineClamp,
		WebkitBoxOrient: 'vertical',
		...style,
	}

	const isTextTruncated = () => {
		if (!ref.current) return false
		return ref.current.scrollHeight > ref.current.clientHeight
	}

	const componentDecorator = (decoratedHref, decoratedText, key) => (
		<a target="blank" href={decoratedHref} key={key}>
			{decoratedText}
		</a>
	)

	if (text === '') {
		return null
	}

	return (
		<>
			<ReactLinkify componentDecorator={componentDecorator}>
				<p
					ref={ref}
					className={`mt-2 text-gray-300 whitespace-pre-line ${className}`}
					style={clamp ? clampStyle : {}}
				>
					{text.replace(/\n\s*\n\s*\n/g, '\n\n')}
				</p>
			</ReactLinkify>
			{isTextTruncated() && clamp && (
				<p
					className="text-white underline text-sm hover:opacity-100 my-2 cursor-pointer"
					onClick={() => setClamp(false)}
				>
					{localeLn('More')}
				</p>
			)}
		</>
	)
}

export default LineClampText
