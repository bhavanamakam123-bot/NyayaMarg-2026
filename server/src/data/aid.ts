/** Offices copied from the NALSA directory (page last updated 6 November 2026). No district office is invented. */
export type AidOffice = {
  id: string;
  kind: "nalsa" | "slsa" | "sclsc";
  state: string;
  name: string;
  address: string;
  phone: string | null;
  website: string | null;
  sourceUrl: string;
  verifiedOn: string;
};

const SRC = "https://nalsa.gov.in/directory/";
const V = "2026-11-06";

export const AID_OFFICES: AidOffice[] = [
  { id: "nalsa", kind: "nalsa", state: "Delhi", name: "National Legal Services Authority", address: "B-Block, Ground Floor, Administrative Buildings Complex, Supreme Court of India, New Delhi 110001. Citizen services also at Ground Floor, Double Storey Building, Jaisalmer House, 26 Man Singh Road, New Delhi 110011.", phone: "011-23382778", website: "https://nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "sclsc", kind: "sclsc", state: "Delhi", name: "Supreme Court Legal Services Committee", address: "Room No. 124 to 128, B-Block, First Floor, Administrative Buildings Complex, Supreme Court of India, Mathura Road, New Delhi 110001.", phone: "011-23112153", website: "https://www.sclsc.nic.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "ap", kind: "slsa", state: "Andhra Pradesh", name: "Andhra Pradesh State Legal Services Authority", address: "H.No. 2-273/54-A, B.S.R Commercial Complex, Malkapuram village, Andhra Pradesh Secretariat Road, opposite Traffic Police Station, Thulluru Mandal, Guntur District 522238.", phone: "0863-2341401", website: "https://andhrapradesh.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "ar", kind: "slsa", state: "Arunachal Pradesh", name: "Arunachal Pradesh State Legal Services Authority", address: "Tower-1 Apartment, Zoo Road, Chimpu, Itanagar, Arunachal Pradesh 791113.", phone: "0360-2911149", website: "https://arunachalpradesh.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "as", kind: "slsa", state: "Assam", name: "Assam State Legal Services Authority", address: "Gauhati High Court, Old Block, 1st Floor, Guwahati 781001.", phone: "0361-2601843", website: "https://assam.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "br", kind: "slsa", state: "Bihar", name: "Bihar State Legal Services Authority", address: "Opposite Patna Museum, Buddha Marg, Patna 800001.", phone: "0612-2508943", website: "https://www.patnahighcourt.gov.in/bslsa", sourceUrl: SRC, verifiedOn: V },
  { id: "cg", kind: "slsa", state: "Chhattisgarh", name: "Chhattisgarh State Legal Services Authority", address: "Old High Court Building, Bilaspur 495001, Chhattisgarh.", phone: "07752-410210", website: "https://chhattisgarh.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "ga", kind: "slsa", state: "Goa", name: "Goa State Legal Services Authority", address: "High Court of Bombay at Goa, Penha-de-Franca, Porvorim, Goa.", phone: "0832-2492614", website: "https://goa.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "gj", kind: "slsa", state: "Gujarat", name: "Gujarat State Legal Services Authority", address: "3rd Floor, near Gujarat High Court Post Office, Gujarat High Court Complex, Sola, Ahmedabad 380060.", phone: "079-27664964", website: "https://gujarat.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "hr", kind: "slsa", state: "Haryana", name: "Haryana State Legal Services Authority", address: "Institutional Plot No. 9, Sector 14, Panchkula, Haryana 134109.", phone: "0172-2583309", website: "https://haryana.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "hp", kind: "slsa", state: "Himachal Pradesh", name: "Himachal Pradesh State Legal Services Authority", address: "Block No. 22, SDA Complex, Kusumpti, Shimla 171009.", phone: "0177-2623862", website: "https://himachalpradesh.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "jk", kind: "slsa", state: "Jammu and Kashmir", name: "Jammu and Kashmir Legal Services Authority", address: "Winter (November to April): JDA Complex, Janipur, Jammu 180007. Summer (May to October): Old Secretariat, Srinagar 190001.", phone: "0191-2539962", website: "https://jammukashmir.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "jh", kind: "slsa", state: "Jharkhand", name: "Jharkhand State Legal Services Authority", address: "Nyaya Sadan, near AG Office, Doranda, Ranchi 834002.", phone: "0651-2481520", website: "https://www.jhalsa.org/", sourceUrl: SRC, verifiedOn: V },
  { id: "ka", kind: "slsa", state: "Karnataka", name: "Karnataka State Legal Services Authority", address: "Nyaya Degula, 1st Floor, H. Siddaiah Road, Bengaluru 560027.", phone: "080-22111875", website: "https://karnataka.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "kl", kind: "slsa", state: "Kerala", name: "Kerala State Legal Services Authority", address: "Niyama Sahaya Bhavan, High Court Compound, Ernakulam, Kochi 682031.", phone: "0484-2396717", website: "https://kerala.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "mp", kind: "slsa", state: "Madhya Pradesh", name: "Madhya Pradesh State Legal Services Authority", address: "C-2, South Civil Lines, Pachpedi, Jabalpur 482001.", phone: "0761-2678352", website: "https://madhyapradesh.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "mh", kind: "slsa", state: "Maharashtra", name: "Maharashtra State Legal Services Authority", address: "105, High Court, PWD Building, Fort, Mumbai 400032.", phone: "022-22691395", website: "https://maharashtra.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "mn", kind: "slsa", state: "Manipur", name: "Manipur State Legal Services Authority", address: "ADR Centre, Lamphel Court Complex, Lamphelpat 795004, Imphal West, Manipur.", phone: "9436239666", website: "https://manipur.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "ml", kind: "slsa", state: "Meghalaya", name: "Meghalaya State Legal Services Authority", address: "Room 120, MATI Building, Additional Secretariat, Shillong 793001.", phone: "0364-2501051", website: "https://meghalaya.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "mz", kind: "slsa", state: "Mizoram", name: "Mizoram State Legal Services Authority", address: "Behind New District Court Building, High Court Complex, MINECO, Aizawl, Mizoram 796001.", phone: "0389-2336621", website: "https://mizoram.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "nl", kind: "slsa", state: "Nagaland", name: "Nagaland State Legal Services Authority", address: "KDPA Building, top floor, D.C. Office Compound, Kohima 797001.", phone: "0370-2290153", website: "https://nagaland.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "od", kind: "slsa", state: "Odisha", name: "Odisha State Legal Services Authority", address: "AAIN Seva Bhawan, Sector-1, CDA, Cuttack 753014, Odisha.", phone: "0671-2307678", website: null, sourceUrl: SRC, verifiedOn: V },
  { id: "pb", kind: "slsa", state: "Punjab", name: "Punjab State Legal Services Authority", address: "Site No. 126, opposite GMADA Community Centre, Sector 69, SAS Nagar, Mohali.", phone: "0172-2216690", website: "https://punjab.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "rj", kind: "slsa", state: "Rajasthan", name: "Rajasthan State Legal Services Authority", address: "Rajasthan High Court Building, Jaipur 302005.", phone: "0141-2227481", website: "https://rajasthan.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "sk", kind: "slsa", state: "Sikkim", name: "Sikkim State Legal Services Authority", address: "Development Area, Gangtok, East Sikkim 737101.", phone: "03592-207753", website: "https://sikkim.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "ts", kind: "slsa", state: "Telangana", name: "Telangana State Legal Services Authority", address: "1st and 2nd Floor, Nyaya Seva Sadan, near Nagamata Temple, Gate No. 2, High Court Premises, Hyderabad 500066.", phone: "040-23446725", website: "https://telangana.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "tn", kind: "slsa", state: "Tamil Nadu", name: "Tamil Nadu State Legal Services Authority", address: "North Fort Road, High Court Campus, Chennai 600104.", phone: "044-25342834", website: "https://tamilnadu.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "tr", kind: "slsa", state: "Tripura", name: "Tripura State Legal Services Authority", address: "Old District and Sessions Judge Court, near Fire Brigade Chowmuhani, Agartala, Tripura West 799001.", phone: "0381-2322481", website: "https://www.slsa.tripura.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "up", kind: "slsa", state: "Uttar Pradesh", name: "Uttar Pradesh State Legal Services Authority", address: "3rd Floor, Jawahar Bhawan Annexe, Lucknow 226001.", phone: "0522-2286395", website: "https://uttarpradesh.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "uk", kind: "slsa", state: "Uttarakhand", name: "Uttarakhand State Legal Services Authority", address: "ADR Centre, High Court Campus, Nainital 263002.", phone: "05942-236762", website: "https://uttarakhand.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "wb", kind: "slsa", state: "West Bengal", name: "West Bengal State Legal Services Authority", address: "City Civil Court Building, 1st Floor, 2 and 3 Kiron Sankar Roy Road, Kolkata 700001.", phone: "033-22483892", website: "https://westbengal.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "an", kind: "slsa", state: "Andaman and Nicobar Islands", name: "Andaman and Nicobar State Legal Services Authority", address: "Secretariat, A&N Administration, Port Blair 744101.", phone: "03192-232835", website: null, sourceUrl: SRC, verifiedOn: V },
  { id: "ch", kind: "slsa", state: "Chandigarh", name: "State Legal Services Authority, Union Territory of Chandigarh", address: "Additional Deluxe Building, Ground Floor, Sector 9-D, Chandigarh 160009.", phone: "0172-2742999", website: "https://chandigarh.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "dn", kind: "slsa", state: "Dadra and Nagar Haveli and Daman and Diu", name: "Dadra and Nagar Haveli Legal Services Authority", address: "District and Sessions Court, Tokarkhada, Silvassa, Dadra and Nagar Haveli 396230.", phone: "0260-2641337", website: "https://dadraandnagarhaveli.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "dd", kind: "slsa", state: "Dadra and Nagar Haveli and Daman and Diu", name: "Daman and Diu Legal Services Authority", address: "District and Sessions Court, Fort Area, Moti Daman, Daman 396220.", phone: "0260-2230887", website: "https://damananddiu.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "dl", kind: "slsa", state: "Delhi", name: "Delhi State Legal Services Authority", address: "Central Office, 3rd Floor, Rouse Avenue District Court Complex, Pt. Deen Dayal Upadhyaya Marg, New Delhi 110002.", phone: "011-23232781", website: "https://delhi.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "la", kind: "slsa", state: "Ladakh", name: "Ladakh Legal Services Authority", address: "Dambuchan, Akling, Leh, Ladakh 194101.", phone: null, website: "https://ladakh.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
  { id: "ld", kind: "slsa", state: "Lakshadweep", name: "Lakshadweep State Legal Services Authority", address: "District and Sessions Judge, Lakshadweep, Kavaratti 682555.", phone: "04896-263422", website: null, sourceUrl: SRC, verifiedOn: V },
  { id: "py", kind: "slsa", state: "Puducherry", name: "Union Territory of Puducherry Legal Services Authority", address: "No. 3, Lal Bahadur Shastri Street, Puducherry 605001.", phone: "0413-2338831", website: "https://puducherry.nalsa.gov.in/", sourceUrl: SRC, verifiedOn: V },
];

export const AID_NOTE =
  "These are State Legal Services Authorities, NALSA, and the Supreme Court Legal Services Committee as published in the NALSA directory. Free legal services are for eligible persons under the Legal Services Authorities Act, 1987. District and taluk offices are not invented here; use the state authority's own directory for those addresses.";
