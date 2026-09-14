// ============================================================
// 周中临时住宿 · 数据层英文映射（供 app.js 在英文模式下查表）
// ------------------------------------------------------------
// 设计原则：data.js 是「自动生成的快照」，不允许手改；
// 因此所有中→英的自由文本翻译集中在本文件，逐条可人工复核。
// 数字、金额、电话、地址、平台名、品牌名一律原样保留，只翻译描述语。
// 用法：ACCOM_EN.type[中文值] / .ls[中文值] / .note[中文值]
// ============================================================
window.ACCOM_EN = {

  /* ① 住宿类型（22 种，覆盖 data.js 全部取值） */
  type: {
    '汽车旅馆': 'Motel',
    '经济汽车旅馆': 'Budget motel',
    '汽车旅馆/长住': 'Motel / long-stay',
    '独立/长住旅店': 'Independent / long-stay inn',
    '经济酒店': 'Economy hotel',
    '中端酒店': 'Mid-range hotel',
    '中端全服务': 'Mid-range full-service',
    '中端有限服务': 'Mid-range limited-service',
    '高端全服务': 'Upscale full-service',
    '独立酒店': 'Independent hotel',
    '精品酒店(市中心)': 'Boutique hotel (downtown)',
    '延长住宿酒店': 'Extended-stay hotel',
    '延长住宿公寓酒店': 'Extended-stay apart-hotel',
    '家具延长住宿': 'Furnished extended stay',
    '民宿 B&B': 'Bed & breakfast',
    '民宿 B&B(市中心)': 'Bed & breakfast (downtown)',
    '民宿私人房': 'B&B private room',
    '私人房': 'Private room',
    '私人房/地下室': 'Private room / basement',
    '大学私人房': 'University private room',
    '企业服务公寓(整租)': 'Corporate serviced apartment (whole unit)',
    '平台服务公寓(整租)': 'Platform serviced apartment (whole unit)'
  },

  /* ② 长住潜力（50 条，与 data.js 的 ls 一一对应） */
  ls: {
    '高（周价/小厨房套房/21翻新房）': 'High (weekly rate / kitchenette suite / 21 renovated rooms)',
    '高（全厨/洗衣/周价）': 'High (full kitchen / laundry / weekly rate)',
    '高（真房间/可现金谈）': 'High (real room / cash negotiable)',
    '高（房东直谈）': 'High (negotiate directly with the landlord)',
    '高（月付灵活）': 'High (flexible monthly payment)',
    '中（业主可谈/含早）': 'Medium (owner negotiable / breakfast included)',
    '高（明示 Group/企业/长住折扣）': 'High (advertised group / corporate / long-stay discounts)',
    '高（效率房全厨/明示长住价）': 'High (efficiency room with full kitchen / advertised long-stay rate)',
    '高（月付/近市中心）': 'High (monthly payment / near downtown)',
    '高（小厨房/周价可谈/免费停车）': 'High (kitchenette / weekly rate negotiable / free parking)',
    '高（冰箱/微炉/周价）': 'High (fridge / microwave / weekly rate)',
    '高（公寓式长租单元）': 'High (apartment-style long-stay unit)',
    '高（家具套房/含停车WiFi）': 'High (furnished suite / parking & Wi-Fi included)',
    '中（含早/泳池/冰箱微炉）': 'Medium (breakfast included / pool / fridge & microwave)',
    '极高（7/14/21天+月租阶梯折扣）': 'Very high (tiered discounts at 7/14/21 days + monthly)',
    '中高（含早/停车/部分小厨）': 'Medium-high (breakfast / parking / some kitchenettes)',
    '高（全厨/含早）': 'High (full kitchen / breakfast included)',
    '中（路边预算/冰箱微炉）': 'Medium (roadside budget / fridge & microwave)',
    '高（小厨/含早/洗衣）': 'High (kitchenette / breakfast / laundry)',
    '高（小厨套房/Jacuzzi/具名销售）': 'High (kitchenette suite / Jacuzzi / named sales contact)',
    '高（全厨/含早/泳池）': 'High (full kitchen / breakfast / pool)',
    '中高（部分小厨/含早/市中心）': 'Medium-high (some kitchenettes / breakfast / downtown)',
    '高（明示 Long Term Stay 套餐）': 'High (advertised Long Term Stay package)',
    '中低（东King街/翻新）': 'Medium-low (East King St / renovated)',
    '中（冰箱微炉/含早/泳池）': 'Medium (fridge & microwave / breakfast / pool)',
    '中高（小厨/含早）': 'Medium-high (kitchenette / breakfast)',
    '中（冰箱微炉/周中低需）': 'Medium (fridge & microwave / low weekday demand)',
    '中（冰箱微炉/周月可谈）': 'Medium (fridge & microwave / weekly & monthly negotiable)',
    '中高（小厨房/含早）': 'Medium-high (kitchenette / breakfast)',
    '高（全厨/含早/晚间社交）': 'High (full kitchen / breakfast / evening social)',
    '中（近UofG/含早/冰箱微炉）': 'Medium (near UofG / breakfast / fridge & microwave)',
    '中（冰箱微炉/含早）': 'Medium (fridge & microwave / breakfast)',
    '中（无厨房）': 'Medium (no kitchen)',
    '中（小厨套房/企业折扣）': 'Medium (kitchenette suite / corporate discount)',
    '中（校内/有私房/灵活）': 'Medium (on campus / private rooms / flexible)',
    '中（可谈长住）': 'Medium (long-stay negotiable)',
    '中（新重开/可谈）': 'Medium (newly reopened / negotiable)',
    '中低（精品/包段意愿弱）': 'Medium-low (boutique / low interest in block bookings)',
    '中（近UofG）': 'Medium (near UofG)',
    '中（含早/小厨/泳池）': 'Medium (breakfast / kitchenette / pool)',
    '中（位置偏/无早）': 'Medium (out-of-the-way / no breakfast)',
    '中（销售联系/无厨房）': 'Medium (sales contact / no kitchen)',
    '中（无厨房/偏贵）': 'Medium (no kitchen / on the pricey side)',
    '中低（住宅区/超预算）': 'Medium-low (residential area / over budget)',
    '高（真公寓/含停车洗衣）': 'High (real apartment / parking & laundry included)',
    '中（近UofG/超预算）': 'Medium (near UofG / over budget)',
    '中（销售联系/远超预算）': 'Medium (sales contact / well over budget)',
    '中（短/长住皆接）': 'Medium (accepts both short and long stays)',
    '高（真公寓/平台价硬）': 'High (real apartment / platform price firm)',
    '中（超预算）': 'Medium (over budget)'
  },

  /* ③ 平台口碑备注（45 条，与 data.js 的 rating_note 一一对应）
        平台名、评论条数、⚠ 符号一律原样保留 */
  note: {
    'Booking·83条 · 便宜老旧、隔音差，位置便利': 'Booking · 83 reviews · cheap but dated, poor soundproofing, convenient location',
    'IHG/Google·285条 · 全新干净、套房带厨房': 'IHG/Google · 285 reviews · brand-new and clean, suites with kitchen',
    '平台房源各异，需逐条看评论': 'Listings vary by platform — read reviews one by one',
    'TripAdvisor·383条 · 含早好评、近高速，房间略旧': 'TripAdvisor · 383 reviews · breakfast well reviewed, near the highway, rooms a bit dated',
    'Booking·386条 · 陈旧脏乱、烟味、维护差 ⚠': 'Booking · 386 reviews · old and untidy, smoke smell, badly maintained ⚠',
    'TripAdvisor·130条 · 床品尚可、设施旧、长住客混杂 ⚠': 'TripAdvisor · 130 reviews · acceptable bedding, dated facilities, mixed long-stay guests ⚠',
    'Google·525条 · 设施破旧、卫生差、有异味 ⚠': 'Google · 525 reviews · run-down facilities, poor cleanliness, odours ⚠',
    'Booking·354条 · 脏、异味、设施失修 ⚠': 'Booking · 354 reviews · dirty, odours, poorly maintained ⚠',
    'TripAdvisor·22条 · 破旧、卫生差、邻夜店噪音 ⚠⚠': 'TripAdvisor · 22 reviews · run-down, poor cleanliness, noise from a nearby nightclub ⚠⚠',
    'KAYAK·146条 · 厨房齐全适合长住；管理松散偶有噪音': 'KAYAK · 146 reviews · full kitchen, good for long stays; lax management, occasional noise',
    'Booking·663条 · 员工友好；建筑老化、偶有烟味': 'Booking · 663 reviews · friendly staff; ageing building, occasional smoke smell',
    'TripAdvisor·104条 · 房东热情、早餐好、贵湖B&B第1名': 'TripAdvisor · 104 reviews · warm host, good breakfast, #1 B&B in Guelph',
    'Expedia·988条 · 干净、早餐佳、近商场': 'Expedia · 988 reviews · clean, great breakfast, near the mall',
    'Trivago·3603条 · 员工好含早；清洁度参差、隔音差': 'Trivago · 3603 reviews · good staff, breakfast included; inconsistent cleanliness, poor soundproofing',
    'Booking·132条 · 员工友好、较干净、性价比高': 'Booking · 132 reviews · friendly staff, fairly clean, good value',
    'Trip.com·120条 · 新且干净、套房宽敞、早餐好': 'Trip.com · 120 reviews · new and clean, spacious suites, good breakfast',
    'Google·1582条 · 服务好、含早、房间干净': 'Google · 1582 reviews · good service, breakfast included, clean rooms',
    'Trip.com·103条 · 套房大带厨房含早；泳池常关': 'Trip.com · 103 reviews · large suites with kitchen, breakfast included; pool often closed',
    'Trip.com·126条 · 位置佳早餐好；房间偏旧、停车收费': 'Trip.com · 126 reviews · great location, good breakfast; rooms a bit dated, paid parking',
    'Booking·157条 · 老宅含早、主人热情，偶有街噪': 'Booking · 157 reviews · heritage house, breakfast included, warm host, occasional street noise',
    'KAYAK·37条 · 干净简洁、员工友好，个别噪音': 'KAYAK · 37 reviews · clean and simple, friendly staff, some noise',
    'TripAdvisor·431条 · 家庭友好、早餐赞、泳池受欢迎': 'TripAdvisor · 431 reviews · family-friendly, excellent breakfast, popular pool',
    'TripAdvisor·198条 · 干净含早；部分平台已更名 Spark by Hilton，订前确认': 'TripAdvisor · 198 reviews · clean, breakfast included; renamed Spark by Hilton on some platforms — confirm before booking',
    'Booking·310条 · 便宜员工好；墙薄噪音、地毯破损': 'Booking · 310 reviews · cheap, good staff; thin walls and noise, worn carpet',
    'Booking·309条 · 早餐好、近大学；设施旧': 'Booking · 309 reviews · good breakfast, near the university; dated facilities',
    'Booking·994条 · 早餐好员工好；设施旧': 'Booking · 994 reviews · good breakfast, good staff; dated facilities',
    'TripAdvisor·351条 · 套房大带厨房、安静（贵湖第1名）': 'TripAdvisor · 351 reviews · large suites with kitchen, quiet (#1 in Guelph)',
    'TripAdvisor·584条 · 便宜近大学；设施旧、卫生参差': 'TripAdvisor · 584 reviews · cheap, near the university; dated facilities, inconsistent cleanliness',
    'Trip.com·113条 · 新装修很干净、早餐丰富': 'Trip.com · 113 reviews · newly renovated and very clean, generous breakfast',
    'TripAdvisor·271条 · 性价比尚可；隔音差、个别霉味': 'TripAdvisor · 271 reviews · acceptable value; poor soundproofing, occasional musty smell',
    'Booking·216条 · 房间大泳池好；设施旧、门锁差': 'Booking · 216 reviews · large rooms, good pool; dated facilities, poor door locks',
    'TripAdvisor·11条 · 便宜位置好；宿舍式设施简陋 ⚠': 'TripAdvisor · 11 reviews · cheap, good location; dorm-style, basic facilities ⚠',
    'Google·17条 · 老宅主人热情含早；停车位有限': 'Google · 17 reviews · heritage house, warm host, breakfast included; limited parking',
    'KAYAK·1247条 · 位置好泳池受欢迎；设施旧、个别卫生差评 ⚠': 'KAYAK · 1247 reviews · good location, popular pool; dated facilities, some cleanliness complaints ⚠',
    'Google·1406条 · 历史精品、位置员工极佳；停车难收费': 'Google · 1406 reviews · historic boutique, excellent location and staff; parking difficult and paid',
    'TripAdvisor·349条 · 员工友好泳池受欢迎；设施老化': 'TripAdvisor · 349 reviews · friendly staff, popular pool; ageing facilities',
    'Booking·306条 · 干净含早员工好；热水浴缸常坏': 'Booking · 306 reviews · clean, breakfast included, good staff; hot tub often out of order',
    'Google·952条 · 干净位置好服务佳；早餐另收费': 'Google · 952 reviews · clean, great location, good service; breakfast costs extra',
    'Marriott·1014条 · 干净安静服务好': 'Marriott · 1014 reviews · clean, quiet, good service',
    'Trip.com·108条 · 翻新后干净现代；偶有清洁疏漏': 'Trip.com · 108 reviews · clean and modern after renovation; occasional cleaning misses',
    'Trip.com·40条 · 主人热情、套房极干净、早餐佳': 'Trip.com · 40 reviews · warm host, spotless suites, excellent breakfast',
    'Google·1144条 · 服务好干净近大学；隔音一般': 'Google · 1144 reviews · good service, clean, near the university; average soundproofing',
    'Marriott·745+条 · 位置佳房间现代；停车收费、价偏高': 'Marriott · 745+ reviews · great location, modern rooms; paid parking, on the pricey side',
    'Booking·78条 · 历史建筑美、干净含早': 'Booking · 78 reviews · beautiful historic building, clean, breakfast included',
    'TripAdvisor·253条 · 干净性价比高；早餐简单': 'TripAdvisor · 253 reviews · clean, good value; simple breakfast'
  }
};

