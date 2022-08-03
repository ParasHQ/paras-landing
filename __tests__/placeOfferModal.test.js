import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import TokenBuyModal from 'components/Modal/TokenBuyModal'
import { IntlProvider } from 'react-intl'
import { onPlaceBid } from '__mocks__/callFunctionMock'
import { fetchTokenTest } from '__mocks__/serviceMock'
import esTranslations from '__mocks__/locale/en.json'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import PlaceOfferModal from 'components/Modal/PlaceOfferModal'

const tokens = {
	contract_id: 'x.paras.near',
	token_series_id: '230098',
	token_id: '230098:1',
	ft_token_id: 'near',
	price: parseNearAmount('5.7'),
	has_price: true,
}

const valueOffer = 0.1

describe('PlaceOfferModal Testing', () => {
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

	describe('callFunction => method: add_offer', () => {
		test('should input offer greater than 0.0', async () => {
			const token = await fetchTokenTest()
			render(
				<IntlProvider locale="en" messages={esTranslations}>
					<PlaceOfferModal data={token.result} show />
				</IntlProvider>
			)

			const inputOffer = screen.getByPlaceholderText('Place your Offer')
			fireEvent.change(inputOffer, { target: { value: 0.0 } })

			expect(valueOffer).toBeGreaterThan(Number(inputOffer.value))
			expect(inputOffer.value).toMatchSnapshot()
		})

		test('should appear input offer', async () => {
			const token = await fetchTokenTest()
			render(
				<IntlProvider locale="en" messages={esTranslations}>
					<PlaceOfferModal data={token.result} show />
				</IntlProvider>
			)

			const inputOffer = fireEvent.click(screen.getByRole('spinbutton'))

			expect(inputOffer).toBeTruthy()
			expect(inputOffer).toMatchSnapshot()
		})

		test('should return arguments and method the same like data API', async () => {
			mock.onGet(`${process.env.V2_API_URL}/token`).reply(200, tokens)

			mock.restore()

			const tokenMock = mock.handlers.get[0][4]
			const token = await fetchTokenTest()
			const callFunction = await onPlaceBid(valueOffer)

			const callFunctionMock = jest.fn()
			callFunctionMock.mockReturnValueOnce({
				receiverId: process.env.MARKETPLACE_CONTRACT_ID,
				methodName: 'add_offer',
				args: {
					nft_contract_id: tokenMock.contract_id,
					token_id: tokenMock.token_id,
					ft_token_id: tokenMock.ft_token_id,
					price: valueOffer,
				},
				deposit: valueOffer,
				gas: `100000000000000`,
			})

			render(
				<IntlProvider locale="en" messages={esTranslations}>
					<TokenBuyModal data={token.result} show />
				</IntlProvider>
			)

			expect(callFunctionMock()).toMatchObject(callFunction)
			expect(callFunctionMock).toMatchSnapshot()
		})
	})
})
