import { useEffect } from 'react'
import near from '../lib/near'
import '../styles/font.css'
import '../styles/tailwind.css'
import 'pure-react-carousel/dist/react-carousel.es.css'

function MyApp({ Component, pageProps }) {
	useEffect(() => {
		_init()
	}, [])

	const _init = async () => {
		await near.init()
	}

	return <Component {...pageProps} />
}

export default MyApp
