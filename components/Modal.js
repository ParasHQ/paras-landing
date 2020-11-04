import React, { useEffect, useRef } from 'react'

const Modal = ({
	close = () => {},
	closeOnBgClick = true,
	closeOnEscape = true,
	children,
	style = {},
}) => {
	const modalRef = useRef(null)

	useEffect(() => {
		const onKeydown = (e) => {
			if (e.key === 'Escape') {
				close()
			}
		}

		if (closeOnEscape) {
			document.addEventListener('keydown', onKeydown)
		}

		return () => {
			document.removeEventListener('keydown', onKeydown)
		}
	}, [])

	const _bgClick = (e) => {
		if (e.target === modalRef.current && closeOnBgClick) {
			close()
		}
	}

	return (
		<div
			ref={modalRef}
			onClick={(e) => _bgClick(e)}
			className="fixed inset-0 z-50 flex items-center p-4"
			style={{
				backgroundColor: `rgba(0,0,0,0.86)`,
				...style,
			}}
		>
			{children}
		</div>
	)
}

export default Modal
