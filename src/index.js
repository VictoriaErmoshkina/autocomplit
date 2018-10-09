import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import database from './db.json';

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            options: [],
            submitted: false,
            doesValueExist: false
        };

        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onChange(event) {
        let val = event.target.value;
        this.setState({
            value: val,
            options: getOptionsList(val),
            submitted: false
        });
    }

    keyPress(event) {
        if (event.keyCode === 13)
            this.handleSubmit(event);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            submitted: true,
            doesValueExist: this.state.options.length > 0 ? this.state.options[0].title.toLowerCase().localeCompare(this.state.value.toLowerCase()) === 0 : false
        });
    }


    render() {
        return (
            <form className='form' onSubmit={this.handleSubmit}>
                <label>Название фильма:</label><br/>
                <input type='text' value={this.state.value} list={this.props.listName} onChange={this.onChange}/>
                <OptionList id={this.props.listName} options={this.state.options}/>
                <Info submitted={this.state.submitted}
                          item={this.state.doesValueExist > 0 ? this.state.options[0] : null}/>
            </form>
        );
    }
}

class OptionList extends React.Component {
    render() {
        return (
            <datalist id={this.props.id}>
                {this.props.options.map((item) => <option key={item.id} value={item.title}></option>)}
            </datalist>
        );
    }
}

class Info extends React.Component {
    render() {
        if (this.props.submitted) {
            if (this.props.item)
                return (
                    <div className='info'>
                        <span>Название: {this.props.item.title}</span><br/>
                        <span>Год: {this.props.item.year}</span><br/>
                        <span>Режиссёр: {this.props.item.director}</span>
                    </div>
                );
            else
                return (
                    <div className='nfo'>
                        <span>Не найден такой фильм</span>
                    </div>
                )
        }
        else
            return (<div className='info'></div>);
    }
}



function getOptionsList(part) {
    //search names in json
    let str = part.toLowerCase();
    let filteredOptions = [];
    let items = database.films;
    if (part.length !== 0) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].title.toLowerCase().indexOf(str) === 0)
                filteredOptions.push(items[i]);
        }
    }

    return filteredOptions;
}

ReactDOM.render(
    <Form listName='films'/>, document.getElementById('root')
);