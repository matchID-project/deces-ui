export const smartNumber = (n, digits) => {
    if (typeof n !== 'number') {
        return n;
    };
    const d = digits ? digits : 0;
    if (n < 1000) {
        return `${n.toFixed(d).replace(/.0$/,'')}`;
    }
    if (n < 1000000) {
        return `${(n/1000).toFixed(d).replace(/.0$/,'')}k`;
    }
    if (n < 1000000000) {
      return `${(n/1000000).toFixed(d).replace(/.0$/,'')}M`;
    }
    return `${(n/1000000000).toFixed(d).replace(/.0$/,'')}G`;
};
