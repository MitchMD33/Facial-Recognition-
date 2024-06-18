import React from "react";
import { Tilt } from 'react-tilt';
import brain from './brain.png';
import './logo.css'; 

/*Logo */
const Logo = () => {
  return (
   <div className='ma4 mt0'>
     <Tilt className='Tilt br2 shadow-2' style={{height: 150, width: 150 }}options={{max: 60}}>
      <div className="Tilt-inner pa3">
        <img style={{padddingTop: '5px'}} src={brain} alt='logo'/>
      </div>
    </Tilt>
   </div>
  );
}





export default Logo;