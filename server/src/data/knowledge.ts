export type Lang = "en" | "hi" | "te";

export type Simple = Record<Lang, string>;

export type Provision = {
  id: string;
  act: string;
  section: string;
  title: string;
  jurisdiction: string;
  effectiveNote: string;
  lastVerified: string;
  sourceName: string;
  sourceUrl: string;
  keywords: string[];
  categories: string[];
  simple: Simple;
  why: Simple;
};

export type PlanStep = {
  title: Simple;
  explanation: Simple;
  documents: string[];
  where: Simple;
  url: string | null;
  urlLabel: string | null;
  timing: Simple | null;
};

export type FlowNode = { title: Simple; detail: Simple };

export type DocHint = { name: string; why: Simple };

export type CategoryPlaybook = {
  id: string;
  label: Simple;
  group: "consumer" | "cyber" | "criminal" | "civil" | "traffic" | "labour" | "rights";
  keywords: string[];
  facts: { id: string; label: Simple; test: RegExp }[];
  questions: Simple[];
  documents: DocHint[];
  remedies: Simple[];
  flow: FlowNode[];
  steps: PlanStep[];
  authorities: { name: string; url: string; phone: string | null; note: Simple }[];
};

export const LAST_VERIFIED = "2026-11-07";

const INDIA = "India (central law, subject to the facts and the forum)";

