import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
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
      box: {}
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

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particleOptions}/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={this.state.box} imageURL={this.state.imageURL}/>
      </div>
    );
  }
}

export default App;
