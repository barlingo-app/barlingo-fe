import React, { Component } from 'react';
import { Slot } from 'react-page-layout';
import Header from '../../containers/Header/Header'
import FooterContainer from '../../containers/FooterContainer/FooterContainer'
import './PublicLayout.scss';

 
class PublicLayout extends Component {
    render() {
        return (
            <>
                <Header />
                <Slot name="content" className={"content"}/>
                <Slot name="fullContent" className={"fullContent"}/>
                <FooterContainer />
            </>
        );
    }
}
 
export default PublicLayout;