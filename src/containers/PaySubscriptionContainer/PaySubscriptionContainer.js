import React from 'react'
import { withNamespaces } from "react-i18next"
import { PayPalButton } from "react-paypal-button-v2";
import { Page, Section } from "react-page-layout";
import { notification } from "antd";
import { Redirect } from 'react-router-dom';
import './PaySubscriptionContainer.scss';
import { establishmentService } from '../../services/establishmentService';
import {Col, Row} from 'react-bootstrap';

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
      subscriptionType: null,
      subscriptionPrice: null,
      subscriptionName: null,
      errorShown: false,
      errorMessage: false,
      successfullPayment: false
    }
  }
  
  componentDidMount(){
    
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
    }

    if (subscriptionId === this.state.subscriptionType) {
      classes += ' active';
    }

    return classes;
  }

  processPayment = (details) => {
    const { t } = this.props;
    
    establishmentService.savePay(this.props.establishmentId, details.id)
    .then((response) => {
      notification.success({
        placement: 'bottomRight',
        bottom: 50,
        duration: 10,
        message: t('subscription.successMessage.title'),
        description: t('subscription.successMessage.message'),
      });

      this.setState({successfullPayment: true});
    })
    .catch((error) => {
      this.setState({errorMessage: true, orderId: details.orderID})
    })
  }

  render(){
    const {subscriptionType, subscriptionPrice, subscriptionName, errorMessage,  orderId, successfullPayment } = this.state
    const { t } = this.props;

    if (successfullPayment) {
      return (<Redirect to={"/"} />)
    }

    return(         
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
                      if (!this.state.errorShown) {
                        notification.error({
                          placement: 'bottomRight',
                          bottom: 50,
                          duration: 10,
                          message: t('subscription.cancelMessage.title'),
                          description: "You must finished the payment in order to appear in the app",
                        });
                        this.setState({errorShown: true});
                      }
                    }}
                    catchError={(error) => {                      
                      notification.error({
                        placement: 'bottomRight',
                        bottom: 50,
                        duration: 10,
                        message: t('subscription.failedMessage.title'),
                        description: "Please retry it again",
                      });
                    }}
                    options={{
                      clientId: process.env.REACT_APP_PAYPAL_ID,
                      currency: "EUR"
                  }}
                />}

                {errorMessage && <div>There was an error registering the data of the payment. Please contact us using the email barlingoapp@gmail.com and indicate us the payment with order id: {orderId}</div>}

              </Col>
            </Row>
          </div>       
    )
    
  }
}

export default withNamespaces('translation')(PaySubscriptionContainer);

