import React from 'react';
import Header from '../components/Header/Header';
import { storiesOf } from '@kadira/storybook';

storiesOf('Header', module)
  .add('with no name', () => (
      <Header />
  ))
  .add('with no text', () => (
      <Header name='Foo' />
  ));
