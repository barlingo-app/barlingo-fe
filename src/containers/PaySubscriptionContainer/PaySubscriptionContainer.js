import React from 'react'
import { withNamespaces } from "react-i18next"
import { PayPalButton } from "react-paypal-button-v2";
import { Page, Section } from "react-page-layout";
import { notification, Alert } from "antd";
import { Redirect } from 'react-router-dom';
import './PaySubscriptionContainer.scss';
import { establishmentService } from '../../services/establishmentService';
import Loading from "../../components/Loading/Loading";
import {Col, Row} from 'react-bootstrap';
import { auth } from '../../auth';

const MONTHLY_SUBSCRIPTION_ID = 1;
const TRIMESTRAL_SUBSCRIPTION_ID = 2;
const ANNUAL_SUBSCRIPTION_ID = 3;

const MONTLY_SUBSCRIPTION_PRICE = 6.99;
const TRIMESTRAL_SUBSCRIPTION_PRICE = 19.88;
const ANNUAL_SUBSCRIPTION_PRICE = 49.99;

const ANNUAL_DISCOUNT = "25%";
const TRIMESTRAL_DISCOUNT = "10%";

class PaySubscriptionContainer extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      loaded: false,
      subscriptionType: null,
      subscriptionPrice: null,
      subscriptionName: null,
      errorShown: false,
      errorMessage: false,
      successfullPayment: false,
      establishmentId: null,
      unknownEstablishment: false,
      paidSubscription: false,
      orderId: null
    }
  }
  
  componentDidMount(){
      let establishmentId = (auth.isAuthenticated() && auth.isEstablishment()) ? 
      auth.getUserData().id : sessionStorage.getItem("establishmentIdToPayment");

      if (auth.isAuthenticated() && auth.isEstablishment() && auth.getUserData().subscription != null) {
        this.setState({paidSubscription: true});
      } else if (establishmentId) {
        this.setState({establishmentId: establishmentId, loaded: true});
      } else {
        this.setState({unknownEstablishment: true});
      }
  }

  selectSubscriptionType = (subscriptionId) => {
    const { t } = this.props;

    switch (subscriptionId) {
      case MONTHLY_SUBSCRIPTION_ID: 
        this.setState({
          subscriptionName: t('subscription.type.monthly'), 
          subscriptionPrice: MONTLY_SUBSCRIPTION_PRICE, 
          subscriptionType: MONTHLY_SUBSCRIPTION_ID
        });
        break;
      case TRIMESTRAL_SUBSCRIPTION_ID: 
        this.setState({
          subscriptionName: t('subscription.type.trimestral'), 
          subscriptionPrice: TRIMESTRAL_SUBSCRIPTION_PRICE, 
          subscriptionType: TRIMESTRAL_SUBSCRIPTION_ID
        });
        break;
      case ANNUAL_SUBSCRIPTION_ID: 
        this.setState({
          subscriptionName: t('subscription.type.annual'), 
          subscriptionPrice: ANNUAL_SUBSCRIPTION_PRICE, 
          subscriptionType: ANNUAL_SUBSCRIPTION_ID
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

        this.setState({successfullPayment: true});
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
    const {subscriptionType, subscriptionPrice, subscriptionName, errorMessage, unknownEstablishment, paidSubscription, loaded, orderId, successfullPayment } = this.state
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
          />}
        <div className={"payment"}>   
        <Row>
          <Col className="payment__form" sm={{ span: 10, offset: 1 }} md={{ span: 8, offset: 2 }}>
            <div className="payment__title">{t('subscription.title')}</div>

              <div className={this.getClass(MONTHLY_SUBSCRIPTION_ID)} onClick={() => this.selectSubscriptionType(MONTHLY_SUBSCRIPTION_ID)}>
                <div>{t('subscription.type.monthly')}</div>
                <div>{MONTLY_SUBSCRIPTION_PRICE} €</div>
              </div>
              
              <div className={this.getClass(TRIMESTRAL_SUBSCRIPTION_ID)} onClick={() => this.selectSubscriptionType(TRIMESTRAL_SUBSCRIPTION_ID)}>
                <div>{t('subscription.type.trimestral')}</div>
                <div>{TRIMESTRAL_SUBSCRIPTION_PRICE} €</div>
                <div>{t('subscription.discounts.' + TRIMESTRAL_DISCOUNT)}</div>
              </div>
              
              <div className={this.getClass(ANNUAL_SUBSCRIPTION_ID)} onClick={() => this.selectSubscriptionType(ANNUAL_SUBSCRIPTION_ID)}>
                <div>{t('subscription.type.annual')}</div>
                <div>{ANNUAL_SUBSCRIPTION_PRICE} €</div>
                <div>{t('subscription.discounts.' + ANNUAL_DISCOUNT)}</div>
              </div>

              {(subscriptionType !== null) && <PayPalButton
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

export default withNamespaces('translation')(PaySubscriptionContainer);

