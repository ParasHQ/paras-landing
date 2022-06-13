import { useRouter } from 'next/router'
import { useIntl } from 'hooks/useIntl'
import { IconSearch } from 'components/Icons'

const CollectionSearch = ({ collectionId }) => {
	const { localeLn } = useIntl()
	const router = useRouter()

	const _handleSubmit = async (e) => {
		const searchInput = new FormData(e.target)

		const query = {
			...router.query,
			collection_id: collectionId,
			q: searchInput.get('searchInput'),
		}

		e.preventDefault()
		router.push(
			{
				pathname: '/collection/[collection_id]',
				query: query,
			},
			undefined,
			{ scroll: false }
		)
	}

	return (
		<div className="flex-1">
			<div className="max-w-sm">
				<form method="get" onSubmit={_handleSubmit} autoComplete="off">
					<div className="flex items-center border-dark-primary-1 border-2 rounded-lg bg-dark-primary-1 h-12 w-80 sm:w-60 md:w-96">
						<IconSearch size={36} />
						<input
							id="search"
							name="searchInput"
							type="search"
							value={router.query.search}
							placeholder={localeLn('Search')}
							className="p-1 pl-0 m-auto bg-transparent focus:bg-transparent border-none text-white text-base md:text-sm font-medium"
							style={{ WebkitAppearance: 'none' }}
						/>
					</div>
				</form>
			</div>
		</div>
	)
}

export default CollectionSearch
