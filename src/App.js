import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { LayoutProvider } from 'react-page-layout';
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { auth } from "./auth";
import RegisterUserContainer from './containers/RegisterUserContainer'
import EditProfileContainer from './containers/EditProfileContainer'
import CreateExchangeForm from "./containers/CreateExchange/CreateExchange";
import DisplayCodeContainer from './containers/DisplayCodeContainer/DisplayCodeContainer';
import EstablishmentDetails from "./containers/EstablishmentDetails/EstablishmentDetails";
import EstablismentsList from "./containers/EstablishmentsList/EstablismentsList";
import ExchangeDetails from "./containers/ExchangeDetails/ExchangeDetails";
import ExchangesList from "./containers/ExchangesList/ExchangesList";
import MyExchangesList from "./containers/ExchangesList/MyExchangesList/MyExchangeList";
import Home from './containers/Home/Home';
import LoginForm from "./containers/LoginForm/LoginForm";
import NotFound from "./containers/NotFound/NotFound";
import ProfileView from "./containers/ProfileView/ProfileView";
import UsersListAdmin from "./containers/UsersListAdmin/UsersListAdmin";
import ValidateCodeContainer from './containers/ValidateCodeContainer/ValidateCodeContainer';
import PublicLayout from './layouts/PublicLayout/PublicLayout';
import RegisterEstablishmentContainer from './containers/RegisterEstablishmentContainer'

const layouts = {
	'public': PublicLayout,
};

function checkRoles(roles) {
	if (roles) {
		if (roles && typeof roles === 'object' && roles.constructor === Array) {
			return roles.include(auth.getRole());
		} else if (typeof roles === 'string' || roles instanceof String) {
			return roles === auth.getRole();
		}
		return false;
	}
	return true;
}

function PrivateRoute({ component: Component, roles: roles, ...rest }) {
	return (
		<Route
			{...rest}
			render={props =>
				auth.isAuthenticated() ? (checkRoles(roles) ? (
					<Component {...props} />
				) : (
						<Redirect
							to={{
								pathname: "/",
								state: { wrongAccess: true }
							}}
						/>
					)) : (
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
		const USER_ROLE = auth._USER_ROLE;
		const ESTABLISMENT_ROLE = auth._ESTABLISMENT_ROLE;
		const ADMIN_ROLE = auth._ADMIN_ROLE;
		/* Para el uso de roles, hay que pasarle a PrivateRoute en el atributo roles, o un string con el rol permitido, o un array con los roles permitidos */
		return (

			<LayoutProvider layouts={layouts}>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/login" component={LoginForm} />
					<PrivateRoute exact path="/profile" component={ProfileView} />
					<PrivateRoute exact path="/profile/:userId" component={ProfileView} />
					<PrivateRoute roles={ADMIN_ROLE} exact path="/users" component={UsersListAdmin} />
					<Route exact path="/exchanges" component={ExchangesList} />
					<Route exact path="/establishments" component={EstablismentsList} />
					<Route exact path="/establishments/:establishmentName" component={EstablishmentDetails} />
					<Route exact path="/exchanges/:exchangeTitle" component={ExchangeDetails} />
					<Route exact path="/registerUser" component={RegisterUserContainer} />
					<PrivateRoute exact path="/editProfile" component={EditProfileContainer} />
					<Route exact path="/notFound" component={NotFound} />
					<Route exact path="/registerEstablishment" component={RegisterEstablishmentContainer} />
					<PrivateRoute roles={USER_ROLE} exact path="/myExchanges" component={MyExchangesList} />
					<PrivateRoute roles={USER_ROLE} exact path="/createExchange/:establishmentId" component={CreateExchangeForm} />
					<PrivateRoute exact path="/displayCode/:codeId" component={DisplayCodeContainer} />
					<PrivateRoute roles={ESTABLISMENT_ROLE} exact path="/validateCode" component={ValidateCodeContainer} />
					<Route component={NotFound} />
				</Switch>
			</LayoutProvider>
		);
	}

}

export default withRouter(withNamespaces('translations')(App));