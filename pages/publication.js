import Head from 'next/head'
import { useState } from 'react'
import Axios from 'axios'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'

import Nav from '../components/Nav'
import Footer from '../components/Footer'
import TextEditor from '../components/TextEditor'
import Modal from '../components/Modal'
import Card from '../components/Card'
import { parseImgUrl } from '../utils/common'
import { useToast } from '../hooks/useToast'

const Publication = () => {
    const toast = useToast()

    const [title, setTitle] = useState("")
    const [content, setContent] = useState(defaultValueContent)
    const [showModal, setShowModal] = useState(null)
    const [searchToken, setSearchToken] = useState("")

    const [embeddedCards, setEmbeddedCards] = useState([])

    const getDataFromTokenId = async () => {
        if (embeddedCards.some((card) => card.tokenId === searchToken)) {
            toast.show({
                text: (
                    <div className="font-semibold text-center text-sm">
                        You have embedded this card
                    </div>
                ),
                type: 'error',
                duration: 1500,
            })
            setSearchToken(null)
            return
        }

        const res = await Axios(`${process.env.API_URL}/tokens?tokenId=${searchToken}`)
        const token = (await res.data.data.results[0]) || null

        if (token) {
            setEmbeddedCards([...embeddedCards, token])
            setShowModal(null)
            setSearchToken(null)
        } else {
            toast.show({
                text: (
                    <div className="font-semibold text-center text-sm">
                        Please enter correct token id
                    </div>
                ),
                type: 'error',
                duration: 2500,
            })
        }
    }

    return (
        <div
            className="min-h-screen bg-dark-primary-1"
            style={{
                backgroundImage: `linear-gradient(to bottom, #000000 0%, rgba(0, 0, 0, 0.69) 69%, rgba(0, 0, 0, 0) 100%)`,
            }}
        >
            <Head>
                <title>Publication — Paras</title>
                <meta
                    name="description"
                    content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
                />
                <meta name="twitter:title" content="Paras — Digital Art Cards Market" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@ParasHQ" />
                <meta name="twitter:url" content="https://paras.id" />
                <meta
                    name="twitter:description"
                    content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
                />
                <meta
                    name="twitter:image"
                    content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
                />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Paras — Digital Art Cards Market" />
                <meta
                    property="og:site_name"
                    content="Paras — Digital Art Cards Market"
                />
                <meta
                    property="og:description"
                    content="Create, Trade and Collect. All-in-one social digital art cards marketplace for creators and collectors."
                />
                <meta property="og:url" content="https://paras.id" />
                <meta
                    property="og:image"
                    content="https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-v2-twitter-card-large.png"
                />
                <meta charSet="utf-8" />
            </Head>
            <Nav />
            <div className="y-16 mx-auto max-w-4xl">
                {showModal === "card" && (
                    <Modal
                        close={() => setShowModal(null)}
                        closeOnBgClick={true}
                        closeOnEscape={true}
                    >
                        <div className="w-full max-w-md p-4 m-auto bg-dark-primary-2 rounded-md overflow-hidden">
                            <div className="m-auto">
                                <label className="mb-4 block text-white text-2xl font-bold">Add card to your publication</label>
                                <input
                                    type="text"
                                    name="Token"
                                    onChange={(e) => setSearchToken(e.target.value)}
                                    value={searchToken}
                                    className={`resize-none h-auto focus:border-gray-100 mb-4`}
                                    placeholder="Token ID"
                                />
                                <p className="text-gray-300 text-sm italic">TokenID is your card id. You can find your TokenID at https://paras.id/token/[TokenID]</p>
                                <button
                                    className="font-semibold mt-4 py-3 w-full rounded-md bg-primary text-white"
                                    onClick={getDataFromTokenId}
                                >
                                    Add Card
                             </button>
                            </div>
                        </div>
                    </Modal>
                )}
                {showModal === "final" && (
                    <Modal
                        close={() => setShowModal(null)}
                        closeOnBgClick={true}
                        closeOnEscape={true}
                    >
                        <div className="max-w-xl p-4 m-auto bg-dark-primary-2 rounded-md overflow-hidden">
                            <h1 className="mb-2 block text-white text-xl font-semibold">Thumbnail</h1>
                            <div className="bg-black h-64 mb-4"></div>
                            <h1 className="mb-2 block text-white text-xl font-semibold">Details</h1>
                            <input
                                type="text"
                                name="Token"
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                                className={`resize-none h-auto focus:border-gray-100 mb-4`}
                                placeholder="Preview Title"
                            />
                            <textarea
                                type="text"
                                name="Token"
                                onChange={(e) => setSearchToken(e.target.value)}
                                value={searchToken}
                                className={`resize-none h-auto focus:border-gray-100 mb-4`}
                                placeholder="Preview SubTitle"
                            />
                            <button
                                className="font-semibold mt-4 py-3 w-40 rounded-md bg-primary text-white"
                                onClick={getDataFromTokenId}
                            >
                                Publish Now
                            </button>
                        </div>
                    </Modal>
                )}
                <TextEditor
                    content={content}
                    setContent={(content) => {
                        console.log("currentcontent", convertToRaw(content.getCurrentContent()))
                        setContent(content)
                    }}
                    title={title}
                    setTitle={setTitle}
                    onPressAddCard={getDataFromTokenId}
                    showCardModal={() => setShowModal("card")}
                />
                {
                    embeddedCards.length !== 0 && (
                        <div className="border-2 border-dashed border-gray-800 p-4 rounded-md my-4 pd-4">
                            <h1 className="p-4 pb-0 block text-white text-2xl font-bold">Embedded Card</h1>
                            <div className="inline-block">
                                {embeddedCards.map(card => (
                                    <CardPublication
                                        key={card.tokenId}
                                        localToken={card}
                                        deleteCard={() => {
                                            const temp = embeddedCards.filter(x => x.tokenId != card.tokenId)
                                            setEmbeddedCards(temp)
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                }
                <div>
                    <button
                        className="font-semibold m-4 py-3 w-32 rounded-md bg-primary text-white"
                        onClick={() => setShowModal("final")}
                    >
                        Continue
                    </button>
                </div>
            </div>
            {/* <Footer /> */}
        </div >
    )
}

const defaultValueContent = EditorState.createWithContent(convertFromRaw({
    entityMap: {},
    blocks: [
        {
            text: '',
            key: 'foo',
            type: 'unstyled',
            entityRanges: [],
        },
    ],
}))

const CardPublication = ({ localToken, deleteCard }) => {
    return (
        <div className="inline-block p-4 rounded-md max-w-sm">
            <div className="w-40 mx-auto">
                <Card
                    imgUrl={parseImgUrl(localToken?.metadata?.image)}
                    imgBlur={localToken?.metadata?.blurhash}
                    token={{
                        name: localToken?.metadata?.name,
                        collection: localToken?.metadata?.collection,
                        description: localToken?.metadata?.description,
                        creatorId: localToken?.creatorId,
                        supply: localToken?.supply,
                        tokenId: localToken?.tokenId,
                        createdAt: localToken?.createdAt,
                    }}
                    initialRotate={{
                        x: 15,
                        y: 15,
                    }}
                    disableFlip={true}
                />
            </div>
            <div className="text-gray-100 pt-4">
                <div className>
                    <a
                        title={localToken?.metadata?.name}
                        className="text-2xl font-bold border-b-2 border-transparent"
                    >
                        {localToken?.metadata?.name}
                    </a>
                </div>
                <p className="opacity-75 truncate">
                    {localToken?.metadata?.collection}
                </p>
            </div>
            <div className="text-red-600 text-sm cursor-pointer" onClick={deleteCard}>
                Delete
            </div>
        </div>
    )
}

export default Publication
