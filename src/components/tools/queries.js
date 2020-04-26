export const prefixQuery = (field, value, fuzzy) => {
    return {
        prefix: {
            [field]: value
        }
    };
};

export const matchQuery = (field, value, fuzzy) => {
    return {
        match: {
            [field]: value
        }
    }
};

export const fuzzyTermQuery = (field, value, fuzzy) => {
    if (fuzzy) {
        return {
            bool: {
                must: [
                    {
                        match: {
                            [field]: {
                                query: value,
                                fuzziness: fuzzy
                            }
                        }
                    }
                ],
                should: [
                    {
                        match: {
                            [field]: value
                        }
                    }
                ]
            }
        };
    } else {
        return matchQuery(field, value, false);
    }
};

export const firstNameQuery = (field, value, fuzzy) => {
    if (fuzzy) {
        return {
            bool: {
                must: [
                    {
                        match: {
                            [field[1]]: {
                                query: value,
                                fuzziness: fuzzy
                            }
                        }
                    }
                ],
                should: [
                    {
                        match: {
                            [field[0]]: {
                                query: value,
                                boost: 4
                            }
                        }
                    },
                    {
                        match: {
                            [field[0]]: {
                                query: value,
                                fuzziness: fuzzy,
                                boost: 2
                            }
                        }
                    },
                    {
                        match: {
                            [field[1]]: value
                        }
                    }
                ]
            }
        };
    } else {
        return matchQuery(field[0], value, false);
    }
};


export const dateRangeStringQuery = (field, value, fuzzy) => {
    if (Array.isArray(value) && (value.length === 2)) {
        let min = (value[0] <= value[1]) ? value[0] : value[1];
        min = min.padEnd(8,'0');
        let max = (value[0] <= value[1]) ? value[1] : value[0];
        max = max.padEnd(8,'9');
        return {
            range: {
                [field]: {
                    gte: min,
                    lte: max
                }
            }
        };
    } else if (value.length < 8){
        return prefixQuery(field, value, false);
    } else {
        return fuzzyTermQuery(field, value, fuzzy)
    }
};

export const ageRangeStringQuery = (field, value, fuzzy) => {
    if (Array.isArray(value) && (value.length === 2)) {
        const min = (parseInt(value[0]) <= parseInt(value[1])) ? parseInt(value[0]) : parseInt(value[1]);
        const max = (parseInt(value[0]) <= parseInt(value[1])) ? parseInt(value[1]) : parseInt(value[0]);
        return {
            range: {
                [field]: {
                    gte: min,
                    lte: max
                }
            }
        };
    } else {
        return matchQuery(field, value, fuzzy)
    }
};

export const geoPointQuery = (field, value, fuzzy) =>  {
    if (value.latitude && value.longitude) {
        let distance;
        if (value.distance && value.distance.match(/[1-9]\d*\s*(mi|miles|yd|yards|ft|feet|in|inch|km|kilometers|m|meters|cm|centimeters|mm|millimeters|NM|nminauticalmiles)$/)) {
            distance = value.distance;
        } else {
            distance = '1km';
        }
        return {
            bool: {
                must: {
                    match_all: {}
                },
                filter : {
                    geo_distance: {
                        distance,
                        [field] : {
                            lat: value.latitude,
                            lon: value.longitude
                        }
                    }
                }
            }
        }
    } else {
        return undefined
    }
};

