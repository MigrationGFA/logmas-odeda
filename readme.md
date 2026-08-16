# Odeda Local Government Area (LOGMAS) — Statutory Services & Form Fields Reference (`README.md`)

This document provides an exhaustive, complete reference for all **12 Statutory Services** available in the **Odeda Local Government Area (LGA) Revenue & Service Management Portal (LOGMAS)**, including all form input fields, data types, dropdown option lists, validation requirements, document upload specifications, and statutory declarations.

---

## 1. Overview of Statutory Odeda LGA Services

| # | Service Name | Service Code | Category | Revenue Head | Default Statutory Fee | Document Output |
|---|---|---|---|---|---|---|
| 1 | **Certificate of Origin** | `certificate_of_origin` | Certificates | `1001 - Certificate Fees` | ₦3,500 | Certificate of Origin |
| 2 | **Certificate of Club Registration** | `club_registration` | Certificates | `1002 - Organization Fees` | ₦15,000 | Certificate of Club Registration |
| 3 | **Certificate of Community Development Association (CDA) Registration** | `cda_registration` | Community & Agriculture | `1003 - Community Dev Head` | ₦10,000 | CDA Registration Certificate |
| 4 | **Certificate of Farmers Registration** | `farmers_registration` | Community & Agriculture | `1004 - Agricultural Services` | ₦5,000 | Farmers Registration Certificate |
| 5 | **Certificate of Environmental Sanitation Compliance** | `environmental_sanitation` | Certificates | `1005 - Health & Sanitation` | ₦20,000 (₦15,000–₦50,000) | Sanitation Compliance Certificate |
| 6 | **Tenement Rate** | `tenement_rate` | Rates & Levies | `2001 - Tenement & Property Rates` | ₦25,000 (Scale-based) | Tenement Rate Clearance Certificate |
| 7 | **Haulage Fees** | `haulage_fees` | Rates & Levies | `2002 - Haulage & Transit Head` | ₦10,000 (Tonnage-based) | Haulage Operation Permit / Clearance |
| 8 | **Liquor Licence Fees** | `liquor_licence` | Licences & Permits | `2003 - Excise & Trade Licences` | ₦25,000 (Tier-based) | Statutory Liquor Licence |
| 9 | **Viewing Centre Licence Fee** | `viewing_centre_licence` | Licences & Permits | `2004 - Entertainment & Sports` | ₦15,000 | Viewing Centre Operational Licence |
| 10 | **Quarry Fees and Permits** | `quarry_permit` | Licences & Permits | `2005 - Mining & Natural Resources` | ₦150,000 | Quarry Mining & Extraction Permit |
| 11 | **Street Naming and Property Numbering** | `street_naming` | Urban Development | `3001 - Urban Planning Head` | ₦100,000 | Street Naming & Numbering Certificate |
| 12 | **Kiosk Licence** | `kiosk_licence` | Licences & Permits | `3002 - Micro Trade Permits` | ₦8,000 | Commercial Kiosk Operating Licence |

---

## 2. Standard Wards in Odeda Local Government Area

All address and geographic location fields reference the **10 Statutory Wards of Odeda LGA**:
1. `Odeda` (Ward 01 - LGA Secretariat Headquarters)
2. `Alagbagba` (Ward 02 - Mining / Agricultural Hub)
3. `Obantoko` (Ward 03 - Urban / Commercial Sector)
4. `Ilugun` (Ward 04)
5. `Osiele` (Ward 05 - Transit / Educational Zone)
6. `Camp` (Ward 06 - Student / Commercial Zone)
7. `Olodo` (Ward 07)
8. `Opeji` (Ward 08)
9. `Balogun` (Ward 09)
10. `Itesi` (Ward 10)

---

## 3. Comprehensive Form Field Specifications by Service

---

### Service 1: Certificate of Origin (`certificate_of_origin`)
* **Purpose**: Official indigene certificate issued to born residents and descendants of Odeda Local Government Area for NYSC, civil service employment, academic admissions, and military/paramilitary screenings.
* **Default Statutory Fee**: ₦3,500 (Configurable by Treasury)
* **Processing Time**: 1 – 2 Business Days
* **Output Document**: Official Odeda LGA Indigene Certificate with security watermark and verification QR code.

