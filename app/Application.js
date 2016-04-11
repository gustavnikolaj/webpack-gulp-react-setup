import React, { Component } from 'react';
import Header from './components/Header/Header';

export default class Application extends Component {
    render() {
        return (
            <div>
                <Header/>
                <p>Hej med dig</p>
            </div>
        );
    }
}
