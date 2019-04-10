import React, { Component } from 'react';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'reactstrap';
import CustomCard from '../../components/CustomCard/CustomCard';
import Loading from '../../components/Loading/Loading';
import { establishmentService } from '../../services/establishmentService';
import './EstablishmentsList.scss';

class EstablismentsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loaded: false,
            errorMessage: null
        }
    }

    fetchData = () => {
        establishmentService.list()
        .then((response) => this.setData(response))
        .catch((error) => this.setError(error));
    };

    setData = (response) => {
        this.setState({
            items: response.data,
            loaded: true
        })
    };

    setError = (error) => {
        this.setState({
            errorMessage: "loadErrorMessage"
        })
    };

    componentDidMount() {
        const { t } = this.props;
        document.title = "Barlingo - " + t('titles.establishmentsList');
        this.fetchData();
    }

    handleOnClick(id) {
        let route = "createExchange";
        this.props.history.push(`/${route}/${id}`);
    }
    render() {
        const { t } = this.props;
        const { errorMessage, loaded, items } = this.state;
        let buttonMessage = t('generic.create');

        if (!loaded) {
            return (
                <Page layout="public">
                    <Section slot="content">
                        <Loading message={errorMessage}/>
                    </Section>
                </Page>
            );
        }
        return (
            <Page layout="public">
                <Section slot="content">
                    <Row>
                        {items.map((i, index) => (
                            <Col xs="12" md="6" xl="4" key={i.id}>
                                <CustomCard onClick={() => this.handleOnClick(i.id)} id={i.id} route="establishments"
                                            buttonMessage={buttonMessage} image={i.imageProfile}
                                            title={i.establishmentName} address={i.address}
                                            schedule={i.workingHours}/>
                            </Col>
                        ))}
                    </Row>
                </Section>
            </Page>
        );
    }
}

export default withNamespaces('translation')(EstablismentsList);