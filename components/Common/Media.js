import { useEffect, useState } from 'react'
import { parseImgUrl } from 'utils/common'
import axios from 'axios'
import FileType from 'file-type/browser'

const Media = ({ className, url, videoControls = false, videoMuted = true, videoLoop = false }) => {
	const [media, setMedia] = useState(null)

	useEffect(() => {
		if (url) {
			getMedia()
		}
	}, [url])

	const getMedia = async () => {
		const resp = await axios.get(`${parseImgUrl(url)}`, {
			responseType: 'blob',
		})

		const fileType = await FileType.fromBlob(resp.data)

		const objectUrl = URL.createObjectURL(resp.data)

		setMedia({
			type: fileType.mime,
			url: [objectUrl],
		})
	}

	if (media?.type.includes('image')) {
		return (
			<div className={className}>
				<img className="object-contain w-full h-full" src={media.url} />
			</div>
		)
	}

	if (media?.type.includes('video')) {
		return (
			<div className={className}>
				<video
					className="w-full h-full"
					autoPlay
					loop={videoLoop}
					controls={videoControls}
					muted={videoMuted}
					src={media.url}
				/>
			</div>
		)
	}

	if (media?.type) {
		return (
			<div className={className}>
				<div className="w-full h-full flex items-center justify-center">
					<p>Media not supported</p>
				</div>
			</div>
		)
	}

	return null
}

export default Media
