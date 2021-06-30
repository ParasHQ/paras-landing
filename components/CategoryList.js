import Link from 'next/link'
import { useRouter } from 'next/router'
import FilterMarket from './FilterMarket'

const CategoryList = ({ listCategory, categoryId = '' }) => {
	const router = useRouter()

	return (
		<div className="mt-6 flex items-end justify-between">
			<div className="flex items-center overflow-x-scroll px-4 text-white space-x-6 whitespace-no-wrap flex-no-wrap">
				<Link href="/market" shallow={true}>
					<a
						className={`text-xl ${
							router.pathname === '/market' ? 'text-gray-100' : 'text-gray-600'
						} font-semibold`}
					>
						All
					</a>
				</Link>
				{/* <Link href="/market/all-category" shallow={true}>
					<a
						className={`text-xl ${
							router.pathname === '/market/all-category'
								? 'text-gray-100'
								: 'text-gray-600'
						} font-semibold`}
					>
						Categories
					</a>
				</Link> */}
				{listCategory.map((category) => (
					<Link
						key={category.categoryId}
						href={`/market/${category.categoryId}`}
						shallow={true}
					>
						<a
							className={`text-xl ${
								category.categoryId === categoryId
									? 'text-gray-100'
									: 'text-gray-600'
							} font-semibold`}
						>
							<span>{category.name}</span>
						</a>
					</Link>
				))}
			</div>
			<div className="md:ml-8 z-10">
				<FilterMarket />
			</div>
		</div>
	)
}

export default CategoryList
