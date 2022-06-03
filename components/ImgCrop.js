import React, { useState, useEffect, useRef } from 'react'
import { readFileAsUrl } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
let cropper = null
let containersize = 0

const ImgCrop = ({
	input,
	type = 'square',
	size = {
		width: 1080,
		height: 1080,
	},
	left,
	right,
}) => {
	const offset = 16
	const containerRef = useRef(null)
	const [imgUrl, setImgUrl] = useState('')
	const [firstLoad, setFirstLoad] = useState(true)
	const { localeLn } = useIntl()

	useEffect(() => {
		const readImg = async () => {
			const imgUrl = await readFileAsUrl(input)
			setImgUrl(imgUrl)
		}
		readImg()
	}, [])

	useEffect(() => {
		if (containerRef) {
			containersize = containerRef.current.offsetWidth - offset
		}
	}, [containerRef])

	useEffect(() => {
		if (typeof window !== 'undefined' && imgUrl.length > 0) {
			const Croppie = require('croppie')
			let vWidth
			let vHeight
			if (size.height > size.width) {
				vWidth = containersize * (size.width / size.height)
				vHeight = containersize
			} else {
				vWidth = containersize
				vHeight = containersize * (size.height / size.width)
			}
			cropper = new Croppie(document.getElementById('new-img'), {
				boundary: { width: containersize, height: containersize },
				viewport: { width: vWidth, height: vHeight, type: type },
			})
			setFirstLoad(false)
		}
	}, [imgUrl])

	const _right = async (e) => {
		e.preventDefault()

		const newFile = await cropper.result({
			type: 'blob',
			size: size,
			format: 'jpeg',
		})
		newFile.lastModifiedDate = new Date()
		newFile.name = input.name
		const newImg = await readFileAsUrl(newFile)

		right({
			type: 'img',
			body: newImg,
			payload: {
				imgFile: newFile,
				imgUrl: newImg,
			},
		})
	}

	const _left = () => {
		left()
	}

	return (
		<div
			id="new-modal-bg"
			className={`${!firstLoad ? `visible` : `invisible`} fixed inset-0 z-50 flex items-center`}
			style={{
				backgroundColor: `rgba(0,0,0,0.86)`,
			}}
		>
			<div className="max-w-lg m-auto p-4 w-full">
				<div className="bg-white w-full rounded-md overflow-hidden">
					<div className="flex justify-between items-center w-full h-16 bg-dark-12 px-4">
						<div className="w-8 flex items-center">
							<button onClick={() => _left()}>
								<svg
									width="28"
									height="28"
									viewBox="0 0 32 32"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
										fill="black"
									/>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M15.9999 17.6979L10.8484 22.8494L9.15137 21.1523L14.3028 16.0009L9.15137 10.8494L10.8484 9.15234L15.9999 14.3038L21.1514 9.15234L22.8484 10.8494L17.697 16.0009L22.8484 21.1523L21.1514 22.8494L15.9999 17.6979Z"
										fill="black"
									/>
								</svg>
							</button>
						</div>
						<div className="flex-auto overflow-hidden px-2 font-bold text-2xl">
							{localeLn('EditImage')}
						</div>
						<div className="w-8 flex items-center justify-end">
							<button>
								<svg
									onClick={(e) => _right(e)}
									width="28"
									height="28"
									viewBox="0 0 32 32"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
										fill="#1300BA"
									/>
									<circle cx="16" cy="16" r="16" fill="#1300BA" />
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M13.7061 19.2929L22.999 10L24.4132 11.4142L13.7061 22.1213L7.99902 16.4142L9.41324 15L13.7061 19.2929Z"
										fill="white"
									/>
								</svg>
							</button>
						</div>
					</div>
					<div
						ref={containerRef}
						className="relative w-full"
						style={{
							minHeight: `${containersize}px`,
						}}
					>
						<div>
							<img id="new-img" src={imgUrl} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ImgCrop
