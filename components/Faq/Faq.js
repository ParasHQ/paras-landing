import React, { useState } from 'react'

const Faq = (props) => {
	const { question, answer } = props
	const [isOpen, toggleOpen] = useState(false)

	return (
		<div
			className="faq mt-4 p-2 cursor-pointer border-dashed border-2 border-gray-900 hover:border-gray-600 rounded-md"
			onClick={() => toggleOpen(!isOpen)}
		>
			<div className="font-medium text-lg">
				<p>Q: {question}</p>
			</div>

			<div className="mt-2" style={isOpen ? { display: 'block' } : { display: 'none' }}>
				<span>A: </span>
				<span dangerouslySetInnerHTML={{ __html: answer }}></span>
			</div>
		</div>
	)
}

export default Faq
