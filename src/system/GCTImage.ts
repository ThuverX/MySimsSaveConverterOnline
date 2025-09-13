// struct GCTImage {
//     u32;
//     u32;
//     u32;
//     u32;
//     u32 version;
//     u32;
//     u32;
//     u32 size;
//     u16 width;
//     u16 height;
//     u8 image[size];
// };
// GCTImage image @ 0;

import { DXT3Image } from "./DXT3Image";


export class GCTImage {
    public Version: number = 0;
    public Size: number = 0;
    public Width: number = 0;
    public Height: number = 0;
    public Pixels: Uint8Array = new Uint8Array();
    public imageElement: HTMLImageElement = new Image();

    public read(view: DataView, offset: number): number {
        offset += 4 * 4;

        this.Version = view.getUint32(offset, true);
        offset += 4;
        offset += 4 * 2;
        this.Size = view.getUint32(offset, true);
        offset += 4;
        this.Width = view.getUint16(offset, true);
        offset += 2;
        this.Height = view.getUint16(offset, true);
        offset += 2;

        this.Pixels = new Uint8Array(
            view.buffer.slice(offset, offset + this.Size),
        );
        offset += this.Size;

        return offset;
    }

    public convertToImage() {
        const canvas = document.createElement("canvas");
        canvas.width = this.Width;
        canvas.height = this.Height;
        const ctx = canvas.getContext("2d");
        console.log(this.Pixels.length,this.Size, this.Width, this.Height)
        
        if (ctx) {
            if (this.Size - (this.Width * this.Height * 4) == 0) {
                ctx.putImageData(
                    new ImageData(
                        new Uint8ClampedArray(this.Pixels),
                        this.Width,
                        this.Height,
                    ),
                    0,
                    0,
                );
            } else {
                
                ctx.putImageData(
                    new ImageData(
                        new Uint8ClampedArray(new DXT3Image().fromGCT(this)),
                        this.Width,
                        this.Height,
                    ),
                    0,
                    0,
                );
            }

            this.imageElement.src = canvas.toDataURL("image/png");
        }
    }

    public write(view: DataView, offset: number): number {
        return offset;
    }
}