import React, { Component } from 'react';
import { Link } from 'react-router';
import './header.less';

export default class Header extends Component {
    render() {
        return (
            <div>
                <h1>Hello Gulp World</h1>
                <ul>
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/about'>About</Link>
                    </li>
                </ul>
            </div>
        );
    }
}
