import React, { useState } from 'react'
import { useEffect } from 'react'
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview/web'

const ExternalScrollView = (props) => {
	useEffect(() => {
		let PADDING_HORIZONTAL
		if (window.matchMedia('(min-width: 768px)').matches) {
			PADDING_HORIZONTAL = 32
		} else {
			PADDING_HORIZONTAL = 0
		}
		if (props.onSizeChanged) {
			props.onSizeChanged({
				width: props.parentRef?.current?.clientWidth - PADDING_HORIZONTAL,
				height: window.innerHeight,
			})
		}
	}, [])

	return <div {...props} onSizeChanged={() => {}} />
}

const RecyclerScrollCommon = ({
	fetchNext,
	items,
	rowRender,
	renderLoader,
	hasMore = true,
	extendedState,
	initialState,
	nonDeterministicRendering,
	windowScroll = false,
	parentRef,
}) => {
	const [isMounted, setIsMounted] = useState(false)
	const [prevResize, setPrevResize] = useState()
	const [currSize, setCurrSize] = useState()
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
			!initialState && fetchNext()
		}
	}

	const resizeScreen = () => {
		if (!initialState) {
			setCurrSize(parentRef?.current?.clientWidth)
		}
	}

	useEffect(() => {
		window.addEventListener('resize', resizeScreen)
		if (prevResize !== currSize) {
			setIsMounted(false)
			fetchNext()
			setPrevResize(currSize)
		}
	}, [currSize])

	useEffect(() => {
		setDataProvider(new DataProvider((r1, r2) => r1 !== r2).cloneWithRows([...items]))
		if (parentRef?.current) {
			setPrevResize(parentRef?.current?.clientWidth)
			setCurrSize(parentRef?.current?.clientWidth)
			setIsMounted(true)
		}
	}, [items, parentRef?.current])

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
			forceNonDeterministicRendering={nonDeterministicRendering}
			canChangeSize={true}
			extendedState={extendedState}
			useWindowScroll={windowScroll}
			externalScrollView={windowScroll ? ExternalScrollView : undefined}
			scrollViewProps={
				windowScroll
					? {
							parentRef,
					  }
					: {}
			}
		/>
	)
}

export default RecyclerScrollCommon
