import {useEffect, useRef, useState} from "react";
import {fabric} from 'fabric'

export const Draw = () => {
    const fabricRef = useRef(null)
    const elementSize = fabricRef.current

    const [zoom, setZoom] = useState(1)

    useEffect(() => {
        const canvas = new fabric.Canvas('canvas', {
            width: 1000,
            height: 800,
            backgroundColor: 'gray'
        })


        fabric.Image.fromURL('/floor_plan.svg' , (oImg) => {

            canvas.height && oImg.height && oImg.set('top', (canvas.height / 2) - (oImg.height /2)* zoom)
            canvas.width && oImg.width && oImg.set('left', (canvas.width / 2) - (oImg.width /2)* zoom)
            oImg.scale(zoom)


            oImg.selectable = false
            oImg.moveTo(0)

            canvas.add(oImg);
        });

        const rect = new fabric.Rect({ width: 100 * zoom, height: 100 * zoom, fill: 'red', top: 200, left:100})
        rect.moveTo(1)
        rect.selectable = false
        canvas.add(rect);
    },[elementSize, zoom])


    return (
        <div style={{position: 'relative'}}>
            <canvas id="canvas" ref={fabricRef}/>

            <div id="overlay" style={{position: 'absolute',top: 200, left: 100, backgroundColor:'rgba(0, 255, 0, 0.4)', width: 100 * zoom, height: 100 * zoom, zIndex: 10 }}/>
            <div style={{position: 'absolute', top: 10, left: 10, zIndex: 10}}>
                <button style={{ borderRadius: 4, backgroundColor: "white", padding: 10, border: 0, cursor: 'pointer'}} onClick={() => setZoom((prev) => (prev + 0.1))}>
                    +
                </button>
                <button style={{ borderRadius: 4, backgroundColor: "white", padding: 10, border: 0, cursor: 'pointer', marginLeft: 10}} onClick={() => setZoom((prev) => (prev - 0.1))}>
                    -
                </button>
            </div>
        </div>
    );
};