#### Form Input Fields:
| Field Key | Field Label | Input Type | Options / Dropdown Values | Required | Validation / Placeholder |
|---|---|---|---|---|---|
| `fullName` | Full Name (as on official ID) | `text` | — | **Yes** | e.g., *Adeyemi Babatunde Ogunlesi* |
| `dob` | Date of Birth | `date` | — | **Yes** | Standard Date picker |
| `gender` | Gender | `select` | `Male`, `Female` | **Yes** | Default: `Male` |
| `phone` | Phone Number | `tel` | — | **Yes** | e.g., `0803XXXXXXX` |
| `email` | Email Address | `email` | — | No | Valid email format |
| `address` | Residential Address | `text` | — | **Yes** | Current street / residential address |
| `ward` | Odeda Ward of Origin | `select` | 10 Odeda Wards | **Yes** | Dropdown selection |
| `fatherName` | Father's Full Name | `text` | — | **Yes** | Full paternal name |
| `fatherCompound` | Father's Family Compound / House | `text` | — | **Yes** | e.g., *Ile Alagbaa Compound* |
| `fatherVillage` | Father's Ancestral Village / Town | `text` | — | **Yes** | e.g., *Alagbagba / Odeda Town* |
| `motherName` | Mother's Maiden / Full Name | `text` | — | **Yes** | Full maternal maiden name |
| `motherCompound` | Mother's Family Compound / House | `text` | — | **Yes** | e.g., *Ile Osi Compound* |
| `motherVillage` | Mother's Ancestral Village / Town | `text` | — | **Yes** | Ancestral village in Odeda |
| `purpose` | Purpose of Application | `select` | `Employment / NYSC / Admission`, `Military / Paramilitary Recruitment`, `Political Appointment / Screening`, `General Identification` | **Yes** | Default: `Employment / NYSC / Admission` |
| `declaration` | Indigene Statutory Declaration | `checkbox` | Acceptance boolean | **Yes** | "I solemnly declare that the genealogical details provided above are true..." |

#### Required Document Uploads:
1. **Passport Photograph (red background)** (`passportPhoto`)
2. **National Identity Card / NIN Slip** (`ninSlip`)
3. **Birth Certificate / Sworn Declaration of Age** (`birthCert`)
4. **Letter of Identification from Family Head or Baale** (`baaleLetter`)

---

### Service 2: Certificate of Club Registration (`club_registration`)
* **Purpose**: Formal registration and certification for social clubs, youth associations, cultural groups, and sports organizations operating in Odeda LGA.
* **Default Statutory Fee**: ₦15,000 (Configurable by Treasury)
* **Processing Time**: 3 – 5 Business Days
* **Output Document**: Certificate of Club Registration & Recognition.

#### Form Input Fields:
| Field Key | Field Label | Input Type | Options / Dropdown Values | Required | Validation / Placeholder |
|---|---|---|---|---|---|
| `clubName` | Name of Club / Organization | `text` | — | **Yes** | e.g., *Odeda Dynamic Youth Club* |
| `clubType` | Category of Club | `select` | `Social & Cultural`, `Sports & Recreation`, `Youth & Development`, `Professional & Trade` | **Yes** | Default: `Social & Cultural` |
| `meetingAddress` | Secretariat / Meeting Address | `text` | — | **Yes** | Physical meeting venue in Odeda |
| `ward` | Ward Jurisdiction | `select` | 10 Odeda Wards | **Yes** | Dropdown selection |
| `presidentName` | President / Chairman Full Name | `text` | — | **Yes** | Full name of club president |
| `presidentPhone` | President Phone Number | `tel` | — | **Yes** | e.g., `080XXXXXXXX` |
| `secretaryName` | Secretary Full Name | `text` | — | **Yes** | Full name of secretary |
| `secretaryPhone` | Secretary Phone Number | `tel` | — | **Yes** | e.g., `080XXXXXXXX` |
| `membershipCount` | Current Number of Members | `number` | — | **Yes** | Minimum 5 members (Default: `20`) |
| `objectives` | Key Aims & Objectives | `textarea` | — | **Yes** | Summary of club mission |
| `declaration` | Constitution Compliance Declaration | `checkbox` | Acceptance boolean | **Yes** | "I declare that the executive members and constitution are bona fide..." |

