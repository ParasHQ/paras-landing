import React, { useState, useEffect, useRef } from 'react'

const Modal = ({ close = () => {}, children }) => {
	const modalRef = useRef(null)

	useEffect(() => {
		const onKeydown = (e) => {
			if (e.key === 'Escape') {
				close()
			}
		}
		document.addEventListener('keydown', onKeydown)

		return () => {
			document.removeEventListener('keydown', onKeydown)
		}
	}, [])

	const _bgClick = (e) => {
		if (e.target === modalRef.current) {
			close()
		}
	}

	return (
		<div
			ref={modalRef}
			onClick={(e) => _bgClick(e)}
			className="fixed inset-0 z-50 flex items-center"
			style={{
				backgroundColor: `rgba(0,0,0,0.86)`,
			}}
		>
			{children}
		</div>
	)
}

export default Modal
