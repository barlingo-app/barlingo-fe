import React, { Component } from "react";
import { Col, Row } from 'react-bootstrap';
import { withNamespaces } from "react-i18next";
import { Page, Section } from "react-page-layout";
import { Redirect } from 'react-router-dom';
import BackButton from "../../components/BackButton/BackButton";
import Loading from "../../components/Loading/Loading";
import defaultImage from '../../media/default-exchange-logo.png';
import { establishmentService } from '../../services/establishmentService';
import MapContainer from '../MapContainer/MapContainer';
import './EstablishmentDetails.scss';
import { auth } from '../../auth';



class EstablishmentDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            establishment: {},
            loaded: false,
            errorMessage: null,
            create: false
        }
    }

    fetchData = () => {
        establishmentService.findOne(this.props.match.params.establishmentName)
            .then((response) => this.setData(response))
            .catch((error) => this.setError(error));
    };

    setData = (response) => {
        if (response.data.code === 200 && response.data.success && response.data.content) {
            document.title = "Barlingo - " + response.data.content.establishmentName;
            this.setState({
                establishment: response.data.content,
                loaded: true
            });
        } else {
            this.setState({ redirectToNotFound: true });
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


    getImage = (image) => {
        return (image === '' || image === null) ? defaultImage : image;
    };

    formatWorkingHours = (workingHours) => {
        const { t } = this.props;
        var formatedWorkingHours = [];
        var splitedWorkingHours = workingHours.split(',')
        for (var i = 0; i < (splitedWorkingHours.length - 1); i++) {
            var elem = splitedWorkingHours[i].split('/')
            if (elem[1] === "closed") {
                elem[1] = t('close')
            }
            formatedWorkingHours.push(elem[1])
        }
        return formatedWorkingHours
    }

    handleOnClick = (id) => {
        this.setState({
            create: true
        })
        /*let route = "createExchange";
        this.props.history.push(`/${route}/${id}`);*/
    }
    render() {
        const { errorMessage, loaded, establishment, create } = this.state;
        const { t } = this.props;
        if (!loaded) {
            return (
                <Page layout="public">
                    <Section slot="content">
                        <Loading message={errorMessage} />
                    </Section>
                </Page>
            );
        }
        if (create) {
            return (
                <Redirect to={{pathname: "/createExchange/" + establishment.id , state: {from: "/establishments/" + establishment.id }}}/>
            )
        }
        const mapAddress = establishment.address + ", " + establishment.city + ", " + establishment.country;
        const name = establishment.establishmentName;

        return (
            <div className="establishment-details">
                <Page layout="public">
                    <Section slot="content">
                        <Row>
                            <Col className="establishment-details__content" sm="12" md={{ span: 6, offset: 3 }}>
                                <div className="establishment-details__top">
                                    {<BackButton to={(this.props.location.state && this.props.location.state.from) ? this.props.location.state.from : "/establishments"} additionalClasses={"centered contrast"} />}
                                    <img className="establishment-details__image" alt="Establishment" src={this.getImage(establishment.imageProfile)} onError={(e) => e.target.src = defaultImage} />
                                </div>
                                <div className="establishment-details__name">{establishment.establishmentName}</div>
                                <div className="establishment-details__description">{establishment.description}</div>

                                <div className="establishment-details__address">
                                    <i className="fas fa-map-marker-alt fa-lg establishment-details__location-icon"></i>
                                    {establishment.address}
                                </div>
                                <div className="establishment-details__map">
                                    <MapContainer address={mapAddress} name={name} />
                                </div>

                                <div className="establishment-details__workingHours-wrapper">
                                    <div className="establishment-details__workingHours-title">{t('form.workingHours')}</div>
                                    <table className="establishment-details__table">
                                        <tbody>
                                            <tr>
                                                <td className="hours-table__day">{t('days.monday')}</td>
                                                <td className="hours-table__time">{this.formatWorkingHours(establishment.workingHours)[0]}</td>
                                            </tr>
                                            <tr>
                                                <td className="hours-table__day">{t('days.tuesday')}</td>
                                                <td className="hours-table__time">{this.formatWorkingHours(establishment.workingHours)[1]}</td>
                                            </tr>
                                            <tr>
                                                <td className="hours-table__day">{t('days.wednesday')}</td>
                                                <td className="hours-table__time">{this.formatWorkingHours(establishment.workingHours)[2]}</td>
                                            </tr>
                                            <tr>
                                                <td className="hours-table__day">{t('days.thursday')}</td>
                                                <td className="hours-table__time">{this.formatWorkingHours(establishment.workingHours)[3]}</td>
                                            </tr>
                                            <tr>
                                                <td className="hours-table__day">{t('days.friday')}</td>
                                                <td className="hours-table__time">{this.formatWorkingHours(establishment.workingHours)[4]}</td>
                                            </tr>
                                            <tr>
                                                <td className="hours-table__day">{t('days.saturday')}</td>
                                                <td className="hours-table__time">{this.formatWorkingHours(establishment.workingHours)[5]}</td>
                                            </tr>
                                            <tr>
                                                <td className="hours-table__day">{t('days.sunday')}</td>
                                                <td className="hours-table__time">{this.formatWorkingHours(establishment.workingHours)[6]}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>


                                <div className="establishment-details__offer-title">{t('form.offer')}</div>
                                <div className="establishment-details__offer">{establishment.offer}</div>
                                {auth.isAuthenticated() && auth.isUser() && <div style={{ textAlign: "center", margin: "30px" }}>
                                    <button className="custom-card-establishment__button" onClick={() => this.handleOnClick()}>{t('generic.createExchange')}</button>
                                </div>}
                            </Col>
                        </Row>
                    </Section>
                </Page>
            </div>
        );
    }
}

export default withNamespaces()(EstablishmentDetails);