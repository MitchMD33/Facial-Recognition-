import React, {Component} from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/logo/logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import FacRecognition from './Components/FacRecognition/FacRecognition';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import Rank from './Components/Rank/Rank';
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
      route: 'signIn',
      isSignedIn: false,
      user:  {
        id: '',
        name:'',
        email: '',
        entries: '0',
        joined:''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user:{
      id: data.id,
        name:data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
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
    this.setState({box: box})
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn:true})
    }
    this.setState({route: route});
  }


  render() {
   const  {isSignedIn, imageURL, route, box } = this.state;
    return (
      <div className="App">
        <ParticlesBg color="#ff0000" num={200} type="cobweb" bg={true} /> 
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { this.state.route === 'home'
        ? <div> 
          <Logo/>
          <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}/>
          <Rank />
            <FacRecognition box ={box} imageURL={imageURL}/>
        </div>
        :(
          route === 'signIn'
          ?<SignIn onRouteChange={this.onRouteChange}/>
          :<Register loadUser={this.loadUser}  onRouteChange={this.onRouteChange}/>
        )
        
     }
      </div>
    );
  }
 }
export default App;
