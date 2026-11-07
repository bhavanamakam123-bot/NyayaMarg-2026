export type LegalUpdate = {
  id: string;
  title: string;
  summary: string;
  publishedOn: string;
  effectiveOn: string | null;
  status: "published" | "passed" | "in_force" | "partially_in_force";
  statusNote: string;
  act: string;
  category: string;
  sourceName: string;
  sourceUrl: string;
};

export const UPDATES: LegalUpdate[] = [
  {
    id: "bns-commencement",
    title: "Bharatiya Nyaya Sanhita, Bharatiya Nagarik Suraksha Sanhita and Bharatiya Sakshya Adhiniyam brought into force",
    summary: "The Ministry of Home Affairs appointed 1 July 2024 as the date for these three laws. The BNS notification excepts sub-section (2) of section 106. The BNSS notification excepts the related entry in the First Schedule. Conduct before the appointed date can remain under the earlier law, subject to transitional provisions. The Negotiable Instruments Act and the Information Technology Act were not replaced by these notifications.",
    publishedOn: "2024-02-23",
    effectiveOn: "2024-07-01",
    status: "partially_in_force",
    statusNote: "The Acts received assent in December 2023. Commencement was appointed later by notification. In force from 1 July 2024 except the withheld portion of BNS section 106(2) and the matching BNSS schedule entry.",
    act: "Bharatiya Nyaya Sanhita, 2023; Bharatiya Nagarik Suraksha Sanhita, 2023; Bharatiya Sakshya Adhiniyam, 2023",
    category: "criminal",
    sourceName: "Ministry of Home Affairs notifications S.O. 848(E), 849(E) and 850(E)",
    sourceUrl: "https://www.ncrb.mha.gov.in/uploads/SankalanPortal/DownloadPDF/GazetteNotificationOfBNS,BNSS,BSA.pdf",
  },
  {
    id: "cpa-2019",
    title: "Consumer Protection Act, 2019 — notified commencement of specified provisions",
    summary: "The Act says it comes into force on a date the Central Government appoints, and different dates may be appointed for different provisions. The India Code text records notification S.O. 2421(E) dated 23 July 2020, appointing 24 July 2020 for specified provisions, including parts of section 2. Check the particular section you rely on.",
    publishedOn: "2020-07-23",
    effectiveOn: "2020-07-24",
    status: "partially_in_force",
    statusNote: "This entry is about notified commencement of specified provisions, not a claim that every clause began on the same day. The Act itself was of 2019.",
    act: "Consumer Protection Act, 2019",
    category: "consumer",
    sourceName: "India Code — Consumer Protection Act, 2019",
    sourceUrl: "https://www.indiacode.nic.in/handle/123456789/15256",
  },
  {
    id: "mv-amendment",
    title: "Motor Vehicles (Amendment) Act, 2019 — changes to road-safety offences",
    summary: "Amendments to the Motor Vehicles Act, 1988 changed provisions on dangerous driving and related penalties. The explanation to section 184 includes conduct such as jumping a red light and using a handheld communication device while driving. Read the current India Code text before relying on a fine amount, because older summaries quote the pre-amendment figures.",
    publishedOn: "2019-08-09",
    effectiveOn: "2019-09-01",
    status: "in_force",
    statusNote: "Many of the amended penalty provisions were brought in from 1 September 2019. Always confirm the section you are relying on in the current text.",
    act: "Motor Vehicles Act, 1988",
    category: "traffic",
    sourceName: "India Code — Motor Vehicles Act, 1988",
    sourceUrl: "https://www.indiacode.nic.in/bitstream/123456789/15390/1/the_motor_vehicles_act%2C_1988.pdf",
  },
  {
    id: "pib-criminal-laws",
    title: "Press Information Bureau note on the new criminal laws",
    summary: "A Ministry of Home Affairs release dated 10 December 2024 restates that the BNS (except section 106(2)), the BNSS (except the related First Schedule entry), and the Bharatiya Sakshya Adhiniyam came into force on 1 July 2024.",
    publishedOn: "2024-12-10",
    effectiveOn: "2024-07-01",
    status: "published",
    statusNote: "This is an official press note about laws already brought into force. It is not itself the commencement notification. The gazette notifications of 23 February 2024 are the appointing instruments.",
    act: "Bharatiya Nyaya Sanhita, 2023",
    category: "criminal",
    sourceName: "Press Information Bureau",
    sourceUrl: "https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=2082757",
  },
];
