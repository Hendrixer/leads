'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var states = [{ name: 'ALABAMA', abbrev: 'AL' }, { name: 'ALASKA', abbrev: 'AK' }, { name: 'AMERICAN SAMOA', abbrev: 'AS' }, { name: 'ARIZONA', abbrev: 'AZ' }, { name: 'ARKANSAS', abbrev: 'AR' }, { name: 'CALIFORNIA', abbrev: 'CA' }, { name: 'COLORADO', abbrev: 'CO' }, { name: 'CONNECTICUT', abbrev: 'CT' }, { name: 'DELAWARE', abbrev: 'DE' }, { name: 'DISTRICT OF COLUMBIA', abbrev: 'DC' }, { name: 'FEDERATED STATES OF MICRONESIA', abbrev: 'FM' }, { name: 'FLORIDA', abbrev: 'FL' }, { name: 'GEORGIA', abbrev: 'GA' }, { name: 'GUAM', abbrev: 'GU' }, { name: 'HAWAII', abbrev: 'HI' }, { name: 'IDAHO', abbrev: 'ID' }, { name: 'ILLINOIS', abbrev: 'IL' }, { name: 'INDIANA', abbrev: 'IN' }, { name: 'IOWA', abbrev: 'IA' }, { name: 'KANSAS', abbrev: 'KS' }, { name: 'KENTUCKY', abbrev: 'KY' }, { name: 'LOUISIANA', abbrev: 'LA' }, { name: 'MAINE', abbrev: 'ME' }, { name: 'MARSHALL ISLANDS', abbrev: 'MH' }, { name: 'MARYLAND', abbrev: 'MD' }, { name: 'MASSACHUSETTS', abbrev: 'MA' }, { name: 'MICHIGAN', abbrev: 'MI' }, { name: 'MINNESOTA', abbrev: 'MN' }, { name: 'MISSISSIPPI', abbrev: 'MS' }, { name: 'MISSOURI', abbrev: 'MO' }, { name: 'MONTANA', abbrev: 'MT' }, { name: 'NEBRASKA', abbrev: 'NE' }, { name: 'NEVADA', abbrev: 'NV' }, { name: 'NEW HAMPSHIRE', abbrev: 'NH' }, { name: 'NEW JERSEY', abbrev: 'NJ' }, { name: 'NEW MEXICO', abbrev: 'NM' }, { name: 'NEW YORK', abbrev: 'NY' }, { name: 'NORTH CAROLINA', abbrev: 'NC' }, { name: 'NORTH DAKOTA', abbrev: 'ND' }, { name: 'NORTHERN MARIANA ISLANDS', abbrev: 'MP' }, { name: 'OHIO', abbrev: 'OH' }, { name: 'OKLAHOMA', abbrev: 'OK' }, { name: 'OREGON', abbrev: 'OR' }, { name: 'PALAU', abbrev: 'PW' }, { name: 'PENNSYLVANIA', abbrev: 'PA' }, { name: 'PUERTO RICO', abbrev: 'PR' }, { name: 'RHODE ISLAND', abbrev: 'RI' }, { name: 'SOUTH CAROLINA', abbrev: 'SC' }, { name: 'SOUTH DAKOTA', abbrev: 'SD' }, { name: 'TENNESSEE', abbrev: 'TN' }, { name: 'TEXAS', abbrev: 'TX' }, { name: 'UTAH', abbrev: 'UT' }, { name: 'VERMONT', abbrev: 'VT' }, { name: 'VIRGIN ISLANDS', abbrev: 'VI' }, { name: 'VIRGINIA', abbrev: 'VA' }, { name: 'WASHINGTON', abbrev: 'WA' }, { name: 'WEST VIRGINIA', abbrev: 'WV' }, { name: 'WISCONSIN', abbrev: 'WI' }, { name: 'WYOMING', abbrev: 'WY' }];

var stateMap = states.reduce(function (map, state) {
    map[state.abbrev] = state.abbrev;
    var name = state.name.toLowerCase().replace(/\s/g, '');

    map[name] = state.abbrev;
    return map;
}, {});
exports.stateMap = stateMap;
exports.states = states;