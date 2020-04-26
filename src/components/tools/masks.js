export const ageTypingMask = (ageString) => {
    return ageString.match(/^(|0|([1-9]([0-9]|[0-3][0-9]?)?))$/);
}

export const ageRangeTypingMask = (ageRangeString) => {
    if (ageRangeString.match(/^[0-9\/]+\-[0-9\/]*$/)) {
        const ages = ageRangeString.split('-');
        return ageValidationMask(ages[0]) && ageTypingMask(ages[1]);
    } else {
        return ageTypingMask(ageRangeString);
    }
}

export const ageValidationMask = (ageString) => {
    return ageString.match(/^(|[0-9]|[1-9]([0-9]|[0-3][0-9]))$/);
}


export const ageRangeValidationMask = (ageRangeString) => {
    if (ageRangeString.match(/[0-9\/]+\-[0-9\/]+/)) {
        const ages = ageRangeString.split('-');
        return ages.every(d => ageValidationMask(d)) && (parseInt(ages[0])<parseInt(ages[1]));
    } else {
        return ageValidationMask(ageRangeString);
    }
}

export const ageRangeTransformMask = (ageRangeString) => {
    if ((typeof(ageRangeString) === 'string') && (ageRangeString.match(/[0-9\/]+\-[0-9\/]+/))) {
        return ageRangeString.split('-').map(d => d);
    } else {
        return ageRangeString;
    }
}

export const dateTypingMask = (dateString) => {
    return dateString.match(/^(|0{0,4}?|1([8-9]\d{1,2}?)?|2(0\d{1,2})?|[0-3](\d(\/([0-1](\d(\/(1([8-9]\d{0,2})?|2(0\d{0,2})?)?)?)?)?)?)?)$/);
}

export const dateValidationMask = (dateString) => {
    return dateString.match(/^(|0000|1([8-9]\d{2})|2(0\d{2})|[0-3](\d(\/([0-1](\d(\/(1([8-9]\d{2})|2(0\d{2}))))))))$/);
}


export const dateRangeTypingMask = (dateRangeString) => {
    if (dateRangeString.match(/[0-9\/]+\-[0-9\/]*/)) {
        const dates = dateRangeString.split('-');
        return dateValidationMask(dates[0]) && dateTypingMask(dates[1]);
    } else {
        return dateTypingMask(dateRangeString);
    }
}

export const dateRangeValidationMask = (dateRangeString) => {
    if (dateRangeString.match(/[0-9\/]+\-[0-9\/]+/)) {
        const dates = dateRangeString.split('-');
        return dates.every(d => dateValidationMask(d)) && (parseInt(dateTransformMask(dates[0]))<parseInt(dateTransformMask(dates[1])));
    } else {
        return dateValidationMask(dateRangeString);
    }
}

export const dateTransformMask = (dateString) => {
    return dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/,'$3$2$1');
}

export const dateRangeTransformMask = (dateRangeString) => {
    if (dateRangeString.match(/[0-9\/]+\-[0-9\/]+/)) {
        return dateRangeString.split('-').map(d => dateTransformMask(d));
    } else {
        return dateTransformMask(dateRangeString);
    }
}

export const sexTypingMask = (sex) => {
    return sex.match(/^(F|M)?$/);
}

export const sexValidationMask = (sex) => {
    return sex.match(/^(F|M)?$/);
}

export const sexTransformMask = (sex) => {
    return sex.replace(/^(F|M).*$/,'$1');
}
