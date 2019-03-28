import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { LayoutProvider } from 'react-page-layout';
import { Route, Switch, withRouter } from "react-router-dom";
import DisplayCodeContainer from './containers/DisplayCodeContainer/DisplayCodeContainer';
import CreateExchangeForm from "./containers/CreateExchange/CreateExchange";
import EstablishmentDetails from "./containers/EstablishmentDetails/EstablishmentDetails";
import EstablismentsList from "./containers/EstablishmentsList/EstablismentsList";
import ExchangeDetails from "./containers/ExchangeDetails/ExchangeDetails";
import ExchangesList from "./containers/ExchangesList/ExchangesList";
import Home from './containers/Home/Home';
import LoginForm from "./containers/LoginForm/LoginForm";
import Logout from "./containers/LoginForm/Logout";

import PublicLayout from './layouts/PublicLayout/PublicLayout';
import ValidateCodeContainer from './containers/ValidateCodeContainer/ValidateCodeContainer'
const layouts = {
	'public': PublicLayout,
};

class App extends Component {

	render() {
		return (
			<LayoutProvider layouts={layouts}>
				<Switch>
					/*<Route exact path="/" component={Home} />*/
					<Route exact path="/logout" component={Logout} />
					<Route exact path="/" component={ExchangesList} />
					<Route exact path="/login" component={LoginForm} />
					<Route exact path="/establishments" component={EstablismentsList} />
					<Route exact path="/exchanges" component={ExchangesList} />
					<Route exact path="/establishments/:establishmentName" component={EstablishmentDetails} />
					<Route exact path="/exchanges/:exchangeTitle" component={ExchangeDetails} />
					<Route exact path="/createExchange/:establishmentId" component={CreateExchangeForm} />
					<Route exact path="/displayCode/:codeId" component={DisplayCodeContainer} />
					<Route exact path="/validateCode" component={ValidateCodeContainer} />
				</Switch>
			</LayoutProvider>
		);
	}

}

export default withRouter(withNamespaces('translations')(App));