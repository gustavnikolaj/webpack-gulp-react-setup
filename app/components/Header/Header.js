import React, { Component, PropTypes } from 'react';
import './header.less';
import catImage from './cat.jpg';

export default class Header extends Component {
    render() {
        let name = 'Gulp';
        if (this.props.name) {
            name = this.props.name;
        }

        return (
            <div>
                <h1>Hello Gulp World</h1>
                <img src={catImage} />
                <p>Hello, {name}</p>
            </div>
        );
    }
}

Header.propTypes = {
    name: PropTypes.string
};