#### Required Document Uploads:
1. **Club Constitution / Rules & Regulations** (`clubConstitution`)
2. **Minutes of Inaugural Meeting** (`inauguralMinutes`)
3. **List of Executive Members & Contacts** (`execList`)
4. **Passport Photographs of President & Secretary** (`execPassports`)
5. **Proof of Secretariat / Meeting Venue Address** (`venueProof`)

---

### Service 3: Certificate of Community Development Association (CDA) Registration (`cda_registration`)
* **Purpose**: Official registration and government recognition of community development associations (CDAs) for grassroots governance and ward development projects.
* **Default Statutory Fee**: ₦10,000 (Configurable by Treasury)
* **Processing Time**: 3 – 5 Business Days
* **Output Document**: CDA Recognition & Registration Certificate.

#### Form Input Fields:
| Field Key | Field Label | Input Type | Options / Dropdown Values | Required | Validation / Placeholder |
|---|---|---|---|---|---|
| `cdaName` | Name of CDA | `text` | — | **Yes** | e.g., *Harmony Community Development Association* |
| `communityName` | Community / Settlement Name | `text` | — | **Yes** | e.g., *Obantoko Phase 2 Community* |
| `ward` | Ward Jurisdiction | `select` | 10 Odeda Wards | **Yes** | Dropdown selection |
| `estimatedHouseholds` | Estimated Number of Households | `number` | — | **Yes** | e.g., `150` |
| `chairmanName` | CDA Chairman Full Name | `text` | — | **Yes** | Executive Chairman name |
| `chairmanPhone` | Chairman Phone Number | `tel` | — | **Yes** | Active phone line |
| `secretaryName` | CDA Secretary Full Name | `text` | — | **Yes** | General Secretary name |
| `secretaryPhone` | Secretary Phone Number | `tel` | — | **Yes** | Active phone line |
| `baaleSupportName` | Sponsoring Baale / Traditional Head | `text` | — | **Yes** | Traditional head endorsing CDA |
| `declaration` | CDA Community Declaration | `checkbox` | Acceptance boolean | **Yes** | "I declare that the resolution represents the residents of the community..." |

#### Required Document Uploads:
1. **CDA Constitution & By-Laws** (`cdaConstitution`)
2. **Inaugural Meeting Minutes & Attendance Sheet** (`meetingMinutes`)
3. **List of Executive Members with Phone Numbers** (`executivesList`)
4. **Community Boundary Map / Sketch** (`boundarySketch`)
5. **Letter of Support from Ward Development Committee** (`wardSupportLetter`)

---

### Service 4: Certificate of Farmers Registration (`farmers_registration`)
* **Purpose**: Formal registration and identification certificate for individual farmers, farm estates, and agricultural cooperatives across Odeda LGA.
* **Default Statutory Fee**: ₦5,000 (Configurable by Treasury)
* **Processing Time**: 2 – 3 Business Days
* **Output Document**: Farmers Registration & Agricultural Identity Certificate.

