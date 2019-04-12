import React from 'react'
import { withNamespaces } from "react-i18next"
import { PayPalButton } from "react-paypal-button-v2";
import { Page, Section } from "react-page-layout";
import { notification } from "antd";
import { Redirect } from 'react-router-dom';
import './PaySubscriptionContainer.scss';
import { establishmentService } from '../../services/establishmentService';

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
    switch (subscriptionId) {
      case MONTHLY_SUBSCRIPTION_ID: 
        this.setState({
          subscriptionName: "Montly", 
          subscriptionPrice: MONTLY_SUBSCRIPTION_PRICE, 
          subscriptionType: MONTHLY_SUBSCRIPTION_ID
        });
        break;
      case TRIMESTRAL_SUBSCRIPTION_ID: 
        this.setState({
          subscriptionName: "Trimestral", 
          subscriptionPrice: TRIMESTRAL_SUBSCRIPTION_PRICE, 
          subscriptionType: TRIMESTRAL_SUBSCRIPTION_ID
        });
        break;
      case ANNUAL_SUBSCRIPTION_ID: 
        this.setState({
          subscriptionName: "Annual", 
          subscriptionPrice: ANNUAL_SUBSCRIPTION_PRICE, 
          subscriptionType: ANNUAL_SUBSCRIPTION_ID
        });
        break;
    }
  }

  getClass = (subscriptionId) => {
    let classes = "option";

    if (subscriptionId === this.state.subscriptionType) {
      classes += ' active';
    }

    return classes;
  }

  processPayment = (details) => {
    establishmentService.savePay(this.props.establishmentId, details.id)
    .then((response) => {
      notification.success({
        placement: 'bottomRight',
        bottom: 50,
        duration: 10,
        message: "Successful payment",
        description: "Now you can see your establishment in the app.",
      });

      this.setState({successfullPayment: true});
    })
    .catch((error) => {
      this.setState({errorMessage: true, orderId: details.orderID})
    })
  }

  render(){
    const {subscriptionType, subscriptionPrice, subscriptionName, errorMessage,  orderId, successfullPayment } = this.state

    if (successfullPayment) {
      return (<Redirect to={"/"} />)
    }

    return(
          <div className={"optionsContainer"}>
            <div className={this.getClass(MONTHLY_SUBSCRIPTION_ID)} onClick={() => this.selectSubscriptionType(MONTHLY_SUBSCRIPTION_ID)}>
              <div>Monthly subscription</div>
              <div>Price: {MONTLY_SUBSCRIPTION_PRICE} €</div>
            </div>
            
            <div className={this.getClass(TRIMESTRAL_SUBSCRIPTION_ID)} onClick={() => this.selectSubscriptionType(TRIMESTRAL_SUBSCRIPTION_ID)}>
              <div>Trimestral subscription</div>
              <div>Price: {TRIMESTRAL_SUBSCRIPTION_PRICE} €</div>
              <div>Discount: {TRIMESTRAL_DISCOUNT}</div>
            </div>
            
            <div className={this.getClass(ANNUAL_SUBSCRIPTION_ID)} onClick={() => this.selectSubscriptionType(ANNUAL_SUBSCRIPTION_ID)}>
              <div>Annual subscription</div>
              <div>Price: {ANNUAL_SUBSCRIPTION_PRICE} €</div>
              <div>Discount: {ANNUAL_DISCOUNT}</div>
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
                        referenceId: subscriptionType,
                        description: "Barlingo - " + subscriptionName + " subscription"
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
                        message: "Payment cancelled",
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
                      message: "Failed payment",
                      description: "Please retry it again",
                    });
                  }}
                  options={{
                    clientId: "AVty7omS6cvIuMGKjMbAIq-xlbPQLyREkzj2HJQ5UkK0JnApk3rX8yLHcvdBrU974UZxav0JK-8fBg2c",
                    currency: "EUR"
                }}
              />}

              {errorMessage && <div>There was an error registering the data of the payment. Please contact us using the email barlingoapp@gmail.com and indicate us the payment with order id: {orderId}</div>}
            </div>
    )
    
  }
}

export default withNamespaces('translation')(PaySubscriptionContainer);