export const PROVISIONS: Provision[] = [
  {
    id: "cpa-2-7",
    act: "Consumer Protection Act, 2019",
    section: "Section 2(7)",
    title: "Consumer",
    jurisdiction: INDIA,
    effectiveNote: "The Act commences on dates notified by the Central Government. Notification S.O. 2421(E) dated 23 July 2020 appointed 24 July 2020 for specified provisions, including parts of section 2. Confirm the particular clause on India Code.",
    lastVerified: LAST_VERIFIED,
    sourceName: "India Code — Consumer Protection Act, 2019",
    sourceUrl: "https://www.indiacode.nic.in/handle/123456789/15256",
    keywords: ["consumer", "bought", "goods", "service", "online", "shopping", "order", "paid"],
    categories: ["consumer"],
    simple: {
      en: "A person who buys goods or hires a service for a price, including many online transactions, can fall within the definition of a consumer. Buying only for resale, or for a commercial purpose, is generally outside it. Use for earning a livelihood by self-employment is treated differently from a commercial purpose.",
      hi: "जो व्यक्ति कीमत देकर सामान खरीदता है या सेवा लेता है, जिसमें कई ऑनलाइन लेनदेन शामिल हो सकते हैं, वह उपभोक्ता की परिभाषा में आ सकता है। केवल दोबारा बेचने या व्यावसायिक उद्देश्य से खरीदना आमतौर पर इसके बाहर है।",
      te: "ధర చెల్లించి వస్తువులు కొనేవారు లేదా సేవ తీసుకునేవారు, అనేక ఆన్‌లైన్ లావాదేవీలతో సహా, వినియోగదారు నిర్వచనంలోకి రావచ్చు. తిరిగి అమ్మడానికి లేదా వ్యాపారం కోసం మాత్రమే కొనడం సాధారణంగా వెలుపల ఉంటుంది.",
    },
    why: {
      en: "This definition is the starting point for a consumer complaint. It may apply if you paid, or promised to pay, for goods or a service.",
      hi: "उपभोक्ता शिकायत के लिए यही शुरुआती परिभाषा है। यदि आपने सामान या सेवा के लिए भुगतान किया है या भुगतान का वादा किया है, तो यह लागू हो सकती है।",
      te: "వినియోగదారు ఫిర్యాదుకు ఇది మొదటి నిర్వచనం. వస్తువు లేదా సేవ కోసం మీరు చెల్లించినా లేదా చెల్లిస్తానని మాట ఇచ్చినా ఇది వర్తించవచ్చు.",
    },
  },
  {
    id: "cpa-2-10",
    act: "Consumer Protection Act, 2019",
    section: "Section 2(10)",
    title: "Defect",
    jurisdiction: INDIA,
    effectiveNote: "Confirm commencement of the relied-on clause from the notified text on India Code.",
    lastVerified: LAST_VERIFIED,
    sourceName: "India Code — Consumer Protection Act, 2019",
    sourceUrl: "https://www.indiacode.nic.in/handle/123456789/15256",
    keywords: ["defect", "defective", "faulty", "damaged", "quality", "not working", "broken"],
    categories: ["consumer"],
    simple: {
      en: "A defect is a fault or shortcoming in the quality, quantity, potency, purity, or standard of goods, whether that standard comes from law, a contract, or what the seller claimed.",
      hi: "दोष का अर्थ है सामान की गुणवत्ता, मात्रा, शुद्धता या मानक में कमी, चाहे वह मानक कानून, अनुबंध या विक्रेता के दावे से आए।",
      te: "లోపం అంటే వస్తువు నాణ్యత, పరిమాణం, స్వచ్ఛత లేదా ప్రమాణంలో లోపం. ఆ ప్రమాణం చట్టం, ఒప్పందం లేదా అమ్మకందారు చెప్పిన దాని నుండి రావచ్చు.",
    },
    why: {
      en: "This may be relevant when goods were supplied but were faulty, incomplete, or not of the promised standard.",
      hi: "जब सामान मिला हो पर वह खराब, अधूरा या वादे के मानक का न हो, तब यह प्रासंगिक हो सकता है।",
      te: "వస్తువు వచ్చినా అది చెడిపోయి, అసంపూర్ణంగా లేదా మాట ఇచ్చిన ప్రమాణంలో లేకపోతే ఇది సంబంధించవచ్చు.",
    },
  },
  {
    id: "cpa-2-11",
    act: "Consumer Protection Act, 2019",
    section: "Section 2(11)",
    title: "Deficiency",
    jurisdiction: INDIA,
    effectiveNote: "Confirm commencement of the relied-on clause from the notified text on India Code.",
    lastVerified: LAST_VERIFIED,
    sourceName: "India Code — Consumer Protection Act, 2019",
    sourceUrl: "https://www.indiacode.nic.in/handle/123456789/15256",
    keywords: ["service", "not delivered", "never delivered", "delay", "deficiency", "refund", "support"],
    categories: ["consumer"],
    simple: {
      en: "Deficiency means a fault or inadequacy in a service that someone was obliged to perform, including negligence and deliberately withholding relevant information.",
      hi: "सेवा में कमी का अर्थ है वह सेवा ठीक से न देना जिसे करना था, इसमें लापरवाही और जरूरी जानकारी जानबूझकर छिपाना भी शामिल हो सकता है।",
      te: "లోపభూయిష్ట సేవ అంటే చేయాల్సిన సేవలో లోపం లేదా లోటు. నిర్లక్ష్యం మరియు ముఖ్యమైన సమాచారాన్ని కావాలని దాచడం కూడా ఇందులోకి రావచ్చు.",
    },
    why: {
      en: "Non-delivery, or a paid service that was not performed, may be examined as a possible deficiency. The outcome depends on the contract and the evidence.",
      hi: "पैसे लेकर सामान न पहुंचाना या सेवा न करना संभावित कमी के रूप में देखा जा सकता है। परिणाम अनुबंध और सबूत पर निर्भर करता है।",
      te: "డబ్బు తీసుకుని వస్తువు ఇవ్వకపోవడం లేదా సేవ చేయకపోవడం లోపభూయిష్ట సేవగా చూడవచ్చు. ఫలితం ఒప్పందం మరియు ఆధారాలపై ఆధారపడుతుంది.",
    },
  },
  {
    id: "cpa-2-47",
    act: "Consumer Protection Act, 2019",
    section: "Section 2(47)",
    title: "Unfair trade practice",
    jurisdiction: INDIA,
    effectiveNote: "Confirm commencement of the relied-on clause from the notified text on India Code.",
    lastVerified: LAST_VERIFIED,
    sourceName: "India Code — Consumer Protection Act, 2019",
    sourceUrl: "https://www.indiacode.nic.in/handle/123456789/15256",
    keywords: ["misleading", "false", "unfair", "fake", "promise", "advertisement", "refund denied"],
    categories: ["consumer"],
    simple: {
      en: "An unfair trade practice includes false or misleading statements about quality, sponsorship, price, warranty, or the usefulness of goods or services, made to promote a sale or service.",
      hi: "अनुचित व्यापार व्यवहार में गुणवत्ता, कीमत, वारंटी या उपयोगिता के बारे में झूठे या भ्रामक बयान शामिल हो सकते हैं, जो बिक्री बढ़ाने के लिए किए गए हों।",
      te: "అన్యాయ వాణిజ్య పద్ధతిలో నాణ్యత, ధర, వారంటీ లేదా ఉపయోగం గురించి అమ్మకం కోసం చేసిన తప్పు లేదా మోసపూరిత ప్రకటనలు ఉండవచ్చు.",
    },
    why: {
      en: "This may be relevant if the seller's advertisement or promise does not match what was supplied. A mismatch still has to be proved.",
      hi: "यदि विक्रेता के विज्ञापन या वादे से मिला सामान मेल नहीं खाता, तो यह प्रासंगिक हो सकता है। अंतर साबित करना होता है।",
      te: "అమ్మకందారు ప్రకటన లేదా మాటకు వచ్చిన వస్తువు సరిపోకపోతే ఇది సంబంధించవచ్చు. తేడాను నిరూపించాలి.",
    },
  },
  {
    id: "cpa-35",
    act: "Consumer Protection Act, 2019",
    section: "Section 35",
    title: "Manner in which a complaint shall be made",
    jurisdiction: INDIA,
    effectiveNote: "Confirm commencement and the current pecuniary jurisdiction before filing. Filing is also offered electronically as prescribed.",
    lastVerified: LAST_VERIFIED,
    sourceName: "India Code — Consumer Protection Act, 2019",
    sourceUrl: "https://www.indiacode.nic.in/handle/123456789/15256",
    keywords: ["complaint", "consumer commission", "file", "district commission", "e-jagriti", "shopping", "delivered", "product", "refund", "order"],
    categories: ["consumer"],
    simple: {
      en: "A consumer complaint about goods or services may be filed with the District Commission by the consumer, a recognised consumer association, or, in some cases, the government or Central Authority. A prescribed fee can apply. Which commission can hear the case depends on the current value limits.",
      hi: "सामान या सेवा के बारे में उपभोक्ता शिकायत जिला आयोग में दर्ज हो सकती है। निर्धारित शुल्क लग सकता है। कौन सा आयोग सुन सकता है, यह मौजूदा मूल्य-सीमा पर निर्भर करता है।",
      te: "వస్తువులు లేదా సేవల గురించిన వినియోగదారు ఫిర్యాదు జిల్లా కమిషన్‌లో దాఖలు కావచ్చు. నిర్ణయించిన రుసుము వర్తించవచ్చు. ఏ కమిషన్ విన్నది ప్రస్తుత విలువ పరిమితులపై ఆధారపడుతుంది.",
    },
    why: {
      en: "This is the complaint route after earlier grievance steps, if a consumer dispute is made out. NyayaMarg does not decide that a complaint will succeed.",
      hi: "शुरुआती शिकायत के बाद, यदि उपभोक्ता विवाद बनता है, तो यह शिकायत का मार्ग है। न्यायमार्ग यह तय नहीं करता कि शिकायत सफल होगी।",
      te: "ముందు ఫిర్యాదు తర్వాత, వినియోగదారు వివాదం ఏర్పడితే ఇది ఫిర్యాదు మార్గం. ఫిర్యాదు గెలుస్తుందని న్యాయమార్గ్ నిర్ణయించదు.",
    },
  },
  {
    id: "ni-138",
    act: "Negotiable Instruments Act, 1881",
    section: "Section 138",
    title: "Dishonour of cheque for insufficiency of funds",
    jurisdiction: INDIA,
    effectiveNote: "The Negotiable Instruments Act continues. It was not replaced by the Bharatiya Nyaya Sanhita. Cheque validity in banking practice also follows Reserve Bank of India directions and should be checked for the date of the cheque.",
    lastVerified: LAST_VERIFIED,
    sourceName: "India Code — Negotiable Instruments Act, 1881",
    sourceUrl: "https://www.indiacode.nic.in/bitstream/123456789/15327/1/negotiable_instruments_act%2C_1881.pdf",
    keywords: ["cheque", "check", "bounce", "bounced", "dishonour", "dishonor", "insufficient"],
    categories: ["cheque"],
    simple: {
      en: "If a cheque drawn on an account for a legally enforceable debt is returned unpaid for insufficient funds or because it exceeds the arrangement with the bank, section 138 may apply. The statute requires presentation within six months or the cheque's period of validity, whichever is earlier; a written demand within thirty days of receiving the bank's information; and failure to pay within fifteen days of the drawer receiving that notice.",
      hi: "यदि कानूनी रूप से वसूली योग्य ऋण के लिए दिया चेक अपर्याप्त राशि के कारण लौटता है, तो धारा 138 लागू हो सकती है। लिखित मांग बैंक की सूचना मिलने के तीस दिन के भीतर, और नोटिस मिलने के पंद्रह दिन में भुगतान न होना, शर्तों में है।",
      te: "చట్టబద్ధమైన అప్పు కోసం ఇచ్చిన చెక్కు తగినన్ని నిధులు లేక తిరిగి వస్తే సెక్షన్ 138 వర్తించవచ్చు. బ్యాంకు సమాచారం వచ్చిన ముప్పై రోజులలో వ్రాతపూర్వక డిమాండ్, మరియు నోటీసు అందిన పదిహేను రోజులలో చెల్లింపు లేకపోవడం షరతుల్లో ఉన్నాయి.",
    },
    why: {
      en: "Your description refers to a dishonoured cheque. Whether section 138 applies depends on a legally enforceable debt, the bank return memo, and these time conditions. Court practice on counting days should be confirmed.",
      hi: "आपका विवरण अनादरित चेक के बारे में है। धारा 138 लागू होती है या नहीं, यह कानूनी ऋण, बैंक मेमो और समय-सीमा पर निर्भर करता है।",
      te: "మీ వివరణ తిరిగి వచ్చిన చెక్కు గురించి. సెక్షన్ 138 వర్తిస్తుందో లేదో చట్టబద్ధమైన అప్పు, బ్యాంకు మెమో మరియు గడువులపై ఆధారపడుతుంది.",
    },
  },
  {
    id: "ni-142",
    act: "Negotiable Instruments Act, 1881",
    section: "Section 142",
    title: "Cognizance of offences",
    jurisdiction: INDIA,
    effectiveNote: "Read with section 138. A court may take cognizance after one month if the complainant shows sufficient cause for the delay.",
    lastVerified: LAST_VERIFIED,
    sourceName: "India Code — Negotiable Instruments Act, 1881",
    sourceUrl: "https://www.indiacode.nic.in/bitstream/123456789/15327/1/negotiable_instruments_act%2C_1881.pdf",
    keywords: ["cheque", "complaint", "court", "cognizance", "bounce"],
    categories: ["cheque"],
    simple: {
      en: "A court takes cognizance of a section 138 offence on a written complaint by the payee or holder in due course, made within one month of the date the cause of action arises. The court may condone delay if sufficient cause is shown.",
      hi: "धारा 138 का संज्ञान भुगतान पाने वाले की लिखित शिकायत पर होता है, जो वाद-कारण की तारीख से एक माह के भीतर हो। पर्याप्त कारण पर विलंब माफ हो सकता है।",
      te: "సెక్షన్ 138పై కోర్టు చెల్లింపు పొందేవారి వ్రాతపూర్వక ఫిర్యాదుపై దృష్టి పెడుతుంది. అది కారణం పుట్టిన తేదీ నుండి ఒక నెలలోపు ఉండాలి. తగిన కారణం చూపితే ఆలస్యం మన్నించబడవచ్చు.",
    },
    why: {
      en: "This controls how and when a cheque-dishonour complaint is filed. It is not a finding that your complaint is in time.",
      hi: "यह बताता है कि चेक अनादर की शिकायत कैसे और कब दर्ज होती है। यह यह निष्कर्ष नहीं है कि आपकी शिकायत समय पर है।",
      te: "చెక్కు తిరిగి వచ్చిన ఫిర్యాదు ఎలా, ఎప్పుడు దాఖలు అవుతుందో ఇది చెబుతుంది. మీ ఫిర్యాదు గడువులోనే ఉందని ఇది తీర్మానం కాదు.",
    },
  },
  {
    id: "it-66c",
    act: "Information Technology Act, 2000",
    section: "Section 66C",
    title: "Punishment for identity theft",
    jurisdiction: INDIA,
    effectiveNote: "The Information Technology Act continues to operate along with the Bharatiya Nyaya Sanhita for conduct after the relevant commencement dates.",
    lastVerified: LAST_VERIFIED,
    sourceName: "India Code — Information Technology Act, 2000",
    sourceUrl: "https://www.indiacode.nic.in/handle/123456789/1999",
    keywords: ["otp", "password", "identity", "sim", "kyc", "impersonat"],
    categories: ["cyber"],
    simple: {
      en: "Fraudulently or dishonestly using another person's electronic signature, password, or other unique identification feature can be an identity-theft offence under section 66C.",
      hi: "किसी अन्य व्यक्ति के पासवर्ड, इलेक्ट्रॉनिक हस्ताक्षर या विशिष्ट पहचान का बेईमानी से उपयोग धारा 66C के तहत पहचान की चोरी हो सकता है।",
      te: "మరొకరి పాస్‌వర్డ్, ఎలక్ట్రానిక్ సంతకం లేదా ప్రత్యేక గుర్తింపును మోసంగా వాడటం సెక్షన్ 66C కింద గుర్తింపు దొంగతనం కావచ్చు.",
    },
    why: {
      en: "This may be relevant if an OTP, password, or identity credential was misused. It is not attracted by every failed online order.",
      hi: "यदि ओटीपी, पासवर्ड या पहचान का दुरुपयोग हुआ हो तो यह प्रासंगिक हो सकता है। हर असफल ऑनलाइन ऑर्डर पर यह लागू नहीं होता।",
      te: "OTP, పాస్‌వర్డ్ లేదా గుర్తింపు దుర్వినియోగమైతే ఇది సంబంధించవచ్చు. ప్రతి విఫలమైన ఆన్‌లైన్ ఆర్డర్‌కు ఇది వర్తించదు.",
    },
  },
  {
    id: "it-66d",
    act: "Information Technology Act, 2000",
    section: "Section 66D",
    title: "Punishment for cheating by personation using a computer resource",
    jurisdiction: INDIA,
    effectiveNote: "Read the current India Code text. Cyber complaints can be reported at the National Cyber Crime Reporting Portal.",
    lastVerified: LAST_VERIFIED,
    sourceName: "India Code — Information Technology Act, 2000",
    sourceUrl: "https://www.indiacode.nic.in/handle/123456789/1999",
    keywords: ["phishing", "fraud", "personation", "fake website", "fake call", "cyber", "online fraud", "without permission", "unauthorised", "unauthorized", "bank account"],
    categories: ["cyber"],
    simple: {
      en: "Cheating by pretending to be another person, through a computer resource or communication device, is addressed by section 66D.",
      hi: "कंप्यूटर या संचार यंत्र के जरिए किसी अन्य व्यक्ति बनकर धोखा देना धारा 66D से जुड़ा हो सकता है।",
      te: "కంప్యూటర్ లేదా కమ్యూనికేషన్ పరికరం ద్వారా మరొకరి వలె నటించి మోసం చేయడం సెక్షన్ 66Dకు సంబంధించవచ్చు.",
    },
    why: {
      en: "This can be looked at when a computer or phone was used to pretend to be someone else, including an unauthorised transfer. The section is not proved merely because money left an account.",
      hi: "जब कंप्यूटर या फोन से किसी और बनकर लेनदेन हो, जिसमें बिना अनुमति का अंतरण भी शामिल हो सकता है, तब यह देखा जा सकता है। केवल खाते से पैसे निकलने से धारा साबित नहीं होती।",
      te: "కంప్యూటర్ లేదా ఫోన్ ద్వారా మరొకరిలా నటించి లావాదేవీ జరిగితే, అనుమతి లేని బదిలీతో సహా, ఇది చూడవచ్చు. ఖాతా నుండి డబ్బు వెళ్లడం మాత్రమే సెక్షన్‌ను నిరూపించదు.",
    },
  },
  {
    id: "bns-318",
    act: "Bharatiya Nyaya Sanhita, 2023",
    section: "Section 318",
    title: "Cheating",
    jurisdiction: INDIA,
    effectiveNote: "Brought into force on 1 July 2024 by Ministry of Home Affairs notification S.O. 850(E), except section 106(2). Offences before that date may continue under the earlier law, subject to transitional provisions. This is not an automatic replacement for every consumer dispute.",
    lastVerified: LAST_VERIFIED,
    sourceName: "India Code — Bharatiya Nyaya Sanhita, 2023",
    sourceUrl: "https://www.indiacode.nic.in/handle/123456789/20062",
    keywords: ["cheat", "cheating", "fraud", "deceived", "dishonest", "scam"],
    categories: ["cyber", "criminal", "consumer"],
    simple: {
      en: "Cheating under section 318 involves deceiving a person, dishonestly or fraudulently, so that they deliver property or do something they would not otherwise do, causing or likely causing harm to body, mind, reputation, or property.",
      hi: "धारा 318 के तहत धोखा तब बन सकता है जब किसी को बेईमानी से गुमराह कर संपत्ति दिलवाई जाए या ऐसा काम करवाया जाए जो वह अन्यथा न करता, जिससे नुकसान हो।",
      te: "సెక్షన్ 318 కింద మోసం అంటే ఒకరిని నిజాయితీ లేకుండా మోసగించి ఆస్తి ఇప్పించడం లేదా వారు చేయని పని చేయించి హాని కలగడం.",
    },
    why: {
      en: "Some money disputes overlap with cheating, but a broken commercial promise is not automatically a criminal offence. A police or legal-aid officer should assess the facts.",
      hi: "कुछ धन विवाद धोखे से मिलते हैं, पर हर टूटा वादा स्वतः आपराधिक अपराध नहीं होता। तथ्यों का आकलन कानूनी सहायता या पुलिस से होना चाहिए।",
      te: "కొన్ని డబ్బు వివాదాలు మోసంతో కలుస్తాయి, కానీ ప్రతి అమలు కాని మాట స్వయంగా నేరం కాదు. వాస్తవాలను న్యాయ సహాయం లేదా పోలీసులు చూడాలి.",
    },
  },
  {
    id: "bns-316",
    act: "Bharatiya Nyaya Sanhita, 2023",
    section: "Section 316",
    title: "Criminal breach of trust",
    jurisdiction: INDIA,
    effectiveNote: "In force from 1 July 2024, subject to the commencement notification and transitional provisions for earlier conduct.",
    lastVerified: LAST_VERIFIED,
    sourceName: "India Code — Bharatiya Nyaya Sanhita, 2023",
    sourceUrl: "https://www.indiacode.nic.in/handle/123456789/20062",
    keywords: ["entrusted", "trust", "misappropriat", "agent", "kept my money"],
    categories: ["criminal", "cyber"],
    simple: {
      en: "Criminal breach of trust involves property that was entrusted to someone, or over which they had control, and which they dishonestly convert or use against the terms of that trust.",
      hi: "आपराधिक न्यास-भंग में वह संपत्ति शामिल है जो किसी को सौंपी गई थी और जिसे उसने बेईमानी से अपने उपयोग में ले लिया।",
      te: "నమ్మక ఉల్లంఘనలో ఒకరికి అప్పగించిన ఆస్తిని నిజాయితీ లేకుండా తమ ఉపయోగంలోకి మార్చడం ఉంటుంది.",
    },
    why: {
      en: "This is listed only if the description suggests money or property was entrusted and then misused. A simple unpaid bill is not enough.",
      hi: "यह तभी सूची में है जब विवरण से लगे कि संपत्ति सौंपी गई और फिर दुरुपयोग हुई। केवल बकाया बिल पर्याप्त नहीं है।",
      te: "ఆస్తి అప్పగించి దుర్వినియోగం చేశారని వివరణ సూచిస్తేనే ఇది జాబితాలో ఉంటుంది. కేవలం బకాయి సరిపోదు.",
    },
  },
  {
    id: "bns-303",
    act: "Bharatiya Nyaya Sanhita, 2023",
    section: "Section 303",
    title: "Theft",
    jurisdiction: INDIA,
    effectiveNote: "In force from 1 July 2024, subject to transitional provisions for earlier conduct.",
    lastVerified: LAST_VERIFIED,
    sourceName: "India Code — Bharatiya Nyaya Sanhita, 2023",
    sourceUrl: "https://www.indiacode.nic.in/handle/123456789/20062",
    keywords: ["theft", "stolen", "stole", "pickpocket"],
    categories: ["criminal"],
    simple: {
      en: "Theft is dishonestly taking movable property out of someone's possession without that person's consent.",
      hi: "चोरी का अर्थ है किसी की सहमति के बिना चल संपत्ति को बेईमानी से उसके कब्जे से निकालना।",
      te: "దొంగతనం అంటే ఒకరి సమ్మతి లేకుండా వారి స్వాధీనంలోని కదిలే ఆస్తిని నిజాయితీ లేకుండా తీసుకెళ్లడం.",
    },
    why: {
      en: "This may be relevant if property was taken without consent. An unpaid contractual claim is a different kind of dispute.",
      hi: "यदि संपत्ति बिना सहमति ली गई हो तो यह प्रासंगिक हो सकता है। अनुबंध का बकाया दावा अलग प्रकार का विवाद है।",
      te: "సమ్మతి లేకుండా ఆస్తి తీసుకుంటే ఇది సంబంధించవచ్చు. ఒప్పంద బకాయి వేరే వివాదం.",
    },
  },
  {
    id: "contract-73",
    act: "Indian Contract Act, 1872",
    section: "Section 73",
    title: "Compensation for loss or damage caused by breach of contract",
    jurisdiction: INDIA,
    effectiveNote: "A general contract principle. State tenancy and consumer laws can provide a more specific route.",
    lastVerified: LAST_VERIFIED,
    sourceName: "India Code",
    sourceUrl: "https://www.indiacode.nic.in/",
    keywords: ["contract", "agreement", "breach", "deposit", "refund", "lease"],
    categories: ["civil", "consumer", "labour"],
    simple: {
      en: "When a contract is broken, the party who suffers may claim compensation for loss that naturally arose from the breach, or that the parties knew was likely when they made the contract. Remote or indirect loss is not the measure stated in the section.",
      hi: "अनुबंध टूटने पर पीड़ित पक्ष उस हानि का मुआवजा मांग सकता है जो स्वाभाविक रूप से टूटने से हुई, या जिसके बारे में पक्षों को पता था। दूर की हानि इस धारा का माप नहीं है।",
      te: "ఒప్పందం ఉల్లంఘిస్తే నష్టపోయిన వారు ఆ ఉల్లంఘన వల్ల సహజంగా వచ్చిన నష్టానికి పరిహారం అడగవచ్చు. దూరపు నష్టం ఈ సెక్షన్ కొలత కాదు.",
    },
    why: {
      en: "A deposit, salary promise, or paid order may also be a contract. The correct forum can still be a consumer, labour, or tenancy forum rather than a civil suit.",
      hi: "जमा राशि, वेतन का वादा या भुगतान किया ऑर्डर अनुबंध भी हो सकता है। सही मंच फिर भी उपभोक्ता, श्रम या किराया मंच हो सकता है।",
      te: "డిపాజిట్, జీతం మాట లేదా చెల్లించిన ఆర్డర్ ఒప్పందం కావచ్చు. సరైన వేదిక వినియోగదారు, కార్మిక లేదా అద్దె వేదిక కావచ్చు.",
    },
  },
  {
    id: "mv-129",
    act: "Motor Vehicles Act, 1988",
    section: "Section 129",
    title: "Wearing of protective headgear",
    jurisdiction: INDIA,
    effectiveNote: "The Act has been amended, including by the Motor Vehicles (Amendment) Act, 2019. Read the current text before relying on a penalty amount.",
    lastVerified: LAST_VERIFIED,
    sourceName: "India Code — Motor Vehicles Act, 1988",
    sourceUrl: "https://www.indiacode.nic.in/bitstream/123456789/15390/1/the_motor_vehicles_act%2C_1988.pdf",
    keywords: ["helmet", "two wheeler", "motorcycle", "bike", "headgear"],
    categories: ["traffic"],
    simple: {
      en: "Every person above four years of age driving, riding, or being carried on a motorcycle in a public place must wear protective headgear of the prescribed standard. A Sikh wearing a turban while riding is exempt.",
      hi: "सार्वजनिक स्थान पर मोटरसाइकिल चलाते या उस पर बैठे चार वर्ष से अधिक आयु के प्रत्येक व्यक्ति को निर्धारित मानक का हेलमेट पहनना होता है। पगड़ी पहनने वाले सिख को छूट है।",
      te: "బహిరంగ ప్రదేశంలో మోటార్‌సైకిల్ నడిపేవారు లేదా ఎక్కేవారు, నాలుగు ఏళ్లు పైబడినవారు, నిర్దేశిత ప్రమాణపు హెల్మెట్ ధరించాలి. తలపాగా ధరించిన సిక్కు వ్యక్తికి మినహాయింపు ఉంది.",
    },
    why: {
      en: "This may apply to a helmet challan or a two-wheeler safety question. The challan itself should be read for the exact allegation.",
      hi: "यह हेलमेट चालान या दोपहिया सुरक्षा प्रश्न पर लागू हो सकता है। चालान में सटीक आरोप पढ़ें।",
      te: "ఇది హెల్మెట్ చలాన్ లేదా ద్విచక్ర భద్రత ప్రశ్నకు వర్తించవచ్చు. ఖచ్చితమైన ఆరోపణ కోసం చలాన్ చదవండి.",
    },
  },
  {
    id: "mv-134",
    act: "Motor Vehicles Act, 1988",
    section: "Section 134",
    title: "Duty of driver in case of accident and injury to a person",
    jurisdiction: INDIA,
    effectiveNote: "Read the current section, including amendments. If someone is injured now, call 112 or 108 before using this app.",
    lastVerified: LAST_VERIFIED,
    sourceName: "India Code — Motor Vehicles Act, 1988",
    sourceUrl: "https://www.indiacode.nic.in/bitstream/123456789/15390/1/the_motor_vehicles_act%2C_1988.pdf",
    keywords: ["accident", "crash", "hit", "injury", "injured", "collision"],
    categories: ["traffic"],
    simple: {
      en: "A driver involved in an accident that injures a person has duties under section 134, including taking reasonable steps to secure medical attention, giving information, and reporting as the section requires.",
      hi: "दुर्घटना में किसी व्यक्ति के घायल होने पर चालक के धारा 134 के तहत कर्तव्य हैं, जिनमें चिकित्सीय सहायता और आवश्यक सूचना देना शामिल है।",
      te: "ప్రమాదంలో ఎవరైనా గాయపడితే డ్రైవర్‌కు సెక్షన్ 134 కింద వైద్య సహాయం మరియు అవసరమైన సమాచారం ఇచ్చే విధులు ఉంటాయి.",
    },
    why: {
      en: "This is relevant to a road accident with injury. It does not decide fault or insurance compensation.",
      hi: "यह चोट वाली सड़क दुर्घटना से जुड़ा है। यह दोष या बीमा मुआवजा तय नहीं करता।",
      te: "ఇది గాయంతో కూడిన రోడ్డు ప్రమాదానికి సంబంధించినది. తప్పు లేదా బీమా పరిహారాన్ని ఇది నిర్ణయించదు.",
    },
  },
  {
    id: "mv-184",
    act: "Motor Vehicles Act, 1988",
    section: "Section 184",
    title: "Driving dangerously",
    jurisdiction: INDIA,
    effectiveNote: "Penalties were amended in 2019. Do not rely on an old fine figure. Read the current section.",
    lastVerified: LAST_VERIFIED,
    sourceName: "India Code — Motor Vehicles Act, 1988",
    sourceUrl: "https://www.indiacode.nic.in/bitstream/123456789/15390/1/the_motor_vehicles_act%2C_1988.pdf",
    keywords: ["rash", "dangerous driving", "red light", "overspeed", "mobile while driving", "wrong side"],
    categories: ["traffic"],
    simple: {
      en: "Driving at a speed or in a manner dangerous to the public, having regard to the place and traffic, is punishable. The explanation added by amendment treats conduct such as jumping a red light and using a handheld device while driving as dangerous driving.",
      hi: "स्थान और यातायात को देखते हुए जनता के लिए खतरनाक ढंग से चलाना दंडनीय है। संशोधन लाल बत्ती कूदने और चलाते समय हैंडहेल्ड उपकरण के उपयोग को भी खतरनाक चालान में रखता है।",
      te: "ప్రదేశం మరియు ట్రాఫిక్‌ను బట్టి ప్రజలకు ప్రమాదకరంగా నడపడం శిక్షార్హం. సవరణ ఎరుపు లైట్ దాటడం మరియు నడుపుతూ హ్యాండ్‌హెల్డ్ పరికరం వాడటాన్ని కూడా ప్రమాదకర డ్రైవింగ్‌గా చూస్తుంది.",
    },
    why: {
      en: "This may match a challan or complaint about dangerous driving. The exact allegation is on the challan or police papers.",
      hi: "यह खतरनाक ड्राइविंग के चालान या शिकायत से मेल खा सकता है। सटीक आरोप चालान पर होता है।",
      te: "ఇది ప్రమాదకర డ్రైవింగ్ చలాన్ లేదా ఫిర్యాదుతో సరిపోవచ్చు. ఖచ్చితమైన ఆరోపణ చలాన్‌పై ఉంటుంది.",
    },
  },
  {
    id: "const-21",
    act: "Constitution of India",
    section: "Article 21",
    title: "Protection of life and personal liberty",
    jurisdiction: "India",
    effectiveNote: "Part of the Constitution. Enforcement is through competent courts and authorities, not through this application.",
    lastVerified: LAST_VERIFIED,
    sourceName: "Legislative Department — Constitution of India",
    sourceUrl: "https://legislative.gov.in/constitution-of-india/",
    keywords: ["liberty", "life", "illegal detention", "custody", "fundamental"],
    categories: ["rights", "criminal"],
    simple: {
      en: "No person shall be deprived of life or personal liberty except according to procedure established by law.",
      hi: "किसी व्यक्ति को विधि द्वारा स्थापित प्रक्रिया के अनुसार ही जीवन या दैहिक स्वतंत्रता से वंचित किया जा सकता है।",
      te: "చట్టం ఏర్పాటు చేసిన విధానం ప్రకారం తప్ప ఎవరి ప్రాణం లేదా వ్యక్తిగత స్వేచ్ఛను తీసివేయకూడదు.",
    },
    why: {
      en: "This is relevant background when someone describes custody, a threat to life, or action by a public authority. It is not a case result.",
      hi: "हिरासत, जीवन का खतरा या सार्वजनिक प्राधिकारी की कार्रवाई के विवरण में यह पृष्ठभूमि प्रासंगिक है। यह मामले का परिणाम नहीं है।",
      te: "నిర్బంధం, ప్రాణాల ముప్పు లేదా ప్రభుత్వ అధికారి చర్య వివరణలో ఇది నేపథ్యం. ఇది కేసు ఫలితం కాదు.",
    },
  },
  {
    id: "const-22",
    act: "Constitution of India",
    section: "Article 22",
    title: "Protection against arrest and detention in certain cases",
    jurisdiction: "India",
    effectiveNote: "Read the full article, including the exceptions it states.",
    lastVerified: LAST_VERIFIED,
    sourceName: "Legislative Department — Constitution of India",
    sourceUrl: "https://legislative.gov.in/constitution-of-india/",
    keywords: ["arrest", "detained", "custody", "lawyer", "grounds of arrest"],
    categories: ["rights", "criminal"],
    simple: {
      en: "Article 22 gives protections to a person who is arrested, including being informed of the grounds of arrest and being allowed to consult a legal practitioner of their choice, subject to the exceptions written in the article.",
      hi: "अनुच्छेद 22 गिरफ्तार व्यक्ति को गिरफ्तारी के आधार बताने और अपनी पसंद के अधिवक्ता से परामर्श की सुरक्षा देता है, उन अपवादों के साथ जो अनुच्छेद में लिखे हैं।",
      te: "ఆర్టికల్ 22 అరెస్టు అయిన వ్యక్తికి అరెస్టు కారణాలు తెలపడం మరియు తమకు నచ్చిన న్యాయవాదిని సంప్రదించడం వంటి రక్షణలు ఇస్తుంది. అందులో రాసిన మినహాయింపులు వర్తిస్తాయి.",
    },
    why: {
      en: "Shown when the description mentions arrest or detention. Immediate danger should go to 112, and a person in custody should be put in touch with family or legal aid.",
      hi: "जब विवरण में गिरफ्तारी या हिरासत हो तब दिखाया जाता है। तत्काल खतरे पर 112 पर संपर्क करें।",
      te: "వివరణలో అరెస్టు లేదా నిర్బంధం ఉంటే చూపిస్తాం. తక్షణ ప్రమాదంలో 112కు సంప్రదించండి.",
    },
  },
  {
    id: "lsa-12",
    act: "Legal Services Authorities Act, 1987",
    section: "Section 12",
    title: "Criteria for giving legal services",
    jurisdiction: INDIA,
    effectiveNote: "Eligibility also depends on income limits and categories prescribed by the authority. A child is a listed category. This app does not grant legal aid.",
    lastVerified: LAST_VERIFIED,
    sourceName: "National Legal Services Authority",
    sourceUrl: "https://nalsa.gov.in/",
    keywords: ["legal aid", "free lawyer", "child", "woman", "income"],
    categories: ["rights", "consumer", "criminal", "civil", "labour", "cyber", "traffic", "cheque"],
    simple: {
      en: "Section 12 sets out who is entitled to legal services, including women, children, members of Scheduled Castes or Scheduled Tribes, and persons whose income is below the prescribed limit. The authority decides eligibility.",
      hi: "धारा 12 बताती है कि किसे विधिक सेवा मिल सकती है, जिनमें महिलाएं, बच्चे, अनुसूचित जाति या जनजाति के व्यक्ति और निर्धारित आय से कम आय वाले व्यक्ति शामिल हैं। पात्रता प्राधिकरण तय करता है।",
      te: "సెక్షన్ 12 ఎవరికి న్యాయ సేవలు లభిస్తాయో చెబుతుంది. మహిళలు, పిల్లలు, షెడ్యూల్డ్ కులాలు లేదా తెగల వారు, మరియు నిర్ణయించిన ఆదాయం కంటే తక్కువ వారు ఉంటారు. అర్హతను అథారిటీ నిర్ణయిస్తుంది.",
    },
    why: {
      en: "Included so you can ask the Legal Services Authority whether you are eligible. Being shown this section is not an approval of aid.",
      hi: "यह इसलिए है कि आप विधिक सेवा प्राधिकरण से पात्रता पूछ सकें। इस धारा का दिखना सहायता की मंजूरी नहीं है।",
      te: "మీరు లీగల్ సర్వీసెస్ అథారిటీని అర్హత అడగడానికి ఇది ఉంది. ఈ సెక్షన్ కనిపించడం సహాయం ఆమోదం కాదు.",
    },
  },
];

