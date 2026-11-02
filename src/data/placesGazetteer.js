// Comprehensive Built-in Regional Gazetteer for Karnataka & Major Indian Centres
// Enables instant (0ms), 100% offline-resilient searching for all districts, taluks, and towns

export const QUICK_SEARCH_REGIONS = [
  { name: "Mandya Kaveri Basin", lat: 12.5240, lng: 76.8960, badge: "⚡ Benchmark", isBenchmark: true },
  { name: "Bengaluru (Bangalore)", lat: 12.9716, lng: 77.5946, badge: "📍 Metro", isBenchmark: false },
  { name: "Mysuru (Mysore)", lat: 12.2958, lng: 76.6394, badge: "📍 Kaveri Basin", isBenchmark: false },
  { name: "Kolar Gold Belt", lat: 13.1367, lng: 78.1337, badge: "⚡ Semi-Arid", isBenchmark: true },
  { name: "Tumakuru (Tumkur)", lat: 13.3422, lng: 77.1017, badge: "📍 Hard Rock", isBenchmark: false },
  { name: "Ramanagara Silk Belt", lat: 12.7253, lng: 77.2805, badge: "📍 Granitic", isBenchmark: false },
  { name: "Hassan (Hemavathi)", lat: 13.0033, lng: 76.1004, badge: "📍 Basin", isBenchmark: false },
  { name: "Ballari (Bellary)", lat: 15.1394, lng: 76.9214, badge: "⚡ Fractures", isBenchmark: true },
  { name: "Belagavi (Belgaum)", lat: 15.8497, lng: 74.4977, badge: "📍 Basalt", isBenchmark: false },
  { name: "Hubballi-Dharwad (Hubli)", lat: 15.3647, lng: 75.1240, badge: "📍 Commercial Hub", isBenchmark: false },
  { name: "Shivamogga (Shimoga)", lat: 13.9299, lng: 75.5681, badge: "📍 Malnad Basin", isBenchmark: false },
  { name: "Mangaluru (Mangalore)", lat: 12.9141, lng: 74.8560, badge: "📍 Coastal", isBenchmark: false },
  { name: "Chitradurga", lat: 14.2251, lng: 76.3980, badge: "📍 Schist Belt", isBenchmark: false },
  { name: "Davanagere", lat: 14.4644, lng: 75.9218, badge: "📍 Alluvial Basin", isBenchmark: false },
  { name: "Whitefield, Bengaluru", lat: 12.9698, lng: 77.7499, badge: "📍 Tech Suburb", isBenchmark: false },
  { name: "Electronic City, Bengaluru", lat: 12.8452, lng: 77.6602, badge: "📍 Tech Suburb", isBenchmark: false }
];

