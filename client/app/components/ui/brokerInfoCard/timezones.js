const timezones = [
{
value: "Dateline Standard Time",
abbr: "DST",
offset: -12,
isdst: false,
text: "(UTC-12:00) International Date Line West"
},
{
value: "UTC-11",
abbr: "U",
offset: -11,
isdst: false,
text: "(UTC-11:00) Coordinated Universal Time-11"
},
{
value: "Hawaiian Standard Time",
abbr: "HST",
offset: -10,
isdst: false,
text: "(UTC-10:00) Hawaii"
},
{
value: "Alaskan Standard Time",
abbr: "AKDT",
offset: -8,
isdst: true,
text: "(UTC-09:00) Alaska"
},
{
value: "Pacific Standard Time (Mexico)",
abbr: "PDT",
offset: -7,
isdst: true,
text: "(UTC-08:00) Baja California"
},
{
value: "Pacific Standard Time",
abbr: "PDT",
offset: -7,
isdst: true,
text: "(UTC-08:00) Pacific Time (US & Canada)"
},
{
value: "US Mountain Standard Time",
abbr: "UMST",
offset: -7,
isdst: false,
text: "(UTC-07:00) Arizona"
},
{
value: "Mountain Standard Time (Mexico)",
abbr: "MDT",
offset: -6,
isdst: true,
text: "(UTC-07:00) Chihuahua, La Paz, Mazatlan"
},
{
value: "Mountain Standard Time",
abbr: "MDT",
offset: -6,
isdst: true,
text: "(UTC-07:00) Mountain Time (US & Canada)"
},
{
value: "Central America Standard Time",
abbr: "CAST",
offset: -6,
isdst: false,
text: "(UTC-06:00) Central America"
},
{
value: "Central Standard Time",
abbr: "CDT",
offset: -5,
isdst: true,
text: "(UTC-06:00) Central Time (US & Canada)"
},
{
value: "Central Standard Time (Mexico)",
abbr: "CDT",
offset: -5,
isdst: true,
text: "(UTC-06:00) Guadalajara, Mexico City, Monterrey"
},
{
value: "Canada Central Standard Time",
abbr: "CCST",
offset: -6,
isdst: false,
text: "(UTC-06:00) Saskatchewan"
},
{
value: "SA Pacific Standard Time",
abbr: "SPST",
offset: -5,
isdst: false,
text: "(UTC-05:00) Bogota, Lima, Quito"
},
{
value: "Eastern Standard Time",
abbr: "EDT",
offset: -4,
isdst: true,
text: "(UTC-05:00) Eastern Time (US & Canada)"
},
{
value: "US Eastern Standard Time",
abbr: "UEDT",
offset: -4,
isdst: true,
text: "(UTC-05:00) Indiana (East)"
},
{
value: "Venezuela Standard Time",
abbr: "VST",
offset: -4.5,
isdst: false,
text: "(UTC-04:30) Caracas"
},
{
value: "Paraguay Standard Time",
abbr: "PST",
offset: -4,
isdst: false,
text: "(UTC-04:00) Asuncion"
},
{
value: "Atlantic Standard Time",
abbr: "ADT",
offset: -3,
isdst: true,
text: "(UTC-04:00) Atlantic Time (Canada)"
},
{
value: "Central Brazilian Standard Time",
abbr: "CBST",
offset: -4,
isdst: false,
text: "(UTC-04:00) Cuiaba"
},
{
value: "SA Western Standard Time",
abbr: "SWST",
offset: -4,
isdst: false,
text: "(UTC-04:00) Georgetown, La Paz, Manaus, San Juan"
},
{
value: "Pacific SA Standard Time",
abbr: "PSST",
offset: -4,
isdst: false,
text: "(UTC-04:00) Santiago"
},
{
value: "Newfoundland Standard Time",
abbr: "NDT",
offset: -2.5,
isdst: true,
text: "(UTC-03:30) Newfoundland"
},
{
value: "E. South America Standard Time",
abbr: "ESAST",
offset: -3,
isdst: false,
text: "(UTC-03:00) Brasilia"
},
{
value: "Argentina Standard Time",
abbr: "AST",
offset: -3,
isdst: false,
text: "(UTC-03:00) Buenos Aires"
},
{
value: "SA Eastern Standard Time",
abbr: "SEST",
offset: -3,
isdst: false,
text: "(UTC-03:00) Cayenne, Fortaleza"
},
{
value: "Greenland Standard Time",
abbr: "GDT",
offset: -2,
isdst: true,
text: "(UTC-03:00) Greenland"
},
{
value: "Montevideo Standard Time",
abbr: "MST",
offset: -3,
isdst: false,
text: "(UTC-03:00) Montevideo"
},
{
value: "Bahia Standard Time",
abbr: "BST",
offset: -3,
isdst: false,
text: "(UTC-03:00) Salvador"
},
{
value: "UTC-02",
abbr: "U",
offset: -2,
isdst: false,
text: "(UTC-02:00) Coordinated Universal Time-02"
},
{
value: "Mid-Atlantic Standard Time",
abbr: "MDT",
offset: -1,
isdst: true,
text: "(UTC-02:00) Mid-Atlantic - Old"
},
{
value: "Azores Standard Time",
abbr: "ADT",
offset: 0,
isdst: true,
text: "(UTC-01:00) Azores"
},
{
value: "Cape Verde Standard Time",
abbr: "CVST",
offset: -1,
isdst: false,
text: "(UTC-01:00) Cape Verde Is."
},
{
value: "Morocco Standard Time",
abbr: "MDT",
offset: 1,
isdst: true,
text: "(UTC) Casablanca"
},
{
value: "UTC",
abbr: "CUT",
offset: 0,
isdst: false,
text: "(UTC) Coordinated Universal Time"
},
{
value: "GMT Standard Time",
abbr: "GDT",
offset: 1,
isdst: true,
text: "(UTC) Dublin, Edinburgh, Lisbon, London"
},
{
value: "Greenwich Standard Time",
abbr: "GST",
offset: 0,
isdst: false,
text: "(UTC) Monrovia, Reykjavik"
},
{
value: "W. Europe Standard Time",
abbr: "WEDT",
offset: 2,
isdst: true,
text: "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna"
},
{
value: "Central Europe Standard Time",
abbr: "CEDT",
offset: 2,
isdst: true,
text: "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague"
},
{
value: "Romance Standard Time",
abbr: "RDT",
offset: 2,
isdst: true,
text: "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris"
},
{
value: "Central European Standard Time",
abbr: "CEDT",
offset: 2,
isdst: true,
text: "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb"
},
{
value: "W. Central Africa Standard Time",
abbr: "WCAST",
offset: 1,
isdst: false,
text: "(UTC+01:00) West Central Africa"
},
{
value: "Namibia Standard Time",
abbr: "NST",
offset: 1,
isdst: false,
text: "(UTC+01:00) Windhoek"
},
{
value: "GTB Standard Time",
abbr: "GDT",
offset: 3,
isdst: true,
text: "(UTC+02:00) Athens, Bucharest"
},
{
value: "Middle East Standard Time",
abbr: "MEDT",
offset: 3,
isdst: true,
text: "(UTC+02:00) Beirut"
},
{
value: "Egypt Standard Time",
abbr: "EST",
offset: 2,
isdst: false,
text: "(UTC+02:00) Cairo"
},
{
value: "Syria Standard Time",
abbr: "SDT",
offset: 3,
isdst: true,
text: "(UTC+02:00) Damascus"
},
{
value: "E. Europe Standard Time",
abbr: "EEDT",
offset: 3,
isdst: true,
text: "(UTC+02:00) E. Europe"
},
{
value: "South Africa Standard Time",
abbr: "SAST",
offset: 2,
isdst: false,
text: "(UTC+02:00) Harare, Pretoria"
},
{
value: "FLE Standard Time",
abbr: "FDT",
offset: 3,
isdst: true,
text: "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius"
},
{
value: "Turkey Standard Time",
abbr: "TDT",
offset: 3,
isdst: true,
text: "(UTC+02:00) Istanbul"
},
{
value: "Israel Standard Time",
abbr: "JDT",
offset: 3,
isdst: true,
text: "(UTC+02:00) Jerusalem"
},
{
value: "Libya Standard Time",
abbr: "LST",
offset: 2,
isdst: false,
text: "(UTC+02:00) Tripoli"
},
{
value: "Jordan Standard Time",
abbr: "JST",
offset: 3,
isdst: false,
text: "(UTC+03:00) Amman"
},
{
value: "Arabic Standard Time",
abbr: "AST",
offset: 3,
isdst: false,
text: "(UTC+03:00) Baghdad"
},
{
value: "Kaliningrad Standard Time",
abbr: "KST",
offset: 3,
isdst: false,
text: "(UTC+03:00) Kaliningrad, Minsk"
},
{
value: "Arab Standard Time",
abbr: "AST",
offset: 3,
isdst: false,
text: "(UTC+03:00) Kuwait, Riyadh"
},
{
value: "E. Africa Standard Time",
abbr: "EAST",
offset: 3,
isdst: false,
text: "(UTC+03:00) Nairobi"
},
{
value: "Iran Standard Time",
abbr: "IDT",
offset: 4.5,
isdst: true,
text: "(UTC+03:30) Tehran"
},
{
value: "Arabian Standard Time",
abbr: "AST",
offset: 4,
isdst: false,
text: "(UTC+04:00) Abu Dhabi, Muscat"
},
{
value: "Azerbaijan Standard Time",
abbr: "ADT",
offset: 5,
isdst: true,
text: "(UTC+04:00) Baku"
},
{
value: "Russian Standard Time",
abbr: "RST",
offset: 4,
isdst: false,
text: "(UTC+04:00) Moscow, St. Petersburg, Volgograd"
},
{
value: "Mauritius Standard Time",
abbr: "MST",
offset: 4,
isdst: false,
text: "(UTC+04:00) Port Louis"
},
{
value: "Georgian Standard Time",
abbr: "GST",
offset: 4,
isdst: false,
text: "(UTC+04:00) Tbilisi"
},
{
value: "Caucasus Standard Time",
abbr: "CST",
offset: 4,
isdst: false,
text: "(UTC+04:00) Yerevan"
},
{
value: "Afghanistan Standard Time",
abbr: "AST",
offset: 4.5,
isdst: false,
text: "(UTC+04:30) Kabul"
},
{
value: "West Asia Standard Time",
abbr: "WAST",
offset: 5,
isdst: false,
text: "(UTC+05:00) Ashgabat, Tashkent"
},
{
value: "Pakistan Standard Time",
abbr: "PST",
offset: 5,
isdst: false,
text: "(UTC+05:00) Islamabad, Karachi"
},
{
value: "India Standard Time",
abbr: "IST",
offset: 5.5,
isdst: false,
text: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi"
},
{
value: "Sri Lanka Standard Time",
abbr: "SLST",
offset: 5.5,
isdst: false,
text: "(UTC+05:30) Sri Jayawardenepura"
},
{
value: "Nepal Standard Time",
abbr: "NST",
offset: 5.75,
isdst: false,
text: "(UTC+05:45) Kathmandu"
},
{
value: "Central Asia Standard Time",
abbr: "CAST",
offset: 6,
isdst: false,
text: "(UTC+06:00) Astana"
},
{
value: "Bangladesh Standard Time",
abbr: "BST",
offset: 6,
isdst: false,
text: "(UTC+06:00) Dhaka"
},
{
value: "Ekaterinburg Standard Time",
abbr: "EST",
offset: 6,
isdst: false,
text: "(UTC+06:00) Ekaterinburg"
},
{
value: "Myanmar Standard Time",
abbr: "MST",
offset: 6.5,
isdst: false,
text: "(UTC+06:30) Yangon (Rangoon)"
},
{
value: "SE Asia Standard Time",
abbr: "SAST",
offset: 7,
isdst: false,
text: "(UTC+07:00) Bangkok, Hanoi, Jakarta"
},
{
value: "N. Central Asia Standard Time",
abbr: "NCAST",
offset: 7,
isdst: false,
text: "(UTC+07:00) Novosibirsk"
},
{
value: "China Standard Time",
abbr: "CST",
offset: 8,
isdst: false,
text: "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi"
},
{
value: "North Asia Standard Time",
abbr: "NAST",
offset: 8,
isdst: false,
text: "(UTC+08:00) Krasnoyarsk"
},
{
value: "Singapore Standard Time",
abbr: "MPST",
offset: 8,
isdst: false,
text: "(UTC+08:00) Kuala Lumpur, Singapore"
},
{
value: "W. Australia Standard Time",
abbr: "WAST",
offset: 8,
isdst: false,
text: "(UTC+08:00) Perth"
},
{
value: "Taipei Standard Time",
abbr: "TST",
offset: 8,
isdst: false,
text: "(UTC+08:00) Taipei"
},
{
value: "Ulaanbaatar Standard Time",
abbr: "UST",
offset: 8,
isdst: false,
text: "(UTC+08:00) Ulaanbaatar"
},
{
value: "North Asia East Standard Time",
abbr: "NAEST",
offset: 9,
isdst: false,
text: "(UTC+09:00) Irkutsk"
},
{
value: "Tokyo Standard Time",
abbr: "TST",
offset: 9,
isdst: false,
text: "(UTC+09:00) Osaka, Sapporo, Tokyo"
},
{
value: "Korea Standard Time",
abbr: "KST",
offset: 9,
isdst: false,
text: "(UTC+09:00) Seoul"
},
{
value: "Cen. Australia Standard Time",
abbr: "CAST",
offset: 9.5,
isdst: false,
text: "(UTC+09:30) Adelaide"
},
{
value: "AUS Central Standard Time",
abbr: "ACST",
offset: 9.5,
isdst: false,
text: "(UTC+09:30) Darwin"
},
{
value: "E. Australia Standard Time",
abbr: "EAST",
offset: 10,
isdst: false,
text: "(UTC+10:00) Brisbane"
},
{
value: "AUS Eastern Standard Time",
abbr: "AEST",
offset: 10,
isdst: false,
text: "(UTC+10:00) Canberra, Melbourne, Sydney"
},
{
value: "West Pacific Standard Time",
abbr: "WPST",
offset: 10,
isdst: false,
text: "(UTC+10:00) Guam, Port Moresby"
},
{
value: "Tasmania Standard Time",
abbr: "TST",
offset: 10,
isdst: false,
text: "(UTC+10:00) Hobart"
},
{
value: "Yakutsk Standard Time",
abbr: "YST",
offset: 10,
isdst: false,
text: "(UTC+10:00) Yakutsk"
},
{
value: "Central Pacific Standard Time",
abbr: "CPST",
offset: 11,
isdst: false,
text: "(UTC+11:00) Solomon Is., New Caledonia"
},
{
value: "Vladivostok Standard Time",
abbr: "VST",
offset: 11,
isdst: false,
text: "(UTC+11:00) Vladivostok"
},
{
value: "New Zealand Standard Time",
abbr: "NZST",
offset: 12,
isdst: false,
text: "(UTC+12:00) Auckland, Wellington"
},
{
value: "UTC+12",
abbr: "U",
offset: 12,
isdst: false,
text: "(UTC+12:00) Coordinated Universal Time+12"
},
{
value: "Fiji Standard Time",
abbr: "FST",
offset: 12,
isdst: false,
text: "(UTC+12:00) Fiji"
},
{
value: "Magadan Standard Time",
abbr: "MST",
offset: 12,
isdst: false,
text: "(UTC+12:00) Magadan"
},
{
value: "Kamchatka Standard Time",
abbr: "KDT",
offset: 13,
isdst: true,
text: "(UTC+12:00) Petropavlovsk-Kamchatsky - Old"
},
{
value: "Tonga Standard Time",
abbr: "TST",
offset: 13,
isdst: false,
text: "(UTC+13:00) Nuku'alofa"
},
{
value: "Samoa Standard Time",
abbr: "SST",
offset: 13,
isdst: false,
text: "(UTC+13:00) Samoa"
}
];

export default timezones;
