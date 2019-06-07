import React, { Component } from 'react';
import { Slot } from 'react-page-layout';
import Header from '../../containers/Header/Header'
import FooterContainer from '../../containers/FooterContainer/FooterContainer'
import './PublicLayout.scss';
import { BackTop } from 'antd';

 
class PublicLayout extends Component {
    render() {
        return (
            <>
                <Header />
                <Slot name="content" component="main" className={"content"}/>
                <Slot name="contentWithWarning" component="main" className={"content contentWithWarning"}/>
                <Slot name="contentWithBackground" component="main" className={"contentWithBackground"}/>
                <BackTop visibilityHeight={50} />
                <FooterContainer />
            </>
        );
    }
}
 
export default PublicLayout;