export const REGIONAL_GAZETTEER = [
  // --- BENGALURU URBAN & LOCALITIES ---
  { name: "Bengaluru City Centre (Bangalore / Majestic)", lat: 12.9767, lng: 77.5713, category: "State Capital", state: "Karnataka", aliases: ["bangalore", "majestic", "bengaluru urban", "cbd", "mg road"] },
  { name: "Whitefield, Bengaluru", lat: 12.9698, lng: 77.7499, category: "Tech Suburb", state: "Karnataka", aliases: ["whitefield", "itpl", "kadugodi", "hope farm"] },
  { name: "Electronic City, Bengaluru", lat: 12.8452, lng: 77.6602, category: "Tech Hub", state: "Karnataka", aliases: ["electronic city", "ecity", "phase 1", "phase 2", "neeladri"] },
  { name: "Koramangala, Bengaluru", lat: 12.9352, lng: 77.6245, category: "South Bengaluru", state: "Karnataka", aliases: ["koramangala", "sony world", "forum"] },
  { name: "Indiranagar, Bengaluru", lat: 12.9784, lng: 77.6408, category: "Central Bengaluru", state: "Karnataka", aliases: ["indiranagar", "100ft road", "cmh road"] },
  { name: "HSR Layout, Bengaluru", lat: 12.9121, lng: 77.6446, category: "South-East Bengaluru", state: "Karnataka", aliases: ["hsr", "hsr layout", "sector 1", "sector 2"] },
  { name: "BTM Layout, Bengaluru", lat: 12.9166, lng: 77.6101, category: "South Bengaluru", state: "Karnataka", aliases: ["btm", "btm layout", "madiwala", "silk board"] },
  { name: "Jayanagar, Bengaluru", lat: 12.9308, lng: 77.5838, category: "South Bengaluru", state: "Karnataka", aliases: ["jayanagar", "4th block", "south bangalore"] },
  { name: "JP Nagar, Bengaluru", lat: 12.9063, lng: 77.5857, category: "South Bengaluru", state: "Karnataka", aliases: ["jp nagar", "jayaprakash nagar", "sarakki"] },
  { name: "Bannerghatta Road, Bengaluru", lat: 12.8625, lng: 77.5972, category: "South Bengaluru", state: "Karnataka", aliases: ["bannerghatta", "bg road", "hulimavu", "gottigere", "jigani"] },
  { name: "Kengeri, Bengaluru", lat: 12.9177, lng: 77.4838, category: "West Suburb", state: "Karnataka", aliases: ["kengeri", "kengeri satellite town", "mysore road"] },
  { name: "Rajarajeshwari Nagar (RR Nagar), Bengaluru", lat: 12.9274, lng: 77.5154, category: "West Bengaluru", state: "Karnataka", aliases: ["rr nagar", "rajarajeshwari nagar"] },
  { name: "Hebbal, Bengaluru", lat: 13.0358, lng: 77.5970, category: "North Bengaluru", state: "Karnataka", aliases: ["hebbal", "hebbal flyover", "manyata"] },
  { name: "Yelahanka, Bengaluru", lat: 13.1007, lng: 77.5963, category: "North Bengaluru", state: "Karnataka", aliases: ["yelahanka", "yelahanka new town", "air force station"] },
  { name: "Bellandur, Bengaluru", lat: 12.9260, lng: 77.6762, category: "East Bengaluru", state: "Karnataka", aliases: ["bellandur", "outer ring road", "ecospace"] },
  { name: "Marathahalli, Bengaluru", lat: 12.9591, lng: 77.6974, category: "East Bengaluru", state: "Karnataka", aliases: ["marathahalli", "bridge", "kundanahalli"] },
  { name: "Sarjapur Road, Bengaluru", lat: 12.8596, lng: 77.7874, category: "East Bengaluru", state: "Karnataka", aliases: ["sarjapur", "sarjapur road", "carmelaram"] },
  { name: "KR Puram (Krishnarajapuram), Bengaluru", lat: 13.0075, lng: 77.6959, category: "East Bengaluru", state: "Karnataka", aliases: ["kr puram", "krishnarajapuram", "tin factory"] },
  { name: "Mahadevapura, Bengaluru", lat: 12.9936, lng: 77.6934, category: "East Bengaluru", state: "Karnataka", aliases: ["mahadevapura", "bagmane"] },
  { name: "Malleshwaram, Bengaluru", lat: 13.0031, lng: 77.5643, category: "North-West Bengaluru", state: "Karnataka", aliases: ["malleshwaram", "malleswaram", "sampige road"] },
  { name: "Rajajinagar, Bengaluru", lat: 12.9982, lng: 77.5530, category: "West Bengaluru", state: "Karnataka", aliases: ["rajajinagar", "isckon", "navrang"] },
  { name: "Vijayanagar, Bengaluru", lat: 12.9719, lng: 77.5304, category: "West Bengaluru", state: "Karnataka", aliases: ["vijayanagar", "rpc layout", "chandra layout"] },
  { name: "Nagarbhavi, Bengaluru", lat: 12.9554, lng: 77.5106, category: "West Bengaluru", state: "Karnataka", aliases: ["nagarbhavi", "bangalore university", "nlsiu"] },
  { name: "Peenya Industrial Area, Bengaluru", lat: 13.0285, lng: 77.5197, category: "Industrial Hub", state: "Karnataka", aliases: ["peenya", "peenya industrial area"] },
  { name: "Yeshwanthpur, Bengaluru", lat: 13.0238, lng: 77.5529, category: "North Bengaluru", state: "Karnataka", aliases: ["yeshwanthpur", "yesvantpur", "railway station"] },
  { name: "RT Nagar, Bengaluru", lat: 13.0247, lng: 77.5948, category: "North Bengaluru", state: "Karnataka", aliases: ["rt nagar", "rabindranath tagore nagar"] },
  { name: "Banashankari, Bengaluru", lat: 12.9150, lng: 77.5450, category: "South Bengaluru", state: "Karnataka", aliases: ["banashankari", "bsk", "katriguppe"] },
  { name: "Basavanagudi, Bengaluru", lat: 12.9416, lng: 77.5750, category: "South Bengaluru", state: "Karnataka", aliases: ["basavanagudi", "bull temple", "gandhi bazaar"] },
  { name: "Anekal, Bengaluru", lat: 12.7107, lng: 77.6975, category: "Taluk HQ", state: "Karnataka", aliases: ["anekal", "jigani", "attibele", "chandapura"] },

  // --- MANDYA DISTRICT & TALUKS ---
  { name: "Mandya Town", lat: 12.5240, lng: 76.8960, category: "District HQ", state: "Karnataka", aliases: ["mandya", "sugar city", "kaveri basin"] },
  { name: "Maddur, Mandya", lat: 12.5849, lng: 77.0449, category: "Taluk HQ", state: "Karnataka", aliases: ["maddur", "shimsha", "maddur vada"] },
  { name: "Malavalli, Mandya", lat: 12.3864, lng: 77.0589, category: "Taluk HQ", state: "Karnataka", aliases: ["malavalli", "gaganachukki", "shivanasamudra"] },
  { name: "Srirangapatna, Mandya", lat: 12.4226, lng: 76.6849, category: "Historic Taluk", state: "Karnataka", aliases: ["srirangapatna", "seringapatam", "ranganathaswamy"] },
  { name: "Pandavapura, Mandya", lat: 12.4975, lng: 76.6698, category: "Taluk HQ", state: "Karnataka", aliases: ["pandavapura", "french rocks", "thonnur lake"] },
  { name: "Nagamangala, Mandya", lat: 12.8183, lng: 76.7588, category: "Taluk HQ", state: "Karnataka", aliases: ["nagamangala", "adichunchanagiri", "bellur"] },
  { name: "Krishnarajpet (K.R. Pet), Mandya", lat: 12.6625, lng: 76.4908, category: "Taluk HQ", state: "Karnataka", aliases: ["kr pet", "krishnarajpet", "k.r.pet", "hemavathi"] },
  { name: "Besagarahalli, Mandya", lat: 12.5401, lng: 77.0125, category: "Farming Belt", state: "Karnataka", aliases: ["besagarahalli"] },
  { name: "Kikkeri, Mandya", lat: 12.7554, lng: 76.4178, category: "Agricultural Zone", state: "Karnataka", aliases: ["kikkeri"] },
  { name: "Bellur Cross, Mandya", lat: 12.9772, lng: 76.7291, category: "Highway Junction", state: "Karnataka", aliases: ["bellur cross", "bg nagara", "aics"] },

  // --- RAMANAGARA DISTRICT & TALUKS ---
  { name: "Ramanagara Town", lat: 12.7253, lng: 77.2805, category: "District HQ", state: "Karnataka", aliases: ["ramanagara", "ramanagar", "silk city", "sholay rocks"] },
  { name: "Channapatna, Ramanagara", lat: 12.6594, lng: 77.2039, category: "Taluk HQ", state: "Karnataka", aliases: ["channapatna", "toy city"] },
  { name: "Kanakapura, Ramanagara", lat: 12.5450, lng: 77.4199, category: "Taluk HQ", state: "Karnataka", aliases: ["kanakapura", "arkavathi", "sangama", "mekedatu"] },
  { name: "Magadi, Ramanagara", lat: 12.9575, lng: 77.2285, category: "Taluk HQ", state: "Karnataka", aliases: ["magadi", "kempegowda fort", "savandurga"] },
  { name: "Harohalli, Ramanagara", lat: 12.6738, lng: 77.4526, category: "Industrial Area", state: "Karnataka", aliases: ["harohalli", "kiadb"] },
  { name: "Bidadi, Ramanagara", lat: 12.7981, lng: 77.3828, category: "Industrial Hub", state: "Karnataka", aliases: ["bidadi", "toyota plant"] },

  // --- BENGALURU RURAL DISTRICT & TALUKS ---
  { name: "Devanahalli, Bengaluru Rural", lat: 13.2484, lng: 77.7134, category: "Airport Belt / Taluk", state: "Karnataka", aliases: ["devanahalli", "bial", "kempegowda airport"] },
  { name: "Doddaballapura, Bengaluru Rural", lat: 13.2929, lng: 77.5432, category: "Taluk HQ", state: "Karnataka", aliases: ["doddaballapura", "doddaballapur", "textile park"] },
  { name: "Hoskote, Bengaluru Rural", lat: 13.0730, lng: 77.7921, category: "Taluk HQ", state: "Karnataka", aliases: ["hoskote", "hosakote", "auto hub"] },
  { name: "Nelamangala, Bengaluru Rural", lat: 13.0953, lng: 77.3964, category: "Highway Junction / Taluk", state: "Karnataka", aliases: ["nelamangala", "tumkur road junction"] },

  // --- MYSURU (MYSORE) DISTRICT & TALUKS ---
  { name: "Mysuru City (Mysore)", lat: 12.2958, lng: 76.6394, category: "District Capital", state: "Karnataka", aliases: ["mysore", "mysuru", "palace city", "chamundi hill"] },
  { name: "Nanjangud, Mysuru", lat: 12.1192, lng: 76.6806, category: "Industrial Taluk", state: "Karnataka", aliases: ["nanjangud", "nanjangudu", "kapila"] },
  { name: "Hunsur, Mysuru", lat: 12.3087, lng: 76.2907, category: "Taluk HQ", state: "Karnataka", aliases: ["hunsur", "hunusuru", "nagarhole gate"] },
  { name: "T. Narasipura, Mysuru", lat: 12.2125, lng: 76.9038, category: "River Confluence Taluk", state: "Karnataka", aliases: ["t narasipura", "tirumakudalu narasipura", "triveni sangama"] },
  { name: "Periyapatna, Mysuru", lat: 12.3396, lng: 76.0967, category: "Tobacco Belt / Taluk", state: "Karnataka", aliases: ["periyapatna", "bylakuppe tibetan camp"] },
  { name: "K.R. Nagar (Krishnarajanagara), Mysuru", lat: 12.5822, lng: 76.3831, category: "Taluk HQ", state: "Karnataka", aliases: ["kr nagar", "krishnarajanagara", "chuncheanakatte"] },
  { name: "Heggadadevankote (H.D. Kote), Mysuru", lat: 11.9168, lng: 76.3313, category: "Forest / River Taluk", state: "Karnataka", aliases: ["hd kote", "heggadadevankote", "kabini"] },
  { name: "Saragur, Mysuru", lat: 11.9796, lng: 76.4172, category: "Taluk HQ", state: "Karnataka", aliases: ["saragur", "kabini backwaters"] },

  // --- TUMAKURU (TUMKUR) DISTRICT & TALUKS ---
  { name: "Tumakuru (Tumkur) City", lat: 13.3422, lng: 77.1017, category: "District Capital", state: "Karnataka", aliases: ["tumkur", "tumakuru", "siddaganga", "smart city"] },
  { name: "Tiptur, Tumakuru", lat: 13.2575, lng: 76.4789, category: "Coconut Capital / Taluk", state: "Karnataka", aliases: ["tiptur", "copra market"] },
  { name: "Kunigal, Tumakuru", lat: 13.0232, lng: 77.0347, category: "Taluk HQ", state: "Karnataka", aliases: ["kunigal", "kunigal kere", "stud farm"] },
  { name: "Gubbi, Tumakuru", lat: 13.3113, lng: 76.9404, category: "Taluk HQ", state: "Karnataka", aliases: ["gubbi", "hal helicopter plant"] },
  { name: "Sira, Tumakuru", lat: 13.7439, lng: 76.9039, category: "Taluk HQ", state: "Karnataka", aliases: ["sira", "kasturi rangappa nayaka"] },
  { name: "Madhugiri, Tumakuru", lat: 13.6625, lng: 77.2081, category: "Monolith Hill / Taluk", state: "Karnataka", aliases: ["madhugiri", "asia largest monolith"] },
  { name: "Pavagada, Tumakuru", lat: 14.1014, lng: 77.2804, category: "Arid Solar Belt / Taluk", state: "Karnataka", aliases: ["pavagada", "ultra mega solar park"] },
  { name: "Koratagere, Tumakuru", lat: 13.5240, lng: 77.2359, category: "Taluk HQ", state: "Karnataka", aliases: ["koratagere", "goravanahalli"] },
  { name: "Turuvekere, Tumakuru", lat: 13.1594, lng: 76.6669, category: "Taluk HQ", state: "Karnataka", aliases: ["turuvekere"] },
  { name: "Chikkanayakanahalli, Tumakuru", lat: 13.4184, lng: 76.6186, category: "Mining / Agro Taluk", state: "Karnataka", aliases: ["cn halli", "chikkanayakanahalli"] },

  // --- KOLAR DISTRICT & TALUKS ---
  { name: "Kolar Town", lat: 13.1367, lng: 78.1337, category: "District HQ", state: "Karnataka", aliases: ["kolar", "kolara", "antargange"] },
  { name: "Kolar Gold Fields (KGF / Robertsonpet)", lat: 12.9592, lng: 78.2727, category: "Mining Basin / City", state: "Karnataka", aliases: ["kgf", "kolar gold fields", "robertsonpet", "beml"] },
  { name: "Bangarapet, Kolar", lat: 12.9961, lng: 78.2014, category: "Taluk HQ", state: "Karnataka", aliases: ["bangarapet", "bangarpet", "junction"] },
  { name: "Malur, Kolar", lat: 13.0041, lng: 77.9408, category: "Industrial Taluk", state: "Karnataka", aliases: ["malur", "honda plant"] },
  { name: "Mulbagal, Kolar", lat: 13.1642, lng: 78.3965, category: "Taluk HQ", state: "Karnataka", aliases: ["mulbagal", "sripadaraja matha", "dosa"] },
  { name: "Srinivaspur, Kolar", lat: 13.3377, lng: 78.2127, category: "Mango Belt / Taluk", state: "Karnataka", aliases: ["srinivaspur", "srinivasapura"] },

  // --- CHIKKABALLAPURA DISTRICT & TALUKS ---
  { name: "Chikkaballapura Town", lat: 13.4325, lng: 77.7275, category: "District HQ", state: "Karnataka", aliases: ["chikkaballapura", "chickballapur", "nandi hills"] },
  { name: "Chintamani, Chikkaballapura", lat: 13.4009, lng: 78.0583, category: "Taluk HQ", state: "Karnataka", aliases: ["chintamani", "kaivara"] },
  { name: "Sidlaghatta, Chikkaballapura", lat: 13.3892, lng: 77.8631, category: "Silk Belt / Taluk", state: "Karnataka", aliases: ["sidlaghatta", "silk cocoon"] },
  { name: "Gauribidanur, Chikkaballapura", lat: 13.6125, lng: 77.5194, category: "Taluk HQ", state: "Karnataka", aliases: ["gauribidanur", "vidurashwatha"] },
  { name: "Bagepalli, Chikkaballapura", lat: 13.7842, lng: 77.7944, category: "Taluk HQ", state: "Karnataka", aliases: ["bagepalli", "andhra border"] },
  { name: "Gudibanda, Chikkaballapura", lat: 13.6706, lng: 77.7039, category: "Taluk HQ", state: "Karnataka", aliases: ["gudibanda", "fort"] },

  // --- HASSAN DISTRICT & TALUKS ---
  { name: "Hassan City", lat: 13.0033, lng: 76.1004, category: "District Capital", state: "Karnataka", aliases: ["hassan", "hasana", "isro mcf"] },
  { name: "Arsikere, Hassan", lat: 13.3134, lng: 76.2572, category: "Railway Hub / Taluk", state: "Karnataka", aliases: ["arsikere", "arasikere", "kalpataru"] },
  { name: "Channarayapatna, Hassan", lat: 12.9028, lng: 76.3897, category: "Taluk HQ", state: "Karnataka", aliases: ["channarayapatna", "cr patna", "shravanabelagola gate"] },
  { name: "Shravanabelagola, Hassan", lat: 12.8584, lng: 76.4867, category: "Heritage Site", state: "Karnataka", aliases: ["shravanabelagola", "gommateshwara", "bahubali"] },
  { name: "Holenarasipura, Hassan", lat: 12.7885, lng: 76.2427, category: "Taluk HQ", state: "Karnataka", aliases: ["holenarasipura", "hemavathi river"] },
  { name: "Belur, Hassan", lat: 13.1623, lng: 75.8617, category: "Hoysala Heritage Taluk", state: "Karnataka", aliases: ["belur", "chennakesava temple"] },
  { name: "Halebidu, Hassan", lat: 13.2167, lng: 75.9833, category: "Hoysala Heritage", state: "Karnataka", aliases: ["halebidu", "halebeedu", "hoysaleswara"] },
  { name: "Sakleshpur, Hassan", lat: 12.9730, lng: 75.7820, category: "Western Ghats / Coffee Taluk", state: "Karnataka", aliases: ["sakleshpur", "sakaleshapura", "manjarabad fort"] },
  { name: "Alur, Hassan", lat: 12.9806, lng: 76.0125, category: "Taluk HQ", state: "Karnataka", aliases: ["alur"] },
  { name: "Arkalgud, Hassan", lat: 12.7667, lng: 76.0500, category: "Taluk HQ", state: "Karnataka", aliases: ["arkalgud", "arikalagudu"] },

  // --- CHAMARAJANAGAR DISTRICT & TALUKS ---
  { name: "Chamarajanagar Town", lat: 11.9261, lng: 76.9437, category: "District HQ", state: "Karnataka", aliases: ["chamarajanagar", "chamarajnagar"] },
  { name: "Kollegal, Chamarajanagar", lat: 12.1558, lng: 77.1128, category: "Silk Hub / Taluk", state: "Karnataka", aliases: ["kollegal", "kollegala"] },
  { name: "Gundlupet, Chamarajanagar", lat: 11.8058, lng: 76.6894, category: "Bandipur Gateway / Taluk", state: "Karnataka", aliases: ["gundlupet", "bandipur national park", "gopalaswamy betta"] },
  { name: "Yelandur, Chamarajanagar", lat: 12.0667, lng: 77.0333, category: "Taluk HQ", state: "Karnataka", aliases: ["yelandur", "br hills", "biligiriranga"] },
  { name: "Hanur, Chamarajanagar", lat: 12.0950, lng: 77.3025, category: "Taluk HQ", state: "Karnataka", aliases: ["hanur", "male mahadeshwara betta", "mm hills"] },

  // --- KODAGU (COORG) DISTRICT & TALUKS ---
  { name: "Madikeri (Coorg), Kodagu", lat: 12.4244, lng: 75.7382, category: "District Capital", state: "Karnataka", aliases: ["madikeri", "coorg", "kodagu", "mercara", "raja seat"] },
  { name: "Virajpet, Kodagu", lat: 12.2033, lng: 75.8033, category: "Taluk HQ", state: "Karnataka", aliases: ["virajpet", "virajapete", "coffee belt"] },
  { name: "Somwarpet, Kodagu", lat: 12.5975, lng: 75.8569, category: "Taluk HQ", state: "Karnataka", aliases: ["somwarpet", "honnamana kere"] },
  { name: "Kushalnagar, Kodagu", lat: 12.4583, lng: 75.9583, category: "Commercial Town / Taluk", state: "Karnataka", aliases: ["kushalnagar", "namdroling monastery", "golden temple coorg"] },

  // --- DAKSHINA KANNADA & UDUPI (COASTAL) ---
  { name: "Mangaluru (Mangalore) City", lat: 12.9141, lng: 74.8560, category: "District Capital / Port", state: "Karnataka", aliases: ["mangalore", "mangaluru", "panambur", "kudla"] },
  { name: "Udupi City", lat: 13.3409, lng: 74.7421, category: "District Capital", state: "Karnataka", aliases: ["udupi", "krishna temple", "manipal", "malpe beach"] },
  { name: "Manipal, Udupi", lat: 13.3525, lng: 74.7865, category: "University Town", state: "Karnataka", aliases: ["manipal", "mahe"] },
  { name: "Kundapura, Udupi", lat: 13.6264, lng: 74.6917, category: "Taluk HQ", state: "Karnataka", aliases: ["kundapura", "kundapur"] },
  { name: "Karkala, Udupi", lat: 13.2167, lng: 74.9967, category: "Taluk HQ", state: "Karnataka", aliases: ["karkala", "gomateshwara karkala"] },
  { name: "Bantwal, Dakshina Kannada", lat: 12.8931, lng: 75.0347, category: "Taluk HQ", state: "Karnataka", aliases: ["bantwal", "buntwal", "netravathi"] },
  { name: "Puttur, Dakshina Kannada", lat: 12.7667, lng: 75.2000, category: "Taluk HQ", state: "Karnataka", aliases: ["puttur", "campco chocolate"] },
  { name: "Sullia, Dakshina Kannada", lat: 12.5600, lng: 75.3900, category: "Taluk HQ", state: "Karnataka", aliases: ["sullia", "kukke subramanya gate"] },
  { name: "Belthangady, Dakshina Kannada", lat: 13.0000, lng: 75.2667, category: "Taluk HQ", state: "Karnataka", aliases: ["belthangady", "dharmasthala gate"] },

  // --- SHIVAMOGGA & CHIKKAMAGALURU ---
  { name: "Shivamogga (Shimoga) City", lat: 13.9299, lng: 75.5681, category: "District Capital", state: "Karnataka", aliases: ["shimoga", "shivamogga", "tunga river", "jog falls gate"] },
  { name: "Bhadravathi, Shivamogga", lat: 13.8409, lng: 75.7037, category: "Steel City / Taluk", state: "Karnataka", aliases: ["bhadravathi", "visl steel", "bhadra river"] },
  { name: "Sagar, Shivamogga", lat: 14.1667, lng: 75.0333, category: "Taluk HQ", state: "Karnataka", aliases: ["sagar", "sagipura", "jog falls hub"] },
  { name: "Thirthahalli, Shivamogga", lat: 13.6833, lng: 75.2333, category: "Taluk HQ", state: "Karnataka", aliases: ["thirthahalli", "kuvempu kuppalli"] },
  { name: "Chikkamagaluru (Chikmagalur) Town", lat: 13.3161, lng: 75.7720, category: "District Capital / Coffee Land", state: "Karnataka", aliases: ["chikmagalur", "chikkamagaluru", "mullayanagiri", "baba budangiri"] },
  { name: "Tarikere, Chikkamagaluru", lat: 13.7167, lng: 75.8167, category: "Taluk HQ", state: "Karnataka", aliases: ["tarikere", "kemmangundi"] },
  { name: "Kadur, Chikkamagaluru", lat: 13.5500, lng: 76.0167, category: "Taluk HQ", state: "Karnataka", aliases: ["kadur", "birur junction"] },
  { name: "Mudigere, Chikkamagaluru", lat: 13.1333, lng: 75.6333, category: "Coffee Taluk", state: "Karnataka", aliases: ["mudigere", "kottigehara"] },

  // --- CHITRADURGA & DAVANAGERE ---
  { name: "Chitradurga (Fort City)", lat: 14.2251, lng: 76.3980, category: "District Capital", state: "Karnataka", aliases: ["chitradurga", "kallina kote", "onake obavva fort", "wind mills"] },
  { name: "Hiriyur, Chitradurga", lat: 13.9500, lng: 76.6167, category: "Taluk HQ", state: "Karnataka", aliases: ["hiriyur", "vani vilasa sagara dam"] },
  { name: "Challakere, Chitradurga", lat: 14.3167, lng: 76.6500, category: "Oil City / Taluk", state: "Karnataka", aliases: ["challakere", "science city", "isro dl"] },
  { name: "Holalkere, Chitradurga", lat: 14.0333, lng: 76.1833, category: "Taluk HQ", state: "Karnataka", aliases: ["holalkere"] },
  { name: "Hosadurga, Chitradurga", lat: 13.8000, lng: 76.2833, category: "Taluk HQ", state: "Karnataka", aliases: ["hosadurga", "cement hub"] },
  { name: "Davanagere City", lat: 14.4644, lng: 75.9218, category: "District Capital", state: "Karnataka", aliases: ["davanagere", "davangere", "benne dosa", "textile capital"] },
  { name: "Harihar, Davanagere", lat: 14.5125, lng: 75.8039, category: "Tungabhadra Industrial Taluk", state: "Karnataka", aliases: ["harihar", "harihara", "polyfibres"] },
  { name: "Channagiri, Davanagere", lat: 14.0253, lng: 75.9281, category: "Arecanut Hub / Taluk", state: "Karnataka", aliases: ["channagiri", "shanti sagara", "sulekere"] },

  // --- BALLARI & VIJAYANAGARA ---
  { name: "Ballari (Bellary) City", lat: 15.1394, lng: 76.9214, category: "District Capital / Mining Hub", state: "Karnataka", aliases: ["bellary", "ballari", "bellary fort", "jsw steels"] },
  { name: "Hosapete (Hospet / Hampi)", lat: 15.2689, lng: 76.3909, category: "District HQ / UNESCO Hampi", state: "Karnataka", aliases: ["hospet", "hosapete", "hampi", "tungabhadra dam", "tb dam"] },
  { name: "Sandur, Ballari", lat: 15.0833, lng: 76.5500, category: "Iron Ore Valley / Taluk", state: "Karnataka", aliases: ["sandur", "mining valley"] },
  { name: "Siruguppa, Ballari", lat: 15.6333, lng: 76.9000, category: "Rice Bowl / Taluk", state: "Karnataka", aliases: ["siruguppa", "paddy fields"] },
  { name: "Kudligi, Vijayanagara", lat: 14.9000, lng: 76.3833, category: "Taluk HQ", state: "Karnataka", aliases: ["kudligi"] },
  { name: "Harapanahalli, Vijayanagara", lat: 14.8000, lng: 75.9833, category: "Taluk HQ", state: "Karnataka", aliases: ["harapanahalli"] },

  // --- BELAGAVI, DHARWAD, HAVERI, GADAG ---
  { name: "Belagavi (Belgaum) City", lat: 15.8497, lng: 74.4977, category: "District Capital / Smart City", state: "Karnataka", aliases: ["belgaum", "belagavi", "suvarna soudha", "kunda sweet"] },
  { name: "Gokak, Belagavi", lat: 16.1667, lng: 74.8333, category: "Falls / Textile Taluk", state: "Karnataka", aliases: ["gokak", "gokak falls", "ghataprabha"] },
  { name: "Chikkodi, Belagavi", lat: 16.4333, lng: 74.6000, category: "Taluk HQ", state: "Karnataka", aliases: ["chikkodi", "chikodi", "sugar belt"] },
  { name: "Athani, Belagavi", lat: 16.7333, lng: 75.0667, category: "Krishna River Taluk", state: "Karnataka", aliases: ["athani", "krishna basin"] },
  { name: "Hubballi (Hubli), Dharwad", lat: 15.3647, lng: 75.1240, category: "Commercial Capital", state: "Karnataka", aliases: ["hubli", "hubballi", "swr railway hq", "unikal lake"] },
  { name: "Dharwad City", lat: 15.4589, lng: 75.0078, category: "Educational Hub / HQ", state: "Karnataka", aliases: ["dharwad", "dharwad peda", "karnatak university"] },
  { name: "Gadag-Betageri City", lat: 15.4319, lng: 75.6358, category: "District HQ", state: "Karnataka", aliases: ["gadag", "betageri", "tontadarya matha"] },
  { name: "Haveri Town", lat: 14.7954, lng: 75.4011, category: "District HQ / Cardamom Hub", state: "Karnataka", aliases: ["haveri", "byadgi chilli market gate"] },
  { name: "Byadgi, Haveri", lat: 14.6833, lng: 75.4833, category: "Chilli Market Capital", state: "Karnataka", aliases: ["byadgi", "byadagi", "red chilli"] },
  { name: "Ranebennur, Haveri", lat: 14.6236, lng: 75.6217, category: "Seed Hub / Blackbuck Sanctuary", state: "Karnataka", aliases: ["ranebennur", "blackbuck sanctuary"] },

  // --- BAGALKOTE & VIJAYAPURA ---
  { name: "Bagalkote (Bagalkot) City", lat: 16.1691, lng: 75.6615, category: "District Capital", state: "Karnataka", aliases: ["bagalkot", "bagalkote", "ghataprabha dam"] },
  { name: "Badami, Bagalkote", lat: 15.9189, lng: 75.6766, category: "Chalukya Heritage Taluk", state: "Karnataka", aliases: ["badami", "cave temples", "aihole", "pattadakal"] },
  { name: "Jamkhandi, Bagalkote", lat: 16.5000, lng: 75.3000, category: "Krishna River Sugar Taluk", state: "Karnataka", aliases: ["jamkhandi", "sugar factories"] },
  { name: "Mudhol, Bagalkote", lat: 16.3500, lng: 75.2833, category: "Hound / Agro Taluk", state: "Karnataka", aliases: ["mudhol", "mudhol hound"] },
  { name: "Vijayapura (Bijapur) City", lat: 16.8302, lng: 75.7100, category: "District Capital / Gol Gumbaz", state: "Karnataka", aliases: ["bijapur", "vijayapura", "gol gumbaz", "ibrahim rauza"] },
  { name: "Indi, Vijayapura", lat: 17.1833, lng: 75.9667, category: "Taluk HQ", state: "Karnataka", aliases: ["indi", "lemon city"] },

  // --- KALABURAGI, BIDAR, RAICHUR, KOPPAL, YADGIR ---
  { name: "Kalaburagi (Gulbarga) City", lat: 17.3297, lng: 76.8343, category: "Kalyana Karnataka Capital", state: "Karnataka", aliases: ["gulbarga", "kalaburagi", "tur dal bowl", "sharanabasaveshwara"] },
  { name: "Bidar City", lat: 17.9104, lng: 77.5199, category: "District HQ / Bidar Fort", state: "Karnataka", aliases: ["bidar", "bidriware", "gurudwara nanak jhira"] },
  { name: "Basavakalyan, Bidar", lat: 17.8731, lng: 76.9497, category: "Sharana Heritage Taluk", state: "Karnataka", aliases: ["basavakalyan", "basavanna", "anubhava mantapa"] },
  { name: "Raichur City", lat: 16.2120, lng: 77.3439, category: "Doab Capital", state: "Karnataka", aliases: ["raichur", "rtps thermal power", "krishna tungabhadra doab"] },
  { name: "Sindhanur, Raichur", lat: 15.7667, lng: 76.7667, category: "Paddy Hub / Taluk", state: "Karnataka", aliases: ["sindhanur", "paddy capital"] },
  { name: "Koppal City", lat: 15.3486, lng: 76.1554, category: "District HQ / Toy Town", state: "Karnataka", aliases: ["koppal", "kinnal craft", "gavimath"] },
  { name: "Gangavathi, Koppal", lat: 15.4333, lng: 76.5333, category: "Rice Bowl / Anegundi Gate", state: "Karnataka", aliases: ["gangavathi", "anegundi", "kishkindha"] },
  { name: "Yadgir City", lat: 16.7644, lng: 77.1378, category: "District HQ", state: "Karnataka", aliases: ["yadgir", "yadagiri", "bhima river"] },
  { name: "Shahapur, Yadgir", lat: 16.7000, lng: 76.8333, category: "Taluk HQ", state: "Karnataka", aliases: ["shahapur", "sleeping buddha hill"] },

  // --- UTTARA KANNADA (KARWAR & COASTAL / GHATS) ---
  { name: "Karwar City", lat: 14.8136, lng: 74.1298, category: "District Capital / Naval Base", state: "Karnataka", aliases: ["karwar", "ins kadamba", "rabindranath tagore beach", "kali river"] },
  { name: "Sirsi, Uttara Kannada", lat: 14.6195, lng: 74.8354, category: "Arecanut / Ghat Taluk", state: "Karnataka", aliases: ["sirsi", "marikamba temple", "unchehalli falls"] },
  { name: "Gokarna, Uttara Kannada", lat: 14.5479, lng: 74.3188, category: "Temple & Beach Town", state: "Karnataka", aliases: ["gokarna", "om beach", "mahabaleshwar temple"] },
  { name: "Dandeli, Uttara Kannada", lat: 15.2458, lng: 74.6158, category: "River Rafting / Forest Hub", state: "Karnataka", aliases: ["dandeli", "kali river rafting", "paper mills"] },
  { name: "Bhatkal, Uttara Kannada", lat: 13.9789, lng: 74.5519, category: "Coastal Taluk", state: "Karnataka", aliases: ["bhatkal", "murudeshwar gate"] },
  { name: "Murudeshwar, Uttara Kannada", lat: 14.0940, lng: 74.4899, category: "Shiva Temple Coastal Shrine", state: "Karnataka", aliases: ["murudeshwar", "shiva statue"] },

  // --- MAJOR METROS & INDIAN CITIES ---
  { name: "Chennai, Tamil Nadu", lat: 13.0827, lng: 80.2707, category: "Metropolitan Capital", state: "Tamil Nadu", aliases: ["chennai", "madras"] },
  { name: "Coimbatore, Tamil Nadu", lat: 11.0168, lng: 76.9558, category: "Industrial Hub", state: "Tamil Nadu", aliases: ["coimbatore", "kovai", "pump hub"] },
  { name: "Hosur, Tamil Nadu", lat: 12.7409, lng: 77.8253, category: "Industrial Border Town", state: "Tamil Nadu", aliases: ["hosur", "tvs", "electronic border"] },
  { name: "Hyderabad, Telangana", lat: 17.3850, lng: 78.4867, category: "State Capital", state: "Telangana", aliases: ["hyderabad", "secunderabad", "cyberabad"] },
  { name: "Tirupati, Andhra Pradesh", lat: 13.6288, lng: 79.4192, category: "Temple Shrine", state: "Andhra Pradesh", aliases: ["tirupati", "tirumala", "balaji"] },
  { name: "Anantapur, Andhra Pradesh", lat: 14.6819, lng: 77.6006, category: "Rayalaseema Semi-Arid", state: "Andhra Pradesh", aliases: ["anantapur", "anantapuram"] },
  { name: "Kurnool, Andhra Pradesh", lat: 15.8281, lng: 78.0373, category: "Tungabhadra Basin", state: "Andhra Pradesh", aliases: ["kurnool"] },
  { name: "Vijayawada, Andhra Pradesh", lat: 16.5062, lng: 80.6480, category: "Commercial Capital", state: "Andhra Pradesh", aliases: ["vijayawada", "bezawada"] },
  { name: "Visakhapatnam, Andhra Pradesh", lat: 17.6868, lng: 83.2185, category: "Eastern Port", state: "Andhra Pradesh", aliases: ["vizag", "visakhapatnam"] },
  { name: "Mumbai, Maharashtra", lat: 19.0760, lng: 72.8777, category: "Financial Capital", state: "Maharashtra", aliases: ["mumbai", "bombay"] },
  { name: "Pune, Maharashtra", lat: 18.5204, lng: 73.8567, category: "Deccan Basalt Hub", state: "Maharashtra", aliases: ["pune", "poona"] },
  { name: "Kolhapur, Maharashtra", lat: 16.7050, lng: 74.2433, category: "Panchaganga Basin", state: "Maharashtra", aliases: ["kolhapur"] },
  { name: "Solapur, Maharashtra", lat: 17.6599, lng: 75.9064, category: "Border Textile Hub", state: "Maharashtra", aliases: ["solapur", "sholapur"] },
  { name: "New Delhi / NCR", lat: 28.6139, lng: 77.2090, category: "National Capital", state: "Delhi", aliases: ["delhi", "new delhi", "ncr", "gurgaon", "noida"] },
  { name: "Kolkata, West Bengal", lat: 22.5726, lng: 88.3639, category: "Eastern Capital", state: "West Bengal", aliases: ["kolkata", "calcutta"] },
  { name: "Ahmedabad, Gujarat", lat: 23.0225, lng: 72.5714, category: "Sabarmati Basin", state: "Gujarat", aliases: ["ahmedabad", "amdavad"] },
  { name: "Jaipur, Rajasthan", lat: 26.9124, lng: 75.7873, category: "Arid Hard Rock Belt", state: "Rajasthan", aliases: ["jaipur", "pink city"] },
  { name: "Kochi, Kerala", lat: 9.9312, lng: 76.2673, category: "Coastal Port", state: "Kerala", aliases: ["kochi", "cochin", "ernakulam"] }
];

