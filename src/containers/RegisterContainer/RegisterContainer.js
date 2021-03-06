import React, { Component } from 'react';
import './RegisterContainer.scss';
import { withNamespaces } from 'react-i18next';
import { Page, Section } from 'react-page-layout';
import RegisterEstablishmentComponent from './../../components/RegisterEstablishmentComponent'
import RegisterUserComponent from './../../components/RegisterUserComponent'
import {Row, Col} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const USER_REGISTER_TYPE = "user";
const ESTABLISHMENT_REGISTER_TYPE = "establishment";

class RegisterContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            registerTypeSelected: null
        }
    }

    selectRegisterType = (registerType) => {
        this.setState({registerTypeSelected: registerType});
    }

    render() {
        const { registerType } = this.props.match.params;
        const { t } = this.props;

        if (!registerType) {
            return(
                    <Page layout="public">
                        <Section slot="content">
                            <div className="selectRegister">
                                <Row>
                                    <Col sm={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }} lg={{span:4,offset:4}}>
                                        <NavLink to={"/register/user"}>
                                            <div className="selectRegister__option">
                                                <div>{t('action.register.asUser')}</div>
                                            </div>
                                        </NavLink>
                                        <NavLink to={"/register/establishment"}>
                                            <div className="selectRegister__option">
                                                <div>{t('action.register.asEstablishment')}</div>
                                            </div>
                                        </NavLink>
                                    </Col>
                                </Row>
                            </div>
                        </Section>
                    </Page>
            );
        } 

        return (
            <div className="register-bg">
                <Page layout="public">
                    <Section slot="content">
                        {(registerType === ESTABLISHMENT_REGISTER_TYPE) && <RegisterEstablishmentComponent />}
                        {(registerType === USER_REGISTER_TYPE) && <RegisterUserComponent />}
                    </Section>
                </Page>
            </div>
        )
    }

}

export default withNamespaces()(RegisterContainer);