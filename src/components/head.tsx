import React from 'react'
import './head.css'

import LogoName from '../images/logoName.png'
import { Navbar, NavDropdown, Nav } from 'react-bootstrap'



function Head() {
    return (



        <div className="header">
            <div className="">
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Navbar.Brand href="/#/">  <img src={LogoName} alt="#" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link className="navlink" href="#/Swap">SWAP</Nav.Link>
                            <Nav.Link  className="navlink" href="#/Earn">Yield</Nav.Link>
                            <Nav.Link  className="navlink" href="#/Bonus">BONUS</Nav.Link>
                            
                            {/* <Nav.Link  className="navlink" href="#/Earn1">Earn1</Nav.Link> */}
                           {/*   <Nav.Link  className="navlink" href="#/Earn2">Earn2</Nav.Link> */}
                             
                           
                        </Nav>
                        <Nav>
                           {/*  <Nav.Link href="#deets">More deets</Nav.Link>
                           <NavDropdown className="navlink" title="More" id="collasible-nav-dropdown">
                                <NavDropdown.Item href="#/Bonus">Bonus</NavDropdown.Item>
                                <NavDropdown.Item href="#/Earn">Earn</NavDropdown.Item>
                                <NavDropdown.Item href="#/Earn2">Earn2</NavDropdown.Item>
                                <NavDropdown.Divider />
                              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item> 
                            </NavDropdown> */}
                            <Nav.Link  className="navlink" eventKey={2} href={require('../files/NovaFinanceSpecifications.pdf')} target = "_blank">
                                About
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        </div>



    );
}
export default Head 