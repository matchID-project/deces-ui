export const dateTypingMask = (dateString) => {
    return dateString.match(/^(|1([8-9]\d{1,2}?)?|2(0\d{1,2})?|[0-3](\d(\/([0-1](\d(\/(1([8-9]\d{0,2})?|2(0\d{0,2})?)?)?)?)?)?)?)$/);
}

export const dateValidationMask = (dateString) => {
    return dateString.match(/^(|1([8-9]\d{2})|2(0\d{2})|[0-3](\d(\/([0-1](\d(\/(1([8-9]\d{2})|2(0\d{2}))))))))$/);
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
        return dateRangeString.split('-').every(d => dateValidationMask(d))
    } else {
        return dateValidationMask(dateRangeString);
    }
}

export const dateTransformMask = (dateString) => {
    let result = dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/,'$3$2$1');
    console.log('la',result);
    return result;
}

export const dateRangeTransformMask = (dateRangeString) => {
    if (dateRangeString.match(/[0-9\/]+\-[0-9\/]+/)) {
        return dateRangeString.split('-').map(d => dateTransformMask(d));
    } else {
        return dateTransformMask(dateRangeString);
    }
}
