import { useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useIntl } from 'hooks/useIntl'
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu'

const CategoryList = ({ listCategory, categoryId = '' }) => {
	const router = useRouter()
	const { localeLn } = useIntl()

	if (listCategory.length === 0) {
		return null
	}

	return (
		<div className="mt-8">
			<div className="px-2">
				<ScrollMenu
					LeftArrow={LeftArrow}
					RightArrow={RightArrow}
					wrapperClassName="flex items-center"
					scrollContainerClassName="top-user-scroll"
				>
					<Link href="/market" shallow={true}>
						<a
							className={`text-xl ${
								router.pathname === '/market' ? 'text-gray-100' : 'text-gray-600'
							} font-semibold px-4`}
						>
							{localeLn('All')}
						</a>
					</Link>
					<span className="text-xl text-gray-600 font-semibold">|</span>
					<Link href="/categories" shallow={true}>
						<a className={`text-xl text-gray-600 font-semibold px-4`}>{localeLn('Categories')}</a>
					</Link>
					<span className="text-xl text-gray-600 font-semibold">|</span>
					{listCategory
						.filter((category) => !category.isHide)
						.map((category) => (
							<Categories
								key={category.category_id}
								itemId={category.category_id}
								title={category.name}
								categoryId={categoryId}
							/>
						))}
				</ScrollMenu>
			</div>
		</div>
	)
}

const Categories = ({ itemId, title, categoryId }) => {
	return (
		<Link href={`/market/${itemId}`} shallow={true}>
			<a
				className={`text-xl ${
					itemId === categoryId ? 'text-gray-100' : 'text-gray-600'
				} font-semibold flex-shrink-0`}
			>
				<span className="flex items-center px-4 space-x-6 whitespace-nowrap">{title}</span>
			</a>
		</Link>
	)
}

const LeftArrow = () => {
	const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext)

	return (
		<div disabled={isFirstItemVisible} onClick={() => scrollPrev()}>
			<svg
				className="w-10 h-10 text-white cursor-pointer"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
					clipRule="evenodd"
				></path>
			</svg>
		</div>
	)
}

const RightArrow = () => {
	const { isLastItemVisible, scrollNext } = useContext(VisibilityContext)

	return (
		<div disabled={isLastItemVisible} onClick={() => scrollNext()}>
			<svg
				className="w-10 h-10 text-white cursor-pointer"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
					clipRule="evenodd"
				></path>
			</svg>
		</div>
	)
}

export default CategoryList
