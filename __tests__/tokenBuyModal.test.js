import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { IconArrow } from 'components/Icons'

describe('Token Buy Modal Testing', () => {
	it('Buy Button', () => {
		//test render component
		render(<IconArrow />)
		screen.debug()
	})
})
