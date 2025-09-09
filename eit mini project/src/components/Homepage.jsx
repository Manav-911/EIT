import { useState } from 'react'
import Marquee from "react-fast-marquee";
import {Link} from 'react-router-dom';
import Tryon from '../../../bigShopping/src/App'
import '../css/Homepage.css'

function Homepage() {

  const [glow, setGlow] = useState(false);

  const handleMouseEnter = () => {
    setGlow(true);
  }
  const handleMouseLeave = () => {
    setGlow(false);
  }

  return (
    <div>

      <div>
        <div className='slidingimage'>
          <div className='bgwhite'>
            <Link to="/buypage">
              <img src="Laptop.jpg" className='bgwhiteimage'>
              </img>
            </Link>
          </div>
          <div className='bgwhite'>
            <img src="Laptop3.jpg" className='bgwhiteimage'></img>
          </div>
          <div className='bgwhite'>
            <img src="Laptop4.jpg" className='bgwhiteimage'></img>
          </div>
          <div className='linever'>
          </div>
          
          <div className={`tryonbgblack ${glow ? 'whiteglow' : ''}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Link to="/Tryon">
            <div className='tryonbgwhite'>
              <img src='shirt5.jpg' style={{height:'100px', marginLeft:'25%', marginTop:'7.5%'}}></img>
            </div>
            
            <h1 style={{color:'white', textAlign:'center'}}>'Try on'</h1>
            </Link>
          </div>
          
        </div>
      </div>

      <div>
        <h1 style={{paddingLeft:'2%', paddingTop:'1%', paddingBottom:'1%'}}>Today Deals</h1>
        <div className='linehor'></div>
        <div>
          <div style={{display:'flex'}}>
            <img src='shirt1.jpg' className='imgstyle'></img>
            <div className='lineverdown'></div>
            <img src='shirt2.jpg' className='imgstyle'></img>
            <div className='lineverdown'></div>
            <img src='shirt3.jpg' className='imgstyle'></img>
            <div className='lineverdown'></div>
            <img src='shirt4.jpg' className='imgstyle'></img>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Homepage;
