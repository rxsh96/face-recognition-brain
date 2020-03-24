import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import Register from './components/register/Register';
import SignIn from './components/signIn/SignIn';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import * as Constants from './Key';
import './App.css';

const app = new Clarifai.App({
 apiKey: Constants.API_KEY
});

const particleOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 500
      }
    },
    line_linked: {
       shadow: {
           enable: true,
           color: "#3CA9D1",
           blur: 3
        }
      }
    }
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
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

  onInputChange = (event) => {
    this.setState({ input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({ imageURL: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
        .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
        .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false});
    } else if (route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageURL, route, box } = this.state;

    return (
      <div className="App">
        <Particles className='particles'
          params={particleOptions}/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ?  <div>
              <Logo />
             <Rank />
             <ImageLinkForm
               onInputChange={this.onInputChange}
               onButtonSubmit={this.onButtonSubmit}
             />
             <FaceRecognition box={box} imageURL={imageURL}/>
            </div>
          : (
             route === 'signin'
              ? <SignIn onRouteChange={this.onRouteChange}/>
              : <Register onRouteChange={this.onRouteChange}/>
          )
        }
      </div>
    );
  }
}

export default App;
