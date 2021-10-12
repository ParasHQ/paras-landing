import { event } from './gtag'

export const trackBuyTokenSeries = (label) => {
	event({
		action: 'purchase_series_redirect',
		category: 'token_detail',
		label: label,
	})
}

export const trackBuyTokenSeriesImpression = (label) => {
	event({
		action: 'purchase_series_impression',
		category: 'token_detail',
		label: label,
	})
}

export const trackBuyToken = (label) => {
	event({
		action: 'purchase_nft_redirect',
		category: 'token_detail',
		label: label,
	})
}

export const trackBuyTokenImpression = (label) => {
	event({
		action: 'purchase_nft_impression',
		category: 'token_detail',
		label: label,
	})
}

export const trackTransferToken = (label) => {
	event({
		action: 'transfer_nft_redirect',
		category: 'token_detail',
		label: label,
	})
}

export const trackUpdateListingTokenSeries = (label) => {
	event({
		action: 'update_listing_series_redirect',
		category: 'token_detail',
		label: label,
	})
}

export const trackRemoveListingTokenSeries = (label) => {
	event({
		action: 'remove_listing_series_redirect',
		category: 'token_detail',
		label: label,
	})
}

export const trackUpdateListingToken = (label) => {
	event({
		action: 'update_listing_nft_redirect',
		category: 'token_detail',
		label: label,
	})
}

export const trackRemoveListingToken = (label) => {
	event({
		action: 'remove_listing_nft_redirect',
		category: 'token_detail',
		label: label,
	})
}

export const trackMintToken = (label) => {
	event({
		action: 'mint_nft_redirect',
		category: 'token_detail',
		label: label,
	})
}

export const trackStorageDeposit = () => {
	event({
		action: 'storage_deposit_redirect',
		category: 'token_detail',
	})
}

export const trackBurnToken = (label) => {
	event({
		action: 'burn_nft_redirect',
		category: 'token_detail',
		label: label,
	})
}

export const trackBurnTokenSeries = (label) => {
	event({
		action: 'burn_series_redirect',
		category: 'token_detail',
		label: label,
	})
}