export const PLAYBOOKS: CategoryPlaybook[] = [
  {
    id: "consumer",
    label: { en: "Consumer dispute", hi: "उपभोक्ता विवाद", te: "వినియోగదారు వివాదం" },
    group: "consumer",
    keywords: ["consumer", "shopping", "order", "delivered", "delivery", "defective", "defect", "refund", "warranty", "seller", "product", "amazon", "flipkart", "invoice", "goods", "not delivered", "never delivered", "did not deliver", "didn't deliver", "faulty"],
    facts: [
      { id: "paid", label: { en: "Payment is mentioned", hi: "भुगतान का उल्लेख है", te: "చెల్లింపు ప్రస్తావన ఉంది" }, test: /paid|payment|money|₹|rs\.?|rupee|upi|debited|amount/i },
      { id: "seller", label: { en: "A seller or platform is mentioned", hi: "विक्रेता या प्लेटफ़ॉर्म का उल्लेख है", te: "అమ్మకందారు లేదా ప్లాట్‌ఫాం ప్రస్తావన ఉంది" }, test: /seller|shop|company|amazon|flipkart|platform|website|store|dealer/i },
      { id: "order", label: { en: "An order or goods are mentioned", hi: "ऑर्डर या सामान का उल्लेख है", te: "ఆర్డర్ లేదా వస్తువు ప్రస్తావన ఉంది" }, test: /order|product|goods|item|parcel|delivery|delivered/i },
      { id: "date", label: { en: "A date is mentioned", hi: "कोई तारीख है", te: "తేదీ ఉంది" }, test: /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i },
    ],
    questions: [
      { en: "On what date did you pay, and on what date was delivery due?", hi: "आपने किस तारीख को भुगतान किया और डिलीवरी किस तारीख को होनी थी?", te: "మీరు ఏ తేదీన చెల్లించారు మరియు డెలివరీ ఏ తేదీకి రావాలి?" },
      { en: "What is the order number, amount, and seller or platform name?", hi: "ऑर्डर नंबर, राशि और विक्रेता या प्लेटफ़ॉर्म का नाम क्या है?", te: "ఆర్డర్ నంబర్, మొత్తం మరియు అమ్మకందారు లేదా ప్లాట్‌ఫాం పేరు ఏమిటి?" },
      { en: "Have you already written to the seller or raised a grievance on the platform?", hi: "क्या आप विक्रेता को लिख चुके हैं या प्लेटफ़ॉर्म पर शिकायत कर चुके हैं?", te: "మీరు అమ్మకందారుకు రాశారా లేదా ప్లాట్‌ఫాంపై ఫిర్యాదు చేశారా?" },
    ],
    documents: [
      { name: "Order confirmation or invoice", why: { en: "Shows what was bought and from whom.", hi: "दिखाता है कि क्या और किससे खरीदा गया।", te: "ఏమి, ఎవరి నుండి కొన్నారో చూపిస్తుంది." } },
      { name: "Payment receipt, UPI record, or bank entry", why: { en: "Shows that money was paid.", hi: "दिखाता है कि पैसे दिए गए।", te: "డబ్బు చెల్లించినట్లు చూపిస్తుంది." } },
      { name: "Screenshots of the product page and messages", why: { en: "Preserves what was promised and what the seller replied.", hi: "वादे और विक्रेता के जवाब को सुरक्षित रखता है।", te: "మాట మరియు అమ్మకందారు సమాధానాన్ని భద్రపరుస్తుంది." } },
      { name: "Photographs of defective goods, if received", why: { en: "Shows the condition of goods that arrived.", hi: "मिले सामान की स्थिति दिखाता है।", te: "వచ్చిన వస్తువు స్థితిని చూపిస్తుంది." } },
      { name: "Complaint or ticket number, if any", why: { en: "Shows that a grievance was already raised.", hi: "दिखाता है कि शिकायत पहले की जा चुकी है।", te: "ఫిర్యాదు ఇప్పటికే చేశారని చూపిస్తుంది." } },
    ],
    remedies: [
      { en: "Ask the seller or platform grievance channel for delivery or a refund, in writing.", hi: "विक्रेता या प्लेटफ़ॉर्म की शिकायत व्यवस्था से लिखित में डिलीवरी या धनवापसी मांगें।", te: "అమ్మకందారు లేదా ప్లాట్‌ఫాం ఫిర్యాదు మార్గంలో వ్రాతపూర్వకంగా డెలివరీ లేదా వాపసు అడగండి." },
      { en: "If unresolved, contact the National Consumer Helpline (1915 / consumerhelpline.gov.in).", hi: "यदि हल न हो, तो राष्ट्रीय उपभोक्ता हेल्पलाइन (1915 / consumerhelpline.gov.in) से संपर्क करें।", te: "పరిష్కారం కాకపోతే నేషనల్ కన్స్యూమర్ హెల్ప్‌లైన్ (1915 / consumerhelpline.gov.in)ను సంప్రదించండి." },
      { en: "If appropriate, explore a complaint on e-Jagriti before the Consumer Commission. The correct commission depends on current jurisdiction rules.", hi: "यदि उचित हो, तो उपभोक्ता आयोग से पहले e-Jagriti पर शिकायत देखें। सही आयोग मौजूदा क्षेत्राधिकार नियमों पर निर्भर करता है।", te: "తగితే, వినియోగదారు కమిషన్ ముందు e-Jagriti పై ఫిర్యాదు చూడండి. సరైన కమిషన్ ప్రస్తుత అధికార పరిధిపై ఆధారపడుతుంది." },
    ],
    flow: [
      { title: { en: "You", hi: "आप", te: "మీరు" }, detail: { en: "Collect the order, payment, and messages.", hi: "ऑर्डर, भुगतान और संदेश एकत्र करें।", te: "ఆర్డర్, చెల్లింపు మరియు సందేశాలు సేకరించండి." } },
      { title: { en: "Seller or platform", hi: "विक्रेता या प्लेटफ़ॉर्म", te: "అమ్మకందారు లేదా ప్లాట్‌ఫాం" }, detail: { en: "Use the published grievance or support channel.", hi: "प्रकाशित शिकायत या सहायता माध्यम का उपयोग करें।", te: "ప్రచురిత ఫిర్యాదు లేదా సహాయ మార్గం వాడండి." } },
      { title: { en: "National Consumer Helpline", hi: "राष्ट्रीय उपभोक्ता हेल्पलाइन", te: "నేషనల్ కన్స్యూమర్ హెల్ప్‌లైన్" }, detail: { en: "1915 and consumerhelpline.gov.in.", hi: "1915 और consumerhelpline.gov.in।", te: "1915 మరియు consumerhelpline.gov.in." } },
      { title: { en: "Consumer Commission, if appropriate", hi: "उपभोक्ता आयोग, यदि उचित हो", te: "వినియోగదారు కమిషన్, తగితే" }, detail: { en: "Filing portal: e-Jagriti. Jurisdiction depends on the current rules and claim.", hi: "पोर्टल: e-Jagriti। क्षेत्राधिकार मौजूदा नियमों और दावे पर निर्भर है।", te: "పోర్టల్: e-Jagriti. అధికార పరిధి ప్రస్తుత నియమాలు మరియు దావాపై ఆధారపడుతుంది." } },
      { title: { en: "Track the reference", hi: "संदर्भ संख्या ट्रैक करें", te: "రిఫరెన్స్ ట్రాక్ చేయండి" }, detail: { en: "Keep the complaint number and hearing or response dates you actually receive.", hi: "शिकायत संख्या और जो तारीखें वास्तव में मिलें उन्हें रखें।", te: "ఫిర్యాదు నంబర్ మరియు మీకు నిజంగా వచ్చిన తేదీలు ఉంచుకోండి." } },
    ],
    steps: [
      {
        title: { en: "Collect the order information", hi: "ऑर्डर की जानकारी एकत्र करें", te: "ఆర్డర్ సమాచారం సేకరించండి" },
        explanation: { en: "Write down the order number, date, item, price, and the seller or platform name.", hi: "ऑर्डर नंबर, तारीख, वस्तु, कीमत और विक्रेता या प्लेटफ़ॉर्म का नाम लिखें।", te: "ఆర్డర్ నంబర్, తేదీ, వస్తువు, ధర మరియు అమ్మకందారు లేదా ప్లాట్‌ఫాం పేరు రాయండి." },
        documents: ["Order confirmation", "Invoice"],
        where: { en: "Your email, app, or account order history", hi: "आपका ईमेल, ऐप या खाते का ऑर्डर इतिहास", te: "మీ ఈమెయిల్, యాప్ లేదా ఖాతా ఆర్డర్ చరిత్ర" },
        url: null,
        urlLabel: null,
        timing: { en: "Do this promptly so records are not lost. There is no single statutory hour-count for this preparatory step.", hi: "रिकॉर्ड न खोएं, इसलिए जल्दी करें। इस तैयारी चरण की कोई एक वैधानिक घंटे-गिनती नहीं है।", te: "రికార్డులు పోకుండా త్వరగా చేయండి. ఈ సిద్ధత దశకు ఒకే చట్టపరమైన గంటల లెక్క లేదు." },
      },
      {
        title: { en: "Save payment and communication records", hi: "भुगतान और संवाद के रिकॉर्ड सहेजें", te: "చెల్లింపు మరియు సంభాషణ రికార్డులు భద్రపరచండి" },
        explanation: { en: "Keep the payment success screen, bank or UPI entry, and chats or emails with the seller.", hi: "भुगतान स्क्रीन, बैंक या यूपीआई प्रविष्टि और विक्रेता से बातचीत सहेजें।", te: "చెల్లింపు స్క్రీన్, బ్యాంక్ లేదా UPI ఎంట్రీ మరియు అమ్మకందారుతో సంభాషణ ఉంచుకోండి." },
        documents: ["Payment receipt", "Screenshots", "Email or chat"],
        where: { en: "Your own records", hi: "आपके अपने रिकॉर्ड", te: "మీ స్వంత రికార్డులు" },
        url: null,
        urlLabel: null,
        timing: null,
      },
      {
        title: { en: "Contact the seller's grievance channel", hi: "विक्रेता के शिकायत माध्यम से संपर्क करें", te: "అమ్మకందారు ఫిర్యాదు మార్గాన్ని సంప్రదించండి" },
        explanation: { en: "Send a short written complaint asking for delivery or refund. Keep the ticket number.", hi: "डिलीवरी या धनवापसी मांगते हुए संक्षिप्त लिखित शिकायत भेजें। टिकट नंबर रखें।", te: "డెలివరీ లేదా వాపసు అడుగుతూ చిన్న వ్రాతపూర్వక ఫిర్యాదు పంపండి. టికెట్ నంబర్ ఉంచుకోండి." },
        documents: ["Written complaint", "Ticket number"],
        where: { en: "The seller or platform's published customer-support or grievance page", hi: "विक्रेता या प्लेटफ़ॉर्म का प्रकाशित सहायता या शिकायत पृष्ठ", te: "అమ్మకందారు లేదా ప్లాట్‌ఫాం ప్రచురిత సహాయ లేదా ఫిర్యాదు పేజీ" },
        url: null,
        urlLabel: null,
        timing: { en: "Use the time stated in the platform's own grievance policy, if it publishes one. NyayaMarg does not invent a deadline.", hi: "यदि प्लेटफ़ॉर्म की अपनी समय-सीमा प्रकाशित हो तो उसका उपयोग करें। न्यायमार्ग समय-सीमा नहीं गढ़ता।", te: "ప్లాట్‌ఫాం తన గడువు ప్రచురించినట్లయితే దానిని వాడండి. న్యాయమార్గ్ గడువు కల్పించదు." },
      },
      {
        title: { en: "Contact the National Consumer Helpline if it remains unresolved", hi: "यदि हल न हो तो राष्ट्रीय उपभोक्ता हेल्पलाइन से संपर्क करें", te: "పరిష్కారం కాకపోతే నేషనల్ కన్స్యూమర్ హెల్ప్‌లైన్‌ను సంప్రదించండి" },
        explanation: { en: "The helpline can register a consumer grievance. Keep the acknowledgement.", hi: "हेल्पलाइन उपभोक्ता शिकायत दर्ज कर सकती है। पावती रखें।", te: "హెల్ప్‌లైన్ వినియోగదారు ఫిర్యాదు నమోదు చేయవచ్చు. అంగీకారం ఉంచుకోండి." },
        documents: ["Helpline acknowledgement"],
        where: { en: "National Consumer Helpline", hi: "राष्ट्रीय उपभोक्ता हेल्पलाइन", te: "నేషనల్ కన్స్యూమర్ హెల్ప్‌లైన్" },
        url: "https://consumerhelpline.gov.in/",
        urlLabel: "consumerhelpline.gov.in",
        timing: { en: "Helpline: 1915. Call timing should be confirmed on the official website.", hi: "हेल्पलाइन: 1915। कॉल का समय आधिकारिक वेबसाइट पर देखें।", te: "హెల్ప్‌లైన్: 1915. కాల్ సమయం అధికారిక వెబ్‌సైట్‌పై చూడండి." },
      },
      {
        title: { en: "Explore a Consumer Commission complaint if appropriate", hi: "यदि उचित हो तो उपभोक्ता आयोग की शिकायत देखें", te: "తగితే వినియోగదారు కమిషన్ ఫిర్యాదు చూడండి" },
        explanation: { en: "A complaint can be filed electronically. Check which commission has jurisdiction for your claim value before filing. A recognised consumer association or legal aid office can help you decide.", hi: "शिकायत इलेक्ट्रॉनिक रूप से दर्ज हो सकती है। दाखिल करने से पहले देखें कि आपके दावे के लिए कौन सा आयोग सक्षम है।", te: "ఫిర్యాదు ఎలక్ట్రానిక్‌గా దాఖలు కావచ్చు. దాఖలు చేసే ముందు మీ దావాకు ఏ కమిషన్ అధికారం ఉందో చూడండి." },
        documents: ["Complaint draft", "Supporting papers", "Fee receipt if a fee is prescribed"],
        where: { en: "e-Jagriti portal", hi: "e-Jagriti पोर्टल", te: "e-Jagriti పోర్టల్" },
        url: "https://e-jagriti.gov.in/",
        urlLabel: "e-jagriti.gov.in",
        timing: null,
      },
      {
        title: { en: "Save the reference and track it", hi: "संदर्भ सहेजें और ट्रैक करें", te: "రిఫరెన్స్ భద్రపరచి ట్రాక్ చేయండి" },
        explanation: { en: "Store the complaint number and any date the authority actually gives you. Do not enter a hearing date that you have not received.", hi: "शिकायत संख्या और प्राधिकरण द्वारा दी गई तारीख रखें। जो तारीख न मिली हो उसे दर्ज न करें।", te: "ఫిర్యాదు నంబర్ మరియు అథారిటీ ఇచ్చిన తేదీ ఉంచుకోండి. రాని తేదీని నమోదు చేయవద్దు." },
        documents: ["Complaint reference"],
        where: { en: "NyayaMarg case notes, plus the official portal", hi: "न्यायमार्ग के नोट्स और आधिकारिक पोर्टल", te: "న్యాయమార్గ్ నోట్స్ మరియు అధికారిక పోర్టల్" },
        url: "https://e-jagriti.gov.in/",
        urlLabel: "e-jagriti.gov.in",
        timing: null,
      },
    ],
    authorities: [
      { name: "National Consumer Helpline", url: "https://consumerhelpline.gov.in/", phone: "1915", note: { en: "Government consumer grievance helpline.", hi: "सरकारी उपभोक्ता शिकायत हेल्पलाइन।", te: "ప్రభుత్వ వినియోగదారు ఫిర్యాదు హెల్ప్‌లైన్." } },
      { name: "e-Jagriti", url: "https://e-jagriti.gov.in/", phone: null, note: { en: "Official portal for consumer commission filings.", hi: "उपभोक्ता आयोग में दाखिल करने का आधिकारिक पोर्टल।", te: "వినియోగదారు కమిషన్ దాఖలాతీకు అధికారిక పోర్టల్." } },
      { name: "Department of Consumer Affairs", url: "https://consumeraffairs.nic.in/", phone: null, note: { en: "Ministry page for consumer affairs.", hi: "उपभोक्ता मामलों का मंत्रालय पृष्ठ।", te: "వినియోగదారు వ్యవహారాల మంత్రిత్వ పేజీ." } },
    ],
  },
  {
    id: "cyber",
    label: { en: "Cyber or unauthorised payment", hi: "साइबर या बिना अनुमति भुगतान", te: "సైబర్ లేదా అనుమతి లేని చెల్లింపు" },
    group: "cyber",
    keywords: ["cyber", "otp", "phishing", "hacked", "hacking", "unauthorized", "unauthorised", "without permission", "upi fraud", "online fraud", "cyber fraud", "fake link", "kyc", "password", "bank account", "transferred"],
    facts: [
      { id: "amount", label: { en: "An amount or transfer is mentioned", hi: "राशि या अंतरण का उल्लेख है", te: "మొత్తం లేదా బదిలీ ప్రస్తావన ఉంది" }, test: /₹|rs\.?|rupee|amount|transferred|debited|upi|money/i },
      { id: "account", label: { en: "A bank, UPI, or account is mentioned", hi: "बैंक, यूपीआई या खाते का उल्लेख है", te: "బ్యాంక్, UPI లేదా ఖాతా ప్రస్తావన ఉంది" }, test: /bank|upi|account|gpay|phonepe|paytm|card/i },
      { id: "unauthorised", label: { en: "Lack of permission or a trick is mentioned", hi: "अनुमति न होने या धोखे का उल्लेख है", te: "అనుమతి లేకపోవడం లేదా ఉపాయం ప్రస్తావన ఉంది" }, test: /without permission|unauthori[sz]ed|otp|phish|hack|fraud|scam|fake/i },
      { id: "reported", label: { en: "A report to bank or police is mentioned", hi: "बैंक या पुलिस रिपोर्ट का उल्लेख है", te: "బ్యాంక్ లేదా పోలీసు నివేదిక ప్రస్తావన ఉంది" }, test: /reported|complaint|fir|cybercrime|helpline|1930/i },
    ],
    questions: [
      { en: "When did the transaction happen, and have you already informed your bank?", hi: "लेनदेन कब हुआ और क्या आप बैंक को बता चुके हैं?", te: "లావాదేవీ ఎప్పుడు జరిగింది మరియు మీరు బ్యాంకుకు చెప్పారా?" },
      { en: "Was an OTP, link, app, or call involved?", hi: "क्या ओटीपी, लिंक, ऐप या कॉल शामिल था?", te: "OTP, లింక్, యాప్ లేదా కాల్ ఉందా?" },
      { en: "Do you have the transaction ID and the recipient details shown by the bank?", hi: "क्या आपके पास लेनदेन आईडी और बैंक द्वारा दिखाए गए प्राप्तकर्ता विवरण हैं?", te: "మీ వద్ద లావాదేవీ ఐడి మరియు బ్యాంక్ చూపిన గ్రహీత వివరాలు ఉన్నాయా?" },
    ],
    documents: [
      { name: "Bank or UPI transaction record", why: { en: "Shows the amount, time, and reference.", hi: "राशि, समय और संदर्भ दिखाता है।", te: "మొత్తం, సమయం మరియు రిఫరెన్స్ చూపిస్తుంది." } },
      { name: "SMS, email, or call screenshots", why: { en: "Shows how the payment was induced, if it was.", hi: "यदि भुगतान के लिए प्रेरित किया गया हो तो वह तरीका दिखाता है।", te: "చెల్లింపు ఎలా ప్రేరేపించబడిందో చూపిస్తుంది." } },
      { name: "Complaint acknowledgement from the bank", why: { en: "Shows the bank was told.", hi: "दिखाता है कि बैंक को बताया गया।", te: "బ్యాంకుకు చెప్పినట్లు చూపిస్తుంది." } },
      { name: "National Cyber Crime Reporting Portal acknowledgement", why: { en: "Shows the official cyber report number.", hi: "आधिकारिक साइबर रिपोर्ट संख्या दिखाता है।", te: "అధికారిక సైబర్ నివేదిక నంబర్ చూపిస్తుంది." } },
    ],
    remedies: [
      { en: "Inform the bank or payment app at once and ask them to record a dispute. Banking refund rules depend on the Reserve Bank of India instructions and the facts, including whether credentials were shared.", hi: "तुरंत बैंक या भुगतान ऐप को बताएं और विवाद दर्ज करने को कहें। धनवापसी नियम भारतीय रिजर्व बैंक के निर्देशों और तथ्यों पर निर्भर करते हैं।", te: "వెంటనే బ్యాంక్ లేదా పేమెంట్ యాప్‌కు చెప్పి వివాదం నమోదు చేయమని అడగండి. వాపసు నియమాలు రిజర్వ్ బ్యాంక్ సూచనలు మరియు వాస్తవాలపై ఆధారపడతాయి." },
      { en: "Report at cybercrime.gov.in or call 1930.", hi: "cybercrime.gov.in पर रिपोर्ट करें या 1930 पर कॉल करें।", te: "cybercrime.gov.in లో నివేదించండి లేదా 1930కు కాల్ చేయండి." },
      { en: "You may also use the Reserve Bank of India Complaint Management System if a regulated bank's grievance is not resolved.", hi: "यदि बैंक की शिकायत न सुलझे तो भारतीय रिजर्व बैंक की शिकायत प्रणाली का उपयोग हो सकता है।", te: "బ్యాంక్ ఫిర్యాదు పరిష్కారం కాకపోతే రిజర్వ్ బ్యాంక్ ఫిర్యాదు వ్యవస్థ వాడవచ్చు." },
    ],
    flow: [
      { title: { en: "You", hi: "आप", te: "మీరు" }, detail: { en: "Note the transaction ID and do not delete messages.", hi: "लेनदेन आईडी लिखें और संदेश न मिटाएं।", te: "లావాదేవీ ఐడి రాసి సందేశాలు తొలగించవద్దు." } },
      { title: { en: "Bank or payment app", hi: "बैंक या भुगतान ऐप", te: "బ్యాంక్ లేదా పేమెంట్ యాప్" }, detail: { en: "Report the unauthorised transaction to the institution that holds the account.", hi: "जिस संस्था में खाता है उसे अनाधिकृत लेनदेन की रिपोर्ट करें।", te: "ఖాతా ఉన్న సంస్థకు అనుమతి లేని లావాదేవీని నివేదించండి." } },
      { title: { en: "National Cyber Crime Reporting Portal", hi: "राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल", te: "నేషనల్ సైబర్ క్రైమ్ రిపోర్టింగ్ పోర్టల్" }, detail: { en: "cybercrime.gov.in or helpline 1930.", hi: "cybercrime.gov.in या हेल्पलाइन 1930।", te: "cybercrime.gov.in లేదా హెల్ప్‌లైన్ 1930." } },
      { title: { en: "Police, if an offence is disclosed", hi: "पुलिस, यदि अपराध बनता हो", te: "పోలీసులు, నేరం ఏర్పడితే" }, detail: { en: "A portal report is not the same as every kind of court case. Ask the cyber police station how your acknowledgement will be taken forward.", hi: "पोर्टल रिपोर्ट हर प्रकार का न्यायालय मामला नहीं है। साइबर थाने से पूछें कि पावती आगे कैसे बढ़ेगी।", te: "పోర్టల్ నివేదిక ప్రతి కోర్టు కేసు కాదు. మీ అంగీకారం ఎలా ముందుకు వెళ్తుందో సైబర్ పోలీసు స్టేషన్‌ను అడగండి." } },
      { title: { en: "Banking ombudsman route, if needed", hi: "बैंकिंग लोकपाल मार्ग, यदि आवश्यक हो", te: "బ్యాంకింగ్ ఒంబుడ్స్‌మన్ మార్గం, అవసరమైతే" }, detail: { en: "Reserve Bank Complaint Management System: cms.rbi.org.in, after the bank's own grievance step where that is required.", hi: "भारतीय रिजर्व बैंक शिकायत प्रणाली: cms.rbi.org.in।", te: "రిజర్వ్ బ్యాంక్ ఫిర్యాదు వ్యవస్థ: cms.rbi.org.in." } },
    ],
    steps: [
      {
        title: { en: "Tell the bank or payment app immediately", hi: "तुरंत बैंक या भुगतान ऐप को बताएं", te: "వెంటనే బ్యాంక్ లేదా పేమెంట్ యాప్‌కు చెప్పండి" },
        explanation: { en: "Ask for a complaint or dispute number. Write the time you reported it.", hi: "शिकायत या विवाद संख्या मांगें। रिपोर्ट करने का समय लिखें।", te: "ఫిర్యాదు లేదా వివాద నంబర్ అడగండి. నివేదించిన సమయం రాయండి." },
        documents: ["Bank acknowledgement"],
        where: { en: "Your bank branch, customer care, or in-app fraud report", hi: "आपकी बैंक शाखा, ग्राहक सेवा या ऐप में धोखाधड़ी रिपोर्ट", te: "మీ బ్యాంక్ శాఖ, కస్టమర్ కేర్ లేదా యాప్ మోసం నివేదిక" },
        url: "https://cms.rbi.org.in/",
        urlLabel: "RBI Complaint Management System",
        timing: { en: "Report as soon as you notice the transaction. Do not wait for this app. Refund eligibility depends on RBI instructions and whether the credentials were compromised by sharing them.", hi: "लेनदेन देखते ही रिपोर्ट करें। इस ऐप का इंतजार न करें।", te: "లావాదేవీ గమనించగానే నివేదించండి. ఈ యాప్ కోసం వేచి ఉండకండి." },
      },
      {
        title: { en: "Preserve evidence", hi: "साक्ष्य सुरक्षित रखें", te: "ఆధారాలు భద్రపరచండి" },
        explanation: { en: "Save SMS, emails, screenshots, and the transaction reference. Do not forward OTP messages to anyone claiming to reverse the payment.", hi: "एसएमएस, ईमेल, स्क्रीनशॉट और लेनदेन संदर्भ सहेजें। भुगतान वापसी का दावा करने वाले को ओटीपी न भेजें।", te: "SMS, ఈమెయిల్, స్క్రీన్‌షాట్ మరియు లావాదేవీ రిఫరెన్స్ భద్రపరచండి. చెల్లింపు వాపసు అంటూ అడిగేవారికి OTP పంపవద్దు." },
        documents: ["Transaction ID", "Screenshots", "SMS"],
        where: { en: "Your phone and this checklist", hi: "आपका फोन और यह चेकलिस्ट", te: "మీ ఫోన్ మరియు ఈ చెక్‌లిస్ట్" },
        url: null,
        urlLabel: null,
        timing: null,
      },
      {
        title: { en: "File a report on the National Cyber Crime Reporting Portal", hi: "राष्ट्रीय साइबर अपराध पोर्टल पर रिपोर्ट दर्ज करें", te: "నేషనల్ సైబర్ క్రైమ్ పోర్టల్‌పై నివేదిక దాఖలు చేయండి" },
        explanation: { en: "Report financial fraud on the official portal or helpline. Keep the acknowledgement number.", hi: "आधिकारिक पोर्टल या हेल्पलाइन पर वित्तीय धोखाधड़ी की रिपोर्ट करें। पावती संख्या रखें।", te: "అధికారిక పోర్టల్ లేదా హెల్ప్‌లైన్‌పై ఆర్థిక మోసాన్ని నివేదించండి. అంగీకార నంబర్ ఉంచుకోండి." },
        documents: ["Portal acknowledgement"],
        where: { en: "National Cyber Crime Reporting Portal", hi: "राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल", te: "నేషనల్ సైబర్ క్రైమ్ రిపోర్టింగ్ పోర్టల్" },
        url: "https://cybercrime.gov.in/",
        urlLabel: "cybercrime.gov.in",
        timing: { en: "Helpline 1930 is published for cyber financial fraud. Confirm current hours on the portal.", hi: "साइबर वित्तीय धोखाधड़ी के लिए हेल्पलाइन 1930 प्रकाशित है।", te: "సైబర్ ఆర్థిక మోసానికి హెల్ప్‌లైన్ 1930 ప్రచురించబడింది." },
      },
      {
        title: { en: "Follow the bank's grievance path if the dispute is not addressed", hi: "यदि विवाद न सुलझे तो बैंक की शिकायत प्रक्रिया अपनाएं", te: "వివాదం పరిష్కారం కాకపోతే బ్యాంక్ ఫిర్యాదు మార్గం అనుసరించండి" },
        explanation: { en: "Use the bank's grievance redressal first where the RBI scheme requires it, then the Complaint Management System if still unresolved.", hi: "जहां योजना कहे, पहले बैंक की शिकायत प्रणाली, फिर रिजर्व बैंक की शिकायत प्रणाली का उपयोग करें।", te: "పథకం చెప్పినచోట ముందు బ్యాంక్ ఫిర్యాదు, తర్వాత రిజర్వ్ బ్యాంక్ వ్యవస్థ వాడండి." },
        documents: ["Bank grievance reference"],
        where: { en: "Reserve Bank of India Complaint Management System", hi: "भारतीय रिजर्व बैंक शिकायत प्रबंधन प्रणाली", te: "రిజర్వ్ బ్యాంక్ ఫిర్యాదు నిర్వహణ వ్యవస్థ" },
        url: "https://cms.rbi.org.in/",
        urlLabel: "cms.rbi.org.in",
        timing: null,
      },
    ],
    authorities: [
      { name: "National Cyber Crime Reporting Portal", url: "https://cybercrime.gov.in/", phone: "1930", note: { en: "Official reporting portal and helpline for cyber crime.", hi: "साइबर अपराध की आधिकारिक रिपोर्टिंग और हेल्पलाइन।", te: "సైబర్ నేరాల అధికారిక నివేదిక మరియు హెల్ప్‌లైన్." } },
      { name: "RBI Complaint Management System", url: "https://cms.rbi.org.in/", phone: null, note: { en: "For complaints against regulated banks after using the bank's grievance channel where required.", hi: "बैंक की शिकायत प्रक्रिया के बाद विनियमित बैंकों के विरुद्ध शिकायत।", te: "అవసరమైన చోట బ్యాంక్ ఫిర్యాదు తర్వాత నియంత్రిత బ్యాంకులపై ఫిర్యాదు." } },
    ],
  },
  {
    id: "cheque",
    label: { en: "Cheque dishonour", hi: "चेक अनादर", te: "చెక్కు తిరిగి రావడం" },
    group: "criminal",
    keywords: ["cheque", "check bounce", "cheque bounce", "bounced", "dishonour", "dishonor", "negotiable instrument"],
    facts: [
      { id: "cheque", label: { en: "A cheque is mentioned", hi: "चेक का उल्लेख है", te: "చెక్కు ప్రస్తావన ఉంది" }, test: /cheque|check/i },
      { id: "return", label: { en: "Return or dishonour is mentioned", hi: "वापसी या अनादर का उल्लेख है", te: "తిరిగి రావడం ప్రస్తావన ఉంది" }, test: /bounce|bounced|dishonou?r|return|insufficient/i },
      { id: "debt", label: { en: "A debt or liability is mentioned", hi: "ऋण या देयता का उल्लेख है", te: "అప్పు లేదా బాధ్యత ప్రస్తావన ఉంది" }, test: /debt|loan|liability|invoice|dues|rent|salary|goods/i },
      { id: "memo", label: { en: "A bank memo or date is mentioned", hi: "बैंक मेमो या तारीख का उल्लेख है", te: "బ్యాంకు మెమో లేదా తేదీ ప్రస్తావన ఉంది" }, test: /memo|bank|date|\d{1,2}[\/\-]\d{1,2}/i },
    ],
    questions: [
      { en: "On which date did the bank inform you that the cheque was returned?", hi: "बैंक ने आपको चेक लौटने की सूचना किस तारीख को दी?", te: "చెక్కు తిరిగి వచ్చిందని బ్యాంక్ మీకు ఏ తేదీన చెప్పింది?" },
      { en: "Was the cheque given for a legally enforceable debt or liability?", hi: "क्या चेक कानूनी रूप से वसूली योग्य ऋण या देयता के लिए दिया गया था?", te: "చెక్కు చట్టబద్ధంగా వసూలు చేయగల అప్పు లేదా బాధ్యత కోసమా?" },
      { en: "Have you already sent a written demand, and on what date?", hi: "क्या आप लिखित मांग भेज चुके हैं, और किस तारीख को?", te: "మీరు వ్రాతపూర్వక డిమాండ్ పంపారా, ఏ తేదీన?" },
    ],
    documents: [
      { name: "Original cheque or a bank-certified copy, as advised", why: { en: "Identifies the instrument.", hi: "लिखत की पहचान करता है।", te: "పత్రాన్ని గుర్తిస్తుంది." } },
      { name: "Bank return memo", why: { en: "Shows the reason and the date of information.", hi: "कारण और सूचना की तारीख दिखाता है।", te: "కారణం మరియు సమాచార తేదీని చూపిస్తుంది." } },
      { name: "Proof of the debt", why: { en: "Section 138 is about a legally enforceable debt or other liability.", hi: "धारा 138 कानूनी रूप से वसूली योग्य ऋण या अन्य देयता के बारे में है।", te: "సెక్షన్ 138 చట్టబద్ధంగా వసూలయ్యే అప్పు లేదా ఇతర బాధ్యత గురించి." } },
      { name: "Copy of the demand notice and proof of delivery", why: { en: "Shows the statutory demand and when the drawer received it.", hi: "वैधानिक मांग और आहरणकर्ता को मिलने का समय दिखाता है।", te: "చట్టపరమైన డిమాండ్ మరియు డ్రాయర్‌కు అందిన సమయం చూపిస్తుంది." } },
    ],
    remedies: [
      { en: "A written demand within thirty days of receiving the bank's information is a condition in section 138(b).", hi: "बैंक की सूचना मिलने के तीस दिन के भीतर लिखित मांग धारा 138(b) की शर्त है।", te: "బ్యాంకు సమాచారం వచ్చిన ముప్పై రోజులలో వ్రాతపూర్వక డిమాండ్ సెక్షన్ 138(b) షరతు." },
      { en: "The drawer then has fifteen days from receiving the notice to pay, under section 138(c).", hi: "आहरणकर्ता को नोटिस मिलने से पंद्रह दिन में भुगतान का समय धारा 138(c) में है।", te: "నోటీసు అందిన నుండి పదిహేను రోజుల్లో చెల్లించే సమయం సెక్షన్ 138(c)లో ఉంది." },
      { en: "A complaint is filed within one month of the cause of action under section 142, unless the court condones delay.", hi: "शिकायत धारा 142 के तहत वाद-कारण से एक माह में दर्ज होती है, जब तक न्यायालय विलंब माफ न करे।", te: "ఫిర్యాదు సెక్షన్ 142 కింద కారణం నుండి ఒక నెలలో దాఖలు అవుతుంది, కోర్టు ఆలస్యం మన్నిస్తే తప్ప." },
    ],
    flow: [
      { title: { en: "Payee", hi: "भुगतान पाने वाला", te: "చెల్లింపు పొందేవారు" }, detail: { en: "Keep the cheque and return memo.", hi: "चेक और रिटर्न मेमो रखें।", te: "చెక్కు మరియు రిటర్న్ మెమో ఉంచుకోండి." } },
      { title: { en: "Bank", hi: "बैंक", te: "బ్యాంక్" }, detail: { en: "The return memo records why the cheque was unpaid.", hi: "रिटर्न मेमो बताता है कि चेक क्यों नहीं भुना।", te: "రిటర్న్ మెమో చెక్కు ఎందుకు చెల్లలేదో రాస్తుంది." } },
      { title: { en: "Written demand to the drawer", hi: "आहरणकर्ता को लिखित मांग", te: "డ్రాయర్‌కు వ్రాతపూర్వక డిమాండ్" }, detail: { en: "Section 138(b): within thirty days of receiving the bank's information.", hi: "धारा 138(b): बैंक की सूचना के तीस दिन के भीतर।", te: "సెక్షన్ 138(b): బ్యాంకు సమాచారం వచ్చిన ముప్పై రోజులలోపు." } },
      { title: { en: "Fifteen days to pay", hi: "भुगतान के पंद्रह दिन", te: "చెల్లించేందుకు పదిహేను రోజులు" }, detail: { en: "Section 138(c), counted from the drawer's receipt of notice.", hi: "धारा 138(c), आहरणकर्ता को नोटिस मिलने से।", te: "సెక్షన్ 138(c), డ్రాయర్‌కు నోటీసు అందిన నుండి." } },
      { title: { en: "Complaint before the competent court", hi: "सक्षम न्यायालय में शिकायत", te: "సమర్థ కోర్టు ముందు ఫిర్యాదు" }, detail: { en: "Section 142. Legal aid can help identify the court. NyayaMarg does not file it.", hi: "धारा 142। न्यायालय पहचानने में विधिक सहायता मदद कर सकती है।", te: "సెక్షన్ 142. కోర్టును గుర్తించడంలో న్యాయ సహాయం ఉపయోగపడుతుంది." } },
    ],
    steps: [
      {
        title: { en: "Secure the cheque and the bank return memo", hi: "चेक और बैंक रिटर्न मेमो सुरक्षित करें", te: "చెక్కు మరియు బ్యాంక్ రిటర్న్ మెమో భద్రపరచండి" },
        explanation: { en: "Note the date the bank informed you. That date matters for the thirty-day demand.", hi: "जिस तारीख को बैंक ने सूचना दी उसे लिखें। तीस दिन की मांग के लिए वह तारीख मायने रखती है।", te: "బ్యాంక్ సమాచారం ఇచ్చిన తేదీ రాయండి. ముప్పై రోజుల డిమాండ్‌కు ఆ తేదీ ముఖ్యం." },
        documents: ["Cheque", "Return memo"],
        where: { en: "Your records and the bank", hi: "आपके रिकॉर्ड और बैंक", te: "మీ రికార్డులు మరియు బ్యాంక్" },
        url: "https://www.indiacode.nic.in/bitstream/123456789/15327/1/negotiable_instruments_act%2C_1881.pdf",
        urlLabel: "Negotiable Instruments Act on India Code",
        timing: { en: "Section 138(a) requires presentation within six months from the date of the cheque or within the period of its validity, whichever is earlier. Banks also follow RBI directions on how long a cheque remains valid. Verify both for your cheque.", hi: "धारा 138(a) चेक की तारीख से छह माह या उसकी वैधता, जो पहले हो, के भीतर प्रस्तुत करने को कहती है। बैंक आरबीआई निर्देश भी मानते हैं। दोनों जाँचें।", te: "సెక్షన్ 138(a) చెక్కు తేదీ నుండి ఆరు నెలలు లేదా చెల్లుబాటు, ఏది ముందు అయితే అందులో సమర్పణను చెబుతుంది. బ్యాంకులు ఆర్‌బీఐ సూచనలు కూడా పాటిస్తాయి." },
      },
      {
        title: { en: "Send a written demand within thirty days", hi: "तीस दिन के भीतर लिखित मांग भेजें", te: "ముప్పై రోజులలోపు వ్రాతపూర్వక డిమాండ్ పంపండి" },
        explanation: { en: "Section 138(b) requires a notice in writing to the drawer within thirty days of receiving information from the bank. Keep proof of dispatch and delivery. Counting of the first day should be confirmed with a lawyer because courts apply limitation rules.", hi: "धारा 138(b) बैंक से सूचना मिलने के तीस दिन के भीतर आहरणकर्ता को लिखित नोटिस कहती है। भेजने और पाने का प्रमाण रखें।", te: "సెక్షన్ 138(b) బ్యాంకు సమాచారం వచ్చిన ముప్పై రోజులలో డ్రాయర్‌కు వ్రాతపూర్వక నోటీసు కోరుతుంది. పంపిన మరియు అందిన రుజువు ఉంచుకోండి." },
        documents: ["Demand notice", "Postal or delivery proof"],
        where: { en: "To the drawer, at an address you can prove", hi: "आहरणकर्ता को, उस पते पर जिसे आप साबित कर सकें", te: "డ్రాయర్‌కు, మీరు రుజువు చేయగల చిరునామాకు" },
        url: null,
        urlLabel: null,
        timing: { en: "Within thirty days of receipt of the bank's information, under section 138(b). This is a statutory condition, not an estimate.", hi: "धारा 138(b) के तहत बैंक की सूचना मिलने के तीस दिन के भीतर। यह अनुमान नहीं, वैधानिक शर्त है।", te: "సెక్షన్ 138(b) కింద బ్యాంకు సమాచారం అందిన ముప్పై రోజులలోపు. ఇది అంచనా కాదు, చట్టపరమైన షరతు." },
      },
      {
        title: { en: "Allow fifteen days after the drawer receives the notice", hi: "आहरणकर्ता को नोटिस मिलने के बाद पंद्रह दिन दें", te: "డ్రాయర్‌కు నోటీసు అందిన తర్వాత పదిహేను రోజులు ఇవ్వండి" },
        explanation: { en: "Under section 138(c), the offence is not complete unless the drawer fails to pay within fifteen days of receiving the notice.", hi: "धारा 138(c) के तहत अपराध तभी पूरा होता है जब आहरणकर्ता नोटिस मिलने के पंद्रह दिन में भुगतान न करे।", te: "సెక్షన్ 138(c) కింద డ్రాయర్ నోటీసు అందిన పదిహేను రోజులలో చెల్లించకపోతేనే నేరం పూర్తవుతుంది." },
        documents: ["Proof of the date of receipt"],
        where: { en: "Wait for payment or for the fifteen days to end", hi: "भुगतान या पंद्रह दिन पूरे होने तक रुकें", te: "చెల్లింపు లేదా పదిహేను రోజులు ముగిసే వరకు వేచి ఉండండి" },
        url: null,
        urlLabel: null,
        timing: { en: "Fifteen days from the drawer's receipt of the notice, under section 138(c).", hi: "धारा 138(c) के तहत नोटिस प्राप्ति से पंद्रह दिन।", te: "సెక్షన్ 138(c) కింద నోటీసు అందిన నుండి పదిహేను రోజులు." },
      },
      {
        title: { en: "If unpaid, consider a complaint within one month of the cause of action", hi: "यदि भुगतान न हो, तो वाद-कारण से एक माह में शिकायत पर विचार करें", te: "చెల్లింపు లేకపోతే, కారణం నుండి ఒక నెలలో ఫిర్యాదును పరిగణించండి" },
        explanation: { en: "Section 142 requires a written complaint by the payee or holder, ordinarily within one month of the cause of action. The court may take a delayed complaint if sufficient cause is shown. A legal aid lawyer should settle the correct court and the day-count.", hi: "धारा 142 भुगतान पाने वाले की लिखित शिकायत कहती है, सामान्यतः वाद-कारण से एक माह में। पर्याप्त कारण पर विलंब माफ हो सकता है।", te: "సెక్షన్ 142 చెల్లింపు పొందేవారి వ్రాతపూర్వక ఫిర్యాదు కోరుతుంది, సాధారణంగా కారణం నుండి ఒక నెలలో. తగిన కారణంపై ఆలస్యం మన్నించబడవచ్చు." },
        documents: ["Complaint", "Cheque", "Memo", "Notice", "Delivery proof", "Debt proof"],
        where: { en: "The competent criminal court. Ask a legal aid office before filing.", hi: "सक्षम आपराधिक न्यायालय। दाखिल करने से पहले विधिक सहायता कार्यालय से पूछें।", te: "సమర్థ క్రిమినల్ కోర్టు. దాఖలు చేసే ముందు న్యాయ సహాయ కార్యాలయాన్ని అడగండి." },
        url: "https://nalsa.gov.in/directory/",
        urlLabel: "NALSA directory",
        timing: { en: "Within one month of the cause of action under section 142, subject to condonation.", hi: "धारा 142 के तहत वाद-कारण से एक माह के भीतर, माफी के अधीन।", te: "సెక్షన్ 142 కింద కారణం నుండి ఒక నెలలోపు, మన్నింపుకు లోబడి." },
      },
    ],
    authorities: [
      { name: "India Code — Negotiable Instruments Act", url: "https://www.indiacode.nic.in/bitstream/123456789/15327/1/negotiable_instruments_act%2C_1881.pdf", phone: null, note: { en: "Official text of sections 138 and 142.", hi: "धारा 138 और 142 का आधिकारिक पाठ।", te: "సెక్షన్లు 138 మరియు 142 అధికారిక పాఠం." } },
      { name: "NALSA directory", url: "https://nalsa.gov.in/directory/", phone: null, note: { en: "To find legal aid before filing.", hi: "दाखिल करने से पहले विधिक सहायता खोजने के लिए।", te: "దాఖలు చేసే ముందు న్యాయ సహాయం కనుగొనేందుకు." } },
    ],
  },
];

