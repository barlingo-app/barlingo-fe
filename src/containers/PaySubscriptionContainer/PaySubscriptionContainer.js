import React from 'react'
import { withNamespaces } from "react-i18next"
import { PayPalButton } from "react-paypal-button-v2";
import { Page, Section } from "react-page-layout";
import { notification, Alert, Icon } from "antd";
import { Redirect } from 'react-router-dom';
import './PaySubscriptionContainer.scss';
import { establishmentService } from '../../services/establishmentService';
import Loading from "../../components/Loading/Loading";
import {Col, Row} from 'react-bootstrap';
import { auth } from '../../auth';
import { configurationService } from '../../services/configurationService';

const MONTHLY_SUBSCRIPTION_ID = 1;
const TRIMESTRAL_SUBSCRIPTION_ID = 2;
const ANNUAL_SUBSCRIPTION_ID = 3;

class PaySubscriptionContainer extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      loaded: false,
      configSubscriptionPrice: null,
      trimestralDiscount: null,
      annualDiscount: null,
      subscriptionType: null,
      subscriptionPrice: null,
      subscriptionName: null,
      errorShown: false,
      errorMessage: null,
      successfullPayment: false,
      establishmentId: null,
      unknownEstablishment: false,
      paidSubscription: false,
      orderId: null,
      buttonLoaded: false
    }
  }
  
  componentDidMount(){
      let establishmentId = (auth.isAuthenticated() && auth.isEstablishment()) ? 
      auth.getUserData().id : sessionStorage.getItem("establishmentIdToPayment");

      if (auth.isAuthenticated() && auth.isEstablishment() && auth.getUserData().subscription != null) {
        this.setState({paidSubscription: true});
      } else if (establishmentId) {
        configurationService.getConfiguration().then(response => {
          if (response.data && response.data.success && response.data.code === 200) {
            this.setState({
              configSubscriptionPrice: response.data.content.priceMonthSubscription, 
              trimestralDiscount: response.data.content.trimestralDiscount, 
              annualDiscount: response.data.content.annualDiscount,
              establishmentId: establishmentId,
              loaded: true
            });
          } else {
            this.setState({errorMessage: 'subscription.errorLoadingConfiguration'})
          }
        });
      } else {
        this.setState({unknownEstablishment: true});
      }

  }

  getTrimestralMonthlyPrice = () => {
    return (this.getTrimestralPrice() / 3).toFixed(2)
}

  getTrimestralPrice = () => {
      let trimestralDiscount = (this.state.configSubscriptionPrice * 3) * this.state.trimestralDiscount;
      return ((this.state.configSubscriptionPrice * 3) - trimestralDiscount).toFixed(2);
  }    

  getAnnualMonthlyPrice = () => {
      return (this.getAnnualPrice() / 12).toFixed(2);
  }

  getAnnualPrice = () => {
      let annualDiscount = (this.state.configSubscriptionPrice * 12) * this.state.annualDiscount;
      return ((this.state.configSubscriptionPrice * 12) - annualDiscount).toFixed(2);
  }

  selectSubscriptionType = (subscriptionId) => {
    const { t } = this.props;

    switch (subscriptionId) {
      case MONTHLY_SUBSCRIPTION_ID: 
        this.setState({
          subscriptionName: t('subscription.type.monthly'), 
          subscriptionPrice: this.state.configSubscriptionPrice, 
          subscriptionType: MONTHLY_SUBSCRIPTION_ID,
          buttonLoaded: this.state.buttonLoaded
        });
        break;
      case TRIMESTRAL_SUBSCRIPTION_ID: 
        this.setState({
          subscriptionName: t('subscription.type.trimestral'), 
          subscriptionPrice: this.getTrimestralPrice(), 
          subscriptionType: TRIMESTRAL_SUBSCRIPTION_ID,
          buttonLoaded: this.state.buttonLoaded
        });
        break;
      case ANNUAL_SUBSCRIPTION_ID: 
        this.setState({
          subscriptionName: t('subscription.type.annual'), 
          subscriptionPrice: this.getAnnualPrice(), 
          subscriptionType: ANNUAL_SUBSCRIPTION_ID,
          buttonLoaded: this.state.buttonLoaded
        });
        break;
      default:
        break;
    }
  }

  getClass = (subscriptionId) => {
    let classes = "payment__option";

    switch (subscriptionId) {
      case MONTHLY_SUBSCRIPTION_ID: 
        classes += ' monthly';
        break;
      case TRIMESTRAL_SUBSCRIPTION_ID: 
      classes += ' trimestral';
        break;
      case ANNUAL_SUBSCRIPTION_ID: 
      classes += ' annual';
        break;
      default:
        break;
    }

    if (subscriptionId === this.state.subscriptionType) {
      classes += ' active';
    }

    return classes;
  }

  processPayment = (details) => {
    const { t } = this.props;
    
    establishmentService.savePay(this.state.establishmentId, details.id)
    .then((response) => {
      if (response.data.code === 200 && response.data.success && response.data.content) {
        notification.success({
          message: t('subscription.successMessage.title'),
          description: t('subscription.successMessage.message'),
        });

        sessionStorage.removeItem("establishmentIdToPayment");

        if (auth.isAuthenticated()) {
          auth.loadUserData().then(() => this.setState({successfullPayment: true}));
        } else {
          this.setState({successfullPayment: true});
        }
      } else if (response.data.code === 500) {
        notification.error({
          message: this.props.t('apiErrors.defaultErrorTitle'),
          description: this.props.t('apiErrors.' + response.data.message),
        });
        this.setState({errorMessage: true, orderId: details.orderID})
      } else {
        this.setState({errorMessage: true, orderId: details.orderID})
      }
    })
    .catch((error) => {
      this.setState({errorMessage: true, orderId: details.orderID})
    });
  }

  render(){
    const { buttonLoaded, configSubscriptionPrice, trimestralDiscount, annualDiscount, subscriptionType, subscriptionPrice, subscriptionName, errorMessage, unknownEstablishment, paidSubscription, loaded, orderId, successfullPayment } = this.state
    const { t } = this.props;

    if (unknownEstablishment) {
      return (<Redirect to={{
        pathname: "/",
        state: { 
          errorTitle: "subscription.unknownEstablishment.title",
          errorMessage: "subscription.unknownEstablishment.message"
        }
      }} />);
    }

    if (paidSubscription) {
      return (<Redirect to={{
        pathname: "/",
        state: { 
          errorTitle: "subscription.paidSubscription.title",
          errorMessage: "subscription.paidSubscription.message"
        }
      }} />);
    }

    if (successfullPayment) {
      return (<Redirect to={"/"} />)
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

    return(        
        
      <div className="register-bg">
      <Page layout="public">
        <Section slot="content"> 
        {errorMessage && <Alert 
            message={t('subscription.errorSavingData.title')}
            description={t('subscription.errorSavingData.message') + orderId} 
            type="error" 
            showIcon
            closable
            className={"ant-alert-fixed"}
          />}
        <div className={"payment"}>   
        <Row>
          <Col className="payment__form" sm={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }}>
            <div className="payment__title">{t('subscription.title')}</div>

              <div className={this.getClass(MONTHLY_SUBSCRIPTION_ID)} onClick={() => this.selectSubscriptionType(MONTHLY_SUBSCRIPTION_ID)}>
                <div>{t('subscription.type.monthly')}</div>
                <div>{configSubscriptionPrice && configSubscriptionPrice.toFixed(2)} €</div>
              </div>
              
              <div className={this.getClass(TRIMESTRAL_SUBSCRIPTION_ID)} onClick={() => this.selectSubscriptionType(TRIMESTRAL_SUBSCRIPTION_ID)}>
                <div>{t('subscription.type.trimestral')}</div>
                <div>{configSubscriptionPrice && this.getTrimestralPrice()} €</div>
                <div>{configSubscriptionPrice && t('subscription.discounts.generic').replace('DISCOUNT', Math.round(trimestralDiscount * 100))}</div>
              </div>
              
              <div className={this.getClass(ANNUAL_SUBSCRIPTION_ID)} onClick={() => this.selectSubscriptionType(ANNUAL_SUBSCRIPTION_ID)}>
                <div>{t('subscription.type.annual')}</div>
                <div>{configSubscriptionPrice && this.getAnnualPrice()} €</div>
                <div>{configSubscriptionPrice && t('subscription.discounts.generic').replace('DISCOUNT', Math.round(annualDiscount * 100))}</div>
              </div>

              {subscriptionType !== null && !buttonLoaded && <Icon className="small-loading" type={"loading"}/>}
              {(subscriptionType !== null) && <PayPalButton
                    onButtonReady={() => { this.setState({buttonLoaded: true}) }}
                    amount={subscriptionPrice}
                    createOrder = {(data, actions) => {
                      return actions.order.create({
                        purchase_units: [{
                          amount: {
                            currency_code: "EUR",
                            value: subscriptionPrice
                          },
                          reference_id: subscriptionType,
                          description: "Barlingo - " + subscriptionName
                        }]
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then((details) => this.processPayment(details));
                    }}
                    onCancel={(data, actions) => {
                        notification.error({
                          message: t('subscription.cancelMessage.title'),
                          description: t('subscription.cancelMessage.message'),
                        });
                    }}
                    catchError={(error) => {                      
                      notification.error({
                        message: t('subscription.failedMessage.title'),
                        description: t('subscription.failedMessage.message'),
                      });
                    }}
                    options={{
                      clientId: process.env.REACT_APP_PAYPAL_ID,
                      currency: "EUR"
                  }}
                />}

              </Col>
            </Row>
          </div>       
          </Section>
          </Page>
          </div>
    )
    
  }
}

export default withNamespaces()(PaySubscriptionContainer);

