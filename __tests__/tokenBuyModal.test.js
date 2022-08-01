import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import TokenBuyModal from 'components/Modal/TokenBuyModal'

describe('Token Buy Modal Testing', () => {
	it('Buy Button', () => {
		//test render component
		render(<TokenBuyModal />)
		screen.debug()
	})
})
