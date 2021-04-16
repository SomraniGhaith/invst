import React from 'react'
import "./about.css"
import Head from '../components/head'
function About() {
    return (

        <div>
            <div className="main-layout inner_page">
                <Head />

                <div className="container-fluid" id="wrapper">


                    <aside id="sidebar-wrapper">
                        <ul className="sidebar-nav">
                            <li className="active">
                                <a href="#intro">

                                    <span>Introduction</span>
                                </a>
                            </li>
                            <li>
                                <a href="#">

                                    <span>Products</span>
                                </a>
                            </li>
                            <li>
                                <a href="#">

                                    <span>CREED ($CREED)</span>
                                </a>
                            </li>
                        </ul>
                    </aside>


                    <div id="page-content-wrapper">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-10">

                                    <div className="container">

                                        <h1 className="mb-3">Introduction</h1>
                                        <p className="text-muted mb-3"> Introduction to CREED protocol</p>
                                        <hr />

                                        <blockquote>
                                            <p> "This document is s till being worked on ."</p>
                                            <p>" This project is in beta.Please do enough research and use at your own risks." </p>
                                        </blockquote>
                                        <hr />
                                        <h1 className="mb-3">what is Decentralized Finance a.k.a DeFi?</h1>
                                        <p> Decentralized Finance, also known as DeFi, refers to an ecosystem of financial applications that are built on top of blockchain network. In other words, DeFi provides financial services to users through smart intermdiaires
                                        such as investement funds, or any other financial institutions using blockchain technology.
                            </p>
                                        <p> The total value of the staked assets in DeFi recorded ab all-time high of $3.68B by July 2020. As the DeFi field became the issue of 2020 summer, there have been hundreds of DeFi projects created and introduced to the public.
                                        THe introduction of new and technologically advanced DeFi projects may confuse the public about how and what platform to use to grow their portfolio.
                            </p>
                                        <hr />
                                        <h1 className="mb-3">What is CREED.finance?</h1>
                                        <p> CREED is an exprimental protocol on the Ethereum blockchain...</p>

                                    </div>


                                </div>
                                <div className="col-sm-2"></div>
                            </div>
                        </div>
                    </div>
                </div></div>
        </div>

    );
}
export default About;