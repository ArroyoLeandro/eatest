
export const formatNum = (num) => {
    const locale = 'es-ar';
    const options = {  maximumFractionDigits: 2};
    return Intl.NumberFormat(locale, options).format(num);
};