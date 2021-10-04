import { useEffect, useRef } from 'react'

const Modal = ({
	isShow = true,
	close = () => {},
	closeOnBgClick = true,
	closeOnEscape = true,
	children,
	backgroundColor = `rgba(0,0,0,0.86)`,
	style = {},
	className,
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
	}, [close, closeOnEscape])

	const bgClick = (e) => {
		if (e.target === modalRef.current && closeOnBgClick) {
			close()
		}
	}

	if (!isShow) return null

	return (
		<div
			ref={modalRef}
			onClick={(e) => bgClick(e)}
			className={`fixed inset-0 z-50 flex items-center p-4 ${className}`}
			style={{
				backgroundColor: backgroundColor,
				...style,
			}}
		>
			{children}
		</div>
	)
}

export default Modal
