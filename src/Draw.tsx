import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {fabric} from 'fabric'
import {Canvas} from "fabric/fabric-impl";


const points = [
    {
        "x": 356,
        "y": 329
    },
    {
        "x": 356,
        "y": 228
    },
    {
        "x": 426,
        "y": 228
    },
    {
        "x": 426,
        "y": 329
    },
]

// top:
//     (elementSize.height / 2 - viewport.y - offsetY * scale) *
//     viewport?.zoom,
//         left:
// (elementSize.width / 2 - viewport.x - offsetX * scale) *
// viewport?.zoom,

export const Draw = () => {
    const fabricRef = useRef(null)




    const [canvas, setCanvas] = useState<Canvas | null>(null)
    const [zoom, setZoom] = useState(1)

    const viewport = useMemo(() => {
        if(canvas === null) return
        // @ts-ignore
        const [_zoomX, _skewX, _skewY, _zoomY, translateX, translateY] = canvas.viewportTransform
       return  {
            x: translateX,
                y: translateY,
            w: (canvas.width ?? 0) / zoom,
            h: (canvas.height ?? 0) / zoom,
            zoom,
        };
    },[canvas, zoom])


    const initDrawCanvas = (id: string) => {
      return new fabric.Canvas(id, {
            width: 1000,
            height: 800,
            backgroundColor: 'gray'
        })
    }

    const setBackground = useCallback( (url:string, canvas:Canvas) => {
        fabric.Image.fromURL(url , (oImg) => {
            canvas.height && oImg.height && oImg.set('top', (canvas.height / 2) - (oImg.height /2)* zoom)
            canvas.width && oImg.width && oImg.set('left', (canvas.width / 2) - (oImg.width /2)* zoom)
            oImg.scale(zoom)

            oImg.selectable = false
            oImg.hoverCursor = "default"
            oImg.moveTo(0)

            canvas.backgroundImage = oImg
            canvas.renderAll()

        });
    }, [zoom])



    // o.set("left", (o.left ?? 0) + pointOnFloorPlan.x * scale);
    // o.set("top", (o.top ?? 0) - pointOnFloorPlan.y * scale);


    const drawPolygon = useCallback( (points: {x:number, y: number}[], canvas: Canvas, zoom: number) => {
        const polygon = new fabric.Polygon(points, {
            fill: '#D81B60',
            scaleX: zoom,
            scaleY: zoom,
            hoverCursor:'pointer',
            selectable: false
        });
        canvas.add(polygon)
    },[])


    // @ts-ignore
    console.log(canvas?.viewportTransform,)

    useEffect(() => {
        setCanvas(initDrawCanvas('canvas'))
    },[])

    useEffect(() => {

        if(canvas !== null) {
            setBackground('floor_plan.svg', canvas)
            drawPolygon(points, canvas, zoom)
        }

    }, [canvas, drawPolygon, setBackground, zoom])


    return (
        <div style={{position: 'relative'}}>
            <canvas id="canvas" ref={fabricRef}/>

            {/*<div id="overlay" style={{position: 'absolute',top: 200, left: 100, backgroundColor:'rgba(0, 255, 0, 0.4)', width: 100 * zoom, height: 100 * zoom, zIndex: 10 }}/>*/}
            <div style={{position: 'absolute', top: 10, left: 10, zIndex: 10}}>
                <button style={{ fontWeight: 'bold', width: 40, height: 40, fontSize: 20, borderRadius: 4, backgroundColor: "white", padding: 10, border: 0, cursor: 'pointer'}} onClick={() => setZoom((prev) => (prev + 0.1))}>
                    +
                </button>
                <button style={{ fontWeight: 'bold', width: 40, height: 40, fontSize: 20, borderRadius: 4, backgroundColor: "white", padding: 10, border: 0, cursor: 'pointer', marginLeft: 10}} onClick={() => setZoom((prev) => (prev - 0.1))}>
                    -
                </button>
            </div>
        </div>
    );
};

