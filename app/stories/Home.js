import React from 'react';
import Home from '../components/Home/Home';
import { storiesOf } from '@kadira/storybook';

storiesOf('Home', module)
  .add('with no name', () => (
      <Home />
  ))
  .add('with no text', () => (
      <Home name='Foo' />
  ));
