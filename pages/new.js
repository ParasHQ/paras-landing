import axios from 'axios'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { useState } from 'react'
import Card from '../components/Card'
import ImgCrop from '../components/ImgCrop'
import Nav from '../components/Nav'
import useStore from '../store'
import { readFileAsUrl } from '../utils/common'

const NewPage = () => {
	const store = useStore()
	const [showImgCrop, setShowImgCrop] = useState(false)
	const [imgFile, setImgFile] = useState('')
	const [imgUrl, setImgUrl] = useState('')
	const [supply, setSupply] = useState(1)
	const [quantity, setQuantity] = useState(1)
	const [amount, setAmount] = useState('')
	const [name, setName] = useState('')
	const [collection, setCollection] = useState('')
	const [description, setDescription] = useState('')
	const [step, setStep] = useState(0)

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
		if (e.target.files[0]) {
			// const url = await readFileAsUrl(e.target.files[0])
			// setImgUrl(url)
			setImgFile(e.target.files[0])
			setShowImgCrop(true)
		}
	}

	return (
		<div
			className="min-h-screen bg-dark-primary-1"
			style={{
				backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
			}}
		>
			<Nav />
			{showImgCrop && (
				<ImgCrop
					input={imgFile}
					size={{
						width: 640,
						height: 890,
					}}
					left={(_) => setShowImgCrop(false)}
					right={(res) => {
						setImgUrl(res.payload.imgUrl)
						setImgFile(res.payload.imgFile)
						setShowImgCrop(false)
					}}
				/>
			)}
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
				<div className="w-1/3 bg-white p-4">
					<input type="file" accept="image/*" onChange={_setImg} />
					<div>
						<label className="block text-sm">Name</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="bg-gray-300 p-2 rounded-md focus:bg-gray-100 border-2 border-transparent focus:border-dark-primary-1 w-full"
						/>
					</div>
					<div className="mt-4">
						<label className="block text-sm">Collection</label>
						<input
							type="text"
							value={collection}
							onChange={(e) => setCollection(e.target.value)}
							className="bg-gray-300 p-2 rounded-md focus:bg-gray-100 border-2 border-transparent focus:border-dark-primary-1 w-full"
						/>
					</div>
					<div className="mt-4">
						<label className="block text-sm">Description</label>
						<textarea
							type="text"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="bg-gray-300 p-2 rounded-md focus:bg-gray-100 border-2 border-transparent focus:border-dark-primary-1 resize-none w-full h-24"
						></textarea>
					</div>
					<div>
						<label className="block text-sm">Supply</label>
						<input
							type="number"
							value={supply}
							onChange={(e) => setSupply(e.target.value)}
							className="bg-gray-300 p-2 rounded-md focus:bg-gray-100 border-2 border-transparent focus:border-dark-primary-1 w-full"
						/>
					</div>
					<div>
						<label className="block text-sm">Quantity</label>
						<input
							type="number"
							value={quantity}
							onChange={(e) => setQuantity(e.target.value)}
							className="bg-gray-300 p-2 rounded-md focus:bg-gray-100 border-2 border-transparent focus:border-dark-primary-1 w-full"
							min={1}
							max={100}
						/>
					</div>
					<div>
						<label className="block text-sm">Amount</label>
						<div className="flex justify-between bg-gray-300 p-2 rounded-md focus:bg-gray-100 border-2 border-transparent focus:border-dark-primary-1 w-full">
							<input
								type="string"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className="bg-transparent w-full pr-2"
							/>
							<div className="inline-block">Ⓝ</div>
						</div>
						<p>~${store.nearUsdPrice * amount}</p>
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