// Normalize text helper: strip accents, punctuation, extra spaces
function cleanText(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Intelligent, fuzzy match for local gazetteer
 * Supports single-character queries, synonyms (Bangalore <-> Bengaluru, Mysore <-> Mysuru),
 * and substring/word-boundary match with relevance scoring.
 */
export function searchLocalGazetteer(query, limit = 8) {
  if (!query || !query.trim()) return [];
  const rawQ = query.trim().toLowerCase();
  const cleanQ = cleanText(rawQ);
  if (!cleanQ) return [];

  const results = [];

  for (const place of REGIONAL_GAZETTEER) {
    const rawName = place.name.toLowerCase();
    const cleanName = cleanText(place.name);
    const cleanCat = cleanText(place.category);
    const cleanState = cleanText(place.state);
    const aliases = (place.aliases || []).map(a => cleanText(a));

    let score = 0;

    // 1. Exact match on clean name or alias
    if (cleanName === cleanQ) {
      score = 300;
    } else if (aliases.includes(cleanQ)) {
      score = 260;
    }
    // 2. Name itself starts with query (e.g. "M" -> "Mandya", "Mysuru")
    else if (cleanName.startsWith(cleanQ)) {
      score = 220;
    }
    // 3. Word boundary match in primary name (e.g. " mandya")
    else if (cleanName.includes(` ${cleanQ}`) || cleanName.includes(`(${cleanQ}`)) {
      score = 190;
    }
    // 4. Alias starts with query (e.g. "bangalore" -> "Bengaluru")
    else if (aliases.some(a => a.startsWith(cleanQ))) {
      score = 170;
    }
    // 5. Substring anywhere in clean name
    else if (cleanName.includes(cleanQ)) {
      score = 130;
    }
    // 6. Substring in aliases
    else if (aliases.some(a => a.includes(cleanQ))) {
      score = 100;
    }
    // 7. Category match
    else if (cleanCat.includes(cleanQ)) {
      score = 60;
    }
    // 8. State match
    else if (cleanState.startsWith(cleanQ)) {
      score = 40;
    }

    if (score > 0) {
      results.push({ place, score });
    }
  }

  // Sort descending by score, tiebreak by shorter name for concise matches
  results.sort((a, b) => b.score - a.score || a.place.name.length - b.place.name.length);

  return results.slice(0, limit).map(r => r.place);
}
