import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { LayoutProvider } from 'react-page-layout';
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { auth } from "./auth";
import CreateExchangeForm from "./containers/CreateExchange/CreateExchange";
import DisplayCodeContainer from './containers/DisplayCodeContainer/DisplayCodeContainer';
import EstablishmentDetails from "./containers/EstablishmentDetails/EstablishmentDetails";
import EstablismentsList from "./containers/EstablishmentsList/EstablismentsList";
import ExchangeDetails from "./containers/ExchangeDetails/ExchangeDetails";
import ExchangesList from "./containers/ExchangesList/ExchangesList";
import MyExchangesListCreated from "./containers/ExchangesList/MyExchangesList/MyExchangeListCreated";
import MyExchangesListJoined from "./containers/ExchangesList/MyExchangesList/MyExchangeListJoined";
import Home from './containers/Home/Home';
import LoginForm from "./containers/LoginForm/LoginForm";
import Logout from "./containers/LoginForm/Logout";
import ValidateCodeContainer from './containers/ValidateCodeContainer/ValidateCodeContainer';
import RegisterComponent from './components/RegisterComponent'
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
					<Route exact path="/establishments" component={EstablismentsList} />
					<Route exact path="/establishments/:establishmentName" component={EstablishmentDetails} />
					<Route exact path="/exchanges/:exchangeTitle" component={ExchangeDetails} />
					<Route exact path="/register"  component={RegisterComponent}/>
					<Route exact path="/notFound" component={Home} />
					<PrivateRoute exact path="/myExchangesCreated" component={MyExchangesListCreated} />
					<PrivateRoute exact path="/myExchangesJoined" component={MyExchangesListJoined} />
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