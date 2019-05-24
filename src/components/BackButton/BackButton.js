import React, { Component } from 'react';
import { Icon } from 'antd';
import { NavLink } from 'react-router-dom';
import './BackButton.scss';

class BackButton extends Component {

    constructor(props) {
        super(props);

        this.state = {
        }
    }


    render() {
        let className = "backContainer";
    
        if (this.props.additionalClasses) {
            className += " " + this.props.additionalClasses
        }        

        return(
            <div className={className}><NavLink to={this.props.to}><Icon type="left-circle" theme="filled" /></NavLink></div>
        )
    }
}

export default BackButton;