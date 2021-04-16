
import React, { useRef, useEffect} from 'react';


import logoBrand from "../images/logo-brand.png"





function Templanding() {

    return (
        <div>
            <header>
                <nav className="navbar navbar-dark bg-dark justify-content-end">


                    {/* Creation d'un Button export d'un fichier pdf  */}

                    <button className="btn btn-outline-dark my-2 my-sm-0  text-light " ><a  href={require('../files/Nova1Pager.pdf')} target = "_blank" style={{ color: "white" }}>View our 1 Pager</a></button>



                </nav>
            </header>
            <section className="pt-5 pb-5 mt-0 align-items-center d-flex bg-dark" style={{ height: "100vh " }}>

                <div className="container-fluid">
                    <div className="row  justify-content-center align-items-center d-flex text-center h-100">
                        <div className="col-12 col-md-8  h-50 ">
                            <h1 className="display-2  text-light mb-2 mt-2"><img src={logoBrand} /> </h1>

                            <h1 className="text-light mb-2 ">Yield and Exchange Assets of the Future</h1>

                            <div className="landing-button">
                                <a href="#" className="btn btn-outline-dark text-light btn-lg mb-2">NovaSwap <p>Coming Soon</p> </a>
                                <a href="#" className="btn btn-outline-dark  text-light btn-lg mb-2"> NovaYield <p>Coming Soon </p> </a>
                                <a href="#" className="btn btn-outline-dark text-light  btn-lg mb-2"> NovaDex <p>Coming Soon </p></a>
                            </div>

                            <form method="get" action="mailto:team@novafinance.app?subject=Example+subject&body=Message+text">

                                <button className="btn btn-outline-dark shadow-lg btn-round text-light btn-lg">Contact us: team@novafinance.app</button>
                            </form>


                        </div>

                    </div>
                </div>
            </section>





        </div >

    );

}
export default Templanding;
