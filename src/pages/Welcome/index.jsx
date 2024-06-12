import React from 'react';
import {Card} from "antd";
import {LinkedinFilled, MailFilled, PhoneFilled} from "@ant-design/icons";

const Welcome = () => {

    return (
        <Card>
            <div style={{padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'left'}}>
                <h1 style={{textAlign: 'center'}}>Welcome to the Online Valuation Tool for Venture Capital and Private
                    Equity Deals</h1>
                <p>
                    This platform provides a comprehensive and accessible solution for MBA and BBA students to compute
                    the valuation of various securities associated with venture capital and private equity transactions.
                    Originally created by Professor Klaas Baks from Emory University's Goizueta Business School, this
                    tool has been meticulously converted from an Excel-based model into an intuitive online interface.
                    Our goal is to offer an alternative resource for students who may not have access to Excel,
                    enhancing their learning experience in financial valuation.
                </p>
                <br/>

                <h2 style={{textAlign: 'center'}}>About the Tool</h2>
                <p>
                    This tool enables users to calculate valuations for a wide range of securities commonly encountered
                    in venture capital and private equity deals. By leveraging this platform, students can:
                </p>
                <ul style={{textAlign: 'left'}}>
                    <li><strong>Understand Deal Structures:</strong> Gain insights into the financial and economic
                        frameworks used in private equity transactions.
                    </li>
                    <li><strong>Perform Accurate Valuations:</strong> Utilize sophisticated models to assess the value
                        of different securities.
                    </li>
                    <li><strong>Enhance Practical Skills:</strong> Apply theoretical knowledge in a practical, hands-on
                        environment.
                    </li>
                </ul>
                <br/>

                <h2 style={{textAlign: 'center'}}>Course Context</h2>
                <p>
                    This online valuation tool is an integral part of the Venture Capital & Private Equity course (FIN
                    428B/681) taught by Professor Klaas Baks. The course is designed to equip students with the
                    necessary skills and knowledge to thrive in the private equity industry. It covers:
                </p>
                <ul>
                    <li>The organization and strategies of private equity funds.</li>
                    <li>Basic and advanced types of private equity transactions.</li>
                    <li>Transactions involving options and hybrid financing structures.</li>
                </ul>
                <br/>

                <h2 style={{textAlign: 'center'}}>Acknowledgments</h2>
                <p>
                    We extend our heartfelt gratitude to Professor Klaas Baks for his invaluable contribution to this
                    tool. Professor Baks is a renowned expert in the field of alternative investments, with a
                    distinguished career that spans academia and industry. His dedication to advancing the education of
                    future finance professionals has been instrumental in the creation of this tool.
                </p>
                <p>
                    For more information on Professor Klaas Baks and his work, please visit his <a
                    href="https://www.linkedin.com/in/klaasbaks" target="_blank"
                    rel="noopener noreferrer">LinkedIn</a> or <a href="http://klaasbaks.com" target="_blank"
                                                                 rel="noopener noreferrer">personal website</a>.
                </p>
                <p>
                    We hope this tool will become an essential resource in your educational journey, helping you to
                    master the complexities of venture capital and private equity valuations.
                </p>
                <p>Feel free to explore the features of the tool and enhance your financial valuation skills today!</p>
                <p>If you need any assistance or have questions, please don't hesitate to contact us.</p>

                <h2 style={{textAlign: 'center'}}>Contact Information</h2>
                <p style={{textAlign: 'center'}}>For any queries or support, please reach out to:</p>
                <br/>
                <p style={{textAlign: 'center'}}>
                    <strong>Kevin Liu</strong><br/>
                    MBA, Class of 2024 <br/>
                    Goizueta Business School, Emory University<br/>
                    <MailFilled style={{marginRight: 5}}/> Email: <a
                    href="mailto:kevinliucm@gmail.com">kevinliucm@gmail.com</a><br/>
                    <PhoneFilled style={{marginRight: 5}}/>Cell: (626)329-7891<br/>
                    <LinkedinFilled style={{marginRight: 5}}/><a href="https://www.linkedin.com/in/kevinliucm"
                                                                 target="_blank"
                                                                 rel="noopener noreferrer">https://www.linkedin.com/in/kevinliucm</a><br/>
                    <a href="https://github.com/sunboyoo/vcpe-deal-valuation" target="_blank" rel="noreferrer">
                        <img src="https://img.shields.io/github/stars/sunboyoo/vcpe-deal-valuation?style=social"
                             alt="Star on GitHub"/>
                    </a> <br/>
                    <a href="https://github.com/sunboyoo/vcpe-deal-valuation/issues/new" target="_blank"
                       rel="noreferrer">
                        <img src="https://img.shields.io/badge/Report%20an%20Issue-Click%20Here-brightgreen"
                             alt="Report an Issue"/>
                    </a>
                </p>
                <br/>
                <p style={{textAlign: 'center'}}>
                    <strong>Professor Klaas P. Baks, PhD</strong><br/>
                    <MailFilled style={{marginRight: 5}}/>Email: <a
                    href="mailto:emoryprof@listserv.cc.emory.edu">emoryprof@listserv.cc.emory.edu</a><br/>
                    Office: GBS 506, Goizueta Business School, Emory University<br/>
                    Office Hours: <a href="https://calendly.com/baks/office-hours" target="_blank"
                                     rel="noopener noreferrer">Schedule an Appointment</a>
                </p>

            </div>
        </Card>
    );
};

export default Welcome;
