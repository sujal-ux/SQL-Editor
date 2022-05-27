import React, { useState } from 'react'
import categories from './data/categories.json'
import region from './data/regions.json'
import employees from './data/employees.json'
import shippers from './data/shippers.json'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/sql/sql'
import Table from 'react-bootstrap/Table'
import { Controlled as ControlledEditor } from 'react-codemirror2'

export const Editor = (props) => {
    const entities = ["categories", "region", "employees", "shippers"] 

    const {
        language,
        displayName,
    } = props

    const [sql, setSql] = useState('')

    function handleChange (editor, data, value) {
        console.log(editor, data, value)
        setSql(value)
    }

    return (
        <div className = "container-fluid">
            <div className = "row">
                <div className = "col-lg-3 col1">
                    <h4>Entities</h4>
                    <div className="entity-wrapper">
                        {entities.map(entity => {
                            return (
                                <div className = "entity-container">
                                    <span>{entity}</span>
                                    <div className="dropdown">
                                        <div className="dropdown-item">
                                            Hello
                                        </div>
                                        <div className="dropdown-item">
                                            Hello
                                        </div>
                                        <div className="dropdown-item">
                                            Hello
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className = "col-lg-9 col2">
                        <div className = "editor-container">
                            <div className = "editor-title">
                                <h4>{displayName}</h4>
                                <button className="btn btn-primary btn-sm"
                        type="submit">Run</button>
                            </div>
                            <ControlledEditor 
                                onBeforeChange = {handleChange}
                                value = {sql}
                                className = "code-mirror-wrapper"
                                options = {{
                                    mode: language, 
                                    lineWrapping: true,
                                    lint: true,
                                    theme: 'material',
                                    lineNumbers: true
                                }}
                            />
                        </div>
                        <div className = "container-fluid">
                            <h4>Output</h4>
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        {Object.keys(region[0]).map(x =>{
                                            return (
                                                <th>{x}</th>
                                            )
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {region.map(item =>{
                                        return (
                                            <tr>
                                                {Object.keys(item).map(x => {
                                                    return (
                                                        <td>{item[x]}</td>
                                                    )    
                                                })}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </div>
                </div>
            </div>
        </div>
    )
}