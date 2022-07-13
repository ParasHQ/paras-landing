const nav = {
	Drops: 'Поступления',
	Market: 'Магазин',
	Publication: 'Публикации',
	Activity: 'Деятельность',
	Stats: 'Статистика',
	Login: 'Войти',
	Home: 'Домашняя',
	Whitepaper: 'Белая Книга',
	SearchByTitle: 'Искать по заголовку, коллекции или художнику',
	VisitOurDiscord: 'Посетить наш канал в Discord чтоб узнать больше:',
	CurrentlyWeOnly: 'Currently we only allow verified creator to create publication.',
	NavJoinDiscord: 'Присоединиться к Paras Discord',
	NavViewWallet: 'Показать в кошельке NEAR',
	NavSwitchAccount: 'Сменить аккаунт',
	NavAddAccount: 'Добавить аккаунт',
	NavCreateCard: 'Создать Карточку',
	NavLogOut: 'Выйти',
	NavSettings: 'Настройки',
	NavMyProfile: 'Мой Профиль',
	NavMyBids: 'Мои ставки',
	NavCreatePublication: 'Создать Публикацию',
	NavCreateCollection: 'Создать Публикацию',
	Languages: 'Языки',
}
const footer = {
	Market: 'Магазин',
	Activity: 'Деятельность',
	License: 'Лицензия',
	FAQ: 'FAQ',
	Twitter: 'Twitter',
	Instagram: 'Instagram',
	Telegram: 'Telegram',
	Discord: 'Discord',
	ApplyAsArtist: 'Зарегестрироваться как Художник',
	FooterBeta: 'Этот проект находится на стадии публичной бета-версии.',
	Paras2022: '2022 Paras',
	PoweredBy: 'Запущен',
	UseOwnRisk: `Смарт контракт от Paras' до сих пор не защищён известной компанией по защите данных. Используйте на свой страх и риск!`,
}
const home = {
	HomeTitle: 'Paras — Магазин Цифрового Искусства',
	LastSold: 'Последние Продажи',
	Featured: 'Рекомендации',
	Latest: 'Последнее',
	TopCollections: 'Топовые Коллекции',
	LiveAuction: 'Живой аукцион',
	TopBuyers: 'Топовые Покупатели',
	TopSellers: 'Топовые Продавцы',
	NewestCards: 'Самые новые Карточки',
	HowWorks: 'Как это работает',
	ForCollectors: 'Для Колллекционеров',
	DiscoverBeautifulCards:
		'Исследуйте удивительные диджитал арт карточки и коллекционируйте их используя технологию блокчейн, которая предотвращает подделку и обеспечивает доказанное право собственности.',
	ExploreParas: 'Исследовать Paras',
	ForArtists: 'Для Художников',
	CreateDigitalCards: `Создавайте цифровое искусство и продавайте его в магазине всего за несколько кликов. Начните зарабатывать с помощью диджитал творчества.`,
	ApplyAsArtist: `Зарегестрироваться как Художник`,
}
const market = {
	MarketParas: 'Магазин — Paras',
	All: 'Всё',
	Filter: 'Фильтр',
	SortBy: 'Сортировать по',
	CategoryParas: 'Категории — Paras',
	OnlyAllowWhitelisted:
		'На данный момент только подтверждённые Художники могут создавать Карточки на Paras.',
	ApplyUsingLink: 'Зарегестрироваться сейчас используя ссылку ниже:',
	ApplyAsArtist: 'Зарегестрироваться как Художник',
	Status: 'Статус',
	Open: 'Открыть',
	SubmitExistingCards: 'Отправить существующие карточки',
	CreateNewCard: 'Создать новую карточку',
	Curators: 'Кураторы',
	PleaseEnterTokenID: 'Пожалуйста, введите корректный ID токена',
	NotCreatorOfCard: 'Вы не являетесь создателем данной карточки',
	ThankForsubmission: 'Благодарим за предоставление материалов.',
	SubmitSucceed: 'Подача карточки прошла успешно.',
	SubmitCardTo: 'Подать карточку',
	CuratorsCardSubmission:
		'*Кураторы рассмотрят предоставленные вами карты, пожалуйста, убедитесь, что карта относится к данной категории.',
	OnlyCreatorAllowedSubmit: '*Только создатель, которому разрешено предоставлять свою карту',
	YouWillAdd: 'Вы добавите',
	To: 'в',
}
const CardInfo = {
	Create: 'Создать',
	CreatingCard: 'Создание Карточки',
	Upload: 'Загрузить',
	PutOnMarketplace: 'Поместить в Магазин',
	CreateNewCollection: 'Создать Новую Коллекцию',
	UploadingImageMeta: 'Загрузка изображения и мета данных',
	Confirmation: 'Подтверждение',
	ConfirmTransactionOnNear: 'Подтвердите транзакцию на кошельке Near',
	SmallTransactionFee: 'Небольшая комиссия за транзакцию взимается в размере',
	OpenEdition: 'Открытое Издание',
	NumberOfCopies: 'Количество копий',
	Name: 'Имя',
	CardCreation: 'Создание Карточки',
	WillSubmitCardTo: 'Вы отправите карточку',
	ConfirmCardCreation: 'Подтвердить создание карточки',
	NoCards: 'Карточки отсутствуют',
	StartFrom: 'Начать с',
	SALE: 'Распродажа',
	SeeDetails: 'Просмотреть Детали',
	Back: 'Назад',
	Next: 'Далее',
	Submit: 'Подтвердить',
	PutOnSaleFor: 'Поместить в продажу за',
	RemoveFromSale: 'Снять с продажи',
	'Bought{quantity}PcsFrom': 'куплено {кол-во}шт. у',
	'CreateSupply{quantity}Pcs': 'создать с запасом в {кол-во}шт.',
	'Burned{quantity}Pcs': 'сожжено {кол-во}шт.',
	PlacedOfferFor: 'размещенное предложение для',
	'Transfer{quantity}PcsTo': 'перевести {кол-во}шт.',
	Owns: 'обладает',
	OnSale: 'В продаже',
	OnAuction: 'На аукционе',
	Update: 'Обновить',
	Buy: 'Купить',
	NotForSale: 'Не для продажи',
	NoTransactions: 'Транзакции отсутствуют',
	InsufficientBalance: 'Недостаточно средств на балансе',
	Available: 'Доступно',
	BurnSuccess: 'Сожжение прошло удачно',
	SomethingWentWrong: 'Что-то пошло не так, повторите попытку позже',
	ListingUpdateSuccess: 'Обновление Списка прошло удачно',
	PlaceABid: 'Сделать ставку',
	UpdateListing: 'Обновить Список',
	Transfer: 'Перевести',
	ShareTo: 'Поделиться...',
	TransferCard: 'Перевести Карточку',
	BurnCard: 'Сжечь Карточку',
	Twitter: 'Twitter',
	Facebook: 'Facebook',
	CardListing: 'Список Карточек',
	SetQuantityTo: 'Установить количество продаж',
	OnlyWantRemoveFrom: `Только если вы хотите убрать эту карточку из списка`,
	SalePrice: 'Цена Продажи',
	Receive: 'Получить',
	Royalty: 'Роялти',
	Views: 'взгляды',
	Fee: 'Комиссия',
	LockedFee: `заблокированная плата`,
	Cancel: 'Отменить',
	RemoveListing: 'Очистить Список',
	CollectDigitalCard:
		'Коллекционируйте цифровое искусство, которым вы действительно можете обладать.',
	GoToLogin: 'Войти',
	ConfirmBuy: 'Подтверждено',
	ConfirmBid: 'Подтвердить аукционную ставку',
	Warning: 'Предупреждение',
	AreYouSureBuy: 'Вы уверены, что купите эту карту?',
	AreYouSureAcceptTrade: 'Вы уверены, что принимаете эту сделку?',
	IUnderstand: 'я понимаю',
	BuyQuantityAvailable: 'Количество покупок (Доступно для покупки',
	YouWillRedirectedTo: 'YВы будете перенаправлены на веб кошелёк NEAR для подтверждения транзакции',
	ConfirmTransfer: 'Подтвердить Перевод',
	ConfirmBurn: 'Подтвердить Сожжение',
	SortBy: 'Сортировать по',
	NameAZ: 'Имени A-Z',
	NameZA: 'Имени Z-A',
	PriceLowHigh: 'Цене от дешёвых к дорогим',
	PriceHighLow: 'Цене от дорогих к дешёвым',
	ImageLink: 'Ссылка на Изображение',
	SmartContract: 'Смарт Контракт',
	TokenID: 'ID Токена',
	TokenInfo: 'Информация о Токене',
	Supply: 'Предложение',
	Created: 'Создано',
	FeaturedIn: 'Рекомендации',
	Description: 'Описание',
	View: 'Вид',
	Collection: 'Коллекция',
	Collectibles: 'Коллекционные издания',
	Publication: 'Публикации',
	History: 'История',
	Bids: 'Ставки',
	Owners: 'Владельцы',
	TransferSuccess: 'Перевод прошёл удачно',
	AddressAccountID: 'Адрес (ID Аккаунта)',
	QuantityAvailableForBurn: 'Количество (Доступное для Сожжения',
	Info: 'Информация',
	by: '',
	Ok: 'ОК',
	Burn: 'Сожжение',
	CardS: 'карточка(и)',
	SaleQuantity: 'Количество продаж',
	EditImage: 'Редактировать Изображение',
	YouWillBeBurning: 'Вы сожжёте',
	NotAllowedToList: 'На данный момент вы не можете перечислять эту карточку',
	NotAllowedToBuy:
		'Вы не можете купить эту карточку сейчас. Только подтверждённые аккаунты могут сделать это',
	AboutToAcceptBid: 'Вы собираетесь принять ставку в',
	From: 'от',
	RoyaltyForArtist: 'Роялти для Художника',
	ServiceFee: 'Комиссия Сервиса',
	YouWillGet: 'Вы получите',
	MakeSureNotOnSale:
		'Пожалуйста, убедитесь в том, что ваша карточка не находится в продаже, чтоб принять ставку',
	SuccessfullyAcceptedBid: 'Вы успешно приняли ставку от',
	BidHasDeleted: 'Ваша ставка была удалена',
	AreSureDeleteBids: 'Вы уверены что хотите удалить ваши ставки?',
	Bid: 'Ставка',
	NoBiddingYet: 'Ставок нет',
	Artist: 'Художник',
	Year: 'Год',
	EditionOf: 'В количестве',
	AboutToBid: 'Вы собираетесь сделать ставку',
	AddNFTToTrade: 'Добавьте NFT для торговли',
	AboutToBidAuction: 'Вы собираетесь участвовать в аукционе',
	Quantity: 'Количество',
	AmountIn: 'Сумма в',
	TotalBidAmount: 'Итоговая сумма ставок',
	Redirecting: 'Переадресация...',
	SubmitBid: 'Принять Ставку',
	Attributes: 'Характеристики',
	ReportTitle: 'Создать отчёт о данной позиции',
	ReportReason: 'Причина',
	ReportDetail: 'Дополнительные детали',
	ReportDetailPlaceholder: 'Пожалуйста предоставьте дополнительную информацию',
	ReportButton: 'Создать отчёт',
	ReportButtonLoading: 'Создание отчёта...',
	ReportToastSuccess: 'Вы создали отчёт по данной позиции.',
}
const publication = {
	PublicationParas: 'Публикация — Paras',
	Publication: 'Публикация',
	EnhancingVisualsStories: 'Улучшение визуального восприятия с помощью историй',
	All: 'Всё',
	Editorial: 'Редакция',
	Community: 'Сообщество',
	MaximumSize3MB: 'Максимальный размер файла 3MB',
	AddCardToPublication: 'Добавить карточку в вашу публикацию',
	AddCollectionToPublication: 'Добавьте карточку в свою публикацию',
	TokenIDIsCardId:
		'ID токена это адрес вашей карточки. Вы можете найти ID вашего токена здесь: https://paras.id/token/[TokenID]',
	AddCard: 'Добавить Карточку',
	AddCollection: 'Добавить коллекцию',
	Thumbnail: 'Миниатюра',
	UpdateThumbnail3MB: 'Обновить Миниатюру (Max. 3MB)',
	Title: 'Заголовок',
	SureToLeavepage:
		'Вы уверены, что хотите покинуть страницу? Все несохранённые данные будут утеряны',
	CardCollectibles: 'Коллекции Карточек',
	Collections: 'Коллекции',
	Continue: 'Продолжить',
	Delete: 'Удалить',
	CardNotMentioned: 'Карточка не указана в публикации',
}
const profile = {
	Creation: 'Создание',
	EnterValidWebsite: 'Пожалуйста. укажите действующий веб-сайт',
	EditProfile: 'Редактировать Профиль',
	Bio: 'Био',
	Website: 'Вебсайт',
	Setting: 'Настройка',
	AddEmail: 'Добавить Электронную почту',
	NotificationPreferences: 'Параметры Уведомлений',
	Newsletters: 'Рассылки',
	FirstNotifiedFor: 'Получайте первыми уведомления о последних новостях на Paras',
	NFTDrops: 'NFT Поступления',
	SavingLoading: 'Сохранение...',
	Save: 'Сохранить',
	GetNotifiedForTransaction: 'Получайте уведомления о вашей сделке на Paras',
	Notification: 'Уведомление',
	GetFirstNotifiedFor: 'Полчайте уведомления первым о самых свежих поступлениях!',
	MaximumSize3MB: 'Максимальный размер файла 3MB',
	Image: 'Изображение',
	Card: 'Карточка',
	Video: 'Видео',
	EmbeddVideo: 'Встроенное видео',
	EnterLinkYoutube: 'Пожалуйста введите ссылку на видео с Youtube',
	AddVideo: 'Добавить Видео',
}
const modal = {
	CollectNFTTrulyOwn: 'Коллекционируйте NFT которые будут действительно вам пренадлежать.',
	WillBeRedirectedTo: 'Вы будете перенаправлены на кошелёк NEAR',
	GoToLogin: 'Логин',
	BurnAsset: 'Сжечь Актив',
	AreAboutToBurn: 'Вы собираетесь сжечь',
	RedirectedToconfirm: 'Вы будете перенаправлены на кошелёк для подтверждения транзакции.',
	AreAboutToPurchase: 'Вы собираетесь приобрести',
	AreAboutToBid: 'Вы собираетесь сделать ставку',
	Total: 'Всего',
	GetForFree: 'Получить Бесплатно',
	AreAboutToReduce: 'Вы собираетесь сократить копии',
	CannotReduceMore: 'Невозможно сократить количество копий на число меньшее, чем текущее',
	AvailableCopies: 'Доступные Копии',
	DecreaseCopies: 'Сократить количество Копий',
	Reduce: 'Сократить',
	DecreaseCopiesBy: 'Сократить количество копий на',
	StorageFee: 'Комиссия за Хранение',
	ConfirmMint: 'Подтвердить Изготовление',
	AreAboutToMint: 'Вы собираетесь изготовить',
	MintToMyself: 'Изготовить для себя',
	NoTokensOwned: 'Отсутствуют купленные Токены',
	Edition: 'Издание',
	SeriesListing: 'Список Серий',
	NewPrice: 'Новая Цена',
	CurrentPrice: 'Актуальная цена',
	DepositStorage: 'Депозитное Хранение',
	ToDepositSmallAmount:
		'Прежде чем вы сможете вывести этот актив на рынок, вам необходимо внести небольшую сумму NEAR',
	Deposit: 'Депозит',
	AreAboutToSend: 'Вы собираетесь отправить',
	MintedBy: 'изготовлено',
	DynamicTxFee:
		'If you make the transaction before {date} you will be charged {fee}% transaction fee.',
}
const tab = {
	BoughtFrom: 'куплено у',
	minted: 'изготовлено',
	burned: 'сожжено',
	TransferredTo: 'переведено',
	SeriesCreatedBy: 'Серии созданные',
	CreatorNotForSale: 'Создатель выставил серию не для продажи',
	CreatorOnSale: 'Создатель выставил серию на продажу за',
	CreatorNonMintable: 'Создатель отправил эту серию в неизготовляемые',
	CreatorDecreaseCopiesTo: 'Создатель уменьшает копии серии до',
	Owner: 'Владелец',
	Copies: 'Копии',
	NoOwnersBecome: 'Владельцы отсутствую, станьте первым!',
	Burned: 'Сожжено',
}
const token = {
	SERIES: 'Серии',
	CheckOwners: 'Просмотреть Владельцев',
	Mint: 'Изготовить',
	UpdatePrice: 'Обновить Цену',
	CreateAuction: 'Создать аукцион',
	'BuyFor{price}On': 'Купить за {price} во  вторичном Магазине',
	SeeTokenSeries: 'Просмотреть серии токенов',
	Notifications: 'Уведомления',
	NoNotifications: 'Уведомления отсутствуют',
	StartingBid: 'Начальная ставка',
	DescStartingBid: 'Установите начальную цену предложения.',
	MultipleBid: 'Множественная ставка',
	DescMultipleBid: 'Установить кратность цены предложения.',
	ReserveBid: 'Резервная ставка',
	DescReserveBid: 'Создайте скрытый лимит, установив резервную цену.',
	ExpirationDate: 'Срок годности',
	DescExpirationDate:
		'Ваш аукцион автоматически завершится в это время, и победит тот, кто предложит самую высокую цену.',
}
const common = {
	OK: 'OK',
	LoadingLoading: 'Загрузка...',
	for: 'для',
	Loading: 'Загрузка',
	More: 'Больше',
	Reject: 'Отклонить',
	Accept: 'Принять',
	Filter: 'Сортировать',
	FilterBy: 'Сортировать по',
	CopiesOfCard: 'Копии карты',
	Price: 'Цене',
	Apply: 'Принять',
	Comics: 'Комиксы',
	ViewProfile: 'Показать Профиль',
	Logout: 'Выход',
	Partner: 'Партнёры',
	ShareNow: 'Поделиться сейчас',
	Chapter: 'Глава',
	ReadNow: 'Читать сейчас',
	FlaggedByPARASStealing:
		'ПРЕДУПРЕЖДЕНИЕ: Этот автор был помечен PARAS из-за кражи произведений искусства.',
	FlaggedByPARASFake: 'ПРЕДУПРЕЖДЕНИЕ: Эта учетная запись использует чужую личность',
	FlaggedByPARASHacked:
		'ПРЕДУПРЕЖДЕНИЕ: Учетная запись была взломана. Пожалуйста, свяжитесь с первоначальным создателем',
	UseOwnRisk:
		"Смарт контракт от Paras' до сих пор не защищён известной компанией по защите данных. Используйте на свой страх и риск!",
	...token,
	...tab,
	...modal,
	...nav,
	...footer,
	...CardInfo,
	...profile,
}
const drops = {
	// none
}
const id = {
	NoPublications: 'Публикации отсутствуют',
	ShowAll: 'Показать Всё',
	OwnedCards: 'Купленные Карточки',
}
const login = {
	LoginParas: 'Вход — Paras',
	CreateAndCollect: 'Создавайте и Коллекционируйте',
	StartJourneyCards: 'Начните своё путешествие с цифровым искусством на блокчейн',
	LoginWithNEAR: 'Войти с помощью NEAR',
	CreateFreeNEARAccount: 'Создать бесплатный аккаунт NEAR с помощью Metamask',
}
const activity = {
	Detail: 'Детали',
	Supply: 'Спрос',
	FirstSale: 'Первая Продажа',
	LastSale: 'Последняя Продажа',
	AvgSale: 'Средн. Продажа',
	TotalSales: 'Всего Продаж',
	TotalVolume: 'Всего в Объёме',
	TopSellers: 'Топовые Продавцы',
	SeeTopBuyers: 'Просмотреть топовых покупателей',
	CardStatistics: 'Статистика по Карточкам',
	Here: 'здесь',
	TopBuyers: 'Топовые Покупатели',
	In7Days: 'за 7 дней',
	SeeTopSellers: 'просмотреть топовых продавцов',
	ActivityParas: 'Деятельность — Paras',
	TopUsers: 'Топовые Пользователи',
	NoTransactions: 'Транзакции отсутствуют',
	PutOnSaleFor: 'Поместить в продажу за',
	RemovedFromSale: 'Удалено с продажи',
	CreatedBy: 'создано',
	'SupplyOf{quantity}pcs': 'со спросом в {кол-во}шт.',
	'Burned{quantity}pcsBy': 'сожжено {кол-во}шт.',
	PlacedOffer: 'размещённое предложение',
}
const categorySubmission = {
	DontHavePermission: 'У вас нет разрешения',
	CategorySubmission: 'Предоставленные категории',
	NoCardSubmission: 'Предоставленных карточек не найдено',
	'To{categoryId}Category': 'в {categoryId} категорию',
	'From{categoryId}Category': 'из {categoryId} категории',
	RejectTheCard: 'Отклонить карточку',
	GoingToReject: 'Вы собираетесь отклонить',
}
const event = {
	//none
}

