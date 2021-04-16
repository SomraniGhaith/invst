import React ,{useRef, useEffect} from 'react'
import WebViewer from '@pdftron/webviewer'


function readpdf() {
    const viewerDiv = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        WebViewer({ path : 'lib'
         , initialDoc : 'E:\souheila\ProjectAmin\Nova\nova-finance-react\src\files\Nova1Pager.pdf'}, 
         viewerDiv.current as HTMLDivElement).then(instance => {

         } )

    } , []);
    return (
      <div className='App' >
          <div className = "WebViewer"  ref = {viewerDiv} > </div>
  
        
  
  
  
      </div>
    );
  }
  
  export default readpdf;
  