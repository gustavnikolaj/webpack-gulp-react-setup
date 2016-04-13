const fs = require('fs');
const glob = require('glob');
const path = require('path');
const taggedLog = require('../lib/taggedLog');
const log = taggedLog('story build');

function buildDuration(starttime, endtime) {
    var duration = endtime - starttime;
    return 'build completed in ' + duration + ' ms';
}

var starttime = Date.now();

log('building story book table of contents');

const buildRoot = path.resolve(__dirname, '../../build');
const storiesPath = path.resolve(__dirname, '../../app/stories');
const stories = glob.sync(storiesPath + '/**/*.js');

var storyCount = stories.length;

log('found', storyCount, storyCount === 1 ? 'story' : 'stories');

const storyIndex = stories.map(function (story) {
    story = path.relative(buildRoot, story);
    return 'require("' + story + '");\n';
}).join('');

fs.writeFileSync('build/stories.js', storyIndex);

log('story book', buildDuration(starttime, Date.now()));
