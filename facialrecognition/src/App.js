import React, {Component} from 'react';
import Navigation from './Componennts/Navigation/Navigation';
import Logo from './Componennts/logo/logo';
import ImageLinkForm from './Componennts/ImageLinkForm/ImageLinkForm';
import Rank from './Componennts/Rank/Rank';
import ParticlesBg from 'particles-bg'
import './App.css';




class App extends Component{
  render() {
    return (
      <div className="App">
    <ParticlesBg color="#ffffff" type="cobweb" bg={true} /> 
      <Navigation />
      <Logo/>
      <ImageLinkForm/>
      <Rank />
     {
        /*
        
       <FacRecognition/>*/
     }
      </div>
    );
  }
 }

export default App;
