const { useRef, useEffect, useState } = require('react')

const CopyLink = ({ children, link, afterCopy }) => {
	const [isComponentMounted, setIsComponentMounted] = useState(false)
	const copyLinkRef = useRef()

	useEffect(() => {
		setIsComponentMounted(true)
	}, [])

	const _copyLink = () => {
		const copyText = copyLinkRef.current
		copyText.select()
		copyText.setSelectionRange(0, 99999)
		document.execCommand('copy')

		if (typeof afterCopy === 'function') {
			afterCopy()
		}
	}

	return (
		<div onClick={() => _copyLink()}>
			{isComponentMounted && (
				<div
					className="absolute z-0 opacity-0"
					style={{
						top: `-1000`,
					}}
				>
					<input ref={copyLinkRef} readOnly type="text" value={link} />
				</div>
			)}
			<div className="relative z-10">{children}</div>
		</div>
	)
}

export default CopyLink