const verify = {
	HomeTitle: 'Paras — Магазин Цифрового Искусства',
	EmailIsVerified: 'Ваша электронная почта подтвеждена',
	VerificationError: 'Проблемы с верификацией',
	LinkVerificationExpired: 'Срок проверки вашей ссылки истек',
	BackToMarket: 'Назад в магазин',
}
const faq = {
	FrequentlyQuestionsParas: 'Часто задаваемые вопросы — Paras',
	FrequentlyQuestions: 'Часто задаваемые вопросы',
	WhatIsParas: 'Что такое Paras?',
	DigitalCardMarketplace:
		'Paras это магазин цифрового искусства созданный на базе технологии блокчейн которая предлагает истинное право собственности и цифровую редкость. Paras использует <a href="https://near.org" target="_blank">NEAR cryptocurrency</a> как средство обмена между создателями и коллекционерами для поддержки сделок вне границ.',
	WhatIsBlockchain: 'Что такое блокчейн?',
	BlockchainIsTechnology:
		'Блокчейн - это технология, которая позволяет каждому по-настоящему владеть своими данными и цифровыми активами. Данные, хранящиеся в блокчейне, прозрачны, что делает владение определенными активами доказуемым и проверяемыми для кого угодно.',
	WhatIsCryptocurrency: 'Что такое криптовалюта и цифровой актив?',
	BothCryptocurrencyDigital:
		'И криптовалюта, и цифровые активы используют технологию блокчейн для управления правами собственности и транзакциями. Криптовалюта позволяет осуществлять расчеты без границ между несколькими сторонами, доступные каждому. Цифровые активы, такие как произведения искусства, которые хранятся в блокчейне, могут быть легко переданы по всему миру без каких-либо барьеров.',
	YouNeedNEARAccount:
		'Вам нужен аккаунт NEAR и немного монет NEAR чтоб начать коллекционировать цифровое искусство. Вы можете исследовать рынок и находить коллекции себе по вкусу, если они доступны к покупке. Вы можете покупать карточки у других коллекционеров или напрямую у создателей. Когда вы покупаете карточку, она действительно становится вашей. В дальнейшем вы можете оставить её себе, продать её или открыть торги.',
	HowDoStartCollecting: 'Как мне начать коллекционировать карточки?',
	WhereCanGetNEAR: 'Где мне получить немного монеток NEAR?',
	CanGetNEARFrom:
		'Вы можете получить монеты NEAR в крипто обменнике, например: <a href="https://binance.com" target="_blank">Binance</a>. Когда у вас появятся монетки для обмена, вы сможете перевести их в свой <a target="_blank" href="https://wallet.near.org">NEAR wallet</a> и распоряжаться ими на своё усмотрение.',
	HowDoBecomeArtist: 'как мне стать Художником на Paras?',
	CanStartApplying:
		'Вы можете начать регистрацию как художник здесь: <a target="_blank" href="https://forms.gle/QsZHqa2MKXpjckj98">here</a>. Наша команда рассмотрит вашу заявку и пришлёт письмо с ответом на вашу электронную почту',
	HowDoMakeCard: 'Как мне создать карточку?',
	ADigitalCardOnParas:
		'Карточки на Paras существуют в концепции формата реального обмена карточками которые находятся в портретной ориентации с соотношением сторон 64 : 89. Максимальный размер файла - 16MB. На данный момент Paras поддерживает форматы png, jpg, jpeg, gifs, etc. Видео формат не поддерживается.',
}
const p404 = {
	NotFoundParas: 'Не найдено — Paras',
	PageNotFound: 'СТРАНИЦА НЕ НАЙДЕНА',
	BackToMarket: 'Назад в Магазин',
}
const license = {
	LicenseParas: 'License — Paras',
	NFTLicense: 'NFT License',
	Overview: 'Overview',
	LicenseHelpsDefine: `The NFT License helps define the rights of both owners or collectors
  of the non-fungible tokens (NFTs) as well as artists working with
  NFTs. The NFT License is designed to balance two concerns:`,
	LicenseProtectingCreators: 'Protecting the hard work and ingenuity of creators',
	LicenseGrantingOwners:
		'Granting owners or collectors the freedom and flexibility to fully enjoy their non-fungible tokens',
	LicenseAnyNFT: 'Any NFT project can use this license.',
	LicenseContentIsYours: 'The Content is Yours',
	LicenseArtistsOwnRights: `Artists own all the rights to the content they create and post on Paras.
  Of course, if the content wasn’t yours to begin with, putting it on
  Paras doesn’t make it yours. Don’t submit content you don’t hold the
  copyright for (unless you have permission).`,
	LicenseArtistsAreResponsible: `Artists are responsible for the content they post. This means all risks
  related to its publication and display, including someone else’s
  reliance on its accuracy and any claims relating to intellectual
  property or other legal rights.`,
	LicenseWhatAmI: 'What am I allowed to do with the art associated with my NFT?',
	LicenseYouBroadRights: `You have broad rights to use the art associated with your NFT. In the
  case of a Digital Art Card (DAC), you can do any of the following:`,
	LicenseUseDAC: 'Use the DAC for your own personal, non-commercial use;',
	LicenseUseDACWhen: `Use the DAC when you’re on a marketplace that allows the purchase and
  sale of your card, so long as the marketplace cryptographically
  verifies that you are the owner;`,
	LicenseUseDACOn: `Use the DAC when you’re on a third-party website or app that allows
  the inclusion, involvement, or participation of your card so long as
  the website/app cryptographically verifies that you are the owner, and
  the DAC doesn’t stay on the website/app after you’ve left; and`,

	LicenseArtAssociated: 'What am I NOT allowed to do with the art associated with my NFT?',
	LicenseAreNotAppropriate:
		'There are a few things that aren’t appropriate uses for your NFT art. They include:',
	LicenseModifyingArt: 'Modifying the art;',
	LicenseUsingForCommercialize:
		'Using the art for commercialize purpose without asking from the creator/artist permission',
	LicenseSellThirdParty: 'Using the art to market or sell third-party products;',
	LicenseImagesHatred:
		'Using the art in connection with images of hatred, violence, or other inappropriate behavior; or',
	LicenseTryingTrademark:
		'Trying to trademark your art, or otherwise acquire intellectual property rights in it.',
	Version10: 'Version 1.0',
	LicenseDefinitions: '1. Definitions.',
	LicenseArtMeans:
		'“Art” means any art, design, and drawings that may be associated with an NFT that you Own.',
	LicenseNFTMeans: `"NFT" means any blockchain-tracked, non-fungible token.`,
	LicenseConcerningAnNFT: `“Own” means, concerning an NFT, an NFT that you have purchased or
  otherwise rightfully acquired from a legitimate source, where proof of
  such purchase is recorded on the relevant blockchain. “Purchased NFT”
  means an NFT that you Own. “Third Party IP” means any third party patent
  rights (including, without limitation, patent applications and
  disclosures), copyrights, trade secrets, trademarks, know-how, or any
  other intellectual property rights recognized in any country or
  jurisdiction in the world.`,
	LicensePurchasedNFT: `“Purchased NFT” means an NFT that you Own. “Third Party IP” means any
  third party patent rights (including, without limitation, patent
  applications and disclosures), copyrights, trade secrets, trademarks,
  know-how, or any other intellectual property rights recognized in any
  country or jurisdiction in the world.`,
	LicenseThirdPartyIP: `“Third Party IP” means any third party patent rights (including, without
      limitation, patent applications and disclosures), copyrights, trade
      secrets, trademarks, know-how, or any other intellectual property rights
      recognized in any country or jurisdiction in the world.`,
	LicenseOwnership: '2. Ownership.',
	LicenseYouAcknowledge: `You acknowledge and agree that the Artist (or, as applicable, its
      licensors) owns all legal right, title, and interest in and to the Art,
      and all intellectual property rights therein. The rights that you have
      in and to the Art are limited to those described in this License. The
      artist reserves all rights in and to the Art not expressly granted to
      you in this License.`,
	LicenseLicense: '3. License.',
	LicenseGeneralUse: `General Use. Subject to your continued compliance with the terms of
  this License, Artist grants you a worldwide, non-exclusive,
  non-transferable, royalty-free license to use, copy, and display the
  Art for your Purchased NFTs, solely for the following purposes:`,
	LicenseForYourPersonal: 'for your own personal, non-commercial use;',
	LicenseAsPartMarketplace:
		'as part of a marketplace that permits the purchase and sale of your NFTs, provided that the marketplace cryptographically verifies each NFT owner’s rights to display the Art for their Purchased NFTs to ensure that only the actual owner can display the Art; or',
	LicenseThirdPartyWebsite:
		'as part of a third-party website or application that permits the inclusion, involvement, or participation of your NFTs, provided that the website/application cryptographically verifies each NFT owner’s rights to display the Art for their Purchased NFTs to ensure that only the actual owner can display the Art, and provided that the Art is no longer visible once the owner of the Purchased NFT leaves the website/application.',
	LicenseCommercialUse:
		'Commercial Use. Subject to your continued compliance with the terms of this License, Artist grants you a limited, worldwide, non-exclusive, non-transferable license to use, copy, and display the Art for your Purchased NFTs to commercialize your own merchandise that includes, contains or consists of the Art for your Purchased NFTs .',
	LicenseRestrictions: '4. Restrictions.',
	LicenseYouAgree:
		'You agree that you may not, nor permit any third party to do or attempt to do any of the foregoing without Artist’s express prior written consent in each case: i) use the Art for your Purchased NFTs in connection with images, videos, or other forms of media that depict hatred, intolerance, violence, cruelty, or anything else that could reasonably be found to constitute hate speech or otherwise infringe upon the rights of others; To the extent that Art associated with your Purchased NFTs contains Third Party IP (e.g., licensed intellectual property from a celebrity, athlete, or other public figures), you understand and agree as follows:',
	LicenseHaveRightTo:
		'that you will not have the right to use such Third Party IP in any way except as incorporated in the Art, and subject to the license and restrictions contained herein;',
	LicenseInSection3: 'that the Commercial Use license in Section 3(b) above will not apply;',
	LicenseDependingOn:
		'that, depending on the nature of the license granted from the owner of the Third Party IP, Artist may need to pass through additional restrictions on your ability to use the Complete Art; and',
	LicenseToTheExtent:
		'to the extent that the Artist informs you of such additional restrictions in writing (email is permissible), you will be responsible for complying with all such restrictions from the date that you receive the notice, and that failure to do so will be deemed a breach of this license. The restriction in Section 4 will survive the expiration or termination of this License.',
	LicenseTermsOf: '5. Terms of License.',
	LicenseTheLicenseGranted:
		'The license granted in Section 3 above applies only to the extent that you continue to Own the applicable Purchased NFT. If at any time you sell, trade, donate, give away, transfer, or otherwise dispose of your Purchased NFT for any reason, the license granted in Section 3 will immediately expire concerning those NFTs without the requirement of notice, and you will have no further rights in or to the Art for those NFTs.',
}
const languages = {
	LanguagesParas: 'Языки — Paras',
	Languages: 'Языки',
	AvailableInFollowingLang: 'Paras доступен в следующих переводах:',
}
const myBids = {
	MyBidsParas: 'Мои Ставки — Paras',
	MyBids: 'Мои Ставки',
	ReceivedBids: 'Полученные Ставки',
	NoActiveBid: 'YУ вас отсутствуют активные ставки',
}
const news = {
	CreateNewCardParas: 'Создать Новую Карточку — Paras',
	MarketData: 'Данные Магазина',
	RecommendedRatio6489: 'Рекомендованное соотношение сторон: 64 : 89',
	Maximum16mb: 'Максимальный размер файла 16mb',
	OnlyWantCreate: 'только если вы хотите создать карточку не для продажи',
}
const newCollection = {
	CreateNewCollectionParas: 'Создать Новую Коллекцию — Paras',
	CreateCollectionSuccess: 'Создание коллекции прошло успешно',
	Logo: 'Лого',
	CreatingLoading: 'Создание...',
}
const deleteCollection = {
	DeleteTitle: 'Удалить подтверждение',
	DeleteText: 'Вы уверены, что хотите удалить эту коллекцию?',
	DeleteCancel: `Отмена`,
	Delete: `Удалить`,
	Loading: `Загрузка`,
	DeleteSuccess: `Коллекция удалена успешно`,
	DeleteFailed: `Что-то пошло не так, повторите попытку позже.`,
}
const search = {
	'Search{searchQuery}Paras': 'Поиск {searchQuery} — Paras',
	SearchResult: 'Результаты Поиска',
}

import { config } from './config.js'
const data = {
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
}

export const ru = config(data)