#### Form Input Fields:
| Field Key | Field Label | Input Type | Options / Dropdown Values | Required | Validation / Placeholder |
|---|---|---|---|---|---|
| `farmerName` | Farmer / Farm Business Name | `text` | — | **Yes** | e.g., *Korede Agro Farms* |
| `phone` | Phone Number | `tel` | — | **Yes** | e.g., `080XXXXXXXX` |
| `email` | Email Address | `email` | — | No | Valid email format |
| `ward` | Farming Ward Location | `select` | 10 Odeda Wards | **Yes** | Dropdown selection |
| `farmingType` | Primary Agricultural Enterprise | `select` | `Crop Farming (Cassava / Maize)`, `Poultry & Egg Production`, `Livestock & Cattle / Goat Rearing`, `Fish Farming / Aquaculture`, `Horticulture & Vegetable Farming`, `Mixed Agro-Enterprise` | **Yes** | Default: `Crop Farming (Cassava / Maize)` |
| `farmLocation` | Farm Settlement / Village Address | `text` | — | **Yes** | e.g., *Km 12, Olodo Farm Settlement* |
| `farmSizeAcres` | Farm Concession Size (Acres / Ha) | `number` | — | **Yes** | e.g., `5` |
| `cooperativeName` | Farmers Cooperative Name | `text` | — | No | Optional affiliated cooperative |
| `declaration` | Agricultural Integrity Declaration | `checkbox` | Acceptance boolean | **Yes** | "I certify that the agricultural details and farm location are authentic..." |

#### Required Document Uploads:
1. **Passport Photograph of Applicant / Manager** (`farmerPassport`)
2. **Means of Identification (NIN / Voter Card)** (`farmerId`)
3. **Farm Location GPS Coordinates or Sketch** (`farmSketch`)
4. **Proof of Land Ownership or Tenancy Agreement** (`landProof`)
5. **Cooperative / Farmers Association Card (if applicable)** (`coopCard`)

---

### Service 5: Certificate of Environmental Sanitation Compliance (`environmental_sanitation`)
* **Purpose**: Mandatory annual environmental health and hygiene clearance certificate for commercial plazas, industrial plants, eateries, hotels, and schools.
* **Default Statutory Fee**: ₦20,000 (Tiered: ₦15,000 to ₦50,000 based on facility type)
* **Processing Time**: 3 – 5 Business Days
* **Output Document**: Environmental Sanitation Compliance Certificate.

#### Form Input Fields:
| Field Key | Field Label | Input Type | Options / Dropdown Values | Required | Validation / Placeholder |
|---|---|---|---|---|---|
| `businessName` | Business / Facility Name | `text` | — | **Yes** | e.g., *Grand Royale Hotel & Suites* |
| `facilityType` | Facility Classification | `select` | `Residential Tenement / Eatery / Shop` (₦15,000), `Commercial Complex / Shopping Plaza` (₦20,000), `Hotel / Hospital / Event Center` (₦35,000), `Industrial Factory / Quarry Plant` (₦50,000) | **Yes** | Default: `Commercial Complex / Shopping Plaza` |
| `address` | Facility Physical Address | `text` | — | **Yes** | Street address |
| `ward` | Facility Ward Location | `select` | 10 Odeda Wards | **Yes** | Dropdown selection |
| `contactPerson` | Health / Safety Officer Name | `text` | — | **Yes** | Contact officer name |
| `phone` | Contact Phone Number | `tel` | — | **Yes** | Active phone line |
| `wasteProvider` | Designated Waste Disposal Contractor | `text` | — | **Yes** | e.g., *Odeda LGA Waste Board / Private PSP* |
| `sanitationFacilities` | Available Sanitation Infrastructure | `text` | — | **Yes** | e.g., *Flush Toilets, Soakaway, Covered Bins* |
| `declaration` | Environmental Sanitation Declaration | `checkbox` | Acceptance boolean | **Yes** | "I certify that this facility complies with all Odeda LGA health bye-laws..." |

#### Required Document Uploads:
1. **Facility Layout & Sanitation Plan** (`sanitationPlan`)
2. **Waste Management / Disposal Contract Evidence** (`wasteContract`)
3. **Pest Control & Fumigation Certificate** (`fumigationCert`)
4. **Photographs of Waste Storage & Toilet Facilities** (`facilityPhotos`)

---

### Service 6: Tenement Rate (`tenement_rate`)
* **Purpose**: Annual statutory property tax clearance levied on landlords and owners of residential, commercial, and industrial properties in Odeda LGA.
* **Default Statutory Fee**: ₦25,000 (Scale-based: ₦12,000–₦100,000)
* **Processing Time**: 1 – 2 Business Days
* **Output Document**: Annual Tenement Rate Clearance Certificate.

