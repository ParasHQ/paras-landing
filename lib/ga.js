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

export const trackNFTLendingClick = (label) => {
	event({
		action: 'click_NFT_Lending',
		category: 'NFT-lending',
		label: label,
	})
}

export const trackTokenDetailPage = (label) => {
	event({
		action: 'view_card_detail_page',
		category: 'token_detail_page',
		additionalParams: {
			token: label,
		},
	})
}

export const trackTokenSeriesDetailPage = (label) => {
	event({
		action: 'view_card_detail_page',
		category: 'token_series_detail_page',
		additionalParams: {
			token: label,
		},
	})
}

export const trackClickBuyButton = (label) => {
	event({
		action: 'card_detail_page_action',
		category: 'click_buy_button',
		additionalParams: {
			token: label,
		},
	})
}

export const trackClickPlaceOffer = (label) => {
	event({
		action: 'card_detail_page_action',
		category: 'click_place_offer',
		additionalParams: {
			token: label,
		},
	})
}

export const trackClickOwners = (label) => {
	event({
		action: 'card_detail_page_action',
		category: 'click_owners',
		additionalParams: {
			token: label,
		},
	})
}

export const trackClickAttributes = (label, type, value) => {
	event({
		action: 'card_detail_page_action',
		category: 'click_attributes',
		additionalParams: {
			attribute_type: type,
			attribute_value: value,
			token: label,
		},
	})
}

export const trackClickInfo = (label, type, value) => {
	event({
		action: 'card_detail_page_action',
		category: 'click_info',
		additionalParams: {
			info_type: type,
			info_value: value,
			token: label,
		},
	})
}

export const trackClickOffers = (label) => {
	event({
		action: 'card_detail_page_action',
		category: 'click_offers',
		additionalParams: {
			token: label,
		},
	})
}

export const trackClickMoreCollection = (label) => {
	event({
		action: 'card_detail_page_action',
		category: 'click_more_collection',
		additionalParams: {
			token: label,
		},
	})
}

export const trackOpenDescription = (label) => {
	event({
		action: 'card_detail_page_dropdown',
		category: 'open_description',
		additionalParams: {
			token: label,
		},
	})
}

export const trackCloseDescription = (label) => {
	event({
		action: 'card_detail_page_dropdown',
		category: 'close_description',
		additionalParams: {
			token: label,
		},
	})
}

export const trackOpenPriceHistory = (label) => {
	event({
		action: 'card_detail_page_dropdown',
		category: 'open_price_history',
		additionalParams: {
			token: label,
		},
	})
}

export const trackClosePriceHistory = (label) => {
	event({
		action: 'card_detail_page_dropdown',
		category: 'close_price_history',
		additionalParams: {
			token: label,
		},
	})
}

export const trackViewLPLoyalty = () => {
	event({
		action: 'view_LP',
		category: 'loyalty',
	})
}

export const trackClickTopButtonLockedStaking = () => {
	event({
		action: 'LP_click_LSbutton1',
		category: 'loyalty',
	})
}

export const trackClickBottomButtonLockedStaking = () => {
	event({
		action: 'LP_click_LSbutton2',
		category: 'loyalty',
	})
}

export const trackClickHowToLoyalty = () => {
	event({
		action: 'LP_click_howtoLS_page',
		category: 'loyalty',
	})
}

export const trackClickTCLoyalty = () => {
	event({
		action: 'LP_click_TC',
		category: 'loyalty',
	})
}
