import React from 'react'

import Faq from './Faq'
import { useIntl } from 'hooks/useIntl'

// this data could come from anywhere

const FaqsList = () => {
	const { localeLn } = useIntl()
	const faqsData = [
		{
			question: localeLn('What is Paras?'),
			answer: localeLn(
				'Paras is a digital art card marketplace built on blockchain technology that offers true ownership and digital scarcity. Paras use <a href="https://near.org" target="_blank">NEAR cryptocurrency</a> as the medium of exchange between creators and collectors to support cross border transactions.'
			),
		},
		{
			question: localeLn('What is blockchain?'),
			answer: localeLn(
				'Blockchain is technology that allows everyone to truly own their data and digital assets. The data stored on blockchain is transparent and untempered which makes the ownership of certain assets provable and verifiable by everyone.'
			),
		},
		{
			question: localeLn('What is cryptocurrency & digital asset?'),
			answer: localeLn(
				'Both cryptocurrency & digital assets use blockchain technology to handle the ownership and their transactions. Cryptocurrency enables cross border settlement between multiple parties that are accessible by everyone. Digital assets such as artwork that are stored in blockchain can easily be transferred globally without any barrier.'
			),
		},
		{
			question: localeLn('How do I start collecting digital cards?'),
			answer: localeLn(
				'You need NEAR account & some NEAR coin to start collecting the digital cards. You can start exploring the marketplace and find the card collectibles that you like and see if it is still available for sale. You can buy the digital card from other collectors or straight from the creators. When you bought one, that card will truly be yours and you can hold it, sell it or trade it in the future.'
			),
		},
		{
			question: localeLn('Where can I get some NEAR?'),
			answer: localeLn(
				'You can get NEAR from some crypto-exchange such as <a href="https://binance.com" target="_blank">Binance</a>. When you got some NEAR from exchange, you can transfer it to your <a target="_blank" href="https://wallet.near.org">NEAR wallet</a> and you are good to go.'
			),
		},
		{
			question: localeLn('How do I become a Paras Artist?'),
			answer: localeLn(
				'You can start by applying as an artist <a target="_blank" href="https://forms.gle/QsZHqa2MKXpjckj98">here</a>. Our team will review your submission and we’ll tell you the result via email.'
			),
		},
		{
			question: localeLn('How do I make a digital art card?'),
			answer: localeLn(
				'A digital art card on Paras follows the format of real world trading cards which are in portrait with ratio 64 : 89. The maximum file size is 16MB. Currently Paras only support image format such as png, jpg, jpeg, gifs, etc. Videos are not supported.'
			),
		},
	]
	return (
		<div>
			{faqsData.map((faq, i) => (
				<Faq key={'faq_' + i} question={faq.question} answer={faq.answer} />
			))}
		</div>
	)
}

export default FaqsList
