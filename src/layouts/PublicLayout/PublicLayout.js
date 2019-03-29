import React, { Component } from 'react';
import { Slot } from 'react-page-layout';
import Header from '../../containers/Header/Header'
import './PublicLayout.scss';

 
class PublicLayout extends Component {
    render() {
        return (
            <>
                <Header />
                <Slot name="content" className={"content"}/>
            </>
        );
    }
}
 
export default PublicLayout;