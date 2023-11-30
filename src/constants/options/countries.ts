import { useT } from "@transifex/react";

import { Option } from "@/types/common";

export const getCountriesOptions = (t: typeof useT | Function = (t: string) => t) =>
  [
    {
      value: "AF",
      title: t("Afghanistan")
    },
    {
      value: "AX",
      title: t("Åland Islands")
    },
    {
      value: "AL",
      title: t("Albania")
    },
    {
      value: "DZ",
      title: t("Algeria")
    },
    {
      value: "AS",
      title: t("American Samoa")
    },
    {
      value: "AD",
      title: t("Andorra")
    },
    {
      value: "AO",
      title: t("Angola")
    },
    {
      value: "AI",
      title: t("Anguilla")
    },
    {
      value: "AQ",
      title: t("Antarctica")
    },
    {
      value: "AG",
      title: t("Antigua and Barbuda")
    },
    {
      value: "AR",
      title: t("Argentina")
    },
    {
      value: "AM",
      title: t("Armenia")
    },
    {
      value: "AW",
      title: t("Aruba")
    },
    {
      value: "AU",
      title: t("Australia")
    },
    {
      value: "AT",
      title: t("Austria")
    },
    {
      value: "AZ",
      title: t("Azerbaijan")
    },
    {
      value: "BS",
      title: t("Bahamas")
    },
    {
      value: "BH",
      title: t("Bahrain")
    },
    {
      value: "BD",
      title: t("Bangladesh")
    },
    {
      value: "BB",
      title: t("Barbados")
    },
    {
      value: "BY",
      title: t("Belarus")
    },
    {
      value: "BE",
      title: t("Belgium")
    },
    {
      value: "BZ",
      title: t("Belize")
    },
    {
      value: "BJ",
      title: t("Benin")
    },
    {
      value: "BM",
      title: t("Bermuda")
    },
    {
      value: "BT",
      title: t("Bhutan")
    },
    {
      value: "BO",
      title: t("Bolivia, Plurinational State of")
    },
    {
      value: "BQ",
      title: t("Bonaire, Sint Eustatius and Saba")
    },
    {
      value: "BA",
      title: t("Bosnia and Herzegovina")
    },
    {
      value: "BW",
      title: t("Botswana")
    },
    {
      value: "BV",
      title: t("Bouvet Island")
    },
    {
      value: "BR",
      title: t("Brazil")
    },
    {
      value: "IO",
      title: t("British Indian Ocean Territory")
    },
    {
      value: "BN",
      title: t("Brunei Darussalam")
    },
    {
      value: "BG",
      title: t("Bulgaria")
    },
    {
      value: "BF",
      title: t("Burkina Faso")
    },
    {
      value: "BI",
      title: t("Burundi")
    },
    {
      value: "CV",
      title: t("Cabo Verde")
    },
    {
      value: "KH",
      title: t("Cambodia")
    },
    {
      value: "CM",
      title: t("Cameroon")
    },
    {
      value: "CA",
      title: t("Canada")
    },
    {
      value: "KY",
      title: t("Cayman Islands")
    },
    {
      value: "CF",
      title: t("Central African Republic")
    },
    {
      value: "TD",
      title: t("Chad")
    },
    {
      value: "CL",
      title: t("Chile")
    },
    {
      value: "CN",
      title: t("China")
    },
    {
      value: "CX",
      title: t("Christmas Island")
    },
    {
      value: "CC",
      title: t("Cocos (Keeling) Islands")
    },
    {
      value: "CO",
      title: t("Colombia")
    },
    {
      value: "KM",
      title: t("Comoros")
    },
    {
      value: "CG",
      title: t("Congo")
    },
    {
      value: "CD",
      title: t("Congo, Democratic Republic of the")
    },
    {
      value: "CK",
      title: t("Cook Islands")
    },
    {
      value: "CR",
      title: t("Costa Rica")
    },
    {
      value: "HR",
      title: t("Croatia")
    },
    {
      value: "CU",
      title: t("Cuba")
    },
    {
      value: "CW",
      title: t("Curaçao")
    },
    {
      value: "CY",
      title: t("Cyprus")
    },
    {
      value: "CZ",
      title: t("Czechia")
    },
    {
      value: "CI",
      title: t("Côte d'Ivoire")
    },
    {
      value: "DK",
      title: t("Denmark")
    },
    {
      value: "DJ",
      title: t("Djibouti")
    },
    {
      value: "DM",
      title: t("Dominica")
    },
    {
      value: "DO",
      title: t("Dominican Republic")
    },
    {
      value: "EC",
      title: t("Ecuador")
    },
    {
      value: "EG",
      title: t("Egypt")
    },
    {
      value: "SV",
      title: t("El Salvador")
    },
    {
      value: "GQ",
      title: t("Equatorial Guinea")
    },
    {
      value: "ER",
      title: t("Eritrea")
    },
    {
      value: "EE",
      title: t("Estonia")
    },
    {
      value: "SZ",
      title: t("Eswatini")
    },
    {
      value: "ET",
      title: t("Ethiopia")
    },
    {
      value: "FK",
      title: t("Falkland Islands (Malvinas)")
    },
    {
      value: "FO",
      title: t("Faroe Islands")
    },
    {
      value: "FJ",
      title: t("Fiji")
    },
    {
      value: "FI",
      title: t("Finland")
    },
    {
      value: "FR",
      title: t("France")
    },
    {
      value: "GF",
      title: t("French Guiana")
    },
    {
      value: "PF",
      title: t("French Polynesia")
    },
    {
      value: "TF",
      title: t("French Southern Territories")
    },
    {
      value: "GA",
      title: t("Gabon")
    },
    {
      value: "GM",
      title: t("Gambia")
    },
    {
      value: "GE",
      title: t("Georgia")
    },
    {
      value: "DE",
      title: t("Germany")
    },
    {
      value: "GH",
      title: t("Ghana")
    },
    {
      value: "GI",
      title: t("Gibraltar")
    },
    {
      value: "GR",
      title: t("Greece")
    },
    {
      value: "GL",
      title: t("Greenland")
    },
    {
      value: "GD",
      title: t("Grenada")
    },
    {
      value: "GP",
      title: t("Guadeloupe")
    },
    {
      value: "GU",
      title: t("Guam")
    },
    {
      value: "GT",
      title: t("Guatemala")
    },
    {
      value: "GG",
      title: t("Guernsey")
    },
    {
      value: "GN",
      title: t("Guinea")
    },
    {
      value: "GW",
      title: t("Guinea-Bissau")
    },
    {
      value: "GY",
      title: t("Guyana")
    },
    {
      value: "HT",
      title: t("Haiti")
    },
    {
      value: "HM",
      title: t("Heard Island and McDonald Islands")
    },
    {
      value: "VA",
      title: t("Holy See")
    },
    {
      value: "HN",
      title: t("Honduras")
    },
    {
      value: "HK",
      title: t("Hong Kong")
    },
    {
      value: "HU",
      title: t("Hungary")
    },
    {
      value: "IS",
      title: t("Iceland")
    },
    {
      value: "IN",
      title: t("India")
    },
    {
      value: "ID",
      title: t("Indonesia")
    },
    {
      value: "IR",
      title: t("Iran")
    },
    {
      value: "IQ",
      title: t("Iraq")
    },
    {
      value: "IE",
      title: t("Ireland")
    },
    {
      value: "IM",
      title: t("Isle of Man")
    },
    {
      value: "IL",
      title: t("Israel")
    },
    {
      value: "IT",
      title: t("Italy")
    },
    {
      value: "JM",
      title: t("Jamaica")
    },
    {
      value: "JP",
      title: t("Japan")
    },
    {
      value: "JE",
      title: t("Jersey")
    },
    {
      value: "JO",
      title: t("Jordan")
    },
    {
      value: "KZ",
      title: t("Kazakhstan")
    },
    {
      value: "KE",
      title: t("Kenya")
    },
    {
      value: "KI",
      title: t("Kiribati")
    },
    {
      value: "KP",
      title: t("Korea, Democratic People's Republic of")
    },
    {
      value: "KR",
      title: t("Korea, Republic of")
    },
    {
      value: "KW",
      title: t("Kuwait")
    },
    {
      value: "KG",
      title: t("Kyrgyzstan")
    },
    {
      value: "LA",
      title: t("Lao People's Democratic Republic")
    },
    {
      value: "LV",
      title: t("Latvia")
    },
    {
      value: "LB",
      title: t("Lebanon")
    },
    {
      value: "LS",
      title: t("Lesotho")
    },
    {
      value: "LR",
      title: t("Liberia")
    },
    {
      value: "LY",
      title: t("Libya")
    },
    {
      value: "LI",
      title: t("Liechtenstein")
    },
    {
      value: "LT",
      title: t("Lithuania")
    },
    {
      value: "LU",
      title: t("Luxembourg")
    },
    {
      value: "MO",
      title: t("Macao")
    },
    {
      value: "MG",
      title: t("Madagascar")
    },
    {
      value: "MW",
      title: t("Malawi")
    },
    {
      value: "MY",
      title: t("Malaysia")
    },
    {
      value: "MV",
      title: t("Maldives")
    },
    {
      value: "ML",
      title: t("Mali")
    },
    {
      value: "MT",
      title: t("Malta")
    },
    {
      value: "MH",
      title: t("Marshall Islands")
    },
    {
      value: "MQ",
      title: t("Martinique")
    },
    {
      value: "MR",
      title: t("Mauritania")
    },
    {
      value: "MU",
      title: t("Mauritius")
    },
    {
      value: "YT",
      title: t("Mayotte")
    },
    {
      value: "MX",
      title: t("Mexico")
    },
    {
      value: "FM",
      title: t("Micronesia, Federated States of")
    },
    {
      value: "MD",
      title: t("Moldova, Republic of")
    },
    {
      value: "MC",
      title: t("Monaco")
    },
    {
      value: "MN",
      title: t("Mongolia")
    },
    {
      value: "ME",
      title: t("Montenegro")
    },
    {
      value: "MS",
      title: t("Montserrat")
    },
    {
      value: "MA",
      title: t("Morocco")
    },
    {
      value: "MZ",
      title: t("Mozambique")
    },
    {
      value: "MM",
      title: t("Myanmar")
    },
    {
      value: "NA",
      title: t("Namibia")
    },
    {
      value: "NR",
      title: t("Nauru")
    },
    {
      value: "NP",
      title: t("Nepal")
    },
    {
      value: "NL",
      title: t("Netherlands")
    },
    {
      value: "NC",
      title: t("New Caledonia")
    },
    {
      value: "NZ",
      title: t("New Zealand")
    },
    {
      value: "NI",
      title: t("Nicaragua")
    },
    {
      value: "NE",
      title: t("Niger")
    },
    {
      value: "NG",
      title: t("Nigeria")
    },
    {
      value: "NU",
      title: t("Niue")
    },
    {
      value: "NF",
      title: t("Norfolk Island")
    },
    {
      value: "MK",
      title: t("North Macedonia")
    },
    {
      value: "MP",
      title: t("Northern Mariana Islands")
    },
    {
      value: "NO",
      title: t("Norway")
    },
    {
      value: "OM",
      title: t("Oman")
    },
    {
      value: "PK",
      title: t("Pakistan")
    },
    {
      value: "PW",
      title: t("Palau")
    },
    {
      value: "PS",
      title: t("Palestine, State of")
    },
    {
      value: "PA",
      title: t("Panama")
    },
    {
      value: "PG",
      title: t("Papua New Guinea")
    },
    {
      value: "PY",
      title: t("Paraguay")
    },
    {
      value: "PE",
      title: t("Peru")
    },
    {
      value: "PH",
      title: t("Philippines")
    },
    {
      value: "PN",
      title: t("Pitcairn")
    },
    {
      value: "PL",
      title: t("Poland")
    },
    {
      value: "PT",
      title: t("Portugal")
    },
    {
      value: "PR",
      title: t("Puerto Rico")
    },
    {
      value: "QA",
      title: t("Qatar")
    },
    {
      value: "RO",
      title: t("Romania")
    },
    {
      value: "RU",
      title: t("Russian Federation")
    },
    {
      value: "RW",
      title: t("Rwanda")
    },
    {
      value: "RE",
      title: t("Réunion")
    },
    {
      value: "BL",
      title: t("Saint Barthélemy")
    },
    {
      value: "SH",
      title: t("Saint Helena, Ascension and Tristan da Cunha")
    },
    {
      value: "KN",
      title: t("Saint Kitts and Nevis")
    },
    {
      value: "LC",
      title: t("Saint Lucia")
    },
    {
      value: "MF",
      title: t("Saint Martin (French part)")
    },
    {
      value: "PM",
      title: t("Saint Pierre and Miquelon")
    },
    {
      value: "VC",
      title: t("Saint Vincent and the Grenadines")
    },
    {
      value: "WS",
      title: t("Samoa")
    },
    {
      value: "SM",
      title: t("San Marino")
    },
    {
      value: "ST",
      title: t("Sao Tome and Principe")
    },
    {
      value: "SA",
      title: t("Saudi Arabia")
    },
    {
      value: "SN",
      title: t("Senegal")
    },
    {
      value: "RS",
      title: t("Serbia")
    },
    {
      value: "SC",
      title: t("Seychelles")
    },
    {
      value: "SL",
      title: t("Sierra Leone")
    },
    {
      value: "SG",
      title: t("Singapore")
    },
    {
      value: "SX",
      title: t("Sint Maarten (Dutch part)")
    },
    {
      value: "SK",
      title: t("Slovakia")
    },
    {
      value: "SI",
      title: t("Slovenia")
    },
    {
      value: "SB",
      title: t("Solomon Islands")
    },
    {
      value: "SO",
      title: t("Somalia")
    },
    {
      value: "ZA",
      title: t("South Africa")
    },
    {
      value: "GS",
      title: t("South Georgia and the South Sandwich Islands")
    },
    {
      value: "SS",
      title: t("South Sudan")
    },
    {
      value: "ES",
      title: t("Spain")
    },
    {
      value: "LK",
      title: t("Sri Lanka")
    },
    {
      value: "SD",
      title: t("Sudan")
    },
    {
      value: "SR",
      title: t("Suriname")
    },
    {
      value: "SJ",
      title: t("Svalbard and Jan Mayen")
    },
    {
      value: "SE",
      title: t("Sweden")
    },
    {
      value: "CH",
      title: t("Switzerland")
    },
    {
      value: "SY",
      title: t("Syrian Arab Republic")
    },
    {
      value: "TW",
      title: t("Taiwan, Province of China")
    },
    {
      value: "TJ",
      title: t("Tajikistan")
    },
    {
      value: "TZ",
      title: t("Tanzania, United Republic of")
    },
    {
      value: "TH",
      title: t("Thailand")
    },
    {
      value: "TL",
      title: t("Timor-Leste")
    },
    {
      value: "TG",
      title: t("Togo")
    },
    {
      value: "TK",
      title: t("Tokelau")
    },
    {
      value: "TO",
      title: t("Tonga")
    },
    {
      value: "TT",
      title: t("Trinidad and Tobago")
    },
    {
      value: "TN",
      title: t("Tunisia")
    },
    {
      value: "TR",
      title: t("Turkey")
    },
    {
      value: "TM",
      title: t("Turkmenistan")
    },
    {
      value: "TC",
      title: t("Turks and Caicos Islands")
    },
    {
      value: "TV",
      title: t("Tuvalu")
    },
    {
      value: "UG",
      title: t("Uganda")
    },
    {
      value: "UA",
      title: t("Ukraine")
    },
    {
      value: "AE",
      title: t("United Arab Emirates")
    },
    {
      value: "GB",
      title: t("United Kingdom")
    },
    {
      value: "UM",
      title: t("United States Minor Outlying Islands")
    },
    {
      value: "US",
      title: t("United States")
    },
    {
      value: "UY",
      title: t("Uruguay")
    },
    {
      value: "UZ",
      title: t("Uzbekistan")
    },
    {
      value: "VU",
      title: t("Vanuatu")
    },
    {
      value: "VE",
      title: t("Venezuela, Bolivarian Republic of")
    },
    {
      value: "VN",
      title: t("Viet Nam")
    },
    {
      value: "VG",
      title: t("Virgin Islands, British")
    },
    {
      value: "VI",
      title: t("Virgin Islands, U.S.")
    },
    {
      value: "WF",
      title: t("Wallis and Futuna")
    },
    {
      value: "EH",
      title: t("Western Sahara")
    },
    {
      value: "YE",
      title: t("Yemen")
    },
    {
      value: "ZM",
      title: t("Zambia")
    },
    {
      value: "ZW",
      title: t("Zimbabwe")
    }
  ] as Option[];
