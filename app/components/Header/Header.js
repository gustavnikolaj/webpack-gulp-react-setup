import React, { Component } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import './header.less';

export default class Header extends Component {
    render() {
        return (
            <div>
                <h1>
                    <FormattedMessage
                        id='header.title'
                        defaultMessage='Hello World'
                    />
                </h1>
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
