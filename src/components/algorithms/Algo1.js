import React, { useState, useEffect, useContext } from "react";
import Sketch from "react-p5";
import Parameter from "../editorComponents/Parameter";
import { ProjectContext } from "../../contexts/ProjectContext";
import StartStop from "../editorComponents/StartStop";
import UploadSketch from "../UploadSketch";
import domtoimage from "dom-to-image";
import saveAs from "file-saver";
import axios from "axios";

const Algo1 = (props) => {
  const [project, setProject] = useContext(ProjectContext);
  //const [imageFile, setImageFile] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const [saveImage, setSaveImage] = useState(false);
  let pngfile = "";
  let canvas="";

  const handleSaveImage = (e) => {
    console.log("download to desktop");
    setSaveImage(true);
    //setImageFile(pngfile)
    // console.log(pngfile)
  };

  const [_, set_] = useState({
    sizeRange: 15,
    scale: 2,
    strokeWeight: 1,

    jiggle: 0,
    jiggle2: 0,
    strokeShade: 0,
    strokeOpacity: 0,

    red: 185,
    green: 185,
    blue: 185,

    spread: 0,
    K: 0,
    L: 0,
    BGhue: 100,
    BGsaturation: 70,
    BGbrightness: 0,
  });

  useEffect(() => {
    setProject({ ...project, start: true });
  }, []);

  const handleParameter = ({ currentTarget: input }) => {
    set_({
      ..._,
      [input.name]: input.value,
    });
  };

  const setup = (p5, canvasParentRef) => {
    canvas = p5.createCanvas(500, 500).parent(canvasParentRef);
    canvas.parent("artwork")
      
    // p5.createCanvas(project.width, project.height).parent(canvasParentRef);
    
  };

  const draw = (p5) => {
    // let value = p5.alpha(30);
    p5.frameRate(7);
    // p5.noLoop();

    if (saveImage) {
     
      p5.saveCanvas(canvas, "canvas.png");
      console.log("p5 save image triggered");
      
      setSaveImage(false);
      
    }

    if (project.start) {
      p5.colorMode(p5.HSB);
      // p5.noLoop();
      p5.background(_.BGhue, _.BGsaturation, _.BGbrightness, 50);
      p5.colorMode(p5.RGB);

      p5.stroke(_.strokeShade, _.strokeShade, _.strokeShade, 50);

      p5.translate(p5.width / 2, p5.height / 2);
      p5.scale(_.scale / 2);

      let jglX = p5.random(-_.jiggle, _.jiggle);
      let jglY = p5.random(-_.jiggle, _.jiggle);

      p5.translate(_.shake, _.randomSize);
      for (let i = 0; i < 30; i += 2) {
        let jglXX = p5.random(-_.jiggle2, _.jiggle2);
        let jglYY = p5.random(-_.jiggle2, _.jiggle2);

        p5.strokeWeight(p5.random(_.strokeWeight / 4, _.strokeWeight));

        p5.fill(
          p5.random(_.red - 100, _.red),
          p5.random(_.green - 100, _.green),
          p5.random(_.blue - 100, _.blue),
          50
        );
        // p5.erase();
        psycheCircle(
          p5,
          _.spread,
          _.spread,
          jglX,
          jglXX,
          jglY,
          jglYY,
          i,
          _.sizeRange
        );
        psycheCircle(
          p5,
          -_.spread,
          _.spread,
          jglX,
          jglXX,
          jglY,
          jglYY,
          i,
          _.sizeRange
        );
        psycheCircle(
          p5,
          -_.spread,
          -_.spread,
          jglX,
          jglXX,
          jglY,
          jglYY,
          i,
          _.sizeRange
        );
        psycheCircle(
          p5,
          _.spread,
          -_.spread,
          jglX,
          jglXX,
          jglY,
          jglYY,
          i,
          _.sizeRange
        );
        psycheCircle(
          p5,
          _.spread / _.spread,
          _.spread / _.spread,
          jglX,
          jglXX,
          jglY,
          jglYY,
          i,
          _.sizeRange
        );
      }
    }
  };
  const psycheCircle = (p5, x, y, jglX, jglXX, jglY, jglYY, i, sizeRange) => {
    return p5.circle(
      jglX + jglXX + x,
      jglY + jglYY + y,
      p5.width - i * 20 - p5.random(0, sizeRange)
    );
  };
  const uploadImage = async () => {
    const image = document.getElementById("defaultCanvas0");


    image.toBlob((blob) => {
      const data = new FormData()
      data.append('upload', blob)
        data.append("upload_preset", "sketch");
     data.append("cloud_name", "pixasso");
      console.log(data)
      fetch('/https://api.cloudinary.com/v1_1/pixasso/image/upload', {
        method: 'POST',
        body: data
      })
      
    }, 'image/jpeg', 0.95);

    // const myBlob = new Blob([image] , {type : "image/png"} )

    // myBlob.name = "image.png";
    // myBlob.lastModified = new Date();

    // const myFile = new File([myBlob], "image.png", {
    //   type: myBlob.type,
    // });
    // console.log(myFile)
    


    // const imageData =  new FormData();
    // imageData.append("file", myFile);
    // imageData.append("upload_preset", "sketch");
    // imageData.append("cloud_name", "pixasso");
    // console.log(imageData)
    //  await fetch(" https://api.cloudinary.com/v1_1/pixasso/image/upload", {
    //   method: "post",
    //   body: imageData,
    // })
    //   .then((resp) => resp.json())
    //   .then((data) => {
    //     setImageUrl(data.url);
    //     console.log(data.url)
    //     axios
    //       .post("http://localhost:4000/api/sketch/upload", {
    //         sketch_Url: imageUrl,
    //       })
    //       .then(console.log("image saved"));
    //   })
    //   .catch((error) => console.log(error));

  }
  


  function savePng(){
    const image = document.getElementById("artwork");
    console.log("save to cloud");
    uploadImage()
    // domtoimage.toBlob(image).then(function (image) {
    //   window.saveAs(image, "test.png");
    // });
  };




 

  return (
    <>
      <div className="canvas-with-parameters">
        <div className="parameters-left">
          <div className="parameter-group">
            <div style={{ opacity: "0" }}>
              <Parameter />
            </div>
          </div>
          <div className="parameters-group">
            <h4>BackGround Color:</h4>
            <Parameter
              name="BGhue"
              value={_.BGhue}
              id="Hue"
              min="1"
              max="360"
              step="0"
              handleParameter={handleParameter}
            />
            <Parameter
              name="BGsaturation"
              value={_.BGsaturation}
              id="Saturation"
              min="0"
              max="100"
              handleParameter={handleParameter}
            />
            <Parameter
              name="BGbrightness"
              value={_.BGbrightness}
              id="Brightness"
              min="0"
              max="100"
              step="0"
              handleParameter={handleParameter}
            />
          </div>
        </div>

        <div className="canvas-container">
          <div className="artwork" id="artwork">
            <Sketch className="x" setup={setup} draw={draw} />
          </div>
          <div className="canvas-utilities">
            <button onClick={handleSaveImage}>Download to Desktop</button>
            <button onClick={uploadImage}>Save to Cloud</button>
            <StartStop />
          </div>
        </div>
        <div className="parameters-right">
          <div className="parameters-group">
            <h4>Sizing:</h4>
            <Parameter
              name="sizeRange"
              value={_.sizeRange}
              id="Size Range"
              min="1"
              max="500"
              step="0"
              handleParameter={handleParameter}
            />

            <Parameter
              name="jiggle"
              value={_.jiggle}
              id="Jiggle"
              min="0"
              max="100"
              step="0"
              handleParameter={handleParameter}
            />
            <Parameter
              name="jiggle2"
              value={_.jiggle2}
              id="Scramble"
              min="0"
              max="200"
              step="0"
              handleParameter={handleParameter}
            />
          </div>
          <div className="parameters-group">
            <h4>Color:</h4>
            <Parameter
              name="red"
              value={_.red}
              id="Red"
              min="0"
              max="255"
              step="0"
              handleParameter={handleParameter}
            />
            <Parameter
              name="green"
              value={_.green}
              id="Green"
              min="0"
              max="255"
              step="0"
              handleParameter={handleParameter}
            />
            <Parameter
              name="blue"
              value={_.blue}
              id="Blue"
              min="0"
              max="255"
              step="0"
              handleParameter={handleParameter}
            />
          </div>
          <div className="parameters-group">
            <h4>Border:</h4>
            <Parameter
              name="strokeWeight"
              value={_.strokeWeight}
              id="Stroke Weight"
              min="0"
              max="60"
              step="0"
              handleParameter={handleParameter}
            />

            <Parameter
              name="strokeShade"
              value={_.strokeShade}
              id="Stroke Shade"
              min="0"
              max="255"
              // step="0"
              handleParameter={handleParameter}
            />
            <Parameter
              name="spread"
              value={_.spread}
              id="Spread"
              min="0"
              max="400"
              step="0"
              handleParameter={handleParameter}
            />
          </div>
          <div className="parameters-group">
            <h4>Effects:</h4>

            <Parameter
              name="scale"
              value={_.scale}
              id="Scale"
              min="1"
              max="6"
              handleParameter={handleParameter}
            />
            <Parameter
              name="randomSize"
              value={_.randomSize}
              id="Move Vertically"
              min="-200"
              max="200"
              step="0"
              handleParameter={handleParameter}
            />
            <Parameter
              name="shake"
              value={_.shake}
              id="Move Horizontally"
              min="-200"
              max="200"
              step="0"
              handleParameter={handleParameter}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Algo1;
