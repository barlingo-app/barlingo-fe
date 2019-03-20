import React, { Component } from "react";
import {withRouter, Route, Switch } from "react-router-dom";
import { LayoutProvider } from 'react-page-layout';
import PublicLayout from './layouts/PublicLayout/PublicLayout';
import Home from './containers/Home/Home';
import {withNamespaces} from "react-i18next";
import EstablismentsList from "./containers/EstablishmentsList/EstablismentsList";
import ExchangesList from "./containers/ExchangesList/ExchangesList";
import EstablishmentDetails from "./containers/EstablishmentDetails/EstablishmentDetails";
import ExchangeDetails from "./containers/ExchangeDetails/ExchangeDetails";

const layouts = {
    'public': PublicLayout,
};

class App extends Component {

	render() {
	    return (
            <LayoutProvider layouts={layouts}>
	            <Switch>
	                <Route exact path="/" component={Home} />
					<Route exact path="/establishments" component={EstablismentsList} />
					<Route exact path="/exchanges" component={ExchangesList} />
					<Route exact path="/establishments/:establishmentName" component={EstablishmentDetails} />
					<Route exact path="/exchanges/:exchangeTitle" component={ExchangeDetails} />
	            </Switch>
            </LayoutProvider>
	    );
	}

}

export default withRouter(withNamespaces('translations')(App));