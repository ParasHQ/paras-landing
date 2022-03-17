import { useEffect, useRef, useState } from 'react'
import WalletHelper from 'lib/WalletHelper'

const DraftPublication = ({ onCreatePublication }) => {
	const draftModalRef = useRef()
	const [showDraftModal, setShowDraftModal] = useState(false)
	const [currentUserDraft, setCurrentUserDraft] = useState()
	const [allDraftStorage, setAllDraftStorage] = useState()

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
		let draftStorage = JSON.parse(localStorage.getItem('draft-publication'))

		const allDraftStorage = draftStorage?.filter(
			(item) => WalletHelper?.currentUser?.accountId !== item.author_id
		)
		setAllDraftStorage(allDraftStorage)

		if (draftStorage !== null) {
			const currentUserDraft = draftStorage?.filter(
				(item) => WalletHelper?.currentUser?.accountId === item.author_id
			)
			setCurrentUserDraft(currentUserDraft)
		} else {
			draftStorage = []
			setCurrentUserDraft(draftStorage)
		}
	}, [showDraftModal])

	const editDraft = (_id) => {
		const editItem = currentUserDraft.filter((item) => item._id === _id)
		localStorage.setItem('edit-draft', JSON.stringify(editItem))
	}

	const deleteDraft = (_id) => {
		let mergeDraftStorage = []
		const deleteItem = currentUserDraft.filter((item) => item._id !== _id)
		allDraftStorage.map((item) => mergeDraftStorage.push(item))
		deleteItem.map((item) => mergeDraftStorage.push(item))
		localStorage.setItem('draft-publication', JSON.stringify(mergeDraftStorage))
		setShowDraftModal(false)
	}

	return (
		<div ref={draftModalRef} className="inline-block">
			<div
				className={`mx-4 inline-flex cursor-pointer px-4 ${
					onCreatePublication ? 'py-2.5' : 'py-2'
				} bg-dark-primary-2 button-wrapper rounded-md`}
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
					Drafts
				</h1>
			</div>
			{showDraftModal && (
				<div
					className={`absolute max-w-full z-20 mt-2 px-4 ${
						!onCreatePublication ? 'right-0' : 'md:right-auto'
					} right-2`}
					style={{
						width: `24rem`,
					}}
				>
					<div className="bg-dark-primary-2 rounded-md p-4 h-60 overflow-y-scroll">
						<h1 className="text-white font-semibold text-xl">My Draft</h1>
						{currentUserDraft.length !== 0 ? (
							currentUserDraft?.map((draft, index) => {
								return (
									<div key={index} className="flex mt-2">
										<div className="rounded-md text-white px-3 py-2 inline-block mb-2 mr-2 border-2 border-gray-800 w-full cursor-pointer hover:bg-gray-800">
											<a href={`/publication/edit/${draft._id}`}>
												<h4 key={index} className="truncate" onClick={() => editDraft(draft._id)}>
													{draft.title}
												</h4>
											</a>
										</div>
										<svg
											className="w-6 h-6 text-red-500 cursor-pointer hover:opacity-80 mt-2.5"
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
								)
							})
						) : (
							<div className="flex flex-col justify-center items-center h-full -mt-4  text-gray-600">
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
			)}
		</div>
	)
}

export default DraftPublication
