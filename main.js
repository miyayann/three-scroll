import './style.css'
import {TextureLoader, PerspectiveCamera, WebGLRenderer, BoxGeometry, Scene, MeshNormalMaterial, Mesh, TorusGeometry} from "three"

const canvas = document.querySelector('#webgl');

const scene = new Scene();

const textureLoader = new TextureLoader();
const bgTexture = textureLoader.load("bg.jpg");
scene.background = bgTexture;

const sizes = {
  width: innerWidth,
  height: innerHeight
}

const camera = new PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);

const renderer = new WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

const boxGeometry = new BoxGeometry(5,5,5,10);
const boxMaterial = new MeshNormalMaterial();
const box = new Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0.5, -15);
box.rotation.set(1,1,0)

const torusGeometry = new TorusGeometry(8,2,16,100);
const torus = new Mesh(torusGeometry, boxMaterial);
torus.position.set(0, 1, 10);

scene.add(box, torus);

function lerp(x, y, a) {
  return (1 - a) * x + a * y;
}

function scalePercent(start, end) {
  return (scrollParcent - start) / (end - start);
}

const animationScript = [];

animationScript.push({
  start: 0,
  end: 40,
  function() {
    camera.lookAt(box.position);
    camera.position.set(0,1,10);
    box.position.z = lerp(-15, 2, scalePercent(0, 40));
    torus.position.z = lerp(10, -20, scalePercent(0, 40));
  }
});

animationScript.push({
  start: 40,
  end: 60,
  function() {
    camera.lookAt(box.position);
    camera.position.set(0,1,10);
    box.rotation.z = lerp(1, Math.PI, scalePercent(40, 60));
  }
});

animationScript.push({
  start: 60,
  end: 80,
  function() {
    camera.lookAt(box.position);
    camera.position.x = lerp(0,-15,scalePercent(60, 80));
    camera.position.y = lerp(1,15,scalePercent(60, 80));
    camera.position.z = lerp(10,25,scalePercent(60, 80));
  }
});

animationScript.push({
  start: 80,
  end: 100,
  function() {
    camera.lookAt(box.position);
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
  }
});

function playScrollAnimation() {
  animationScript.forEach((animation) => {
      if(scrollParcent >= animation.start && scrollParcent <= animation.end) {
      animation.function()
      }
  })
  }

let scrollParcent = 0;

document.body.onscroll = () => {
  scrollParcent = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
  console.log(scrollParcent);
}


const tick = () => {
  window.requestAnimationFrame(tick);
  playScrollAnimation();
  renderer.render(scene, camera);
}

tick();

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width/ sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
})