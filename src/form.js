import React from 'react';
import './index.css';
import onClickOutside from 'react-onclickoutside';

let films;

class Form extends React.Component {
    //компонент, возвращающий форму с автодополнением
    //state.value -- содержимое поля ввода
    //state.options -- список предложенных вариантов
    //state.selectedItem -- ссылка на выбранный элемент
    //state.indexOfMarked -- индекс выделенного элемента в массиве options
    //state.showOptions -- флаг отображения списка вариантов
    //state.isSubmitted -- флаг подтверждения введенных данных
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            options: [],
            selectedItem: null,
            indexOfMarked: -1,
            showOptions: false,
            isSubmitted: false
        };

        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.OptionList = this.OptionList.bind(this);
        this.FormContent = this.FormContent.bind(this);
    }

    componentDidMount(){
        const url = 'http://localhost:3001/films';
        window.fetch(url, {
            method: 'GET'
        })
            .then(function (response) {
                return response.json();
            }).then(function (json) {
            films = json;
            console.log(films);
        }).catch(function (ex) {
            console.log('parsing failed', ex);
            console.log('Соединение с сервером не установлено');
        });
    }


    onChange(event) {
        //обработка изменений содержимого поля ввода
        let val = event.target.value;
        this.setState({
            value: val,
            options: getOptionsList(val),
            selectedItem: null,
            indexOfMarked: -1,
            showOptions: true,
            isSubmitted: false
        })
    }

    onKeyPress(event) {
        //подтверждение данных формы нажатию клавиши enter
        if (event.keyCode === 13) {//код клавиши enter -- 13
            let inputItem = getItemByTitle(this.state.value);
            let newSelectedItem = this.state.selectedItem ?
                ((this.state.selectedItem.title === inputItem.title) ? this.state.selectedItem : inputItem) : inputItem;
            this.setState({
                options: getOptionsList(this.state.value),
                selectedItem: newSelectedItem,
                indexOfMarked: -1,
                showOptions: false
            });
            this.handleSubmit(event);
        }

        //обработка нажатия клавиш вверх и вниз
        if (event.keyCode === 38 || event.keyCode === 40) {
            let newIndex; //новый индекс -- индекс выбранного элемента в массиве options
            //нажатие клавиши вверх
            if (event.keyCode === 38 && this.state.value) {
                newIndex = this.state.options.length - 1;
                if (this.state.indexOfMarked !== -1) {
                    newIndex = this.state.indexOfMarked - 1;
                }
            }
            //нажатие клавиши вниз
            if (event.keyCode === 40 && this.state.value) {
                newIndex = -1;
                if (this.state.indexOfMarked !== this.state.options.length - 1) {
                    newIndex = this.state.indexOfMarked + 1;
                }
            }
            this.setState({
                value: newIndex >= 0 ? this.state.options[newIndex].title : this.state.value,
                selectedItem: newIndex >= 0 ? this.state.options[newIndex] : this.state.selectedItem,
                indexOfMarked: newIndex,
                showOptions: true,
                isSubmitted: false
            })
        }
    }

    onClick(event) {
        //обработка клика по элементу списка вариантов
        let selectedItem = getItemById(event.target.id);
        if (selectedItem) {
            this.setState({
                value: selectedItem.title,
                options: getOptionsList(selectedItem.title),
                selectedItem: selectedItem,
                indexOfMarked: getIndexOfElement(event.target.id, this.state.options),
                showOptions: false
            });
        }
        this.handleSubmit(event);
    }

    onMouseOver(event) {
        //обработка наведения мыши на элемент списка
        if (event.target.id) {
            this.setState({
                indexOfMarked: getIndexOfElement(event.target.id, this.state.options)
            })
        }
    }

    onFocus(event) {
        //обработка события, при котором input получает фокус
        this.setState({
            showOptions: true,
            isSubmitted: false
        })
    }

    handleClickOutside(event) {
        //обработка внешнего клика
        this.setState({
            showOptions: false
        })
    }

    handleSubmit(event) {
        //обработка отправки данных
        event.preventDefault();
        this.setState({
            indexOfMarked: -1,
            showOptions: false,
            isSubmitted: true
        });
    }

    OptionList() {
        //отрисовка списка вариантов
        return (
            <ol className='option-list'>
                {this.state.options.map((item) =>
                    <li onClick={this.onClick} key={item._id} onMouseOver={this.onMouseOver}
                        className={getOptionClassName(item, this.state.options, this.state.indexOfMarked)}
                        id={item._id}>{item.title}</li>
                )}
            </ol>
        );
    }

    FormContent() {
        //отрисовка списка вариантов или информации о фильме по условию
        if (this.state.showOptions && this.state.options.length > 0) {
            return (
                <div className='form-content'>
                    <this.OptionList/>
                </div>
            )
        }
        if (this.state.isSubmitted)
            return (
                <div className='form-content'>
                    <Info item={this.state.selectedItem ? this.state.selectedItem : null}/>
                </div>
            );
        else
            return (<div className='form-content'></div>)
    }

    render() {
        return (
            <form className='form' onSubmit={this.handleSubmit} onKeyDown={this.onKeyPress} onFocus={this.onFocus}>
                <label>Название фильма:</label> < br/>
                <input type='text' value={this.state.value} list={this.props.listName} onChange={this.onChange}/>
                <this.FormContent/>
            </form>
        );
    }
}

function Info(props) {
    //компонент, отвечающий за отображение информации о выбранном фильме
    //props.item -- ссылка на выбранный фильм
    if (props.item)
        return (
            <div className='info'>
                <span>Название: {props.item.title}</span><br/>
                <span>Год: {props.item.year}</span><br/>
                <span>Режиссёр: {props.item.director}</span>
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

function getOptionsList(part) {
    //part -- содержимое поля ввода (должно содержаться в названии фильма)
    //функция фильтрует названия фильмов и возвращает массив подходящих фильмов
    if (films) {
        let str = part.toString().toLowerCase();
        let filteredOptions = [];
        let items = films;
        if (part.length !== 0) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].title.toLowerCase().indexOf(str) >= 0)
                    filteredOptions.push(items[i]);

            }
        }
        return filteredOptions;
    }
    return [];
}

function getIndexOfElement(id, options) {
    //получение индекса элемента с заданным id в массиве options
    for (let i = 0; i < options.length; i++) {
        if (options[i]._id === id)
            return i;
    }
    return -1;
}

function getItemById(id) {
    //получение элемента из базы данных по id
    if (films) {
        let items = films;
        for (let i = 0; i < items.length; i++)
            if (items[i]._id === id)
                return items[i];
    }
    return null;
}

function getItemByTitle(name) {
    //получение элемента из базы данных по названию
    if (films) {
        let items = films;
        for (let i = 0; i < items.length; i++)
            if (items[i].title.toLowerCase().localeCompare(name.toLowerCase()) === 0)
                return items[i];
    }
    return null;
}

function getOptionClassName(item, options, index) {
    //получения названия класса для элемента списка вариантов
    if (index >= 0 && index < options.length)
        if (item._id === options[index]._id)
            return 'option-marked';
    return 'option';
}

export default onClickOutside(Form);