#### Form Input Fields:
| Field Key | Field Label | Input Type | Options / Dropdown Values | Required | Validation / Placeholder |
|---|---|---|---|---|---|
| `ownerName` | Property Owner / Landlord Name | `text` | — | **Yes** | Landlord or corporate owner |
| `phone` | Phone Number | `tel` | — | **Yes** | Contact phone |
| `email` | Email Address | `email` | — | No | Valid email |
| `propertyAddress` | Physical Property Address | `text` | — | **Yes** | Exact property location |
| `ward` | Property Ward Location | `select` | 10 Odeda Wards | **Yes** | Dropdown selection |
| `propertyCategory` | Property Classification | `select` | `Residential (Tenement / Rooming House)`, `Residential (Bungalow / Duplex)`, `Commercial Plaza / Banking Hall`, `Industrial / Factory Premises`, `Agricultural Farm Building / Storage` | **Yes** | Default: `Residential (Bungalow / Duplex)` |
| `numberOfUnits` | Number of Habitable Units / Flats / Shops | `number` | — | **Yes** | e.g., `4` |
| `assessmentYear` | Assessment Billing Year | `select` | `2026`, `2025 (Arrears)` | **Yes** | Default: `2026` |
| `declaration` | Property Valuation Declaration | `checkbox` | Acceptance boolean | **Yes** | "I declare that the property description represents true physical assets..." |

#### Required Document Uploads:
1. **Property Ownership Document / Survey Plan** (`ownershipDoc`)
2. **Building Elevation Photographs** (`buildingPhoto`)
3. **Previous Year Tenement Clearance (for renewals)** (`prevClearance`)
4. **Valid ID of Property Owner / Agent** (`ownerId`)

---

### Service 7: Haulage Fees (`haulage_fees`)
* **Purpose**: Statutory transit levy and operator clearance for heavy-duty haulage vehicles, tippers, granite transit, timber, and agro logistics passing through or loading in Odeda LGA.
* **Default Statutory Fee**: ₦10,000 (Tonnage-based: ₦4,000–₦20,000 per trip or monthly)
* **Processing Time**: Instant / Same Day
* **Output Document**: Official Haulage Transit Clearance / Permit.

#### Form Input Fields:
| Field Key | Field Label | Input Type | Options / Dropdown Values | Required | Validation / Placeholder |
|---|---|---|---|---|---|
| `companyName` | Haulage / Transport Operator Name | `text` | — | **Yes** | e.g., *Odeda Logistics Express Ltd* |
| `vehicleRegistration` | Vehicle Registration Number | `text` | — | **Yes** | e.g., `OG-345-ABJ` |
| `truckCapacity` | Truck Tonnage & Capacity | `select` | `Light Duty Van / Pick-up (< 10 Tons)` (₦4,000), `Medium Truck / Canter (10-20 Tons)` (₦6,000), `Heavy Duty Tipper (20-30 Tons)` (₦10,000), `Trailer / Heavy Mining Dump Truck (30+ Tons)` (₦20,000) | **Yes** | Default: `Heavy Duty Tipper (20-30 Tons)` |
| `cargoCategory` | Primary Cargo Transported | `select` | `Granite / Quarry Stone`, `Sand / Laterite`, `Agricultural Produce / Cassava`, `Timber / Wood Logs`, `General Merchandise` | **Yes** | Default: `Granite / Quarry Stone` |
| `driverName` | Driver Full Name | `text` | — | **Yes** | Primary vehicle driver |
| `driverPhone` | Driver Phone Number | `tel` | — | **Yes** | Active mobile line |
| `loadingWard` | Loading Point / Quarry Ward | `select` | 10 Odeda Wards | **Yes** | Default: `Alagbagba` / `Odeda` |
| `destination` | Transit Destination Route | `text` | — | **Yes** | e.g., *Lagos / Ogun Transit Corridor* |
| `tripFrequency` | Payment Schedule | `select` | `Per Trip`, `Monthly Fleet Permit`, `Annual Haulage Permit` | **Yes** | Default: `Per Trip` |
| `declaration` | Road Transit Compliance Declaration | `checkbox` | Acceptance boolean | **Yes** | "I agree to comply with Odeda LGA axle load regulations and transit bye-laws..." |

