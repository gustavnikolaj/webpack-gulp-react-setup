import { configure } from '@kadira/storybook';

function loadStories() {
    require('../app/stories/Header');
    // require as many as stories you need.
}

configure(loadStories, module);
