import React, { useEffect, useRef } from 'react';
import 'babylonjs';
import 'babylonjs-gui';
import 'babylonjs-loaders';
import 'babylonjs-materials';
import TOOLKIT from 'babylon-toolkit';
import Viewer from './Viewer';
import './App.css';

function App() {

  ////////////////////////////////////////////////////////////////////////
  // CONFIGURATION
  ////////////////////////////////////////////////////////////////////////
  const moveBackAndForth = false;   // MOVE SPHERE BACK AND FORTH
  const enableLegacyAudio = false;  // ENABLE LEGACY AUDIO ENGINE
  ////////////////////////////////////////////////////////////////////////

  const onSceneReady = async (scene) => {
    // This gets the engine and canvas references (non-mesh)
    const engine = scene.getEngine();
    const canvas = scene.getEngine().getRenderingCanvas();

    // This creates and positions a debug camera (non-mesh)
    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    scene.activeCamera = camera;

    // This creates ambient light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.8;

    // Our built-in 'ground' shape. Params: name, options, scene
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    // Our built-in 'sphere' shape. Params: name, options, scene
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Setup spatial audio test
    if (enableLegacyAudio)
    {
      if (!BABYLON.Engine.audioEngine?.unlocked)
      {
          BABYLON.Engine.audioEngine?.unlock();
      }    
      const sx = new BABYLON.Sound(
          "loading",
          "https://raw.githubusercontent.com/onekit/gardener/master/public/sounds/loader/loading.ogg",
          scene,
          null,
          { autoplay: true, loop:true, spatialSound: true, maxDistance: 25, rolloffFactor: 1 }
      );
      window["sx"] = sx;
      sx.attachToMesh(sphere);
      console.log("Legacy Sound Created: ", sx);
    }
    else
    {
      const audioEngine = await BABYLON.CreateAudioEngineAsync({ volume: 0.25 });
      await audioEngine.unlock();
      const sxx = await BABYLON.CreateSoundAsync("bounce",
        "https://raw.githubusercontent.com/onekit/gardener/master/public/sounds/loader/loading.ogg",
        { spatialEnabled: true, spatialMaxDistance: 25, spatialRolloffFactor: 1 }
      );
      window["sxx"] = sxx;
      sxx.spatial.attach(sphere);
      sxx.play({ loop: true });
      console.log("New Sound Created: ", sxx);
    }

    // Move sphere back and forth
    if(moveBackAndForth)
    {  
      let moveSpeed = 0.05;
      const moveDistance = 25;
      scene.onBeforeRenderObservable.add(()=>{
        if (sphere.position.z > moveDistance) {
          moveSpeed = -0.05;
        }
        if (sphere.position.z < -moveDistance) {
          moveSpeed = 0.05;
        }
        sphere.position.z += moveSpeed;   
      });
    }

    // Focus the render canvas
    TOOLKIT.SceneManager.FocusRenderCanvas(scene);
  };

  return (    
    <div className="root">
      <Viewer legacyAudio={enableLegacyAudio} antialias={true} adaptToDeviceRatio={true} onSceneReady={onSceneReady} className="canvas" id="my-canvas" />
    </div>
  );
}

export default App;