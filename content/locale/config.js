export const config = ({
	common,
	home,
	market,
	publication,
	drops,
	id,
	activity,
	login,
	categorySubmission,
	event,
	token,
	verify,
	faq,
	p404,
	license,
	languages,
	myBids,
	news,
	search,
	newCollection,
	deleteCollection,
	collection,
	categories,
	artistVerification,
}) => {
	return {
		defaultAll: {
			...common,
			...home,
			...market,
			...p404,
		},
		'/': {
			...common,
			...home,
		},
		'/[id]': {
			...common,
			...id,
		},
		'/[id]/publication': {
			...common,
			...id,
		},
		'/[id]/creation': {
			...common,
			...id,
		},
		'/[id]/collection': {
			...common,
			...id,
		},
		'/[id]/collection/[collectionName]': {
			...common,
			...id,
		},
		'/activity': {
			...common,
			...activity,
		},
		'/activity/[id]': {
			...common,
			...activity,
		},
		'/activity/top-buyers': {
			...common,
			...activity,
		},
		'/activity/top-cards': {
			...common,
			...activity,
		},
		'/activity/top-sellers': {
			...common,
			...activity,
		},
		'/activity/top-collections': {
			...common,
			...activity,
		},
		'/category-submission/[categoryId]': {
			...common,
			...categorySubmission,
		},
		'/event/[id]': {
			...common,
			...event,
		},
		'/drops': {
			...common,
			...drops,
		},
		'/market': {
			...common,
			...market,
		},
		'/market/all-category': {
			...common,
			...market,
		},
		'/market/[categoryId]': {
			...common,
			...market,
		},
		'/publication': {
			...common,
			...publication,
		},
		'/publication/edit/[pubId]': {
			...common,
			...publication,
		},
		'/publication/create': {
			...common,
			...publication,
		},
		'/publication/[type]': {
			...common,
			...publication,
		},
		'/publication/[type]/[slug]': {
			...common,
			...publication,
		},
		'/token/[id]': {
			...common,
			...token,
		},
		'/verify/email/[id]': {
			...common,
			...verify,
		},
		'/login': {
			...common,
			...login,
		},
		'/languages': {
			...common,
			...languages,
		},
		'/404': {
			...common,
			...p404,
		},
		'/faq': {
			...common,
			...faq,
		},
		'/license': {
			...common,
			...license,
		},
		'/my-bids': {
			...common,
			...myBids,
		},
		'/new': {
			...common,
			...news,
			...newCollection,
		},
		'/new-collection': {
			...common,
			...newCollection,
		},
		'/search': {
			...common,
			...search,
		},
		'/collection/[collection_id]': {
			...common,
			...collection,
			...deleteCollection,
		},
		'/categories': {
			...common,
			...categories,
		},
		'/artist-verification': {
			...common,
			...artistVerification,
		},
	}
}
