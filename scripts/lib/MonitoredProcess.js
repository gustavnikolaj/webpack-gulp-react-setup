const childProcess = require('child_process');
const EventEmitter = require('events').EventEmitter;
const inherits = require('util').inherits;


module.exports = MonitoredProcess;

function MonitoredProcess(options) {
    EventEmitter.call(this);
    this.command = options.command;
    this.args = options.args;
    this.state = 'stopped';
}
inherits(MonitoredProcess, EventEmitter);

MonitoredProcess.prototype.start = function () {
    if (this.state === 'stopped') {
        this.childProcess = childProcess.spawn(this.command, this.args || []);
        this.childProcess.on('error', function (err) {
            this.state = 'stopped';
            this.emit('crash', err, 'spawn');
        }.bind(this));
        ['stdout', 'stderr'].forEach(function (streamName) {
            this.childProcess[streamName].on('data', function (data) {
                this.emit('output', data, streamName);
            }.bind(this));
        }.bind(this));
        this.childProcess.on('exit', function (exitCode, signalName) {
            this.state = 'stopped';
            this.emit('crash', exitCode, signalName);
        }.bind(this));
        this.state = 'started';
        this.emit('start');
    } else {
        this.emit('output', 'MonitoredProcess: process already running.');
    }
    return this;
};

MonitoredProcess.prototype.stop = function () {
    if (this.state === 'started') {
        // Prevent auto-restarting behavior:
        this.childProcess.removeAllListeners();
        var exited = false;
        this.childProcess.on('exit', function (exitCode) {
            exited = true;
            this.state = 'stopped';
            this.emit('stop', exitCode);
        }.bind(this));
        this.childProcess.kill('SIGTERM');
        setTimeout(function () {
            if (!exited) {
                this.childProcess.kill('SIGKILL');
            }
        }.bind(this), 1000);
    } else {
        this.emit('output', 'MonitoredProcess: process already stopped.');
        setImmediate(function () {
            this.emit('stop', 0);
        }.bind(this));
    }
    return this;
};

MonitoredProcess.prototype.restart = function () {
    if (this.state === 'started') {
        this.emit('output', 'MonitoredProcess: restarting');
        this.once('stop', function () {
            this.start();
        }.bind(this));
        this.stop();
    } else {
        this.start();
    }
    return this;
};