#### Required Document Uploads:
1. **Vehicle Registration Papers** (`vehiclePapers`)
2. **Driver's Licence** (`driverLicense`)
3. **Waybill / Load Manifest** (`waybill`)
4. **Quarry or Loading Point Dispatch Note** (`dispatchNote`)

---

### Service 8: Liquor Licence Fees (`liquor_licence`)
* **Purpose**: Annual statutory excise licence authorizing retail or wholesale sale of alcoholic beverages, bars, lounges, and hotel beverage outlets within Odeda LGA.
* **Default Statutory Fee**: ₦25,000 (Tiered: ₦20,000–₦60,000)
* **Processing Time**: 3 – 5 Business Days
* **Output Document**: Statutory Liquor Licence Certificate.

#### Form Input Fields:
| Field Key | Field Label | Input Type | Options / Dropdown Values | Required | Validation / Placeholder |
|---|---|---|---|---|---|
| `businessName` | Bar / Lounge / Outlet Name | `text` | — | **Yes** | e.g., *Camp Junction Lounge & Bar* |
| `establishmentCategory` | Establishment Category | `select` | `Retail Beer Parlour / Local Bar` (₦20,000), `Hotel / Bar / Lounge` (₦25,000), `Wholesale Distributor / Depot` (₦40,000), `Major Hotel / Event Resort` (₦60,000) | **Yes** | Default: `Hotel / Bar / Lounge` |
| `premisesAddress` | Physical Outlet Address | `text` | — | **Yes** | Street address |
| `ward` | Ward Location | `select` | 10 Odeda Wards | **Yes** | Dropdown selection |
| `proprietorName` | Proprietor / Licensee Name | `text` | — | **Yes** | Business owner name |
| `phone` | Contact Phone Number | `tel` | — | **Yes** | Active phone line |
| `cacNumber` | CAC Business Registration / BN Number | `text` | — | No | e.g., `BN-294829` |
| `operatingHours` | Daily Trading Hours | `text` | — | **Yes** | e.g., *10:00 AM – 11:00 PM* |
| `declaration` | Liquor Act Compliance Declaration | `checkbox` | Acceptance boolean | **Yes** | "I certify that this premises complies with age restrictions and public order laws..." |

#### Required Document Uploads:
1. **Business Premises Tenancy Agreement / C of O** (`premisesTenancy`)
2. **CAC Business Registration Documents** (`cacDocument`)
3. **Environmental Sanitation Compliance Certificate** (`sanitationCert`)
4. **Valid ID of Business Proprietor** (`proprietorId`)

---

### Service 9: Viewing Centre Licence Fee (`viewing_centre_licence`)
* **Purpose**: Annual operating permit and public safety licence for commercial football viewing centres, video halls, and gaming arcades in Odeda LGA.
* **Default Statutory Fee**: ₦15,000 (Configurable by Treasury)
* **Processing Time**: 2 – 4 Business Days
* **Output Document**: Viewing Centre Operational Licence.

#### Form Input Fields:
| Field Key | Field Label | Input Type | Options / Dropdown Values | Required | Validation / Placeholder |
|---|---|---|---|---|---|
| `centreName` | Viewing Centre Name | `text` | — | **Yes** | e.g., *Premier League Live Arena* |
| `seatingCapacity` | Audience Seating Capacity | `number` | — | **Yes** | e.g., `80` |
| `tvScreenCount` | Number of TV / Projector Screens | `number` | — | **Yes** | e.g., `3` |
| `generatorCapacity` | Backup Generator Rating | `text` | — | **Yes** | e.g., *7.5 KVA* |
| `operatorName` | Operator / Manager Full Name | `text` | — | **Yes** | Manager name |
| `phone` | Phone Number | `tel` | — | **Yes** | Active phone line |
| `address` | Premises Location Address | `text` | — | **Yes** | Physical venue address |
| `ward` | Ward Location | `select` | 10 Odeda Wards | **Yes** | Dropdown selection |
| `declaration` | Public Safety Declaration | `checkbox` | Acceptance boolean | **Yes** | "I confirm the installation of fire extinguishers, emergency exits, and ventilation..." |

