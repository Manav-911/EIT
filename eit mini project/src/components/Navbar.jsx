import React from 'react' 
import { VscAccount } from "react-icons/vsc";
import { FaShoppingCart } from "react-icons/fa";
import '../css/Navbar.css'

function Navbar(){
    return(
        <div className='navbarbg'>
            <img src="/Par-Mart.png" style={{margin:'5px', marginLeft:'50px', cursor:'pointer'}}/>

            {/* Search bar */}
            <div className='searchbar'>
                <input type='text' placeholder='Search...' className='searchbar-input' />
                <div className='searchbarblackbox'>
                    <p style={{color:'white', paddingLeft:'5%', letterSpacing:'7px', fontSize:'30px'}}><b>Search</b></p>
                </div>
            </div>

            {/* Icons */}
            <VscAccount className='iconstyle'/>
            <FaShoppingCart className='iconstyle' style={{marginLeft:'5px'}}/>
            <p style={{color:'white', position:'relative', top:'20px', marginLeft:'15px', fontSize:'30px', cursor:'pointer'}}>Profile</p>

        </div>
    )
}

export default Navbar;