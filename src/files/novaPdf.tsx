import React, { Component } from 'react';
    
    class NovaPdf extends Component {
    
      render() {
    
        return (
          <div className="App">
            <a href={require('E:/souheila/projetidk/nova/src/files/Nova1Pager.pdf')} target="_blank">Download Pdf</a>
          </div>
        );
      }
    }
    
    export default NovaPdf;