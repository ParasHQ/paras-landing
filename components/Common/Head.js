import NextHead from 'next/head'

const Head = ({
	title = 'Comics by Paras',
	description = 'New way to collect digital comics. Read and truly own your digital comics. Engage and support the creators like never before.',
	image = '',
	url = 'https://comics.paras.com',
	keywords = 'comics, blockchain, near',
}) => {
	return (
		<NextHead>
			<title>{title}</title>
			<meta name="title" content={title} />
			<meta name="description" content={description} />
			<meta property="og:type" content="website" />
			<meta property="og:url" content={url} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={image} />
			<meta name="keywords" content={keywords} />
			<meta name="robots" content="index, follow" />
			<meta property="twitter:card" content="summary_large_image" />
			<meta property="twitter:url" content={url} />
			<meta property="twitter:title" content={title} />
			<meta property="twitter:description" content={description} />
			<meta property="twitter:image" content={image} />
		</NextHead>
	)
}

export default Head
