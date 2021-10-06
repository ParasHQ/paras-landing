import { useState } from 'react'
import ListModal from './ListModal'

const TokenMoreModal = ({ show, onClose, listModalItem }) => {
	const [copyLink, setCopyLink] = useState(false)

	const onClickCopy = () => {
		navigator.clipboard.writeText(window.location.href)
		setCopyLink(true)
		setTimeout(() => {
			setCopyLink(false)
		}, 3000)
	}

	const _listModalItem = [{ name: copyLink ? 'Copied' : 'Copy Link', onClick: onClickCopy }].concat(
		listModalItem
	)

	return <ListModal list={_listModalItem} show={show} onClose={onClose} />
}

export default TokenMoreModal
