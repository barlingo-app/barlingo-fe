import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Col, Row } from 'react-bootstrap';
import defaultImage from '../../media/default-exchange-header.jpg';
import './EstablishmentDetails.scss';
import locationIcon from '../../media/imageedit_5_5395394410.png';
import timeIcon from '../../media/imageedit_8_4988666292.png';
import { establishmentService } from '../../services/establishmentService';
import Loading from "../../components/Loading/Loading";
import { Redirect } from 'react-router-dom';

class EstablishmentDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            establishment: {},
            loaded: false,
            errorMessage: null,
            redirectToNotFound: false
        }
    }

    fetchData = () => {
        if (isNaN(this.props.match.params.establishmentName)) {
            this.setState({redirectToNotFound: true});
        } else {
            establishmentService.findOne(this.props.match.params.establishmentName)
            .then((response) => this.setData(response))
            .catch((error) => this.setError(error));
        }
    };

    setData = (response) => {
        if (response.data) {
            document.title = "Barlingo - " + response.data.establishmentName;
            this.setState({
                establishment: response.data,
                loaded: true
            });
        } else {
            this.setState({redirectToNotFound: true});
        }
    };

    setError = (error) => {
        this.setState({
            errorMessage: "loadErrorMessage"
        })
    };

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate() {
        if (this.state.establishment) {
            document.title = "Barlingo - " + this.state.establishment.establishmentName;
        }
    }

    getFormattedWorkingHours = (workingHours) => {
        const { t } = this.props;

        let formattedWorkingHours = '';
        let days = workingHours.split(',')[0].trim();

        days.split(' ').forEach(function(value, index,  array) {
            formattedWorkingHours += t('days.' + value.trim().toLowerCase()) + ' ';
        });

        return formattedWorkingHours.trim() + ' , ' + workingHours.split(',')[1].trim();
    }

    renderDescription() {
        const address = this.state.establishment.establishmentName + ", " + this.state.establishment.address;
        const description = this.state.establishment.description;
        return (
            <div className="establishment">
                <div>
                    {description}
                </div>
                <div>
                    <img className="establishment__icon" src={locationIcon} alt="Location" />
                    {address}
                </div>
                <div className="establishment__icon-wrapper">
                    <img className="establishment__icon" src={timeIcon} alt="Date and time" />{this.getFormattedWorkingHours(this.state.establishment.workingHours)}
                </div>
            </div>
        );
    }

    getImage = (image) => {
        return (image === '' || image === null) ? defaultImage : image;
    };

    render() {
        const { errorMessage, loaded, establishment, redirectToNotFound } = this.state;
        const { t } = this.props;

        if (redirectToNotFound) {
            return(<Redirect to={"/notFound"} />);
        }

        if (!loaded) {
            return (
                <Page layout="public">
                    <Section slot="content">
                        <Loading message={errorMessage} />
                    </Section>
                </Page>
            );
        }

        return (
            <div className="establishment-details">
                <Page layout="public">
                    <Section slot="content">
                        <Row>
                            <Col className="establishment-details__content" sm="12" md={{span: 6, offset: 3}}>
                                <div className="establishment-details__top">
                                    <img  className="establishment-details__image" alt="some" src={establishment.imageProfile}/>
                                </div>
                                <div className="establishment-details__name">{establishment.establishmentName}</div>
                                <div className="establishment-details__address">{establishment.address}</div>
                                <div className="establishment-details__description">{establishment.description}</div>
                                <div className="establishment-details__workingHours-title">{t('form.workingHours')}</div>
                                <div className="establishment-details__workingHours">{this.getFormattedWorkingHours(establishment.workingHours)}</div>
                                <div className="establishment-details__offer-title">{t('form.offer')}</div>
                                <div className="establishment-details__offer">{establishment.offer}</div>
                            </Col>
                        </Row>
                    </Section>
                </Page>
            </div>
        );
    }
}

export default withNamespaces('translation')(EstablishmentDetails);