import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import database from './db.json';

class Form extends React.Component {
    //компонент, возвращающий форму с автодополнением
    //state.value -- содержимое поля ввода
    //state.options -- список предложенных фильмов
    //state.isSubmitted -- флаг подтверждения введенных данных
    //state.doesValueExist -- флаг наличия фильма с названием из поля state.value в базе данных
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            options: [],
            isSubmitted: false,
            doesValueExist: false
        };

        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onChange(event) {
        //обработка изменений содержимого поля ввода
        let val = event.target.value;
        this.setState({
            value: val,
            options: getOptionsList(val),
            isSubmitted: false
        });
    }

    keyPress(event) {
        //подтверждение данных формы нажатию клавиши enter
        if (event.keyCode === 13) //код клавиши enter -- 13
            this.handleSubmit(event);
    }

    handleSubmit(event) {
        //обработка принятых данных формы
        event.preventDefault();
        this.setState({
            isSubmitted: true,
            doesValueExist: this.state.options.length > 0 ? this.state.options[0].title.toLowerCase().localeCompare(this.state.value.toLowerCase()) === 0 : false
        });
    }

    render() {
        return (
            <form className='form' onSubmit={this.handleSubmit}>
                <label>Название фильма:</label><br/>
                <input type='text' value={this.state.value} list={this.props.listName} onChange={this.onChange}/>
                <OptionList id={this.props.listName} options={this.state.options}/>
                <Info isSubmitted={this.state.isSubmitted}
                          item={this.state.doesValueExist > 0 ? this.state.options[0] : null}/>
            </form>
        );
    }
}

class OptionList extends React.Component {
    //компонент, отвечающий за отрисовку ниспадающего списка предложенных вариантов названий
    //props.id -- идентификатор списка (совпадает с атрибутом list у соответствующего тега input
    //props.options -- массив фильмов, которые нужно отобразить в списке
    render() {
        return (
            <datalist id={this.props.id}>
                {this.props.options.map((item) => <option key={item.id} value={item.title}></option>)}
            </datalist>
        );
    }
}

class Info extends React.Component {
    //компонент, отвечающий за отображение информации о выбранном фильме
    //props.isSubmitted -- true, если был submit и не было изменений поля ввода после этого, иначе false
    //props.item -- ссылка на выбранный фильм
    render() {
        if (this.props.isSubmitted) {
            if (this.props.item)
                return (
                    <div className='info'>
                        <span>Название: {this.props.item.title}</span><br/>
                        <span>Год: {this.props.item.year}</span><br/>
                        <span>Режиссёр: {this.props.item.director}</span>
                    </div>
                );
            else
                //props.item == null, если фильма с выбранным названием нет в базе данных
                return (
                    <div className='info'>
                        <span>Не найден такой фильм</span>
                    </div>
                )
        }
        else
            //если не было submit, возвращается пустой div
            return (<div className='info'></div>);
    }
}

function getOptionsList(part) {
    //part -- содержимое поля ввода (должно совпадать с началом названия фильма)
    //функция фильтрует названия фильмов и возвращает массив подходящих фильмов
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
    //отрисовка формы с автодополнением в основном html-документе
    <Form listName='films'/>, document.getElementById('root')
);