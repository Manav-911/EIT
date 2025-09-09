import React, { useState } from 'react';
import '../css/Buypage.css';

function Buypage() {
    const [quantity, setQuantity] = useState(1); 
    const [address, setAddress] = useState(""); 
    const [payment, setPayment] = useState(""); 

    const handleIncrease = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    const handleAddToCart = (itemName) => {
        alert(`${itemName} added to cart with quantity: ${quantity}\nAddress: ${address || "Not Selected"}\nPayment: ${payment || "Not Selected"}`);
    };

    return (
        <div style={{ display: 'flex', height:'85vh'}}>
            <img src="design.png" style={{position:'absolute', zIndex:'-1', transform: 'rotate(90deg)', right:'75%', top:'20%'}}></img>
            
            <div style={{marginLeft:'3%', marginTop:'3%', width:'30%'}}>
                <img src="Laptop.jpg" style={{ marginTop: '5%', marginLeft: '5%', width: '100%', display: 'block', boxShadow: '-10px 15px 10px 5px grey' }}/>
                <h1 style={{ marginTop: '10%'}}>Lena-woh L3770 i7 GG9811</h1>
                <div style={{ display: 'flex', marginTop: '2%', marginLeft: '5%', gap: '30%' }}>
                    <h2>68000/-</h2>
                    <h2>MRP: 79000/-</h2>
                </div>
                <h1 style={{ marginTop: '1%', marginLeft: '4%', whiteSpace: 'nowrap' }}>
                    Seller: Lena-woh Laptops
                </h1>
            </div>

            <div className='verticallineleft'></div>

            <div style={{marginTop:'5%', marginLeft:'5%'}}>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <h1>Quantity:</h1>
                    <button onClick={handleDecrease} style={{padding:'5px 10px'}}> - </button>
                    <div className='selectbox'>{quantity}</div>
                    <button onClick={handleIncrease} style={{padding:'5px 10px'}}> + </button>
                </div>

                <div style={{display:'flex', marginTop:'10%'}}>
                    <h1>Promo code:</h1>
                    <input type='text' className='selectbox'/>
                </div>

                <div style={{display:'flex', marginTop:'10%', alignItems:'center', gap:'10px'}}>
                    <h1>Address:</h1>
                    <select 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        className='selectbox'
                    >
                        <option value="">Select your address</option>
                        <option value="Home">M-10, Big Society, Thane</option>
                        <option value="Office">Cool Chemical Company, Chembur</option>
                        <option value="College">SBMP and COE, Vile Parle</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div style={{display:'flex', marginTop:'10%', alignItems:'center', gap:'10px'}}>
                    <h1>Payment:</h1>
                    <select 
                        value={payment} 
                        onChange={(e) => setPayment(e.target.value)} 
                        className='selectbox'
                    >
                        <option value="">Type of payment</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="UPI">UPI</option>
                        <option value="Net Banking">Net Banking</option>
                        <option value="Cash on Delivery">Cash on Delivery</option>
                    </select>
                </div>

                <button 
                    onClick={() => handleAddToCart("Lena-woh L3770 i7 GG9811")}
                    style={{marginLeft:'30%', marginTop:'10%', backgroundColor:'#05002F', width:'200px', height:'50px', borderRadius:'50px', alignContent:'center', color:'white', fontWeight:'bold', cursor:'pointer'}}
                >
                    Add to cart
                </button>
            </div>

            <div className='verticallineright'></div>

            <div>
                <h1>More items for you</h1>
                <div style={{display:'flex', marginTop:'5%'}}>
                    <img src="Laptop3.jpg" style={{marginLeft: '5%', width: '50%', display: 'block', boxShadow: '-10px 1px 10px 1px grey' }}/>
                    <div>
                        <h1 style={{marginLeft:'15%'}}>YoussR SVT38</h1>
                        <div style={{display:'flex', marginTop:'10%'}}>
                            <h4>45000/-</h4>
                            <h4 style={{marginLeft:'50%'}}>MRP: 55000/-</h4>
                        </div>
                        <h3 style={{marginTop:'10%'}}>Seller:- JS Industries</h3>
                        <button 
                            onClick={() => handleAddToCart("YouR SVT38")} 
                            style={{marginLeft:'10%' , marginTop:'10%', backgroundColor:'#05002F', width:'80%', height:'50px', borderRadius:'50px', alignContent:'center', color:'white', fontWeight:'bold', cursor:'pointer'}}
                        >
                            Add to cart +
                        </button>
                    </div>
                </div>

                <div style={{display:'flex', marginTop:'5%'}}>
                    <img src="Laptop4.jpg" style={{marginLeft: '5%', width: '50%', display: 'block', boxShadow: '-10px 1px 10px 1px grey' }}/>
                    <div>
                        <h1 style={{marginLeft:'15%'}}>PanzR</h1>
                        <div style={{display:'flex', marginTop:'10%'}}>
                            <h4>55000/-</h4>
                            <h4 style={{marginLeft:'50%'}}>MRP: 65000/-</h4>
                        </div>
                        <h3 style={{marginTop:'10%'}}>Seller:- HANG Computers</h3>
                        <button 
                            onClick={() => handleAddToCart("PanzR")} 
                            style={{marginLeft:'10%' , marginTop:'10%', backgroundColor:'#05002F', width:'70%', height:'50px', borderRadius:'50px', alignContent:'center', color:'white', fontWeight:'bold', cursor:'pointer'}}
                        >
                            Add to cart +
                        </button>
                    </div>
                </div>
                
            </div>
            <img src="design.png" style={{position:'absolute', zIndex:'-1', transform: 'rotate(-90deg)', left:'60%', top:'22%', height:'600px'}}></img>
        </div>
    );
}

export default Buypage;
