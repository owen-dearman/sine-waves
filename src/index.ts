import {
    Scene,
    Mesh,
    MeshStandardMaterial,
    BoxGeometry,
    BufferGeometry,
    Material,
} from 'three';
import { setupCamera } from './setupCamera';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { setupRenderer } from './setupRenderer';


export function setupThreeJSScene(): void {

    const scene = new Scene();

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const controls = setupOrbitControls(camera, renderer.domElement);

    setupLights(scene);

    // setupHelpers(scene);

    const shapesArrX: Mesh<BufferGeometry, Material | Material[]>[] = []
    const shapesArrZ: Mesh<BufferGeometry, Material | Material[]>[] = []

    //Make some shape(s) and add them to the scene

    let num = 50
    for (let i = 0; i < num; i++) {
        const geometry = new BoxGeometry(2, 2, 2);
        const material = new MeshStandardMaterial({
            color: 0xFFD700
        });
        const myShape: Mesh = new Mesh(geometry, material);
        const [x, z] = polarToCartesian(degToRad((360 / num) * i), num / 1.5)
        myShape.position.x = x
        myShape.position.z = z
        shapesArrX.push(myShape)
        scene.add(myShape);
    }

    let zPos = -100
    for (let i = 0; i <= 20; i++) {
        const geometry = new BoxGeometry(10, 10, 10);
        const material = new MeshStandardMaterial({
            color: 0xC0C0C0
        });

        const myShape: Mesh = new Mesh(geometry, material);
        myShape.position.z = zPos
        myShape.position.y = -100
        zPos += 10
        shapesArrZ.push(myShape)
        scene.add(myShape);
    }


    let frameCount = 0
    let freq = 3
    animate();


    function animate() {
        let offsetY = 0
        for (const shape of shapesArrX) {
            const T = offsetY * ((2 * Math.PI) / shapesArrX.length) + frameCount / 70
            shape.position.y = Math.sin(T * freq) * 5
            offsetY += 1
            shape.rotation.x += 0.05
            shape.rotation.y += 0.1
            shape.rotation.z += 0.05
        }



        let offsetX = 0
        for (const shape of shapesArrZ) {
            shape.position.x = Math.sin(offsetX * (Math.PI / 8) + frameCount / 30) * 30
            offsetX += 1
            shape.rotation.z += 0.1
        }

        //Draw the current scene to the canvas - one frame of animation.
        renderer.render(scene, camera);

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        //Queue for this function to be called again when the browser is ready for another animation frame.
        requestAnimationFrame(animate);
        frameCount++
    }

    function polarToCartesian(angle: number, radius: number) {
        const x = radius * Math.cos(angle)
        const y = radius * Math.sin(angle)
        return [x, y]
    }

    function degToRad(angle: number) {
        return angle * 0.0174533
    }


}

setupThreeJSScene();
