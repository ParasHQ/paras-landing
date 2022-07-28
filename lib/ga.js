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

export const trackOfferToken = (label) => {
	event({
		action: 'offer_nft_redirect',
		category: 'offer_detail',
		label: label,
	})
}

export const trackOfferTokenImpression = (label) => {
	event({
		action: 'offer_nft_impression',
		category: 'offer_detail',
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

export const trackFeatureBannerOfficial = (label) => {
	event({
		action: 'featured_big',
		category: 'home_banner',
		label: label,
	})
}

export const trackFeatureBannerCommunity = (label) => {
	event({
		action: 'featured_small',
		category: 'home_banner',
		label: label,
	})
}

export const trackCollectionList = (label) => {
	event({
		action: 'banner_collection_list',
		category: 'home_banner',
		label: label,
	})
}

export const trackTopCollection = (label) => {
	event({
		action: 'top_collections',
		category: 'top_user_list',
		label: label,
	})
}

export const trackTopBuyer = (label) => {
	event({
		action: 'top_buyers',
		category: 'top_user_list',
		label: label,
	})
}

export const trackTopSeller = (label) => {
	event({
		action: 'top_sellers',
		category: 'top_user_list',
		label: label,
	})
}

export const trackLikeToken = (label, source) => {
	event({
		action: 'like_token',
		category: 'token',
		label: label,
		additionalParams: {
			source,
			token: label,
		},
	})
}

export const trackUnlikeToken = (label, source) => {
	event({
		action: 'unlike_token',
		category: 'token',
		label: label,
		additionalParams: {
			source,
			token: label,
		},
	})
}

export const trackFlipCard = (label) => {
	event({
		action: 'flip_card',
		category: 'card',
		label: label,
	})
}

export const trackTransakButton = (label) => {
	event({
		action: 'transak_button',
		category: 'transak',
		label: label,
	})
}

export const trackFollowButton = (label) => {
	event({
		action: 'click_follow',
		category: 'follow-profile',
		label: label,
	})
}

export const trackUnfollowButton = (label) => {
	event({
		action: 'click_unfollow',
		category: 'follow-profile',
		label: label,
	})
}

export const trackFollowingClick = (action, label) => {
	event({
		action,
		category: 'following-page',
		label,
	})
}
