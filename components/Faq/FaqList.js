import React from 'react'

import Faq from './Faq'
import { useIntl } from 'hooks/useIntl'

// this data could come from anywhere

const FaqsList = () => {
	const { localeLn } = useIntl()
	const faqsData = [
		{
			question: localeLn('WhatIsParas'),
			answer: localeLn('DigitalCardMarketplace'),
		},
		{
			question: localeLn('What is blockchain?'),
			answer: localeLn('BlockchainIsTechnology'),
		},
		{
			question: localeLn('WhatIsCryptocurrency'),
			answer: localeLn('BothCryptocurrencyDigital'),
		},
		{
			question: localeLn('HowDoStartCollecting'),
			answer: localeLn('YouNeedNEARAccount'),
		},
		{
			question: localeLn('WhereCanGetNEAR'),
			answer: localeLn('CanGetNEARFrom'),
		},
		{
			question: localeLn('HowDoBecomeArtist'),
			answer: localeLn('CanStartApplying'),
		},
		{
			question: localeLn('HowDoMakeCard'),
			answer: localeLn('ADigitalCardOnParas'),
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
