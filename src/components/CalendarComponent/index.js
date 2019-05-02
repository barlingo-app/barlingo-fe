import  React, { Component } from 'react'
import { Calendar, Badge, Empty } from 'antd';
import { withNamespaces } from "react-i18next";
import "antd/dist/antd.css";
import './index.scss'

export class index extends Component {

  constructor(props){
    super(props)
    this.state = {
      items: props.items,
      startSubcripcion: props.startSubcripcion || new Date(),
      endSubcripcion: props.endSubcripcion || new Date()
    }

    this.dateCellRender = this.dateCellRender.bind(this)
    this.monthCellRender = this.monthCellRender.bind(this)
  }

  getListData(value){
    let calendatDate = new Date(value)
    const {items} = this.state
    
    let listData = items.map( item => {
      let itemDate = new Date(item.moment + 'Z')
      if( (calendatDate.getDate() === itemDate.getDate()) && 
      (calendatDate.getMonth() === itemDate.getMonth()) &&
      (calendatDate.getFullYear() === itemDate.getFullYear()) ){
        return { id: item.id ,type: "success", content: item.title }
      }
      return null

    })
    let resul = listData.filter(x => x !== null)
    return  resul || []
  }


  getMonthData(value) {
    let calendatDate = new Date(value)
    const {items} = this.state
    let months = []
    let count = 0
    for (let i in items){
      let item = items[i]
      let itemDate = new Date(item.moment + 'Z')
      if((calendatDate.getMonth() === itemDate.getMonth()) &&
      (calendatDate.getFullYear() === itemDate.getFullYear())){
        count++
      }

    }
    return count
  }

  monthCellRender(value) {
    const {t} = this.props
    let num = this.getMonthData(value);
    return num>0 ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>{t('titles.exchangesList')}</span>
      </div>
    ) : null;
  }

  dateCellRender(value){
    let listData = this.getListData(value);
    return (
      <ul className="events">
        {
          listData.map(item => (
            <li key={item.id}>
              <Badge status={item.type} text={item.content} />
            </li>
          ))
        }
      </ul>
    );
  }
  
  render() {
    
    const {t} = this.props
    return (
      <div>
        <p>
          {t('intercambiosconcertadosensulocal')}
        </p>
        <Calendar monthCellRender={this.monthCellRender} dateCellRender = {this.dateCellRender} />
      </div>
    )
  }
}

export default withNamespaces('translation')(index);

