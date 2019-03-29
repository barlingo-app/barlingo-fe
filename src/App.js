import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { LayoutProvider } from 'react-page-layout';
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import DisplayCodeContainer from './containers/DisplayCodeContainer/DisplayCodeContainer';
import CreateExchangeForm from "./containers/CreateExchange/CreateExchange";
import EstablishmentDetails from "./containers/EstablishmentDetails/EstablishmentDetails";
import EstablismentsList from "./containers/EstablishmentsList/EstablismentsList";
import ExchangeDetails from "./containers/ExchangeDetails/ExchangeDetails";
import ExchangesList from "./containers/ExchangesList/ExchangesList";
import Home from './containers/Home/Home';
import LoginForm from "./containers/LoginForm/LoginForm";
import Logout from "./containers/LoginForm/Logout";
import { auth } from "./auth";
import PublicLayout from './layouts/PublicLayout/PublicLayout';
import ValidateCodeContainer from './containers/ValidateCodeContainer/ValidateCodeContainer'
const layouts = {
	'public': PublicLayout,
};

function PrivateRoute({ component: Component, ...rest }) {
	return (
		<Route
			{...rest}
			render={props =>
				auth.isAuthenticated() ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: "/login",
							state: { from: props.location }
						}}
					/>
				)
			}
		/>
	);
}

class App extends Component {

	render() {
		return (
			<LayoutProvider layouts={layouts}>
				<Switch>
					<Route exact path="/logout" component={Logout} />
					<Route exact path="/" component={ExchangesList} />
					<Route exact path="/login" component={LoginForm} />
					<Route exact path="/establishments" component={EstablismentsList} />
					<Route exact path="/establishments/:establishmentName" component={EstablishmentDetails} />
					<Route exact path="/exchanges/:exchangeTitle" component={ExchangeDetails} />
					<Route exact path="/notFound" component={Home} />
					<PrivateRoute exact path="/createExchange/:establishmentId" component={CreateExchangeForm} />
					<PrivateRoute exact path="/displayCode/:codeId" component={DisplayCodeContainer} />
					<PrivateRoute exact path="/validateCode" component={ValidateCodeContainer} />
					<Route component={Home}/>
				</Switch>
			</LayoutProvider>
		);
	}

}

export default withRouter(withNamespaces('translations')(App));