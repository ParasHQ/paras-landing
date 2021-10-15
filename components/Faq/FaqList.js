import React from 'react'

import Faq from './Faq'
import { useIntl } from 'hooks/useIntl'

// this data could come from anywhere

const FaqsList = () => {
	const { localeLn } = useIntl()
	const faqsData = [
		{
			question: localeLn('WhatIsParas'),
			answer: localeLn(
				'Digital_Card_Marketplace'
			),
		},
		{
			question: localeLn('What is blockchain?'),
			answer: localeLn(
				'Blockchain_Is_Technology'
			),
		},
		{
			question: localeLn('WhatIsCryptocurrency'),
			answer: localeLn(
				'Both_Cryptocurrency_Digital'
			),
		},
		{
			question: localeLn('HowDoStartCollecting'),
			answer: localeLn(
				'You_Need_NEAR_Account'
			),
		},
		{
			question: localeLn('WhereCanGetNEAR'),
			answer: localeLn(
				'Can_Get_NEAR_From'
			),
		},
		{
			question: localeLn('HowDoBecomeArtist'),
			answer: localeLn(
				'Can_Start_Applying'
			),
		},
		{
			question: localeLn('HowDoMakeCard'),
			answer: localeLn(
				'A_Digital_Card_On_Paras'
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
