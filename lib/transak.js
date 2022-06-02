import transakSDK from '@transak/transak-sdk'
import getConfigTransak from 'config/transak'

class Transak {
	constructor(env) {
		const configSetting =
			env !== 'production' ? getConfigTransak('staging') : getConfigTransak('production')
		this.apiKey = configSetting.apiKey
		this.environment = configSetting.environment
		this.widgetWidth = configSetting.widgetWidth
		this.widgetHeight = configSetting.widgetHeight
		this.themeColor = configSetting.themeColor
		this.defaultCryptoCurrency = configSetting.defaultCryptoCurrency
	}

	init() {
		const configSetting = {
			apiKey: this.apiKey,
			environment: this.environment,
			widgetWidth: this.widgetWidth,
			widgetHeight: this.widgetHeight,
			themeColor: this.themeColor,
			defaultCryptoCurrency: this.defaultCryptoCurrency,
		}
		this.transakInstance = new transakSDK(configSetting)
		this.transakInstance.init()
		this.transakInstance.on(this.transakInstance.ALL_EVENTS, (data) => {})
	}

	async onWidgetClose() {
		this.transakInstance.on(this.transakInstance.EVENTS.TRANSAK_WIDGET_CLOSE, (eventData) => {
			this.transakInstance.close()
		})
	}
}

const transak = new Transak(process.env.APP_ENV)

export default transak
