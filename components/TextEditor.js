import React from 'react'
import Editor, { composeDecorators } from '@draft-js-plugins/editor'
import { RichUtils, getDefaultKeyBinding } from 'draft-js'
import createToolbarPlugin, {
	Separator,
} from '@draft-js-plugins/static-toolbar'
import {
	ItalicButton,
	BoldButton,
	UnderlineButton,
	CodeButton,
	HeadlineOneButton,
	HeadlineTwoButton,
	HeadlineThreeButton,
	UnorderedListButton,
	OrderedListButton,
	BlockquoteButton,
	CodeBlockButton,
} from '@draft-js-plugins/buttons'
import createImagePlugin from '@draft-js-plugins/image'
import createFocusPlugin from '@draft-js-plugins/focus'

import 'draft-js/dist/Draft.css'
import toolbarStyles from '../styles/toolbar.module.css'
import buttonStyles from '../styles/button.module.css'

import { parseImgUrl, readFileAsUrl } from '../utils/common'

const toolbarPlugin = createToolbarPlugin({
	theme: { buttonStyles, toolbarStyles },
})

const focusPlugin = createFocusPlugin({
	theme: {
		focused: 'border-gray-700 rounded-md border-4 -m-0.5',
		unfocused: 'border-transparent rounded-md border-4 -m-0.5',
	},
})

const imagePlugin = createImagePlugin({
	decorator: composeDecorators(focusPlugin.decorator),
	imageComponent: (props) => {
		const entity = props.contentState.getEntity(props.block.getEntityAt(0))
		const { src } = entity.getData()

		return (
			<img
				onClick={props.onClick}
				src={parseImgUrl(src)}
				className={`w-full ${props.className}`}
			/>
		)
	},
})

const { Toolbar } = toolbarPlugin
const plugins = [toolbarPlugin, imagePlugin, focusPlugin]
class TextEditor extends React.Component {
	constructor(props) {
		super(props)
		this.focus = () => this.editor.focus()
	}

	onAddLocalImage = async (e) => {
		const { content } = this.props
		const imgUrl = await readFileAsUrl(e.target.files[0])

		this.props.setContent(imagePlugin.addImage(content, imgUrl))
	}

	handleKeyCommand = (command, editorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command)
		if (newState) {
			this.props.setContent(newState)
			return true
		}
		return false
	}

	mapKeyToEditorCommand = (e) => {
		if (e.keyCode === 9 /* TAB */) {
			const newEditorState = RichUtils.onTab(
				e,
				this.props.content,
				4 /* maxDepth */
			)
			if (newEditorState !== this.props.content) {
				this.props.setContent(newEditorState)
			}
			return
		}
		return getDefaultKeyBinding(e)
	}

	toggleBlockType = (blockType) => {
		this.props.setContent(
			RichUtils.toggleBlockType(this.props.content, blockType)
		)
	}

	toggleInlineStyle = (inlineStyle) => {
		this.props.setContent(
			RichUtils.toggleInlineStyle(this.props.content, inlineStyle)
		)
	}

	render() {
		const {
			content,
			readOnly = false,
			title,
			hideTitle = false,
			setTitle,
			showCardModal,
			setContent,
		} = this.props

		let className = 'RichEditor-editor text-lg'
		var contentState = content.getCurrentContent()
		if (!contentState.hasText()) {
			if (contentState.getBlockMap().first().getType() !== 'unstyled') {
				className += ' RichEditor-hidePlaceholder'
			}
		}

		return (
			<div>
				{!hideTitle && (
					<div className="titlePublication text-4xl font-bold p-4 pb-0 text-white">
						<Editor
							placeholder="Title"
							editorState={title}
							onChange={setTitle}
							handleReturn={() => 'handled'}
							readOnly={readOnly}
						/>
					</div>
				)}
				<div className="RichEditor-root text-white p-4">
					<div className={className} onClick={this.focus}>
						<Editor
							blockStyleFn={getBlockStyle}
							customStyleMap={styleMap}
							editorState={content}
							handleKeyCommand={this.handleKeyCommand}
							keyBindingFn={this.mapKeyToEditorCommand}
							onChange={setContent}
							placeholder="Tell a story..."
							plugins={plugins}
							readOnly={readOnly}
							ref={(element) => {
								this.editor = element
							}}
						/>
					</div>
					{!readOnly && (
						<Toolbar className="flex">
							{(externalProps) => (
								<div className="inline-block md:flex px-1 items-center">
									<BoldButton {...externalProps} />
									<ItalicButton {...externalProps} />
									<UnderlineButton {...externalProps} />
									<CodeButton {...externalProps} />
									<Separator {...externalProps} />
									<HeadlineOneButton {...externalProps} />
									<HeadlineTwoButton {...externalProps} />
									<HeadlineThreeButton {...externalProps} />
									<UnorderedListButton {...externalProps} />
									<OrderedListButton {...externalProps} />
									<BlockquoteButton {...externalProps} />
									<CodeBlockButton {...externalProps} />
									<ImageButton onChange={this.onAddLocalImage} />
									<CardButton onClick={showCardModal} />
								</div>
							)}
						</Toolbar>
					)}
				</div>
			</div>
		)
	}
}

const ImageButton = ({ onChange }) => {
	return (
		<div className="styleButton px-3 py-1 relative overflow-hidden cursor-pointer">
			Image
			<input
				className="cursor-pointer w-full opacity-0 absolute inset-0"
				type="file"
				accept="image/*"
				onChange={onChange}
			/>
		</div>
	)
}

const CardButton = ({ onClick }) => {
	return (
		<button className="inline styleButton pr-3" onClick={onClick}>
			Card
		</button>
	)
}

const styleMap = {
	CODE: {
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
		fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
		fontSize: 16,
		padding: 2,
	},
}

const getBlockStyle = (block) => {
	switch (block.getType()) {
		case 'blockquote':
			return 'RichEditor-blockquote'
		case 'header-one':
			return 'text-3xl font-bold my-6'
		case 'header-two':
			return 'text-2xl font-semibold my-5'
		case 'header-three':
			return 'text-xl font-semibold my-4'
		case 'unstyled':
			return 'mb-4'
		case 'code-block':
			return 'bg-gray-900 my-4'
		case 'atomic':
			return 'my-4'
		default:
			return null
	}
}

export default TextEditor
