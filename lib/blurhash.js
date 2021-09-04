import { encode } from 'blurhash'

const loadImage = async (src) =>
	new Promise((resolve, reject) => {
		const img = new Image()
		img.onload = () => resolve(img)
		img.onerror = (...args) => reject(args)
		img.src = src
	})

const getImageData = (image) => {
	const canvas = document.createElement('canvas')
	canvas.width = 360
	canvas.height = 400
	const context = canvas.getContext('2d')
	context.drawImage(image, 0, 0)
	return context.getImageData(0, 0, 360, 400)
}

export const encodeImageToBlurhash = async (imageUrl) => {
	const image = await loadImage(imageUrl)
	const imageData = getImageData(image)
	return encode(imageData.data, imageData.width, imageData.height, 4, 4)
}
