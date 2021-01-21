import Head from 'next/head'

import Nav from '../components/Nav'
import Footer from '../components/Footer'
import TextEditor from '../components/TextEditor'
import Modal from '../components/Modal'
import ProfileEdit from '../components/ProfileEdit'

const Publication = () => {
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
            <div className="my-16 mx-auto max-w-4xl">
                {/* <Modal
                    // close={(_) => setShowEditAccountModal(false)}
                    closeOnBgClick={false}
                    closeOnEscape={false}
                >
                    <div className="w-full max-w-sm p-4 m-auto bg-dark-primary-2 rounded-md overflow-hidden">
                        <ProfileEdit close={(_) => setShowEditAccountModal(false)} />
                    </div>
                </Modal> */}
                <TextEditor />
            </div>
            {/* <Footer /> */}
        </div>
    )
}

export default Publication