// Labour, tenancy, traffic, rights playbooks continue in the same file below.
export const MORE_PLAYBOOKS: CategoryPlaybook[] = [
  {
    id: "labour",
    label: { en: "Unpaid wages or employment", hi: "अवैतनिक मजदूरी या रोजगार", te: "చెల్లించని వేతనం లేదా ఉద్యోగం" },
    group: "labour",
    keywords: ["salary", "wages", "wage", "employer", "employee", "not paid", "unpaid", "appointment", "pf", "esi", "labour", "labor", "hr"],
    facts: [
      { id: "employer", label: { en: "An employer is mentioned", hi: "नियोक्ता का उल्लेख है", te: "యజమాని ప్రస్తావన ఉంది" }, test: /employer|company|office|boss|hr|manager/i },
      { id: "wages", label: { en: "Wages or salary are mentioned", hi: "मजदूरी या वेतन का उल्लेख है", te: "వేతనం లేదా జీతం ప్రస్తావన ఉంది" }, test: /salary|wage|paid|stipend|overtime/i },
      { id: "period", label: { en: "A time period is mentioned", hi: "समय अवधि का उल्लेख है", te: "కాలం ప్రస్తావన ఉంది" }, test: /month|week|january|february|march|april|may|june|july|august|september|october|november|december|\d{4}/i },
    ],
    questions: [
      { en: "Which months are unpaid, and what was the agreed wage?", hi: "कौन से महीने का भुगतान नहीं हुआ और तय मजदूरी क्या थी?", te: "ఏ నెలలు చెల్లించలేదు మరియు అంగీకరించిన వేతనం ఎంత?" },
      { en: "Do you have an appointment letter, salary slips, or attendance proof?", hi: "क्या आपके पास नियुक्ति पत्र, वेतन पर्ची या हाजिरी का प्रमाण है?", te: "మీ వద్ద నియామక లేఖ, జీతం స్లిప్పులు లేదా హాజరు రుజువు ఉందా?" },
      { en: "Are you still employed, and in which state did you work?", hi: "क्या आप अभी भी नियोजित हैं और आपने किस राज्य में काम किया?", te: "మీరు ఇంకా ఉద్యోగంలో ఉన్నారా మరియు ఏ రాష్ట్రంలో పనిచేశారు?" },
    ],
    documents: [
      { name: "Appointment letter or written offer", why: { en: "Shows the relationship and the promised pay.", hi: "संबंध और वादा की गई मजदूरी दिखाता है।", te: "సంబంధం మరియు మాట ఇచ్చిన వేతనం చూపిస్తుంది." } },
      { name: "Salary slips or bank credits", why: { en: "Shows what was paid earlier.", hi: "पहले क्या भुगतान हुआ दिखाता है।", te: "ముందు ఏమి చెల్లించారో చూపిస్తుంది." } },
      { name: "Attendance or work messages", why: { en: "Shows that work was done.", hi: "दिखाता है कि काम हुआ।", te: "పని జరిగినట్లు చూపిస్తుంది." } },
      { name: "Written demand to the employer", why: { en: "Shows you asked for the unpaid amount.", hi: "दिखाता है कि आपने बकाया मांगा।", te: "బకాయి అడిగినట్లు చూపిస్తుంది." } },
    ],
    remedies: [
      { en: "Make a written demand to the employer and keep proof.", hi: "नियोक्ता को लिखित मांग करें और प्रमाण रखें।", te: "యజమానికి వ్రాతపూర్వక డిమాండ్ చేసి రుజువు ఉంచుకోండి." },
      { en: "Approach the labour authorities through the SAMADHAN portal or the state labour department. Which law applies depends on the establishment and whether a particular labour code has been brought into force.", hi: "SAMADHAN पोर्टल या राज्य श्रम विभाग से संपर्क करें। कौन सा कानून लागू होता है, यह प्रतिष्ठान और श्रम संहिता के प्रवर्तन पर निर्भर करता है।", te: "SAMADHAN పోర్టల్ లేదా రాష్ట్ర కార్మిక శాఖను సంప్రదించండి. ఏ చట్టం వర్తిస్తుంది అనేది స్థాపన మరియు కార్మిక సంహిత అమలుపై ఆధారపడుతుంది." },
    ],
    flow: [
      { title: { en: "Worker", hi: "कर्मचारी", te: "కార్మికుడు" }, detail: { en: "Collect appointment, attendance, and pay records.", hi: "नियुक्ति, हाजिरी और वेतन रिकॉर्ड एकत्र करें।", te: "నియామకం, హాజరు మరియు వేతన రికార్డులు సేకరించండి." } },
      { title: { en: "Employer", hi: "नियोक्ता", te: "యజమాని" }, detail: { en: "Written demand for unpaid wages.", hi: "अवैतनिक मजदूरी की लिखित मांग।", te: "చెల్లించని వేతనానికి వ్రాతపూర్వక డిమాండ్." } },
      { title: { en: "Labour department / SAMADHAN", hi: "श्रम विभाग / SAMADHAN", te: "కార్మిక శాఖ / SAMADHAN" }, detail: { en: "https://samadhan.labour.gov.in/", hi: "https://samadhan.labour.gov.in/", te: "https://samadhan.labour.gov.in/" } },
      { title: { en: "Legal Services Authority", hi: "विधिक सेवा प्राधिकरण", te: "లీగల్ సర్వీసెస్ అథారిటీ" }, detail: { en: "If you may be eligible for free legal aid.", hi: "यदि आप निःशुल्क विधिक सहायता के पात्र हो सकते हैं।", te: "మీరు ఉచిత న్యాయ సహాయానికి అర్హులు కావచ్చు." } },
    ],
    steps: [
      {
        title: { en: "List the unpaid period and the agreed wage", hi: "अवैतनिक अवधि और तय मजदूरी लिखें", te: "చెల్లించని కాలం మరియు అంగీకరించిన వేతనం రాయండి" },
        explanation: { en: "A clear list is more useful than a general statement that salary was not paid.", hi: "स्पष्ट सूची इस सामान्य बात से अधिक उपयोगी है कि वेतन नहीं मिला।", te: "జీతం రాలేదనే సాధారణ మాట కంటే స్పష్టమైన జాబితా ఉపయోగకరం." },
        documents: ["Appointment letter", "Salary slips"],
        where: { en: "Your records", hi: "आपके रिकॉर्ड", te: "మీ రికార్డులు" },
        url: null,
        urlLabel: null,
        timing: null,
      },
      {
        title: { en: "Send a written request to the employer", hi: "नियोक्ता को लिखित अनुरोध भेजें", te: "యజమానికి వ్రాతపూర్వక అభ్యర్థన పంపండి" },
        explanation: { en: "State the months and the amount. Ask for payment by a date you choose as a request. Do not describe that date as a statutory deadline unless a lawyer confirms one.", hi: "महीने और राशि लिखें। अपनी मांगी तारीख को वैधानिक समय-सीमा न कहें जब तक कोई वकील पुष्टि न करे।", te: "నెలలు మరియు మొత్తం రాయండి. మీరు అడిగే తేదీని చట్టపరమైన గడువుగా చెప్పకండి, న్యాయవాది నిర్ధారించే వరకు." },
        documents: ["Written demand"],
        where: { en: "Employer's official email or address", hi: "नियोक्ता का आधिकारिक ईमेल या पता", te: "యజమాని అధికారిక ఈమెయిల్ లేదా చిరునామా" },
        url: null,
        urlLabel: null,
        timing: null,
      },
      {
        title: { en: "Approach the labour authorities", hi: "श्रम प्राधिकरणों से संपर्क करें", te: "కార్మిక అధికారులను సంప్రదించండి" },
        explanation: { en: "SAMADHAN is the Ministry of Labour and Employment portal for industrial disputes and related grievances. The Payment of Wages Act, 1936 and the Code on Wages, 2019 may be relevant, but you should confirm on India Code which provisions are in force for your establishment.", hi: "SAMADHAN श्रम मंत्रालय का पोर्टल है। मजदूरी संदाय अधिनियम, 1936 और मजदूरी संहिता, 2019 प्रासंगिक हो सकते हैं, पर अपने प्रतिष्ठान के लिए कौन सी धारा प्रवृत्त है यह India Code पर जाँचें।", te: "SAMADHAN కార్మిక మంత్రిత్వ పోర్టల్. పేమెంట్ ఆఫ్ వేజెస్ చట్టం, 1936 మరియు కోడ్ ఆన్ వేజెస్, 2019 సంబంధించవచ్చు. మీ స్థాపనకు ఏవి అమలులో ఉన్నాయో India Code పై చూడండి." },
        documents: ["Identity", "Work proof", "Demand copy"],
        where: { en: "SAMADHAN and the state labour department", hi: "SAMADHAN और राज्य श्रम विभाग", te: "SAMADHAN మరియు రాష్ట్ర కార్మిక శాఖ" },
        url: "https://samadhan.labour.gov.in/",
        urlLabel: "samadhan.labour.gov.in",
        timing: null,
      },
    ],
    authorities: [
      { name: "SAMADHAN", url: "https://samadhan.labour.gov.in/", phone: null, note: { en: "Ministry of Labour and Employment portal.", hi: "श्रम और रोजगार मंत्रालय का पोर्टल।", te: "కార్మిక మరియు ఉపాధి మంత్రిత్వ పోర్టల్." } },
      { name: "India Code", url: "https://www.indiacode.nic.in/", phone: null, note: { en: "Check whether the Payment of Wages Act, 1936 or the Code on Wages, 2019 applies.", hi: "जाँचें कि मजदूरी संदाय अधिनियम, 1936 या मजदूरी संहिता, 2019 लागू है।", te: "పేమెంట్ ఆఫ్ వేజెస్ చట్టం, 1936 లేదా కోడ్ ఆన్ వేజెస్, 2019 వర్తిస్తుందో చూడండి." } },
    ],
  },
  {
    id: "tenancy",
    label: { en: "Security deposit or tenancy", hi: "जमानत राशि या किरायेदारी", te: "డిపాజిట్ లేదా అద్దె" },
    group: "civil",
    keywords: ["landlord", "tenant", "security deposit", "rent", "eviction", "lease", "flat", "house owner"],
    facts: [
      { id: "deposit", label: { en: "A deposit or rent is mentioned", hi: "जमा या किराए का उल्लेख है", te: "డిపాజిట్ లేదా అద్దె ప్రస్తావన ఉంది" }, test: /deposit|rent|advance/i },
      { id: "parties", label: { en: "A landlord or tenant is mentioned", hi: "मकानमालिक या किरायेदार का उल्लेख है", te: "ఇంటి యజమాని లేదా అద్దెదారు ప్రస్తావన ఉంది" }, test: /landlord|tenant|owner|lease/i },
      { id: "writing", label: { en: "A written agreement is mentioned", hi: "लिखित समझौते का उल्लेख है", te: "వ్రాతపూర్వక ఒప్పందం ప్రస్తావన ఉంది" }, test: /agreement|lease|contract|receipt/i },
    ],
    questions: [
      { en: "Which state's law would apply, and is there a written lease?", hi: "किस राज्य का कानून लागू होगा और क्या लिखित पट्टा है?", te: "ఏ రాష్ట్ర చట్టం వర్తిస్తుంది మరియు వ్రాతపూర్వక లీజు ఉందా?" },
      { en: "How much was the deposit, when was it paid, and when did you vacate?", hi: "जमा कितनी थी, कब दी गई और आपने मकान कब खाली किया?", te: "డిపాజిట్ ఎంత, ఎప్పుడు చెల్లించారు మరియు ఎప్పుడు ఖాళీ చేశారు?" },
    ],
    documents: [
      { name: "Lease or rent agreement", why: { en: "Shows the deposit term. State rent law may also matter.", hi: "जमा की शर्त दिखाता है। राज्य का किराया कानून भी मायने रख सकता है।", te: "డిపాజిట్ షరతు చూపిస్తుంది. రాష్ట్ర అద్దె చట్టం కూడా ముఖ్యం కావచ్చు." } },
      { name: "Deposit receipt or bank transfer", why: { en: "Shows the money was paid.", hi: "दिखाता है कि पैसे दिए गए।", te: "డబ్బు చెల్లించినట్లు చూపిస్తుంది." } },
      { name: "Vacation and key-handover messages", why: { en: "Shows when possession ended.", hi: "दिखाता है कि कब्जा कब समाप्त हुआ।", te: "స్వాధీనం ఎప్పుడు ముగిసిందో చూపిస్తుంది." } },
    ],
    remedies: [
      { en: "Send a written demand for the deposit. State tenancy or rent-control law differs, so NyayaMarg does not name a single national section for the refund.", hi: "जमा की लिखित मांग भेजें। राज्य का किराया कानून अलग होता है, इसलिए न्यायमार्ग एक राष्ट्रीय धारा नहीं बताता।", te: "డిపాజిట్‌కు వ్రాతపూర్వక డిమాండ్ పంపండి. రాష్ట్ర అద్దె చట్టం వేరు, కాబట్టి న్యాయమార్గ్ ఒకే జాతీయ సెక్షన్ చెప్పదు." },
      { en: "Ask the State Legal Services Authority which forum hears tenancy disputes in your district.", hi: "राज्य विधिक सेवा प्राधिकरण से पूछें कि आपके जिले में किराया विवाद कौन सुनता है।", te: "మీ జిల్లాలో అద్దె వివాదాలు ఏ వేదిక వింటుందో రాష్ట్ర లీగల్ సర్వీసెస్ అథారిటీని అడగండి." },
    ],
    flow: [
      { title: { en: "Tenant", hi: "किरायेदार", te: "అద్దెదారు" }, detail: { en: "Collect the agreement and proof of payment.", hi: "समझौता और भुगतान का प्रमाण एकत्र करें।", te: "ఒప్పందం మరియు చెల్లింపు రుజువు సేకరించండి." } },
      { title: { en: "Landlord", hi: "मकानमालिक", te: "ఇంటి యజమాని" }, detail: { en: "Written demand for return of the deposit.", hi: "जमा लौटाने की लिखित मांग।", te: "డిపాజిట్ వాపసుకు వ్రాతపూర్వక డిమాండ్." } },
      { title: { en: "State tenancy forum or civil process", hi: "राज्य किराया मंच या दीवानी प्रक्रिया", te: "రాష్ట్ర అద్దె వేదిక లేదా సివిల్ ప్రక్రియ" }, detail: { en: "The forum depends on the state. Do not assume one national tribunal.", hi: "मंच राज्य पर निर्भर करता है। एक राष्ट्रीय अधिकरण न मानें।", te: "వేదిక రాష్ట్రంపై ఆధారపడుతుంది. ఒకే జాతీయ ట్రిబ్యునల్ అనుకోవద్దు." } },
      { title: { en: "Legal aid", hi: "विधिक सहायता", te: "న్యాయ సహాయం" }, detail: { en: "SLSA or DLSA directory via nalsa.gov.in.", hi: "nalsa.gov.in के माध्यम से एसएलएसए या डीएलएसए निर्देशिका।", te: "nalsa.gov.in ద్వారా SLSA లేదా DLSA డైరెక్టరీ." } },
    ],
    steps: [
      {
        title: { en: "Collect the lease and proof of the deposit", hi: "पट्टा और जमा का प्रमाण एकत्र करें", te: "లీజు మరియు డిపాజిట్ రుజువు సేకరించండి" },
        explanation: { en: "If there is no written lease, collect rent receipts, messages, and transfer records instead.", hi: "यदि लिखित पट्टा न हो तो किराया रसीद, संदेश और अंतरण रिकॉर्ड एकत्र करें।", te: "వ్రాతపూర్వక లీజు లేకపోతే అద్దె రసీదులు, సందేశాలు మరియు బదిలీ రికార్డులు సేకరించండి." },
        documents: ["Lease", "Deposit receipt"],
        where: { en: "Your records", hi: "आपके रिकॉर्ड", te: "మీ రికార్డులు" },
        url: null,
        urlLabel: null,
        timing: null,
      },
      {
        title: { en: "Send a written demand", hi: "लिखित मांग भेजें", te: "వ్రాతపూర్వక డిమాండ్ పంపండి" },
        explanation: { en: "State the amount and the date you vacated. A response time you request is not automatically a statutory deadline.", hi: "राशि और मकान खाली करने की तारीख लिखें। आपके द्वारा मांगा गया उत्तर समय स्वतः वैधानिक समय-सीमा नहीं है।", te: "మొత్తం మరియు ఖాళీ చేసిన తేదీ రాయండి. మీరు అడిగే సమాధాన సమయం స్వయంగా చట్టపరమైన గడువు కాదు." },
        documents: ["Demand letter", "Delivery proof"],
        where: { en: "Landlord's address used in the agreement", hi: "समझौते में दिया मकानमालिक का पता", te: "ఒప్పందంలో ఉన్న యజమాని చిరునామా" },
        url: null,
        urlLabel: null,
        timing: null,
      },
      {
        title: { en: "Identify the state forum with legal aid", hi: "विधिक सहायता के साथ राज्य मंच पहचानें", te: "న్యాయ సహాయంతో రాష్ట్ర వేదికను గుర్తించండి" },
        explanation: { en: "Tenancy relief depends on state law. The Legal Services Authority can tell you the forum. Section 73 of the Indian Contract Act, 1872 is only a general contract principle and may not be the right route.", hi: "किराया राहत राज्य कानून पर निर्भर है। विधिक सेवा प्राधिकरण मंच बता सकता है। भारतीय संविदा अधिनियम की धारा 73 केवल सामान्य सिद्धांत है।", te: "అద్దె పరిహారం రాష్ట్ర చట్టంపై ఆధారపడుతుంది. లీగల్ సర్వీసెస్ అథారిటీ వేదిక చెప్పగలదు. భారత ఒప్పంద చట్టం సెక్షన్ 73 కేవలం సాధారణ సూత్రం." },
        documents: ["All papers above"],
        where: { en: "State Legal Services Authority", hi: "राज्य विधिक सेवा प्राधिकरण", te: "రాష్ట్ర లీగల్ సర్వీసెస్ అథారిటీ" },
        url: "https://nalsa.gov.in/directory/",
        urlLabel: "NALSA directory",
        timing: null,
      },
    ],
    authorities: [
      { name: "NALSA directory", url: "https://nalsa.gov.in/directory/", phone: null, note: { en: "Find the State Legal Services Authority.", hi: "राज्य विधिक सेवा प्राधिकरण खोजें।", te: "రాష్ట్ర లీగల్ సర్వీసెస్ అథారిటీని కనుగొనండి." } },
      { name: "India Code", url: "https://www.indiacode.nic.in/", phone: null, note: { en: "Look up the tenancy law of your state rather than assuming one national section.", hi: "एक राष्ट्रीय धारा मानने के बजाय अपने राज्य का किराया कानून देखें।", te: "ఒకే జాతీయ సెక్షన్ అనుకోకుండా మీ రాష్ట్ర అద్దె చట్టం చూడండి." } },
    ],
  },
  {
    id: "traffic",
    label: { en: "Traffic and motor vehicles", hi: "यातायात और मोटर वाहन", te: "ట్రాఫిక్ మరియు మోటారు వాహనాలు" },
    group: "traffic",
    keywords: ["traffic", "helmet", "challan", "accident", "rash driving", "vehicle", "car", "bike", "motorcycle", "red light", "licence", "license", "insurance", "hit and"],
    facts: [
      { id: "vehicle", label: { en: "A vehicle is mentioned", hi: "वाहन का उल्लेख है", te: "వాహనం ప్రస్తావన ఉంది" }, test: /car|bike|motorcycle|vehicle|scooter|bus|lorry|auto/i },
      { id: "event", label: { en: "A challan or accident is mentioned", hi: "चालान या दुर्घटना का उल्लेख है", te: "చలాన్ లేదా ప్రమాదం ప్రస్తావన ఉంది" }, test: /challan|accident|crash|helmet|fine|signal|hit/i },
      { id: "injury", label: { en: "Injury is mentioned", hi: "चोट का उल्लेख है", te: "గాయం ప్రస్తావన ఉంది" }, test: /injur|hurt|blood|hospital|died|death/i },
    ],
    questions: [
      { en: "Is anyone injured right now? If yes, call 112 or 108 before continuing.", hi: "क्या अभी कोई घायल है? यदि हाँ, आगे बढ़ने से पहले 112 या 108 पर कॉल करें।", te: "ఇప్పుడు ఎవరైనా గాయపడ్డారా? అవును అయితే కొనసాగే ముందు 112 లేదా 108కు కాల్ చేయండి." },
      { en: "Do you have the challan number, vehicle number, and insurance papers?", hi: "क्या आपके पास चालान संख्या, वाहन संख्या और बीमा पत्र हैं?", te: "మీ వద్ద చలాన్ నంబర్, వాహన నంబర్ మరియు బీమా పత్రాలు ఉన్నాయా?" },
    ],
    documents: [
      { name: "Challan or accident information report", why: { en: "Shows the allegation or the reported accident.", hi: "आरोप या दर्ज दुर्घटना दिखाता है।", te: "ఆరోపణ లేదా నమోదైన ప్రమాదం చూపిస్తుంది." } },
      { name: "Driving licence, registration, and insurance", why: { en: "Commonly required after a traffic stop or accident.", hi: "यातायात रोक या दुर्घटना के बाद आमतौर पर आवश्यक।", te: "ట్రాఫిక్ ఆపు లేదా ప్రమాదం తర్వాత సాధారణంగా అవసరం." } },
      { name: "Photographs and witness names", why: { en: "Preserve the scene without obstructing treatment.", hi: "इलाज में बाधा डाले बिना घटनास्थल सहेजें।", te: "చికిత్సకు ఆటంకం కలగకుండా సన్నివేశం భద్రపరచండి." } },
    ],
    remedies: [
      { en: "If someone is injured, get medical help and inform the police. Section 134 of the Motor Vehicles Act states duties of a driver when an accident injures a person.", hi: "यदि कोई घायल हो तो चिकित्सा सहायता लें और पुलिस को बताएं। मोटर यान अधिनियम की धारा 134 चालक के कर्तव्य बताती है।", te: "ఎవరైనా గాయపడితే వైద్య సహాయం తీసుకుని పోలీసులకు చెప్పండి. మోటారు వాహనాల చట్టం సెక్షన్ 134 డ్రైవర్ విధులు చెబుతుంది." },
      { en: "For a challan, use the official state transport or traffic portal printed on the challan. NyayaMarg does not invent a payment website.", hi: "चालान के लिए चालान पर छपे आधिकारिक पोर्टल का उपयोग करें। न्यायमार्ग भुगतान वेबसाइट नहीं गढ़ता।", te: "చలాన్ కోసం చలాన్‌పై ముద్రించిన అధికారిక పోర్టల్ వాడండి. న్యాయమార్గ్ చెల్లింపు వెబ్‌సైట్ కల్పించదు." },
    ],
    flow: [
      { title: { en: "People at the scene", hi: "घटनास्थल पर लोग", te: "సన్నివేశంలో ఉన్నవారు" }, detail: { en: "Safety and medical help first: 112 and 108.", hi: "पहले सुरक्षा और चिकित्सा: 112 और 108।", te: "ముందు భద్రత మరియు వైద్యం: 112 మరియు 108." } },
      { title: { en: "Police", hi: "पुलिस", te: "పోలీసులు" }, detail: { en: "Report injury accidents. Keep any receipt or number they give.", hi: "चोट वाली दुर्घटना की रिपोर्ट करें। जो संख्या मिले उसे रखें।", te: "గాయపు ప్రమాదాలను నివేదించండి. ఇచ్చిన నంబర్ ఉంచుకోండి." } },
      { title: { en: "Insurer", hi: "बीमाकर्ता", te: "బీమా సంస్థ" }, detail: { en: "Inform the insurer named in the policy. Time limits are in the policy and the law; read them rather than guessing.", hi: "पॉलिसी में लिखे बीमाकर्ता को सूचित करें। समय-सीमा पॉलिसी और कानून में है।", te: "పాలసీలో ఉన్న బీమా సంస్థకు తెలియజేయండి. గడువులు పాలసీ మరియు చట్టంలో ఉన్నాయి." } },
      { title: { en: "State transport or claims process", hi: "राज्य परिवहन या दावा प्रक्रिया", te: "రాష్ట్ర రవాణా లేదా క్లెయిమ్ ప్రక్రియ" }, detail: { en: "Motor accident claims are a specialised process. Use legal aid rather than a generated form alone.", hi: "मोटर दुर्घटना दावे एक विशेष प्रक्रिया हैं। केवल बनाए गए फॉर्म पर निर्भर न रहें।", te: "మోటారు ప్రమాద క్లెయిమ్‌లు ప్రత్యేక ప్రక్రియ. కేవలం రూపొందించిన ఫారంపై ఆధారపడకండి." } },
    ],
    steps: [
      {
        title: { en: "Get help if anyone is hurt", hi: "यदि कोई घायल हो तो सहायता लें", te: "ఎవరైనా గాయపడితే సహాయం తీసుకోండి" },
        explanation: { en: "Call 112 or 108. This step comes before paperwork.", hi: "112 या 108 पर कॉल करें। कागजी कार्रवाई से पहले यह कदम है।", te: "112 లేదా 108కు కాల్ చేయండి. పత్రాల ముందు ఇది." },
        documents: [],
        where: { en: "Emergency services", hi: "आपातकालीन सेवाएं", te: "అత్యవసర సేవలు" },
        url: "https://www.india.gov.in/topics/home-affairs-enforcement/emergency-services",
        urlLabel: "India.gov.in emergency services",
        timing: { en: "Immediately, if there is injury or danger.", hi: "चोट या खतरे पर तुरंत।", te: "గాయం లేదా ప్రమాదం ఉంటే వెంటనే." },
      },
      {
        title: { en: "Collect vehicle, challan, and insurance details", hi: "वाहन, चालान और बीमा विवरण एकत्र करें", te: "వాహనం, చలాన్ మరియు బీమా వివరాలు సేకరించండి" },
        explanation: { en: "Photograph documents. Do not admit fault in a message drafted without advice.", hi: "दस्तावेजों के चित्र लें। बिना सलाह के संदेश में दोष स्वीकार न करें।", te: "పత్రాల ఫోటోలు తీయండి. సలహా లేకుండా సందేశంలో తప్పు ఒప్పుకోవద్దు." },
        documents: ["Licence", "Registration", "Insurance", "Challan"],
        where: { en: "Your records", hi: "आपके रिकॉर्ड", te: "మీ రికార్డులు" },
        url: "https://morth.nic.in/",
        urlLabel: "Ministry of Road Transport and Highways",
        timing: null,
      },
      {
        title: { en: "Use the official channel named on the challan or by the police", hi: "चालान या पुलिस द्वारा बताए आधिकारिक माध्यम का उपयोग करें", te: "చలాన్ లేదా పోలీసులు చెప్పిన అధికారిక మార్గం వాడండి" },
        explanation: { en: "Helmet use is covered by section 129, and dangerous driving by section 184, of the Motor Vehicles Act, 1988. Penalty amounts change with amendments, so read the current section or the challan.", hi: "हेलमेट धारा 129 और खतरनाक चालन धारा 184 से जुड़ा है। जुर्माने की राशि संशोधन से बदलती है।", te: "హెల్మెట్ సెక్షన్ 129 మరియు ప్రమాదకర డ్రైవింగ్ సెక్షన్ 184కు సంబంధించినవి. జరిమానా మొత్తాలు సవరణలతో మారతాయి." },
        documents: ["Challan"],
        where: { en: "The portal or office printed on your challan", hi: "आपके चालान पर छपा पोर्टल या कार्यालय", te: "మీ చలాన్‌పై ముద్రించిన పోర్టల్ లేదా కార్యాలయం" },
        url: "https://www.indiacode.nic.in/bitstream/123456789/15390/1/the_motor_vehicles_act%2C_1988.pdf",
        urlLabel: "Motor Vehicles Act on India Code",
        timing: null,
      },
    ],
    authorities: [
      { name: "Emergency", url: "https://www.india.gov.in/", phone: "112", note: { en: "Police and emergency response. Ambulance 108.", hi: "पुलिस और आपात प्रतिक्रिया। एम्बुलेंस 108।", te: "పోలీసు మరియు అత్యవసర స్పందన. అంబులెన్స్ 108." } },
      { name: "Ministry of Road Transport and Highways", url: "https://morth.nic.in/", phone: null, note: { en: "Central ministry. State challan portals differ.", hi: "केंद्रीय मंत्रालय। राज्य के चालान पोर्टल अलग होते हैं।", te: "కేంద్ర మంత్రిత్వం. రాష్ట్ర చలాన్ పోర్టల్‌లు వేరు." } },
    ],
  },
  {
    id: "rights",
    label: { en: "Fundamental rights and legal aid", hi: "मौलिक अधिकार और विधिक सहायता", te: "ప్రాథమిక హక్కులు మరియు న్యాయ సహాయం" },
    group: "rights",
    keywords: ["fundamental right", "article 21", "article 14", "arrested", "detention", "legal aid", "constitution", "rights"],
    facts: [
      { id: "authority", label: { en: "Police or custody is mentioned", hi: "पुलिस या हिरासत का उल्लेख है", te: "పోలీసు లేదా నిర్బంధం ప్రస్తావన ఉంది" }, test: /police|arrest|custody|detained|station/i },
    ],
    questions: [
      { en: "Is someone in custody or in immediate danger? If yes, call 112 and contact family or legal aid now.", hi: "क्या कोई हिरासत में या तत्काल खतरे में है? यदि हाँ, तो 112 पर कॉल करें।", te: "ఎవరైనా నిర్బంధంలో లేదా తక్షణ ప్రమాదంలో ఉన్నారా? అవును అయితే 112కు కాల్ చేయండి." },
    ],
    documents: [
      { name: "Any written order, notice, or arrest memo you were given", why: { en: "Shows what the authority says it did.", hi: "दिखाता है कि प्राधिकरण ने क्या किया बताया।", te: "అధికారులు ఏమి చేశామని చెప్పారో చూపిస్తుంది." } },
    ],
    remedies: [
      { en: "Contact the District Legal Services Authority. Section 12 of the Legal Services Authorities Act, 1987 sets eligibility, including for a child.", hi: "जिला विधिक सेवा प्राधिकरण से संपर्क करें। विधिक सेवा प्राधिकरण अधिनियम, 1987 की धारा 12 पात्रता बताती है, जिसमें बच्चा शामिल है।", te: "జిల్లా లీగల్ సర్వీసెస్ అథారిటీని సంప్రదించండి. లీగల్ సర్వీసెస్ అథారిటీస్ చట్టం, 1987 సెక్షన్ 12 అర్హతను, పిల్లలతో సహా, చెబుతుంది." },
    ],
    flow: [
      { title: { en: "Person or family", hi: "व्यक्ति या परिवार", te: "వ్యక్తి లేదా కుటుంబం" }, detail: { en: "If there is danger, call 112 first.", hi: "खतरा हो तो पहले 112 पर कॉल करें।", te: "ప్రమాదం ఉంటే ముందు 112కు కాల్ చేయండి." } },
      { title: { en: "Legal Services Authority", hi: "विधिक सेवा प्राधिकरण", te: "లీగల్ సర్వీసెస్ అథారిటీ" }, detail: { en: "nalsa.gov.in/directory", hi: "nalsa.gov.in/directory", te: "nalsa.gov.in/directory" } },
      { title: { en: "Competent court", hi: "सक्षम न्यायालय", te: "సమర్థ కోర్టు" }, detail: { en: "A lawyer or legal aid office chooses the remedy. This app does not file writs.", hi: "वकील या विधिक सहायता कार्यालय उपाय चुनता है। यह ऐप रिट दर्ज नहीं करता।", te: "న్యాయవాది లేదా న్యాయ సహాయ కార్యాలయం పరిహారం ఎంచుకుంటుంది. ఈ యాప్ రిట్ దాఖలు చేయదు." } },
    ],
    steps: [
      {
        title: { en: "If there is immediate danger or custody, contact 112 and the family", hi: "तत्काल खतरा या हिरासत हो तो 112 और परिवार से संपर्क करें", te: "తక్షణ ప్రమాదం లేదా నిర్బంధం ఉంటే 112 మరియు కుటుంబాన్ని సంప్రదించండి" },
        explanation: { en: "Article 22 protections, where they apply, include being told the grounds of arrest and consulting a lawyer, subject to the exceptions in the article.", hi: "जहां अनुच्छेद 22 लागू होता है, उसमें गिरफ्तारी के आधार बताना और वकील से परामर्श शामिल है, अनुच्छेद के अपवादों के साथ।", te: "ఆర్టికల్ 22 వర్తించే చోట అరెస్టు కారణాలు తెలపడం మరియు న్యాయవాదిని సంప్రదించడం ఉంటుంది, అందులోని మినహాయింపులతో." },
        documents: [],
        where: { en: "Emergency 112 and the local legal aid office", hi: "आपात 112 और स्थानीय विधिक सहायता कार्यालय", te: "అత్యవసర 112 మరియు స్థానిక న్యాయ సహాయ కార్యాలయం" },
        url: "https://nalsa.gov.in/directory/",
        urlLabel: "NALSA directory",
        timing: { en: "Immediately when someone is in danger or incommunicado in custody.", hi: "जब कोई खतरे में हो या हिरासत में संपर्क से बाहर हो, तुरंत।", te: "ఎవరైనా ప్రమాదంలో లేదా నిర్బంధంలో సంప్రదింపు లేకుండా ఉంటే వెంటనే." },
      },
    ],
    authorities: [
      { name: "NALSA", url: "https://nalsa.gov.in/", phone: null, note: { en: "National Legal Services Authority.", hi: "राष्ट्रीय विधिक सेवा प्राधिकरण।", te: "నేషనల్ లీగల్ సర్వీసెస్ అథారిటీ." } },
      { name: "Constitution of India", url: "https://legislative.gov.in/constitution-of-india/", phone: null, note: { en: "Official text.", hi: "आधिकारिक पाठ।", te: "అధికారిక పాఠం." } },
    ],
  },
];

export const ALL_PLAYBOOKS = [...PLAYBOOKS, ...MORE_PLAYBOOKS];

export const DISCLAIMER =
  "NyayaMarg provides legal information and AI-assisted guidance for educational and informational purposes. It does not replace advice from a qualified advocate or legal aid professional.";

export const EMERGENCY = [
  { name: "Emergency response", phone: "112", note: "Police and other emergency response." },
  { name: "Ambulance", phone: "108", note: "Medical emergency." },
  { name: "Cyber financial fraud helpline", phone: "1930", note: "National cyber crime helpline, with cybercrime.gov.in." },
  { name: "Women's helpline", phone: "181", note: "Published women's helpline." },
  { name: "Childline", phone: "1098", note: "For a child who needs help." },
  { name: "National Consumer Helpline", phone: "1915", note: "Consumer grievances, not a crime emergency." },
];
