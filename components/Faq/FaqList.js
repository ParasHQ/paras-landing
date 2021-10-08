import React from 'react'

import Faq from './Faq'
import { useIntl } from 'hooks/useIntl'

// this data could come from anywhere

const FaqsList = () => {
	const { localeLn } = useIntl()
	const faqsData = [
		{
			question: localeLn('What_Is_Paras'),
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
			question: localeLn('What_Is_Cryptocurrency'),
			answer: localeLn(
				'Both_Cryptocurrency_Digital'
			),
		},
		{
			question: localeLn('How_Do_Start_Collecting'),
			answer: localeLn(
				'You_Need_NEAR_Account'
			),
		},
		{
			question: localeLn('Where_Can_Get_NEAR'),
			answer: localeLn(
				'Can_Get_NEAR_From'
			),
		},
		{
			question: localeLn('How_Do_Become_Artist'),
			answer: localeLn(
				'Can_Start_Applying'
			),
		},
		{
			question: localeLn('How_Do_Make_Card'),
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
