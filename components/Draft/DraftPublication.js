import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const DraftPublication = () => {
	const draftModalRef = useRef()
	const [showDraftModal, setShowDraftModal] = useState(false)
	const [dataDraftPublication, setDataDraftPublication] = useState()

	useEffect(() => {
		const onClickEv = (e) => {
			if (draftModalRef.current?.contains && !draftModalRef.current.contains(e.target)) {
				setShowDraftModal(false)
			}
		}
		if (showDraftModal) {
			document.body.addEventListener('click', onClickEv)
		}
		return () => {
			document.body.removeEventListener('click', onClickEv)
		}
	}, [showDraftModal])

	useEffect(() => {
		const draftStorage = JSON.parse(localStorage.getItem('draft-publication'))
		setDataDraftPublication(draftStorage)
	}, [showDraftModal])

	const editDraft = (_id) => {
		const editItem = dataDraftPublication.filter((item) => item._id === _id)
		localStorage.setItem('edit-draft', JSON.stringify(editItem))
	}

	const deleteDraft = (_id) => {
		const deleteItem = dataDraftPublication.filter((item) => item._id !== _id)
		localStorage.setItem('draft-publication', JSON.stringify(deleteItem))
		if (dataDraftPublication.length === 1) localStorage.removeItem('draft-publication')
		setShowDraftModal(false)
	}

	return (
		<div ref={draftModalRef} className="inline-block">
			<div
				className="mx-4 inline-flex cursor-pointer px-4 py-2 bg-dark-primary-2 button-wrapper rounded-md"
				onClick={() => setShowDraftModal(!showDraftModal)}
			>
				<svg
					className="w-6 h-6 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					></path>
				</svg>
				<h1 className="text-white font-semibold text-xl select-none hidden md:inline-block">
					Draft
				</h1>
			</div>
			{showDraftModal && (
				<div
					className="absolute max-w-full z-20 mt-2 px-4 right-0"
					style={{
						width: `24rem`,
					}}
				>
					<div className="bg-dark-primary-2 rounded-md p-4">
						<h1 className="text-white font-semibold text-xl mb-2">My Draft</h1>
						<div className="overflow-y-scroll">
							{dataDraftPublication ? (
								dataDraftPublication?.map((draft, index) => {
									return (
										<>
											<div className="flex">
												<Link href={`/publication/edit/${draft._id}`}>
													<h4
														key={index}
														className="rounded-md text-white px-3 py-1 inline-block mb-2 mr-2 border-2 border-gray-800 w-full cursor-pointer hover:bg-gray-800 truncate"
														onClick={() => editDraft(draft._id)}
													>
														{draft.title}
													</h4>
												</Link>
												<svg
													className="w-6 h-6 text-red-500 cursor-pointer hover:opacity-80 mt-1.5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													xmlns="http://www.w3.org/2000/svg"
													onClick={() => deleteDraft(draft._id)}
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													></path>
												</svg>
											</div>
										</>
									)
								})
							) : (
								<div className="text-center text-gray-600">
									<svg
										className="w-6 h-6 mx-auto mb-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
										></path>
									</svg>
									<p>No Draft</p>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default DraftPublication
