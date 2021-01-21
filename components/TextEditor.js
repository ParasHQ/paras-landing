import React from 'react'
import Editor from '@draft-js-plugins/editor'
import { EditorState, RichUtils, getDefaultKeyBinding, convertFromRaw, convertToRaw } from 'draft-js'

import createToolbarPlugin, { Separator, composeDecorators } from '@draft-js-plugins/static-toolbar'
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
import { readFileAsUrl } from '../utils/common'


const toolbarPlugin = createToolbarPlugin({ theme: { buttonStyles, toolbarStyles } })
const imagePlugin = createImagePlugin()

const { Toolbar } = toolbarPlugin
const plugins = [toolbarPlugin, imagePlugin]

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
        this.state = {
            editorState: EditorState.createWithContent(emptyContentState),
            readOnly: false
        }
        this.focus = () => this.editor.focus()
    }

    onChange = (editorState) => {
        console.log("currentcontent", convertToRaw(editorState.getCurrentContent()))
        this.setState({ editorState })
    }

    onChangeReadOnly = () => {
        this.setState(prevState => ({ readOnly: !prevState.readOnly }))
    }

    onAddImage = (e) => {
        e.preventDefault()
        const editorState = this.state.editorState
        const urlValue = window.prompt("Paste Image Link")

        this.onChange(imagePlugin.addImage(editorState, urlValue))
    };

    onAddLocalImage = async (e) => {
        const editorState = this.state.editorState
        const imgUrl = await readFileAsUrl(e.target.files[0])

        this.onChange(imagePlugin.addImage(editorState, imgUrl))
    }

    handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            this.onChange(newState)
            return true
        }
        return false
    }

    mapKeyToEditorCommand = (e) => {
        if (e.keyCode === 9 /* TAB */) {
            const newEditorState = RichUtils.onTab(
                e,
                this.state.editorState,
                4, /* maxDepth */
            )
            if (newEditorState !== this.state.editorState) {
                this.onChange(newEditorState)
            }
            return
        }
        return getDefaultKeyBinding(e)
    }

    toggleBlockType = (blockType) => {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        )
    }

    toggleInlineStyle = (inlineStyle) => {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        )
    }

    render() {
        const { editorState } = this.state

        let className = 'RichEditor-editor text-lg'
        var contentState = editorState.getCurrentContent()
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
                    autocomplete="off"
                    // value={website}
                    // onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Title"
                />
                <div className="RichEditor-root text-white p-4">
                    <div className={className} onClick={this.focus}>
                        <Editor
                            blockStyleFn={getBlockStyle}
                            customStyleMap={styleMap}
                            editorState={editorState}
                            handleKeyCommand={this.handleKeyCommand}
                            keyBindingFn={this.mapKeyToEditorCommand}
                            onChange={this.onChange}
                            placeholder="Tell a story..."
                            plugins={plugins}
                            readOnly={this.state.readOnly}
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
                                    <button className="inline styleButton pr-3" onClick={this.onAddImage}>
                                        <i
                                            className="material-icons"
                                            style={{
                                                fontSize: "16px",
                                                textAlign: "center",
                                                padding: "0px",
                                                margin: "0px"
                                            }}
                                        >
                                            image
                                        </i>
                                    </button>
                                    {/* <input
                                        // className="cursor-pointer w-full absolute inset-0"
                                        type="file"
                                        accept="image/*"
                                        onChange={this.onAddLocalImage}
                                    /> */}
                                </div>
                            )
                        }
                    </Toolbar>
                </div>
                {/* <div className="text-lg text-black" onClick={this.onChangeReadOnly}>ReadOnly</div> */}
                <div>
                    <button
                        className="font-semibold m-4 py-3 w-32 rounded-md bg-primary text-white"
                        onClick={() => { }}
                    >
                        Continue
                    </button>
                </div>
            </div>
        )
    }
}

const emptyContentState = convertFromRaw({
    entityMap: {},
    blocks: [
        {
            text: '',
            key: 'foo',
            type: 'unstyled',
            entityRanges: [],
        },
    ],
})

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