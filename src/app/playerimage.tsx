import React from "react";
import { usePlayerImage } from "./state";

const PlayerImage = (props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
    const image = usePlayerImage()

    if(!image?.src) return <div {...props}/>
    return (
        <img
        src={image?.src}
        {...props}
        />
    );
};



export default PlayerImage;