/* ④ 物业名（仅 5 条含中文：平台房源与非标准房源；品牌酒店一律保留原名） */
window.ACCOM_NAME_EN = {
  'Kijiji 家具房（KW 挂牌）': 'Kijiji furnished room (KW listings)',
  'Airbnb 月租私人房（KW）': 'Airbnb monthly private room (KW)',
  'Roomies.ca / Qdb 家具房': 'Roomies.ca / Qdb furnished room',
  'City Casa / Nest 行政套房': 'City Casa / Nest executive suite',
  'Blueground 家具月租公寓': 'Blueground furnished monthly apartment'
};

/* ⑤ 价格字段里的中文注解（顺序敏感：整句先替换，再替换通用词）
      数字、金额、货币符号、~ 号一律原样保留。 */
window.ACCOM_PRICE_EN = [
  // 整句注解
  ['（周/冬特价另议）', ' (weekly / winter rates on request)'],
  ['（明示长期折扣）', ' (advertises long-stay discount)'],
  ['（长住价可谈）', ' (long-stay rate negotiable)'],
  ['（淡旺差大）', ' (big low/high-season gap)'],
  ['（月租40%off）', ' (40% off monthly)'],
  ['（私人房）', ' (private room)'],
  ['（含税）', ' (tax incl.)'],
  ['（税前）', ' (before tax)'],
  // 通用词（「晚均」必须在「/晚」之前，否则 /晚均 会被切成 /night均）
  ['晚均', 'night avg'],
  ['/晚', '/night'],
  ['/月', '/month'],
  ['按月计', 'billed monthly'],
  ['典型', 'typical'],
  ['另议', 'on request'],
  ['从', 'from'],
  // 中文括号 → ASCII 括号
  ['（', ' ('],
  ['）', ')']
];
