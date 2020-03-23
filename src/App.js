import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import './App.css';

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
  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particleOptions}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm />
        {/*<FaceRecognition /> */}
      </div>
    );
  }
}

export default App;
