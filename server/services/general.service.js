function DifferenceInMinutes(start, end) {
    let totalMinutes = function (value) {
        let match = (/(\d{1,2}):(\d{1,2})/g).exec(value);
        return (Number(match[1]) * 60) + Number(match[2]);
    }
    return totalMinutes(end) - totalMinutes(start);
}

const getDuration = (beginDate, closeDate) => {
    let bd = new Date(beginDate);
    let cd = new Date(closeDate);
    var seconds = Math.floor((cd - (bd)) / 1000);
    // var seconds = Math.floor((closeDate - (beginDate)) / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    hours = hours - (days * 24);
    minutes = minutes - (days * 24 * 60) - (hours * 60);
    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
    let str = "" + hours + ":" + minutes + ":" + seconds;
    return str;
}

module.exports = {
    DifferenceInMinutes,
    getDuration,
}