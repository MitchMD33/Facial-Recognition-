import React from 'react';
import './Facerecognition.css';

/*Face detection*/
const FacRecognition = ({imageURL, box}) => {
  return (
    <div className='center ma'>
    <div className='absolute mt2'>
    <img id='inputimage' alt='' src={imageURL} width='500px' heigh='auto' />
    <div/>
    <div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
    </div>
   </div>
  );
}





export default FacRecognition;