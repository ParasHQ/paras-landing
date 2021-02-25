import React, { useRef } from 'react'
import Editor from '@draft-js-plugins/editor'
import { RichUtils, getDefaultKeyBinding } from 'draft-js'
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

import {
	imagePlugin,
	InlineToolbar,
	linkPlugin,
	plugins,
	Toolbar,
} from './TextEditorPlugin'
import { compressImg, readFileAsUrl } from '../utils/common'
import { useToast } from '../hooks/useToast'

import 'draft-js/dist/Draft.css'

const TextEditor = ({
	content,
	readOnly = false,
	title,
	hideTitle = false,
	setTitle = () => {},
	showCardModal,
	setContent = () => {},
}) => {
	const toast = useToast()
	const editor = useRef(null)

	let className = 'RichEditor-editor text-lg'
	var contentState = content.getCurrentContent()
	if (!contentState.hasText()) {
		if (contentState.getBlockMap().first().getType() !== 'unstyled') {
			className += ' RichEditor-hidePlaceholder'
		}
	}

	const onAddLocalImage = async (e) => {
		let imgUrl
		if (e.target.files[0]) {
			if (e.target.files[0].size > 3 * 1024 * 1024) {
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							Maximum file size 3MB
						</div>
					),
					type: 'error',
					duration: null,
				})
				return
			}
			const compressedImg =
				e.target.files[0].type === 'image/gif'
					? e.target.files[0]
					: await compressImg(e.target.files[0])
			imgUrl = await readFileAsUrl(compressedImg)
		}
		setContent(imagePlugin.addImage(content, imgUrl))
	}

	const handleKeyCommand = (command, editorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command)
		if (newState) {
			setContent(newState)
			return true
		}
		return false
	}

	const mapKeyToEditorCommand = (e) => {
		if (e.keyCode === 9) {
			const newEditorState = RichUtils.onTab(e, content, 4)
			if (newEditorState !== content) {
				setContent(newEditorState)
			}
			return
		}
		return getDefaultKeyBinding(e)
	}

	return (
		<div>
			{!hideTitle && (
				<div className="titlePublication text-4xl font-bold pb-0 text-white">
					<Editor
						editorKey={'title'}
						placeholder="Title"
						editorState={title}
						onChange={setTitle}
						handleReturn={() => 'handled'}
						readOnly={readOnly}
					/>
				</div>
			)}
			<div className="RichEditor-root text-white">
				<div className={className} onClick={editor.focus}>
					<Editor
						editorKey={'content'}
						blockStyleFn={getBlockStyle}
						customStyleMap={styleMap}
						editorState={content}
						handleKeyCommand={handleKeyCommand}
						keyBindingFn={mapKeyToEditorCommand}
						onChange={setContent}
						placeholder="Tell a story..."
						plugins={plugins}
						readOnly={readOnly}
						ref={editor}
					/>
					<InlineToolbar>
						{(externalProps) => (
							<div className="inline-block md:flex items-center">
								<BoldButton {...externalProps} />
								<ItalicButton {...externalProps} />
								<UnderlineButton {...externalProps} />
								<linkPlugin.LinkButton {...externalProps} />
							</div>
						)}
					</InlineToolbar>
				</div>
				{!readOnly && (
					<Toolbar className="flex">
						{(externalProps) => (
							<div className="inline-block md:flex px-1 items-center">
								<BoldButton {...externalProps} />
								<ItalicButton {...externalProps} />
								<UnderlineButton {...externalProps} />
								<CodeButton {...externalProps} />
								<HeadlineOneButton {...externalProps} />
								<HeadlineTwoButton {...externalProps} />
								<HeadlineThreeButton {...externalProps} />
								<UnorderedListButton {...externalProps} />
								<OrderedListButton {...externalProps} />
								<BlockquoteButton {...externalProps} />
								<CodeBlockButton {...externalProps} />
								<linkPlugin.LinkButton
									{...externalProps}
									onOverrideContent={() => {}}
								/>
								<ImageButton {...externalProps} onChange={onAddLocalImage} />
								<CardButton {...externalProps} onClick={showCardModal} />
							</div>
						)}
					</Toolbar>
				)}
			</div>
		</div>
	)
}

const ImageButton = ({ theme, onChange }) => {
	return (
		<div
			className={`${theme.customButton} ${theme.button} relative overflow-hidden cursor-pointer px-2`}
		>
			Image
			<input
				className="cursor-pointer w-full opacity-0 absolute inset-0"
				type="file"
				accept="image/*"
				onChange={onChange}
				onClick={(e) => {
					e.target.value = null
				}}
			/>
		</div>
	)
}

const CardButton = ({ theme, onClick }) => {
	return (
		<button
			className={`${theme.customButton} ${theme.button} px-2`}
			onClick={onClick}
		>
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
			return 'bg-gray-900'
		case 'atomic':
			return 'my-4'
		default:
			return null
	}
}

export default TextEditor
