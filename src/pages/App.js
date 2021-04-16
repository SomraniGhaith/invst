import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

export default class InvestForm extends React.Component {



  render() {
    return (
        < div style={{
          backgroundColor: '#0d151f',
          color: 'azure',
          fontFamily:'Google Sans',
          

        }}>
<Navbar bg="#0d151f" variant="dark">
    <Navbar.Brand href="#home">
      <img
        alt=""
        src="novalogo.svg"
        width="30"
        height="30"
        className="d-inline-block align-top"
      />{" "}
      Token:HiZil
    </Navbar.Brand>
    <Navbar.Toggle />
  <Navbar.Collapse className="justify-content-end">
    <Navbar.Text>
     <a href="#">WhitePaper</a>
    </Navbar.Text>
  </Navbar.Collapse>
  </Navbar>
  <div style={{fontFamily:'Google Sans' ,fontSize : '150%',}}>
  <Container >
  <Row>
    <Col sm={6}>
      <Card  className="bg-dark text-white text-center" >
        <Card.Header className="text-center">Protocol name</Card.Header>
        <Card.Body>
           <Card.Text>
           HiZil Swap
         </Card.Text>
      </Card.Body>
      </Card>
    </Col>
    <Col sm={6}>
      <Card  className="bg-white text-dark text-center" >
        <Card.Header className="text-center">Token name : HIZ</Card.Header>
        <Card.Body>
           <Card.Text>
           <Row>
           <Col sm="6"> <Button variant="outline-dark" onClick={window.zilPay.wallet.connect()} block > Connect Zilliqa</Button></Col>
           <Col sm="6"> <Button variant="outline-dark"  block > Connect ethereum</Button></Col>
           </Row>
         </Card.Text>
      </Card.Body>
      </Card></Col>
  </Row>
  <Row>&nbsp;</Row>
  </Container>
  <Container>

  <Row>
  <Col sm={6}>
      <Card  className="bg-dark text-white text-center" >
        <Card.Header className="text-center ">MAX Supply </Card.Header>
        <Card.Body>
           <Card.Text>
           200.000.000 tokens
         </Card.Text>
      </Card.Body>
      </Card>
    </Col>
    <Col sm={6}>
      <Card  className="bg-white text-dark text-center " >
        <Card.Header className="text-center">Balance  </Card.Header>
        <Card.Body>
           <Card.Text>
           <Row>
             <Col sm="8"> <input type="Text"/></Col>
             <Col sm="4"> <Button variant="outline-dark" size="lg"> Buy Token!</Button></Col>
           </Row>

         </Card.Text>
      </Card.Body>
      </Card></Col>
  </Row>
  <Row>&nbsp;</Row>
  <Row>
  
  <Col sm={4}> <Card  className="bg-dark text-white text-center" >
        <Card.Header className="text-center">Circulating supply</Card.Header>
        <Card.Body>
           <Card.Text>
           20.000.000
         </Card.Text>
      </Card.Body>
      </Card></Col>
  <Col sm={4}> <Card  className="bg-dark text-white text-center" >
        <Card.Header className="text-center">Seed sale </Card.Header>
        <Card.Body>
           <Card.Text>
           10.000.000
         </Card.Text>
      </Card.Body>
      </Card></Col>
  <Col sm={4}> <Card  className="bg-dark text-white text-center" >
        <Card.Header className="text-center">Public sale </Card.Header>
        <Card.Body>
           <Card.Text>
           10.000.000
         </Card.Text>
      </Card.Body>
      </Card></Col>
  </Row>
</Container>
   
  
  </div>

        
       
</div>
       
    );
  }
}


