import React, { Component } from 'react';
import catImage from './cat.jpg';

export default class App extends Component {
    render() {
        return (
            <div>
            <img src={catImage} />
                This is the about page.
            </div>
        );
    }
}
