import React, {Component} from 'react';
import Navigation from './Componennts/Navigation/Navigation';
import Logo from './Componennts/logo/logo';
import ImageLinkForm from './Componennts/ImageLinkForm/ImageLinkForm';
import FacRecognition from './Componennts/FacRecognition/FacRecognition';
import SignIn from './Componennts/Signin/Signin.js';
import Rank from './Componennts/Rank/Rank';
import ParticlesBg from 'particles-bg'
import './App.css';

const returnClarifaiRequestOptions = (imageURL) => {
  const PAT = '657e4f1eae86452aa567d50247067239';
  const USER_ID = 'clarifai';
  const APP_ID = 'main';
  const IMAGE_URL = imageURL;
  
  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                    // "base64": IMAGE_BYTES_STRING
                }
            }
        }
    ]
});

const requestOptions = {
  method: 'POST',
  headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
  },
  body: raw
};
return requestOptions;

}




class App extends Component{
  constructor(){
    super();
    this.state= {
      input:'',
      imageURL:'',
      box: {},
    }
  }





  onInputChange =(event) => {
    this.setState({input: event.target.value});
  }




onButtonSubmit = () => {
  this.setState({imageURL: this.state.input});
  console.log('click');
  const MODEL_ID = 'face-detection';
  const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
  fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", returnClarifaiRequestOptions(this.state.input) )
    .then(response => response.json())
    .then(result => {

      

        const regions = result.outputs[0].data.regions;

        regions.forEach(region => {
            // Accessing and rounding the bounding box values
            const boundingBox = region.region_info.bounding_box;
            const topRow = boundingBox.top_row.toFixed(3);
            const leftCol = boundingBox.left_col.toFixed(3);
            const bottomRow = boundingBox.bottom_row.toFixed(3);
            const rightCol = boundingBox.right_col.toFixed(3);

            region.data.concepts.forEach(concept => {
                // Accessing and rounding the concept value
                const name = concept.name;
                const value = concept.value.toFixed(4);

                console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);
                
            });
        });
        
        this.displayFaceBox(this.calculateFaceLocation(result));
    })
    .catch(error => console.log('error', error));

  
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
   return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
   } 
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box})
  }


  render() {
    return (
      <div className="App">
        <ParticlesBg color="#ff0000" num={200} type="cobweb" bg={true} /> 
        <SignIn/>
      <Navigation />
      <Logo/>
      <ImageLinkForm 
      onInputChange={this.onInputChange} 
      onButtonSubmit={this.onButtonSubmit}/>
      <Rank />
     {
        <FacRecognition box ={this.state.box} imageURL={this.state.imageURL}/>
     }
      </div>
    );
  }
 }
export default App;
