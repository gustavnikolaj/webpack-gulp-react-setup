const chalk = require('chalk');
const chalkColors = ['yellow', 'blue', 'green', 'magenta', 'cyan', 'red'];
var chalkColorsIndex = chalkColors.length - 1;

function nextColor() {
    chalkColorsIndex += 1;
    if (chalkColorsIndex === chalkColors.length) {
        chalkColorsIndex = 0;
    }

    return chalkColors[chalkColorsIndex];
}

function label(str, sep) {
    var len = 13;
    if (str.length > len) {
        str = str.slice(0, len - 3) + '...';
    } else {
        while (str.length < len) {
            str += ' ';
        }
    }
    return str  + ' ' + sep;
}

function getTimeStamp() {
    var date = new Date();
    var result = [];
    var h = '' + date.getHours();
    var m = '' + date.getMinutes();
    var s = '' + date.getSeconds();

    result.push(h.length < 2 ? '0' + h : h);
    result.push(m.length < 2 ? '0' + m : m);
    result.push(s.length < 2 ? '0' + s : s);

    return result.join(':');
}

module.exports = function taggedLog(tag) {
    var chalkColor = nextColor();
    var format = function () {
        return chalk.bold[chalkColor].apply(chalk, arguments);
    };
    var styledTag = format(label(tag, '|'));
    var multiLineStyledTag = format(label(tag, 'v'));
    return function (log) {
        if (arguments.length > 1) {
            log = Array.prototype.join.call(arguments, ' ');
        }
        var args = [format(getTimeStamp())];
        if (Buffer.isBuffer(log)) {
            log = log.toString('utf-8');
        }
        log = log.trim();


        if (log.indexOf('\n') !== -1) {
            args.push(multiLineStyledTag);
            log = '\n' + log + '\n';
        } else {
            args.push(styledTag);
        }

        console.log.apply(console, args.concat(log));
    };
};
