import React, { Component, PropTypes } from 'react';
import Header from '../Header/Header';

export default class About extends Component {
    render() {
        return (
            <div>
                <Header />
                {this.props.children}
            </div>
        );
    }
}

About.propTypes = {
    children: PropTypes.node
};
