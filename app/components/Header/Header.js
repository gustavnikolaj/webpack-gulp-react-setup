import React, { Component } from 'react';
import './header.less';
import catImage from './cat.jpg';

export default class Header extends Component {
    render() {
        return (
            <div>
                <h1>Hello Gulp World</h1>
                <img src={catImage} />
            </div>
        );
    }
}
