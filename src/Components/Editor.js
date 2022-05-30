import React, { useState } from 'react'
import { useRef, useEffect } from 'react'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import categories from './data/categories.json'
import region from './data/regions.json'
import shippers from './data/shippers.json'
import customers from './data/customers.json'
import order_details from './data/order_details.json'
import suppliers from './data/suppliers.json'
import territories from './data/territories.json'
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
    

    const entities = ["categories", "customers", "order_details", "region", "shippers", "suppliers", "territories"] 
    const entData = {"categories": categories, "customers": customers, "order_details": order_details, 
    "region": region, "shippers": shippers, "suppliers": suppliers, "territories": territories}

    const {
        language,
        displayName,
    } = props

    const [sql, setSql] = useState('select * from categories')
    const [dd, setdd] = useState('')
    const [dd2, setdd2] = useState('')
    const [cols, setCols] = useState([])
    const [cols2, setCols2] = useState([])

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

    function runQuery() {
        var value = sql;
        if(value==='')
            alert("Kindly enter Query first")
        else {
            value = value.replace("select ", "");
            value = value.split("from");
            if(value.length!==2)
                return;

            value[0] = value[0].trim();
            value[1] = value[1].trim();
            var ent = value[1];
            var colArr=value[0].split(',').map(x=>x.trim());
            if(colArr.length===1 && colArr[0]==="*") 
                colArr = [];
            console.log(colArr);

            if(!entities.includes(ent)) {
                return;
            }
        
            var actCols = Object.keys(entData[ent][0]);
            var idx, check = 1;

            for(idx = 0; idx<colArr.length;idx++) {
                check &= actCols.includes(colArr[idx]);
            }
            
            if(!check) {
                console.log('Column names cannot be found in the mentioned entity');
                return;
            }


            setCols(colArr);
            setdd(ent);
            setCols2(colArr);
            setdd2(ent);
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
                                    {/* <i className="fa fa-angle-right"></i> */}
                                    <i className="fas fa-folder"></i><span>
                                        <a data-value={entity} onClick={handleDD}>{entity}</a></span>
                                    <div className={(dd===entity)? "droppedDown":"dropdown"}>
                                        {Object.keys(entData[entity][0]).map(x=>{
                                            return (
                                                <div className="dropdown-item" onClick={updQuery}><i className="fas fa-file"></i>{x}</div>
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
                        <div className = "container-fluid outputBox">
                            <h4>Output</h4> 
                            {(dd2==='')? 
                                <div className="text">
                                    Click <b>"Run"</b> to execute the SQL statement above.<br/><br/>
                                    The menu to the left displays the database, from which entities can be chosen.<br/><br/>
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