#### Required Document Uploads:
1. **Premises Location Sketch & Photos** (`venuePhotos`)
2. **Fire Extinguisher & Safety Equipment Receipt** (`safetyReceipt`)
3. **Passport Photograph & ID of Operator** (`operatorId`)
4. **Tenancy Agreement or Approval Letter** (`tenancyProof`)

---

### Service 10: Quarry Fees and Permits (`quarry_permit`)
* **Purpose**: Statutory local government operating permit, mineral haulage access, and environmental impact clearance for granite quarries, crusher plants, and mining sites.
* **Default Statutory Fee**: ₦150,000 (Base permit; configurable by Treasury)
* **Processing Time**: 5 – 7 Business Days
* **Output Document**: Annual Quarry Operation & Mining Concession Permit.

#### Form Input Fields:
| Field Key | Field Label | Input Type | Options / Dropdown Values | Required | Validation / Placeholder |
|---|---|---|---|---|---|
| `companyName` | Mining / Quarry Company Name | `text` | — | **Yes** | e.g., *Odeda Granite & Crushing Ltd* |
| `cacNumber` | CAC Registration / RC Number | `text` | — | **Yes** | e.g., `RC-1294829` |
| `miningCadastreRef` | Federal Mining Cadastre Lease / Ref No | `text` | — | **Yes** | e.g., `QL-00492-2024` |
| `siteAddress` | Quarry Site Physical Location | `text` | — | **Yes** | Exact site coordinates / address |
| `ward` | Quarry Ward Location | `select` | 10 Odeda Wards | **Yes** | Default: `Alagbagba` / `Odeda` |
| `siteAreaHectares` | Licensed Concession Area (Hectares) | `number` | — | **Yes** | e.g., `25` |
| `extractedMaterial` | Primary Extracted Mineral | `select` | `Granite / Crusher Dust`, `Laterite / Sand`, `Clay / Feldspar`, `Dimension Stones / Boulders` | **Yes** | Default: `Granite / Crusher Dust` |
| `estimatedDailyTonnage` | Estimated Daily Output (Tons) | `number` | — | **Yes** | e.g., `500` |
| `contactPerson` | Managing Director / Site Engineer | `text` | — | **Yes** | Project lead name |
| `phone` | Phone Number | `tel` | — | **Yes** | Active phone line |
| `email` | Corporate Email | `email` | — | **Yes** | Corporate contact email |
| `declaration` | Mining Environmental Declaration | `checkbox` | Acceptance boolean | **Yes** | "I certify compliance with the Community Host MOU, EIA guidelines, and local bye-laws..." |

#### Required Document Uploads:
1. **Federal Mining Cadastre Lease / Quarry Licence** (`cadastreLicence`)
2. **State Ministry of Environment EIA Approval** (`eiaApproval`)
3. **Community Host Agreement (MOU)** (`communityMou`)
4. **Site Survey Plan & GPS Coordinates** (`surveyPlan`)
5. **CAC Certificate of Incorporation** (`cacCert`)

---

### Service 11: Street Naming and Property Numbering (`street_naming`)
* **Purpose**: Formal application, approval, and official registry certificate for naming streets, closes, and estates, alongside house numbering plates in Odeda LGA.
* **Default Statutory Fee**: ₦100,000 (Configurable by Treasury)
* **Processing Time**: 7 – 10 Business Days
* **Output Document**: Official Street Naming & Property Numbering Certificate.

