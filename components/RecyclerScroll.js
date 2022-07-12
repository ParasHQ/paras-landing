import React, { useState } from 'react'
import { useEffect } from 'react'
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview/web'

const RecyclerScroll = ({
	fetchNext,
	items,
	rowRender,
	renderLoader,
	hasMore = true,
	extendedState,
}) => {
	const [isMounted, setIsMounted] = useState(false)

	const [dataProvider, setDataProvider] = useState(
		new DataProvider((r1, r2) => {
			return r1 !== r2
		}).cloneWithRows(items)
	)
	const [layoutProvider] = useState(
		new LayoutProvider(
			() => {
				return 'single_type'
			},
			(type, dim) => {
				switch (type) {
					case 'single_type':
						dim.width = 0
						dim.height = 0
				}
			}
		)
	)

	const handleReachEnded = () => {
		if (!hasMore) {
			return
		} else {
			fetchNext()
		}
	}

	useEffect(() => {
		setDataProvider(new DataProvider((r1, r2) => r1 !== r2).cloneWithRows([...items]))
		setIsMounted(true)
	}, [items])

	if (!isMounted) {
		return null
	}

	return (
		<RecyclerListView
			layoutProvider={layoutProvider}
			dataProvider={dataProvider}
			rowRenderer={rowRender}
			renderFooter={renderLoader}
			onEndReached={handleReachEnded}
			forceNonDeterministicRendering={true}
			style={{ height: `100%`, width: `100%` }}
			canChangeSize={true}
			extendedState={extendedState}
		/>
	)
}

export default RecyclerScroll
