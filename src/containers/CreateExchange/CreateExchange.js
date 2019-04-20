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


class CreateExchange extends Component {
    state = {
        establishment: null,
        loaded: false,
        error: true
    }
    componentDidMount() {
        this.consultaEstablecimiento();
    }
    consultaEstablecimiento() {
        const id = this.props.match.params.establishmentId;
        establishmentService.findOne(id).then(
            response => {
                if (response.data) {
                    this.setState({
                        establishment: response.data,
                        loaded: true,
                        error: false
                    });
                } else {
                    const { t } = this.props;
                    notification.error({
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 10,
                        message: t("establishment.error.title"),
                        description: t("establishment.error.message"),
                    });
                    this.setState({
                        error: true,
                        loaded: true
                    });
                }
            }).catch(onrejected => (console.log(onrejected)))
    }
    render() {
        const { establishment, loaded, error } = this.state;
        if (loaded) {
            if (error)
                return <Redirect to={"/establishments"} />
            let i = establishment;
            return (
                <Page layout="public">
                    <Section slot="content">
                        <Row>
                            <Col md={{ size: 6, offset: 3 }}>
                                <div>
                                    <CustomCardEstablishment establishment={i} showButton={false} />
                                </div>
                                <div>
                                    <CreateExchangeForm establishmentId={i.id} />
                                </div>
                            </Col>
                        </Row>
                    </Section>
                </Page>
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

export default withNamespaces('translation')(CreateExchange);