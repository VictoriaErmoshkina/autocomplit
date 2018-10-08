import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import database from './db.json';

class FilmForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            films: [],
            list: 'films',
            submitted: false
        };

        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onChange(event) {
        let val = event.target.value;
        this.setState({
            title: val,
            films: getFilmsList(val),
            submitted: false,
            doesTitleExist: false
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
            doesTitleExist: this.state.films.length > 0 ? this.state.films[0].title.toLowerCase().localeCompare(this.state.title.toLowerCase()) === 0 : false
        });
    }


    render() {
        return (
            <form className='film-form' onSubmit={this.handleSubmit}>
                <label>Название фильма:</label><br/>
                <input type='text' value={this.state.title} list={this.state.list} onChange={this.onChange}/>
                <FilmOptionList id={this.state.list} films={this.state.films}/>
                <FilmInfo submitted={this.state.submitted}
                          film={this.state.doesTitleExist > 0 ? this.state.films[0] : null}/>
            </form>
        );
    }
}

class FilmOptionList extends React.Component {
    render() {
        return (
            <datalist id={this.props.id}>
                {this.props.films.map((film) => <option key={film.id} value={film.title}></option>)}
            </datalist>
        );
    }
}

class FilmInfo extends React.Component {
    render() {
        if (this.props.submitted) {
            if (this.props.film)
                return (
                    <div className='film-info'>
                        <span>Название: {this.props.film.title}</span><br/>
                        <span>Год: {this.props.film.year}</span><br/>
                        <span>Режиссёр: {this.props.film.director}</span>
                    </div>
                );
            else
                return (
                    <div className='film-info'>
                        <span>Не найден такой фильм</span>
                    </div>
                )
        }
        else
            return (<div className='film-info'></div>);
    }
}



function getFilmsList(part) {
    //search names in json
    let str = part.toLowerCase();
    let filteredFilms = [];
    let films = database.films;
    if (part.length !== 0) {
        for (let i = 0; i < films.length; i++) {
            if (films[i].title.toLowerCase().indexOf(str) === 0)
                filteredFilms.push(films[i]);
        }
    }

    return filteredFilms;
}

ReactDOM.render(
    <FilmForm/>, document.getElementById('root')
);