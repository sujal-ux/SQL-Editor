import React, { useState } from 'react'
import { useRef, useEffect } from 'react'
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
    // Entities column resize
    const ref = useRef(null);
    const refRight = useRef(null);
    
    useEffect(() => {
        const resizeableEle = ref.current;
        if(resizeableEle===null)
            return;
        const styles = window.getComputedStyle(resizeableEle);
        let width = parseInt(styles.width, 10);
        // let height = parseInt(styles.height, 10);
        let x = 0;
        
        resizeableEle.style.top = "50px";
        resizeableEle.style.left = "50px";

        // resizer
        const onMouseMoveRightResize=(event)=>{
            const dx = event.clientX-x;
            x = event.clientX;
            width = width + dx;
            resizeableEle.style.width = `${width}px`
        }

        const onMouseUpRightResize = (event)=>{
            document.removeEventListener("mousemove", onMouseMoveRightResize);
        }

        const onMouseDownRightResize=(event)=>{
            x = event.clientX;
            resizeableEle.style.left = styles.left;
            resizeableEle.style.right = null;
            document.addEventListener("mousemove", onMouseMoveRightResize);
            document.addEventListener("mouseup", onMouseUpRightResize);
        } 

        // Mouse down event listener
        const resizerRight = refRight.current;
        resizerRight.addEventListener("mousedown", onMouseDownRightResize); 

        return () => {
            resizerRight.removeEventListener("mousedown", onMouseDownRightResize);
        }
    }, [])
    

    const entities = ["categories", "region", "employees", "shippers"] 
    const entData = {"categories": categories, "region": region, "employees": employees, "shippers": shippers}

    const {
        language,
        displayName,
    } = props

    const [sql, setSql] = useState('')
    const [dd, setdd] = useState('')
    const [cols, setCols] = useState([])
    const [flag, setFlag] = useState(0)


    function handleDD (event) {
        var val = event.target.dataset.value
        setQuery(val)
        if(dd===val) {
            setdd('')
        }
        else {
            console.log(val)
            setdd(val)
        }
    }

    function setQuery (val) {
        setSql("select * from " + val)
        setCols([]);
    }

    function handleChange (editor, data, value) {
        console.log(editor, data, value)
        setSql(value)
    }

    function updQuery (event) {
        var val = event.target.innerText
        var tmp = [...cols]
        if(!tmp.includes(val))
            tmp.push(val)
        else {
            tmp = tmp.filter((e)=>{
                return e!==val;
            })
        }
        setCols(tmp)
        if(tmp.length===0)
            setQuery(dd)
        else
            setSql("select "+tmp.join(', ')+" from "+dd)
    }

    function runQuery() {
        if(sql==='')
            alert("Kindly enter Query first");
        else {
            if(flag===0)
                setFlag(1);
            else
                setFlag(0);
        }
    }

    return (
        <div className = "container-fluid">
            <div className = "row">
                <div ref = {refRight} className = "col-lg-3 col1">
                    <h4>Entities</h4>
                    <div className="entity-wrapper">
                        {entities.map(entity => {
                            return (
                                <div className = "entity-container">
                                    <i className="fas fa-file"></i><span><a data-value={entity} 
                                    onClick={handleDD}>{entity}</a></span>
                                    <div className={(dd===entity)? "droppedDown":"dropdown"}>
                                        {Object.keys(entData[entity][0]).map(x=>{
                                            return (
                                                <div className="dropdown-item" onClick={updQuery}>{x}</div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="resizeable"></div>
                </div>
                <div className = "col-lg-9 col2">
                        <div className = "editor-container">
                            <div className = "editor-title">
                                <h4>{displayName}</h4>
                                <button className="btn btn-primary btn-sm"
                            onClick={runQuery}>Run</button>
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
                            {(flag===0 || dd==='')? "Kindly enter a query": 
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        {Object.keys(entData[dd][0]).map(x =>{
                                            return (
                                                <th>{x}</th>
                                            )
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {entData[dd].map(item =>{
                                        return (
                                            <tr>
                                                {Object.keys(item).map(x => {
                                                    return (
                                                        <td>{item[x]}</td>
                                                    )    
                                                })}
                                            </tr>
                                        )
                                    })
                                    }
                                </tbody>
                            </Table>
                            }
                        </div>
                </div>
            </div>
        </div>
    )
}