import React, { useState, useEffect } from 'react'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/sql/sql'

import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Table from 'react-bootstrap/Table'
import { Controlled as ControlledEditor } from 'react-codemirror2'

import categories from './data/categories.json'
import shippers from './data/shippers.json'
import customers from './data/customers.json'
import order_details from './data/order_details.json'
import suppliers from './data/suppliers.json'
import territories from './data/territories.json'

export const Editor = (props) => {
    const entities = ["categories", "customers", "order_details", "shippers", "suppliers", "territories"] 
    const entData = {"categories": categories, "customers": customers, "order_details": order_details, 
                    "shippers": shippers, "suppliers": suppliers, "territories": territories}


    const [sql, setSql] = useState("select * from categories")
    const [dd, setdd] = useState('')
    const [dd2, setdd2] = useState('')
    const [cols, setCols] = useState([])
    const [cols2, setCols2] = useState([])
    const [idx, setIdx] = useState(0)
    const [tabData, setData] = useState(["", "", "", "", ""])

    useEffect(()=>{
        var tmp = [...tabData]
        tmp[idx] = sql
        setData(tmp)
    }, [sql])

    useEffect(()=> {
        setSql(tabData[idx])
        runQuery(tabData[idx])
    }, [idx])

    function handleDD (event) {
        var val = event.target.dataset.value
        setQuery(val)
        if(dd===val) 
            setdd('')
        else 
            setdd(val)
    }

    function setQuery (val) {
        setSql("select * from " + val)
        setCols([]);
    }

    function handleChange (editor, data, value) {
        setSql(value) 
    }

    function updQuery (event) {
        var val = event.target.innerText
        var tmp = [...cols]
        if(!tmp.includes(val))
            tmp.push(val)
        else {
            tmp = tmp.filter((e)=>{
                return e!==val
            })
        }
        setCols(tmp)
        if(tmp.length===0)
            setQuery(dd)
        else
            setSql("select "+tmp.join(', ')+" from "+dd)
    }

    function handleTab (event) {
        var tmpIDX = parseInt(event.target.dataset.rrUiEventKey)
        setIdx(tmpIDX)        
    }

    function runQuery(arg) {
        var value = (typeof(arg)==='string')? arg : sql;
        value = value.replace("select ", "");
        value = value.split(" from ");
        if(value.length!==2) {
            setCols([])
            setdd("")
            return;
        }
        value[0] = value[0].trim();
        value[1] = value[1].trim();
        var ent = value[1];
        var colArr=value[0].split(',').map(x=>x.trim());
        if(colArr.length===1 && colArr[0]==="*") 
            colArr = [];

        if(!entities.includes(ent)) {
            setCols([])
            setdd("")
            return;
        }
    
        var actCols = Object.keys(entData[ent][0]);
        var idx, check = 1;

        for(idx = 0; idx<colArr.length;idx++) {
            check &= actCols.includes(colArr[idx]);
        }
        
        if(!check) {
            setCols([])
            setdd("")
            return;
        }

        setCols(colArr);
        setdd(ent);
        setCols2(colArr);
        setdd2(ent);
    }

    return (
        <div className = "container-fluid">
            <div className = "row">
                <div className = "col-lg-2 col1">
                    <h4>Entities</h4>
                    <div className="entity-wrapper">
                        {entities.map(entity => {
                            return (
                                <div className = "entity-container">
                                    <div className = {(dd===entity)? "bgChange entHead":"entHead"}>
                                        <i className="fa fa-angle-right rightIcon"></i>
                                        <i className="fas fa-folder"></i><span>
                                        <a data-value={entity} onClick={handleDD}>{entity}</a></span>
                                    </div>
                                    <div className={(dd===entity)? "droppedDown":"dropdown"}>
                                        {Object.keys(entData[entity][0]).map(x=>{
                                            return (
                                                <div className={(cols.includes(x))?"dropdown-item bgChange": "dropdown-item"} onClick={updQuery}><i className="fas fa-file"></i>{x}</div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className = "col-lg-10 col2">
                        <div className = "editor-container">
                            <div className = "editor-title">
                                <Tabs defaultActiveKey='0' transition={false} onClick={handleTab}>
                                    {tabData.map((x, i)=> {
                                        return (
                                                <Tab eventKey={i} title={<div className="tabIcon">
                                                    <i className="fa fa-code"></i>Query #{i}</div>}></Tab>
                                        )
                                    })}
                                </Tabs>
                                <button className="btn btn-primary btn-sm" onClick={runQuery}>Run</button>
                            </div>
                            <ControlledEditor 
                                onBeforeChange = {handleChange}
                                value = {sql}
                                className = "code-mirror-wrapper"
                                options = {{
                                    mode: props.language, 
                                    lineWrapping: true,
                                    lint: true,
                                    theme: 'material',
                                    lineNumbers: true
                                }}
                            />
                        </div>
                        <div className = "container-fluid outputBox">
                            <h4>Output</h4>
                            <div className="tableBox"> 
                            {(dd2==='')? 
                                <div className="text">
                                    Click <b>"Run"</b> to execute the SQL statement above.<br/><br/>
                                    The menu on the left displays the database, from which entities can be chosen.<br/><br/>
                                    SQL queries can be entered directly in the input box, or <br/>
                                    clicking on the entities and columns also fills the input box with required query 
                                </div> : 
                                <Table striped bordered hover variant="dark">
                                    <thead>
                                        <tr>
                                            {Object.keys(entData[dd2][0]).map(x =>{
                                                return (cols2.includes(x) || cols2.length===0)? (
                                                    <th>{x}</th>
                                                ): null;
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entData[dd2].map(item =>{
                                            return (
                                                <tr>
                                                    {Object.keys(item).map(x => {
                                                        return (cols2.includes(x) || cols2.length===0)? (
                                                            <td>{item[x]}</td>
                                                        ): null;    
                                                    })}
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                                }
                            </div>
                        </div>
                </div>
            </div>
        </div>
    )
}