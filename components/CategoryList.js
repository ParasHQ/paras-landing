import Link from 'next/link'
import { useRouter } from 'next/router'
import FilterMarket from './FilterMarket'
import Scrollbars from 'react-custom-scrollbars'

const CategoryList = ({ listCategory, categoryId = '' }) => {
	const router = useRouter()

	return (
		<div className="mt-6 flex items-end justify-between">
			<Scrollbars
				renderThumbHorizontal={renderThumb}
				autoHeight={true}
				universal={true}
				width={100}
			>
				<div className="flex items-center px-4 text-white space-x-6 whitespace-no-wrap">
					<Link href="/market" shallow={true}>
						<a
							className={`text-xl ${
								router.pathname === '/market'
									? 'text-gray-100'
									: 'text-gray-600'
							} font-semibold`}
						>
							All
						</a>
					</Link>
					{listCategory
						.filter((category) => !category.isHide)
						.map((category) => (
							<Link
								key={category.category_id}
								href={`/market/${category.category_id}`}
								shallow={true}
							>
								<a
									className={`text-xl ${
										category.category_id === categoryId
											? 'text-gray-100'
											: 'text-gray-600'
									} font-semibold`}
								>
									<span>{category.name}</span>
								</a>
							</Link>
						))}
				</div>
			</Scrollbars>
			<div className="md:ml-8 z-10">
				<FilterMarket />
			</div>
		</div>
	)
}

const renderThumb = ({ style, ...props }) => {
	return (
		<div
			{...props}
			style={{
				...style,
				cursor: 'pointer',
				borderRadius: 'inherit',
				backgroundColor: 'rgba(255, 255, 255, 0.1)',
			}}
		/>
	)
}

export default CategoryList
