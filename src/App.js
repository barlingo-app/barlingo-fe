import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { LayoutProvider } from 'react-page-layout';
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { auth } from "./auth";
import RegisterComponent from './components/RegisterComponent';
import CreateExchangeForm from "./containers/CreateExchange/CreateExchange";
import DisplayCodeContainer from './containers/DisplayCodeContainer/DisplayCodeContainer';
import EstablishmentDetails from "./containers/EstablishmentDetails/EstablishmentDetails";
import EstablismentsList from "./containers/EstablishmentsList/EstablismentsList";
import ExchangeDetails from "./containers/ExchangeDetails/ExchangeDetails";
import ExchangesList from "./containers/ExchangesList/ExchangesList";
import MyExchangesList from "./containers/ExchangesList/MyExchangesList/MyExchangeList";
import Home from './containers/Home/Home';
import LoginForm from "./containers/LoginForm/LoginForm";
import Logout from "./containers/LoginForm/Logout";
import ProfileView from "./containers/ProfileView/ProfileView";
import ValidateCodeContainer from './containers/ValidateCodeContainer/ValidateCodeContainer';
import PublicLayout from './layouts/PublicLayout/PublicLayout';


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
					<Route exact path="/profile" component={ProfileView} />
					<Route exact path="/establishments" component={EstablismentsList} />
					<Route exact path="/establishments/:establishmentName" component={EstablishmentDetails} />
					<Route exact path="/exchanges/:exchangeTitle" component={ExchangeDetails} />
					<Route exact path="/register" component={RegisterComponent} />
					<Route exact path="/notFound" component={Home} />
					<PrivateRoute exact path="/myExchanges" component={MyExchangesList} />
					<PrivateRoute exact path="/createExchange/:establishmentId" component={CreateExchangeForm} />
					<PrivateRoute exact path="/displayCode/:codeId" component={DisplayCodeContainer} />
					<PrivateRoute exact path="/validateCode" component={ValidateCodeContainer} />
					<Route component={Home} />
				</Switch>
			</LayoutProvider>
		);
	}

}

export default withRouter(withNamespaces('translations')(App));