import { ByteBuffer } from "./ByteBuffer";
import { decompressBC2 } from "./Compression/BC2";
import { GCTImage } from "./GCTImage";

export class DXT3Image {
    public read(view: DataView, offset: number): number {
        return offset
    }

    public fromGCT(image: GCTImage): Uint8Array {
        const width = image.Width
        const height = image.Height

        const bb = ByteBuffer.from(image.Pixels)
        bb.setEndianness(ByteBuffer.Endianness.LittleEndian)
        const pixels = decompressBC2(bb, width, height)

        return Uint8Array.from(pixels.flat())
    }

    public write(view: DataView, offset: number): number {
        return offset;
    }
}