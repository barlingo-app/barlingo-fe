import React, { Component } from 'react';
import logo from '../../media/logo-white.png';
import { withNamespaces } from 'react-i18next';
import { Page, Section } from 'react-page-layout';
import './Home.scss';
import { notification, Alert } from 'antd';
import { NavLink } from "react-router-dom";
import { Row, Col } from 'react-bootstrap'
import {auth} from './../../auth'
import ernesto from '../../media/Ernesto.optimized.jpg'
import fernando from '../../media/Fernando.optimized.jpg'
import ramon from '../../media/Ramon.optimized.jpg'
import miguelangel from '../../media/Miguel Angel.optimized.jpg'
import angel from '../../media/Angel.optimized.jpg'
import jesus from '../../media/Jesus.optimized.jpg'
import migue from '../../media/Miguel.optimized.jpg'
import jose from '../../media/Jose.optimized.jpg'
import { configurationService } from '../../services/configurationService';
import { BackTop } from 'antd';

class Home extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            errorAlreadyDisplayed: false,
            subscriptionPrice: null,
            trimestralDiscount: null,
            annualDiscount: null
        }
    }

    componentDidMount() {

        document.title = "Barlingo - Enjoy talking where you prefer";
        if (!this.state.errorAlreadyDisplayed) {
            if (this.props.location.state) {
                const { t } = this.props;
                if (this.props.location.state.wrongAccess)  {
                    notification.error({
                        message: t('access.error.title'),
                        description: t("access.error.message"),
                    })
                    this.setState({currentWrongAccessToken: this.props.location.state.wrongAccess});
                } else if (this.props.location.state.errorTitle && this.props.location.state.errorMessage) {
                    notification.error({
                        message: t(this.props.location.state.errorTitle),
                        description: t(this.props.location.state.errorMessage),
                    });
                }

                this.setState({errorAlreadyDisplayed: true});
            }
        }

        configurationService.getConfiguration().then(response => {
            if (response.data && response.data.success && response.data.code === 200) {
                this.setState({
                    subscriptionPrice: response.data.content.priceMonthSubscription, 
                    trimestralDiscount: response.data.content.trimestralDiscount, 
                    annualDiscount: response.data.content.annualDiscount
                });
            }
        });
    }

    getSubcriptionWarning = () => (
        <Alert
            message={this.props.t('subscription.warningMessage.title')}
            description={ this.props.t('subscription.warningMessage.message1') }
            type="warning"
            showIcon
            banner
            className={"ant-alert-fixed"}
        />
    )

    getTrimestralMonthlyPrice = () => {
        return (this.getTrimestralPrice() / 3).toFixed(2)
    }

    getTrimestralPrice = () => {
        let trimestralDiscount = (this.state.subscriptionPrice * 3) * this.state.trimestralDiscount;
        return ((this.state.subscriptionPrice * 3) - trimestralDiscount).toFixed(2);
    }    
    
    getAnnualMonthlyPrice = () => {
        return (this.getAnnualPrice() / 12).toFixed(2);
    }

    getAnnualPrice = () => {
        let annualDiscount = (this.state.subscriptionPrice * 12) * this.state.annualDiscount;
        return ((this.state.subscriptionPrice * 12) - annualDiscount).toFixed(2);
    }

    render() {
        const { t } = this.props;
        const { subscriptionPrice, trimestralDiscount, annualDiscount } = this.state;
        
        let label1 = "undefiend"
        let label2 = "undefined"

        let path1 = "/undefiend"
        let path2 = "/undefined"

        if(auth.isAuthenticated()){
            if(auth.isUser()){
                label1 = 'landing.navOptions.createExchanges'
                label2 = 'landing.navOptions.findExchanges'

                path1 = '/establishments'
                path2 = '/exchanges'
            }
            else if(auth.isEstablishment()){
                label1 = 'links.calendar'
                label2 = 'links.validateCode'

                path1 = '/calendar'
                path2 = '/validateCode'
            }
            else if(auth.isAdmin()){
                label1 = "links.manageaccounts"
                label2 = "links.notification"

                path1 = '/users'
                path2 = '/createNotification'
            }

            
        }else{
            label1 = 'links.login'
            label2 = 'links.registerUser'

            path1 = '/login'
            path2 = '/register'
        }

        return (
            <Page layout="public">
                <Section slot="contentWithBackground">
                <BackTop  visibilityHeight={50} target={()=> {return document.getElementsByClassName("contentWithBackground")[0]}} />
                    {  auth.isAuthenticated() && auth.isEstablishment() && (auth.getUserData().subscription == null) &&  this.getSubcriptionWarning() }
                        <div className="landing-container">
                            <div className="landing-container__bg"></div>
                                <div className="landing-container__content">
                                    <img src={logo} className="logo" alt="logo" />
                                    <div className={"message"}>
                                        <p>
                                            Enjoy talking where you prefer
                                    </p>
                                    </div>
                                    <div className={"navContainer"}>

                                        <NavLink exact={true} to={path1}>
                                            <div className={"navOption"}>{t(label1)}</div>
                                        </NavLink>
                                        <NavLink exact={true} to={path2}>
                                            <div className={"navOption"}>{t(label2)}</div>
                                        </NavLink>
                                    </div>
                                </div>
                            
                        </div>
                        <div className="home-info">
                            <Row>
                                <Col className="home-info__whatis">
                                    <Row>
                                        <Col>
                                            <div className="home-info__title">{t('home.whatis')}</div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="home-info__description" xs={{span:10,offset:1}} md={{span:8,offset:2}}>
                                            <p>{t('home.paragraph1')}</p>
                                            <p>{t('home.paragraph2')}</p>
                                            <p>{t('home.paragraph3')}</p>
                                        </Col>
                                    </Row>
                                
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col className="home-info__pricing">
                                    <Row>
                                        <Col>
                                            <div className="home-info__title">{t('home.pricing')}</div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        {subscriptionPrice && <Col className="home-info__pricing-col" xs={{span:10,offset:1}} md={{span:4,offset:0}}>
                                            <div className="home-info__pricing-card">
                                                <b className="home-info__pricing-title">{t('home.monthly')}</b>
                                                <div className="home-info__monthly">{ subscriptionPrice.toFixed(2) } €/{t('home.month')}</div>
                                                <div className="home-info__total">TOTAL: { subscriptionPrice.toFixed(2) } €</div>
                                            </div>
                                        </Col>}
                                        {subscriptionPrice && trimestralDiscount && <Col className="home-info__pricing-col" xs={{span:10,offset:1}} md={{span:4,offset:0}}> 
                                            <div className="home-info__pricing-card">
                                                <b className="home-info__pricing-title">{t('home.quarterly')}</b>
                                                <div className="home-info__quarterly">{ this.getTrimestralMonthlyPrice() } €/{t('home.month')}</div>
                                                <div className="home-info__discount">-{ Math.round(trimestralDiscount * 100) }%</div>
                                                <div className="home-info__total">TOTAL: {this.getTrimestralPrice()}€</div>
                                            </div>
                                        </Col>}
                                        {subscriptionPrice && annualDiscount && <Col className="home-info__pricing-col" xs={{span:10,offset:1}} md={{span:4,offset:0}}>
                                            <div className="home-info__pricing-card">
                                                <b className="home-info__pricing-title">{t('home.annual')}</b>
                                                <div className="home-info__annual">{this.getAnnualMonthlyPrice() } €/{t('home.month')}</div>
                                                <div className="home-info__discount">-{ Math.round(annualDiscount * 100) }%</div>
                                                <div className="home-info__total">TOTAL: { this.getAnnualPrice() } €</div>
                                            </div>
                                        </Col>}
                                        {!subscriptionPrice &&
                                            <div style={{width: "100%", textAlign: "center"}}>
                                                {t('subscription.errorLoadingConfiguration')}
                                            </div>
                                        }
                                    </Row>
                                </Col>            
                            </Row>
                            <Row>
                                <Col className="home-info__team">
                                    <Row>
                                        <Col>
                                            <div className="home-info__title">{t('home.team')}</div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="6" lg="4" xl="3">
                                            <div className="home-info__team-card">
                                                <img className="home-info__img" src={ernesto} alt=""/>
                                                <b>Ernesto de Tovar</b>
                                                <div>{t('home.pm')}</div>
                                            </div>
                                        </Col>
                                        <Col md="6" lg="4" xl="3">
                                            <div className="home-info__team-card">
                                                <img className="home-info__img" src={fernando} alt=""/>
                                                <b>Fernando Ramírez</b>
                                                <div>{t('home.be-leader')}</div>
                                            </div>
                                        </Col>
                                        <Col md="6" lg="4" xl="3">
                                            <div className="home-info__team-card">
                                                <img className="home-info__img" src={ramon} alt=""/>
                                                <b>Ramón Guerrero</b>
                                                <div>{t('home.be-dev')}</div>
                                            </div>
                                        </Col>
                                        <Col md="6" lg="4" xl="3">
                                            <div className="home-info__team-card">
                                                <img className="home-info__img" src={angel} alt=""/>
                                                <b>Ángel Pomares</b>
                                                <div>{t('home.be-dev')}</div>
                                            </div>
                                        </Col>
                                        <Col md="6" lg="4" xl="3">
                                            <div className="home-info__team-card">
                                                <img className="home-info__img" src={miguelangel} alt=""/>
                                                <b>Miguel Angel Mogrovejo</b>
                                                <div>{t('home.be-dev')}</div>
                                            </div>
                                        </Col>
                                        <Col md="6" lg="4" xl="3">
                                            <div className="home-info__team-card">
                                                <img className="home-info__img" src={jesus} alt=""/>
                                                <b>Jesús Rivas</b>
                                                <div>{t('home.fe-leader')}</div>
                                            </div>
                                        </Col>
                                        <Col md="6" lg="4" xl="3">
                                            <div className="home-info__team-card">
                                                <img className="home-info__img" src={jose} alt=""/>
                                                <b>José Giraldo</b>
                                                <div>{t('home.fe-dev')}</div>
                                            </div>
                                        </Col>
                                        <Col md="6" lg="4" xl="3">
                                            <div className="home-info__team-card">
                                                <img className="home-info__img" src={migue} alt=""/>
                                                <b>Miguel Campos</b>
                                                <div>{t('home.fe-dev')}</div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>    
                            </Row>

                        </div>              
            </Section>
        </Page>
        );
    }
}

export default withNamespaces()(Home);
