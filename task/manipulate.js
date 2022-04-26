

module.exports = {
    toDateTimeLocal(date){
        var ten = function(i){
            return (i<10 ? '0' : '') + i;
        }, 
        YYYY = date.getFullYear(),
        MM = ten(date.getMonth() + 1),
        DD = ten(date.getDate()),
        HH = ten(date.getHours()),
        II = ten(date.getMinutes());

        return YYYY + '-' + MM + '-' + DD + 'T' + HH + ':' + II;
    }
}