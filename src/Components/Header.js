import React from 'react'
import logo from './Atlan-logo-full.svg'
export const Header = () => {
    return (
        <div>
            <nav className="navbar navbar-inverse">
            <div className="container-fluid">
                <div className="navbar-header">
                    <a href="https://atlan.com/"><img src = {logo} alt="logo"/></a>
                    <div className = "navbar-brand name">
                        <div className="mainT">AtSql</div>&nbsp;- Online SQL Editor
                    </div>
                </div>
                
            </div>
            </nav>
        </div>
    )
}