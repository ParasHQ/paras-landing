import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import axios from 'axios'
import * as React from 'react'
import MockAdapter from 'axios-mock-adapter'
import TokenBuyModal from 'components/Modal/TokenBuyModal'
import { IntlProvider } from 'react-intl'
import { onBuyToken } from '__mocks__/callFunctionMock'
import { fetchTokenTest } from '__mocks__/serviceMock'
import esTranslations from '__mocks__/locale/en.json'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'

const tokens = {
	contract_id: 'x.paras.near',
	token_series_id: '230098',
	token_id: '230098:1',
	ft_token_id: 'near',
	price: parseNearAmount('5.7'),
	has_price: true,
}

describe('TokenBuyModal Testing', () => {
	let mock

	beforeAll(async () => {
		mock = new MockAdapter(axios)
		window.gtag = function () {}
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
				expect(resultMock).toMatchSnapshot()
				expect(resultAPI).toMatchSnapshot()
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

	describe('callFunction => method: buy', () => {
		test('should have any price', async () => {
			mock.onGet(`${process.env.V2_API_URL}/token`).reply(200, tokens)
			const tokenMock = mock.handlers.get[0]

			expect(tokenMock[4].has_price).toBeTruthy()
			expect(tokenMock[4].has_price).toMatchSnapshot()
		})

		test('should appear buy button', async () => {
			const token = await fetchTokenTest()
			render(
				<IntlProvider locale="en" messages={esTranslations}>
					<TokenBuyModal data={token.result} show />
				</IntlProvider>
			)

			const buyBtn = fireEvent.click(screen.getByRole('button', { name: 'Buy' }))

			expect(buyBtn).toBeTruthy()
			expect(buyBtn).toMatchSnapshot()
		})

		test('should user balance greater than token price', async () => {
			const token = await fetchTokenTest()
			render(
				<IntlProvider locale="en" messages={esTranslations}>
					<TokenBuyModal data={token.result} show />
				</IntlProvider>
			)

			const userBalance = parseNearAmount('9.7')
			const handleOnBuyToken = jest.fn((tokenPrice) => {
				if (parseFloat(formatNearAmount(tokenPrice)) >= parseFloat(formatNearAmount(userBalance))) {
					return `You don't have enough balance`
				}
				return 'redirect to near wallet'
			})

			expect(handleOnBuyToken(token.price)).toBe('redirect to near wallet')
			expect(handleOnBuyToken(token.price)).toMatchSnapshot()
		})

		test('should return arguments and method the same like data API', async () => {
			mock.onGet(`${process.env.V2_API_URL}/token`).reply(200, tokens)

			mock.restore()

			const tokenMock = mock.handlers.get[0][4]
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

			expect(callFunctionMock()).toMatchObject(callFunction)
			expect(callFunctionMock).toMatchSnapshot()
		})
	})
})
