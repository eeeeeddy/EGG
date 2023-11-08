import React from 'react';
import EggNavbar from './Navbar';

function Pricing() {

    return (
        <div style={{ fontFamily: 'MaruBuri-Regular' }}>
            <div className='Navbar'>
                <EggNavbar />
            </div>

            <div className='main' style={{marginTop:"100px"}}>
                <div className="align-items-center vh-100">
                    <div className='mt-5 me-5'>
                        <p class="fs-1 text-center">Speed up your literature search</p>
                        <p className='text-center'>Skim hundreds of relevant papers in minutes and save days of work</p>
                    </div>

                    <div className="d-flex flex-row justify-content-around mt-5">
                        <div style={{ width: "16em" }}></div> {/* 좌우 여백을 위한 div 태그 */}
                        <div className="">
                            <div className="card" style={{ width: "18em", height: "24em" }}>
                                <div className="card-body text-center">
                                    <h5 className="card-title">KRW 0</h5>
                                    <h3 className='card-usage'>Free</h3>
                                    <hr />
                                    <a href="/" className="btn btn-success rounded-pill">Sign Up</a>
                                    <p className="card-text mt-3">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <ul>
                                        <li className='text-start'>5 graphs per month</li>
                                        <li className='text-start'>All features included</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="a">
                            <div className="card" style={{ width: "18em", height: "24em" }}>
                                <div className="card-body text-center">
                                    <h5 className="card-title">KRW 5000 / month</h5>
                                    <h3 className='card-usage'>Academic</h3>
                                    <hr />
                                    <a href="/" className="btn btn-success rounded-pill">Sign Up</a> <br />
                                    <p className="card-text mt-3">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <ul>
                                        <li className='text-start'>Unlimited graphs</li>
                                        <li className='text-start'>All features included</li>
                                        <li className='text-start'>For academics, non-profits and personal use</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="a">
                            <div className="card" style={{ width: "18em", height: "24em" }}>
                                <div className="card-body text-center">
                                    <h5 className="card-title">KRW 14000 / month</h5>
                                    <h3 className='card-usage'>Business</h3>
                                    <hr />
                                    <a href="/" className="btn btn-success rounded-pill">Sign Up</a> <br />
                                    <p className="card-text mt-3">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <ul>
                                        <li className='text-start'>Unlimited graphs</li>
                                        <li className='text-start'>All features included</li>
                                        <li className='text-start'>For business and industry</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: "16em" }}></div> {/* 좌우 여백을 위한 div 태그 */}
                    </div>

                    <div className='w-50 mt-5 mx-auto'>
                        <h1>Upgrade to Premium</h1>
                        <p>Unlock unlimited graphs by joining the Academic or Business plans.</p> <br />
                        <p>We support all payment methods including credit/debit cards, PayPal, Alipay, wire transfers and many others. We use automatic renewal but you can cancel the subscription at any time.</p>
                        <p>To learn more, read our announcement blog post.</p>
                        <br />
                        <h3>All plans include</h3>
                        <ul>
                            <li>Connected Papers similarity graphs</li>
                            <li>Prior and derivative works</li>
                            <li>Multi-origin graphs</li>
                            <li>Saved papers</li>
                            <li>Graph history</li>
                        </ul>
                        <br /><br />
                    </div>
                </div>
            </div>

        </div>
    );
}
export default Pricing;