import React, { useEffect, useRef } from 'react';
import 'babylonjs';
import 'babylonjs-gui';
import 'babylonjs-loaders';
import 'babylonjs-materials';
import TOOLKIT from 'babylon-toolkit';
import Viewer from './Viewer';
import './App.css';

function App() {
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

    // Our built-in 'sphere' shape. Params: name, options, scene
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape. Params: name, options, scene
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    const sx = new BABYLON.Sound(
        "loading",
        "https://raw.githubusercontent.com/onekit/gardener/master/public/sounds/loader/loading.ogg",
        scene,
        null,
        { autoplay: true, loop:true }
    );

    console.log("Legacy Sound: ", sx);

    
    TOOLKIT.SceneManager.FocusRenderCanvas(scene);
  };

  return (    
    <div className="root">
      <Viewer antialias={true} adaptToDeviceRatio={true} onSceneReady={onSceneReady} className="canvas" id="my-canvas" />
    </div>
  );
}

export default App;