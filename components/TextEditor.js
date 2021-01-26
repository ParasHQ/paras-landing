import React from 'react'
import Editor from '@draft-js-plugins/editor'
import { RichUtils, getDefaultKeyBinding, convertToRaw } from 'draft-js'

import createToolbarPlugin, { Separator } from '@draft-js-plugins/static-toolbar'
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

import 'draft-js/dist/Draft.css'
import toolbarStyles from '../styles/toolbar.module.css'
import buttonStyles from '../styles/button.module.css'
import { parseImgUrl, readFileAsUrl } from '../utils/common'


const toolbarPlugin = createToolbarPlugin({ theme: { buttonStyles, toolbarStyles } })
const imagePlugin = createImagePlugin()

const { Toolbar } = toolbarPlugin
const plugins = [toolbarPlugin]

class HeadlinesPicker extends React.Component {
    componentDidMount() {
        setTimeout(() => {
            window.addEventListener('click', this.onWindowClick)
        })
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.onWindowClick)
    }

    onWindowClick = () =>
        this.props.onOverrideContent(undefined);

    render() {
        const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton]
        return (
            <div className="flex">
                {buttons.map((Button, i) => (
                    <Button key={i} {...this.props} />
                ))}
            </div>
        )
    }
}

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
                4, /* maxDepth */
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
            RichUtils.toggleBlockType(
                this.props.content,
                blockType
            )
        )
    }

    toggleInlineStyle = (inlineStyle) => {
        this.props.setContent(
            RichUtils.toggleInlineStyle(
                this.props.content,
                inlineStyle
            )
        )
    }

    render() {
        const { content } = this.props

        let className = 'RichEditor-editor text-lg'
        var contentState = content.getCurrentContent()
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder'
            }
        }

        return (
            <div>
                <input
                    type="text"
                    name="website"
                    className="titlePublication text-4xl font-bold p-4 pb-0"
                    autoComplete="off"
                    value={this.props.title}
                    onChange={(e) => this.props.setTitle(e.target.value)}
                    placeholder="Title"
                />
                <div className="RichEditor-root text-white p-4">
                    <div className={className} onClick={this.focus}>
                        <Editor
                            blockStyleFn={getBlockStyle}
                            blockRendererFn={imageBlockRenderer}
                            customStyleMap={styleMap}
                            editorState={content}
                            handleKeyCommand={this.handleKeyCommand}
                            keyBindingFn={this.mapKeyToEditorCommand}
                            onChange={this.props.setContent}
                            placeholder="Tell a story..."
                            plugins={plugins}
                            ref={(element) => {
                                this.editor = element
                            }}
                        />
                    </div>
                    <Toolbar className="flex">
                        {
                            (externalProps) => (
                                <div className="inline-block md:flex px-1 items-center">
                                    <BoldButton {...externalProps} />
                                    <ItalicButton {...externalProps} />
                                    <UnderlineButton {...externalProps} />
                                    <CodeButton {...externalProps} />
                                    <Separator {...externalProps} />
                                    <HeadlinesPicker {...externalProps} />
                                    <UnorderedListButton {...externalProps} />
                                    <OrderedListButton {...externalProps} />
                                    <BlockquoteButton {...externalProps} />
                                    <CodeBlockButton {...externalProps} />
                                    <div className="styleButton px-3 py-1 relative overflow-hidden cursor-pointer">
                                        Image
                                        <input
                                            className="cursor-pointer w-full opacity-0 absolute inset-0"
                                            type="file"
                                            accept="image/*"
                                            onChange={this.onAddLocalImage}
                                        />
                                    </div>
                                    <button className="inline styleButton pr-3" onClick={this.props.showCardModal}>
                                        Card
                                    </button>
                                </div>
                            )
                        }
                    </Toolbar>
                </div>
            </div>
        )
    }
}

const imageBlockRenderer = (block) => {
    if (block.getType() === 'atomic') {
        return {
            component: Image,
            editable: false,
        }
    }
    return null
}

const Image = (props) => {
    const entity = props.contentState.getEntity(
        props.block.getEntityAt(0)
    )
    const { src } = entity.getData()

    return <img src={parseImgUrl(src)} className="w-full" />
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
        case 'blockquote': return 'RichEditor-blockquote'
        case 'header-one': return 'text-3xl font-semibold my-5'
        case 'header-two': return 'text-2xl font-semibold my-4'
        case 'header-three': return 'text-xl font-semibold my-3'
        case 'header-four': return 'text-lg font-medium my-2'
        case 'header-five': return 'text-lg font-normal my-1'
        case 'code-block': return 'bg-gray-900'
        default: return null
    }
}

export default TextEditor