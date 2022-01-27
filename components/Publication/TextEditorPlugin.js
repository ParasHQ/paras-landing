/* eslint-disable react/display-name */
import { composeDecorators } from '@draft-js-plugins/editor'

import createToolbarPlugin from '@draft-js-plugins/static-toolbar'
import createImagePlugin from '@draft-js-plugins/image'
import createFocusPlugin from '@draft-js-plugins/focus'
import createLinkPlugin from '@draft-js-plugins/anchor'
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar'
import createLinkifyPlugin from '@draft-js-plugins/linkify'
import createVideoPlugin from '@draft-js-plugins/video'
import createDividerPlugin from '@draft-js-plugins/divider'

import toolbarStyles from 'styles/toolbar.module.css'
import inlineToolbarStyles from 'styles/inlinetoolbar.module.css'
import linkStyles from 'styles/linkStyles.module.css'
import buttonStyles from 'styles/button.module.css'

import { parseImgUrl } from 'utils/common'

const focusPlugin = createFocusPlugin({
	theme: {
		focused: 'border-transparent rounded-md border-4 -m-0.5',
		unfocused: 'border-transparent rounded-md border-4 -m-0.5',
	},
})

const decorator = composeDecorators(focusPlugin.decorator)

const dividerPlugin = createDividerPlugin({
	decorator: decorator,
	dividerComponent: () => (
		<div className="flex justify-center items-center gap-8 my-14">
			<div className="w-1 h-1 rounded-full bg-white"></div>
			<div className="w-1 h-1 rounded-full bg-white"></div>
			<div className="w-1 h-1 rounded-full bg-white"></div>
		</div>
	),
})

const linkifyPlugin = createLinkifyPlugin({
	target: '_blank',
	component(props) {
		return <a {...props} className="mt-4 text-gray-200 hover:text-white font-semibold border-b-2" />
	},
})

const imagePlugin = createImagePlugin({
	decorator: composeDecorators(focusPlugin.decorator),
	imageComponent: (props) => {
		const entity = props.contentState.getEntity(props.block.getEntityAt(0))
		const { src } = entity.getData()

		return (
			<img onClick={props.onClick} src={parseImgUrl(src)} className={`w-full ${props.className}`} />
		)
	},
})

const linkPlugin = createLinkPlugin({
	linkTarget: '_blank',
	theme: {
		input: linkStyles.input,
		inputInvalid: linkStyles.inputInvalid,
		link: 'mt-4 text-gray-200 hover:text-white font-semibold border-b-2',
	},
	placeholder: 'https://',
})

const videoPlugin = createVideoPlugin({
	theme: {
		iframe: 'w-full embedVideo',
	},
})

const toolbarPlugin = createToolbarPlugin({
	theme: { buttonStyles, toolbarStyles },
})

const inlineToolbarPlugin = createInlineToolbarPlugin({
	theme: { buttonStyles, toolbarStyles: inlineToolbarStyles },
})

const { InlineToolbar } = inlineToolbarPlugin
const { Toolbar } = toolbarPlugin

const plugins = [
	toolbarPlugin,
	imagePlugin,
	focusPlugin,
	linkPlugin,
	inlineToolbarPlugin,
	linkifyPlugin,
	dividerPlugin,
	videoPlugin,
]

export { plugins, Toolbar, InlineToolbar, linkPlugin, dividerPlugin, imagePlugin, videoPlugin }
