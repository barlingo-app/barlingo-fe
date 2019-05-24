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
                <Slot name="content" component="main" className={"content"}/>
                <Slot name="contentWithWarning" component="main" className={"content contentWithWarning"}/>
                <Slot name="fullContent" component="main" className={"fullContent"}/>
                <FooterContainer />
            </>
        );
    }
}
 
export default PublicLayout;