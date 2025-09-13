"use-client";

import React, { useEffect, useRef, useState } from "react";
import { useMaps } from "./state";
import { useAnimationFrame } from "motion/react";

import IconList from "../../public/maps/icon_list.json";
import WorldList from "../../public/maps/world_list.json";

function loadImage(path: string): HTMLImageElement {
    let img = new Image();
    img.src = path;
    return img;
}

type WorldNames = "desert.world" | "townsquare.world" | "forest.world";

interface MapProps {
    name: WorldNames
}

const Map = ({name}: MapProps) => {
    const { maps, loaded } = useMaps();
    const [activeMap, setActiveMap] = useState<WorldNames>(name);
    const [images, setImages] = useState<
        Record<string, HTMLImageElement> | null
    >(
        null,
    );
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (images !== null) return;

        const imageList: Record<string, HTMLImageElement> = {};
        for (let { id, name } of IconList.icons) {
            let img = loadImage("/maps/icons/" + id);

            if (img) {
                imageList[name] = img;
            }
        }

        for (let [k, v] of Object.entries(IconList.maps_to_icons)) {
            let img = loadImage("/maps/" + v + ".png");

            if (img) {
                imageList[k] = img;
            }
        }

        setImages(imageList);
    }, []);

    const worldToScreen = (x: number, y: number) => [
        (x + WorldList[activeMap].offsetX) * (WorldList[activeMap].scale / 400 * WorldList[activeMap].width),
        (y + WorldList[activeMap].offsetY) * (WorldList[activeMap].scale / 400 * WorldList[activeMap].height),
    ];

    useAnimationFrame(() => {
        if (!canvasRef.current) return;
        if (!images) return;

        const ctx = canvasRef.current.getContext("2d")!;
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;

        ctx.clearRect(0, 0, width, height);

        ctx.drawImage(images[activeMap], 0, 0, 400, 400);

        for (
            let building of maps.find((m) => m.name.toLowerCase() == activeMap)
                ?.buildings!
        ) {
            ctx.fillStyle = "red";
            const [x, y] = worldToScreen(building.x, building.y);
            ctx.save();
            ctx.translate(x, y);
            ctx.fillRect(0, 0, 15, 15);
            ctx.restore();
        }
    });

    if (!loaded) return <></>;
    return (
        <canvas
            ref={canvasRef}
            width={400}
            height={400}
            style={{ width: 400, height: 400 }}
        />
    );
};

export default Map;
