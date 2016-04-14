const EventEmitter = require('events').EventEmitter;
const inherits = require('util').inherits;
const watch = require('watch');
const path = require('path');
const MonitoredProcess = require('../lib/MonitoredProcess');

module.exports = WatchedProcess;

function WatchedProcess(options) {
    EventEmitter.call(this);
    this.monitoredProcess = new MonitoredProcess(options);
    this.watchDirectory = options.watchDirectory;
    this.state = 'stopped';
    this.monitoredProcess.on('output', function (output) {
        this.emit('output', output);
    }.bind(this));
}
inherits(WatchedProcess, EventEmitter);

WatchedProcess.prototype.resolveFilenameFromCwd = function (filename) {
    return path.relative(process.cwd(), filename);
};

WatchedProcess.prototype.log = function () {
    var args = ['WatchedProcess:'].concat(Array.prototype.slice.call(arguments));
    this.emit('output', args.join(' '));
};

WatchedProcess.prototype.start = function () {
    var that = this;
    if (this.state === 'stopped') {
        this.state = 'starting';
        watch.createMonitor(this.watchDirectory, { interval: 100 }, function (monitor) {
            monitor.on('created', function (filename) {
                that.log(that.resolveFilenameFromCwd(filename), 'created');
                that.monitoredProcess.restart();
            });
            monitor.on('changed', function (filename) {
                that.log(that.resolveFilenameFromCwd(filename), 'changed');
                that.monitoredProcess.restart();
            });
            monitor.on('removed', function (filename) {
                that.log(that.resolveFilenameFromCwd(filename), 'removed');
                that.monitoredProcess.restart();
            });

            that.once('stop', function () {
                monitor.stop();
            });

            that.monitoredProcess.start();
            that.state = 'started';
            that.emit('started');
        });
    }
    return this;
};

WatchedProcess.prototype.stop = function (cb) {
    cb = cb || function () {};
    var that = this;
    if (this.state === 'started') {
        this.monitoredProcess.on('stop', function () {
            this.state = 'stopped';
            this.emit('stopped');
            cb();
        });
        this.monitoredProcess.stop();
    } else if (this.state === 'starting') {
        this.once('started', function () {
            that.stop(cb);
        });
    } else {
        this.emit('stopped');
        setImmediate(cb);
    }
};

WatchedProcess.prototype.restart = function () {
    return this.monitoredProcess.restart();
};
