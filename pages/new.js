import axios from 'axios'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { useState } from 'react'
import Card from '../components/Card'
import Nav from '../components/Nav'
import useStore from '../store'
import { readFileAsUrl } from '../utils/common'

const NewPage = () => {
	const store = useStore()
	const [imgFile, setImgFile] = useState('')
	const [imgUrl, setImgUrl] = useState('')
	const [supply, setSupply] = useState(1)
	const [quantity, setQuantity] = useState(1)
	const [amount, setAmount] = useState('')
	const [name, setName] = useState('')
	const [collection, setCollection] = useState('')
	const [description, setDescription] = useState('')
	const [step, setStep] = useState(0)

	// file,
	// 	ownerId,
	// 	supply,
	// 	quantity,
	// 	amount,
	// 	name,
	// 	description,
	// 	collection,

	const _submit = async (e) => {
		e.preventDefault()

		const formData = new FormData()
		formData.append('file', imgFile)
		formData.append('ownerId', store.currentUser)
		formData.append('supply', supply)
		formData.append('quantity', quantity)
		formData.append('amount', parseNearAmount(amount))
		formData.append('name', name)
		formData.append('description', description)
		formData.append('collection', collection)

		try {
			await axios.post(`http://localhost:9090/tokens`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
		} catch (err) {
			console.log(err)
		}
	}

	const _setImg = async (e) => {
		const url = await readFileAsUrl(e.target.files[0])
		setImgFile(e.target.files[0])
		setImgUrl(url)
		// setNewAvatarFile(e.target.files[0])
		// setShowImgCrop(true)
	}

	return (
		<div
			className="min-h-screen bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Nav />
			<div className="max-w-6xl flex m-auto bg-dark-primary-2">
				<div className="w-2/3 py-16 flex justify-center items-center">
					<div className="w-56">
						<Card
							imgWidth={640}
							imgHeight={890}
							imgUrl={imgUrl}
							token={{
								name: name,
								collection: collection,
								description: description,
								creatorId: store.currentUser,
								supply: supply,
								tokenId: 'ID',
								createdAt: new Date().getTime(),
							}}
							initialRotate={{
								x: 0,
								y: 0,
							}}
							disableFlip={step == 0}
						/>
					</div>
				</div>
				<div className="w-1/3 bg-white">
					<input type="file" onChange={_setImg} />
					<label>Name</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<label>Collection</label>
					<input
						type="text"
						value={collection}
						onChange={(e) => setCollection(e.target.value)}
					/>
					<label>Description</label>
					<textarea
						type="text"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					></textarea>
					<div>
						<label>Supply</label>
						<input
							type="number"
							value={supply}
							onChange={(e) => setSupply(e.target.value)}
						/>
					</div>
					<div>
						<label>Quantity</label>
						<input
							type="number"
							value={quantity}
							onChange={(e) => setQuantity(e.target.value)}
						/>
					</div>
					<div>
						<label>Amount</label>
						<input
							type="string"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
						/>
					</div>
					<button onClick={_submit}>Add new card</button>
					<div onClick={(_) => setStep(0)}>step 0</div>
					<div onClick={(_) => setStep(1)}>step 1</div>
				</div>
			</div>
		</div>
	)
}

export default NewPage
