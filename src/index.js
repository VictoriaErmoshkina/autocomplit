import React from 'react';
import ReactDOM from 'react-dom';
import Form from './form'

ReactDOM.render(
    //отрисовка формы с автодополнением в основном html-документе
    <Form listName='films'/>, document.getElementById('root')
);