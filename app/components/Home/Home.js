import React, { Component, PropTypes } from 'react';

export default class Home extends Component {
    render() {
        let name = 'Gulp';
        if (this.props.name) {
            name = this.props.name;
        }

        return (
            <div>
                <p>Hello, {name}</p>
                <p>This is the home page.</p>
            </div>
        );
    }
}

Home.propTypes = {
    name: PropTypes.string
};
