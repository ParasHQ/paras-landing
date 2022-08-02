import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import TokenBuyModal from 'components/Modal/TokenBuyModal'
import { IntlProvider } from 'react-intl'
import { onBuyToken } from '__mocks__/callFunctionMock'
import { fetchTokenTest } from '__mocks__/serviceMock'
import esTranslations from '__mocks__/locale/en.json'
import { parseNearAmount } from 'near-api-js/lib/utils/format'

const tokens = {
	contract_id: 'v0.apemetaerror.near',
	token_id: '103',
	ft_token_id: 'near',
	price: parseNearAmount('777'),
}

describe('TokenBuyModal Testing', () => {
	let mock

	beforeAll(async () => {
		mock = new MockAdapter(axios)

		window.gtag = function () {} // if using gtag
		window.ga = function () {}
	})

	afterEach(() => {
		mock.reset()
	})

	describe('API Gateway', () => {
		describe('When API call is successful', () => {
			test('should return contract_id && token_id', async () => {
				// given
				mock.onGet(`${process.env.V2_API_URL}/token`).reply(200, tokens)

				mock.restore()

				// // when
				const resultMock = mock.handlers.get[0]
				const resultAPI = await fetchTokenTest()

				// then
				expect(resultMock[0]).toEqual(resultAPI.url)
				expect(resultMock[4].contract_id).toEqual(resultAPI.contract_id)
				expect(resultMock[4].token_id).toEqual(resultAPI.token_id)
			})
		})

		describe('When API call fails', () => {
			test('should return empty data', async () => {
				mock.onGet(`${process.env.V2_API_URL}/token`).networkErrorOnce()

				const resultMock = mock.handlers.get[0]
				const resultAPI = await fetchTokenTest()

				expect(resultMock[0]).toEqual(resultAPI.url)
				expect(resultMock[4] === undefined && []).toEqual([])
			})
		})
	})

	describe('callFunction => method: Buy', () => {
		test('should appear TokenBuyModal if have any price', async () => {
			const token = await fetchTokenTest()
			expect(token.has_price).toBeTruthy()
		})

		test('should return arguments and method the same like data API', async () => {
			mock.onGet(`${process.env.V2_API_URL}/token`).reply(200, tokens)

			mock.restore()

			const tokenMock = mock.handlers.get[0][4]
			const token = await fetchTokenTest()
			const callFunction = await onBuyToken()

			const callFunctionMock = jest.fn()
			callFunctionMock.mockReturnValueOnce({
				contractId: 'marketplace.paras.near',
				methodName: `buy`,
				args: {
					token_id: tokenMock.token_id,
					nft_contract_id: tokenMock.contract_id,
					ft_token_id: tokenMock.ft_token_id,
					price: tokenMock.price,
				},
				gas: `150000000000000`,
				deposit: tokenMock.price,
			})

			render(
				<IntlProvider locale="en" messages={esTranslations}>
					<TokenBuyModal data={token.result} show />
				</IntlProvider>
			)
			screen.debug()
			fireEvent.click(screen.getByRole('button', { name: 'Buy' }))

			expect(callFunctionMock()).toEqual(callFunction)
		})

		test('Test with Rewire', () => {})
	})
})
