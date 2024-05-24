import React from 'react';

export default function RenderFieldInfomation(props) {
    return (
        (props.content || (props.content === 0)) ? <li className="list-group-item">{props.title} : {props.content}</li> : null
    )
}