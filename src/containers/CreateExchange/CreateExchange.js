import { notification } from 'antd';
import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Redirect } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import CustomCardEstablishment from '../../components/CustomCard/CustomCardEstablishment/CustomCardEstablishment';
import Loading from "../../components/Loading/Loading";
import { establishmentService } from '../../services/establishmentService';
import CreateExchangeForm from './CreateExchangeForm/CreateExchangeForm';
import './CreateExchange.scss'
import BackButton from '../../components/BackButton/BackButton';


class CreateExchange extends Component {
    state = {
        establishment: null,
        loaded: false,
        error: true,
        redirectToNotFound: false
    }
    componentDidMount() {
        this.consultaEstablecimiento();
    }
    consultaEstablecimiento() {
        const id = this.props.match.params.establishmentId;
        establishmentService.findOne(id).then(
            response => {
                if (response.data.code === 200 && response.data.success && response.data.content) {
                    if (response.data.content.userAccount.active) {
                    this.setState({
                        establishment: response.data.content,
                        loaded: true,
                        error: false
                    });
                    } else {
                        this.setState({loaded: true, redirectToNotFound: true});
                    }
                } else if (response.data.code === 500) {
                    notification.error({
                        message: this.props.t('apiErrors.defaultErrorTitle'),
                        description: this.props.t('apiErrors.' + response.data.message),
                      });
                    this.setState({
                        error: true,
                        loaded: true
                    });
                }
            }).catch(onrejected => {
                notification.error({
                    message: this.props.t('apiErrors.defaultErrorTitle'),
                    description: this.props.t('apiErrors.defaultErrorMessage')
                });
            });
    }
    render() {
        const { establishment, loaded, error, redirectToNotFound } = this.state;
        if (loaded) {
            if (redirectToNotFound) {
                return <Redirect to={"/notFound"} />
            }
            if (error)
                return <Redirect to={"/establishments"} />
            let i = establishment;
            return (
                <div className="create-exchange-wrapper">
                    <Page layout="public">
                        <Section slot="content">
                            <Row>
                                <Col md={{ size: 8, offset: 2 }} lg={{ size: 6, offset: 3 }} className="create-exchange-wrapper__form">
                                    <div className="mt-3">
                                        <CustomCardEstablishment establishment={i} showButton={false} />
                                    </div>
                                    <div className="mt-3">
                                        <BackButton to={(this.props.location.state && this.props.location.state.from) ? this.props.location.state.from : "/establishments/" + i.id } additionalClasses={" full "} />
                                    </div>
                                    <div>
                                        <CreateExchangeForm establishment={i} />
                                    </div>
                                </Col>
                            </Row>
                        </Section>
                    </Page>
                </div>
            );
        }
        return (
            <Page layout="public">
                <Section slot="content">
                    <Loading />
                </Section>
            </Page>
        );;
    }
}

export default withNamespaces()(CreateExchange);