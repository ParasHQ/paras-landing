import { useIntl as useReactIntl } from 'react-intl'

export function useIntl() {
	const { formatMessage } = useReactIntl()
	const localeLn = (id, value) => formatMessage({ id }, value)

	return { localeLn }
}