#### Form Input Fields:
| Field Key | Field Label | Input Type | Options / Dropdown Values | Required | Validation / Placeholder |
|---|---|---|---|---|---|
| `proposedStreetName` | Proposed Street Name | `text` | — | **Yes** | e.g., *Chief Olusegun Obasanjo Way* |
| `alternativeName` | Alternative / Backup Name | `text` | — | **Yes** | e.g., *Unity Crescent* |
| `ward` | Ward Jurisdiction | `select` | 10 Odeda Wards | **Yes** | Dropdown selection |
| `communityArea` | Community / Estate Area | `text` | — | **Yes** | e.g., *Obantoko Hilltop Estate* |
| `propertyCount` | Number of Properties / Plots along Street | `number` | — | **Yes** | e.g., `25` |
| `applicantName` | Applicant / Community Leader Name | `text` | — | **Yes** | Primary sponsor name |
| `applicantRole` | Applicant Capacity | `select` | `CDA Chairman`, `Estate Developer / Landowner`, `Community Elder / Baale`, `Resident Representative` | **Yes** | Default: `CDA Chairman` |
| `phone` | Contact Phone Number | `tel` | — | **Yes** | Active phone line |
| `email` | Email Address | `email` | — | No | Valid email |
| `justification` | Historical / Community Justification | `textarea` | — | **Yes** | Rationale for proposed street name |
| `declaration` | Street Naming Statutory Declaration | `checkbox` | Acceptance boolean | **Yes** | "I certify that this naming application was endorsed by residents and has no existing duplication..." |

#### Required Document Uploads:
1. **Formal Application Letter with Justification** (`applicationLetter`)
2. **CDA Resolution or Residents Consent List** (`residentsConsent`)
3. **Street Location Map & Layout Diagram** (`streetLayout`)
4. **Applicant Identification & Contact Details** (`applicantIdDoc`)

---

### Service 12: Kiosk Licence (`kiosk_licence`)
* **Purpose**: Annual commercial trade licence and space approval for roadside kiosks, retail containers, and mobile sales booths across Odeda LGA.
* **Default Statutory Fee**: ₦8,000 (Configurable by Treasury)
* **Processing Time**: 1 – 2 Business Days
* **Output Document**: Commercial Kiosk Operating Licence.

#### Form Input Fields:
| Field Key | Field Label | Input Type | Options / Dropdown Values | Required | Validation / Placeholder |
|---|---|---|---|---|---|
| `kioskName` | Kiosk Trading / Shop Name | `text` | — | **Yes** | e.g., *Iya Moria Cold Drinks & Provisions* |
| `goodsCategory` | Retail Goods Category | `select` | `Provisions / Soft Drinks`, `Food Items / Spices`, `Phone Accessories / Recharge Cards`, `Tailoring / Artisan Repair`, `Fruit / Vegetables` | **Yes** | Default: `Provisions / Soft Drinks` |
| `locationAddress` | Roadside / Junction Location Address | `text` | — | **Yes** | Specific junction / road address |
| `ward` | Ward Location | `select` | 10 Odeda Wards | **Yes** | Dropdown selection |
| `ownerName` | Operator / Trader Full Name | `text` | — | **Yes** | Trader name |
| `phone` | Contact Phone Number | `tel` | — | **Yes** | Active mobile line |
| `declaration` | Right-of-Way & Sanitation Declaration | `checkbox` | Acceptance boolean | **Yes** | "I agree to maintain clean surroundings and not obstruct public traffic or drainage..." |

#### Required Document Uploads:
1. **Kiosk & Placement Site Photograph** (`kioskPhoto`)
2. **Landowner or Market Committee Consent Letter** (`marketConsent`)
3. **Passport Photograph of Operator** (`operatorPassport`)
4. **Valid ID Card (NIN / Voter's Card)** (`operatorIdCard`)

---

## 4. End-to-End Workflow & Financial Linkage

```
[1. Citizen Service Selection & Form Submission]
                     │
                     ▼
[2. Automated Statutory Fee Resolution from Treasury Configuration (`ServiceFeeConfig`)]
                     │
                     ▼
[3. Invoice Creation & Citizen Payment (Virtual Bank Account / Online Gateway)]
                     │
                     ▼
[4. LGA Administrator Review & Decision (Approve or Decline with mandatory reason)]
                     │
                     ▼
[5. Automated Document Generation (Official QR-Coded Certificate or Licence Issued)]
```
