import { configure } from '@kadira/storybook';

function loadStories() {
    require('../build/stories');
}

configure(loadStories, module);
