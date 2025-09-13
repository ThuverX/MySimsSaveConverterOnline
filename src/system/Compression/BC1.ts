import { ByteBuffer } from "../ByteBuffer"

/**
 * Reads rgb values from a `5r 6g 5b` color.
 *
 * @export
 * @param {number} color
 * @return {*}  {[number, number, number]}
 */
export function readColorRGB565(color: number): [number, number, number] {
    const r = (color & 0b1111100000000000) >> 11
    const g = (color & 0b0000011111100000) >> 5
    const b = (color & 0b0000000000011111) >> 0

    return [r, g, b]
}

/**
 * Decompresses a BC1 (`D3DFMT_DXT1`, `DXGI_FORMAT_BC1_UNORM`, `DXGI_FORMAT_BC1_UNORM_SRGB`) compressed texture to RGBA8.
 *
 * @see https://docs.microsoft.com/en-us/windows/win32/direct3d10/d3d10-graphics-programming-guide-resources-block-compression#bc1
 *
 * @export
 * @param {ByteBuffer} compressedData
 * @param {number} width
 * @param {number} height
 * @return {*}  {Array<[number, number, number, number]>}
 */
export function decompressBC1(
    compressedData: ByteBuffer,
    width: number,
    height: number
): Array<[number, number, number, number]> {
    const pixelData: Array<[number, number, number, number]> = []

    for (let blockY = 0; blockY < height; blockY += 4) {
        for (let blockX = 0; blockX < width; blockX += 4) {
            const colorint1 = compressedData.readUInt16()
            const colorint2 = compressedData.readUInt16()

            const color0 = readColorRGB565(colorint1)
            const color1 = readColorRGB565(colorint2)

            const hasAlpha = colorint1 <= colorint2

            const indices = compressedData.readUInt32()
            const bits: Array<number> = []

            for (let i = 0; i < 16; i++) bits.push((indices >> (2 * i)) & 0b11)

            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    const pixelIndex = bits[y * 4 + x]

                    let r = 0
                    let g = 0
                    let b = 0
                    let a = 255

                    if (pixelIndex === 0) {
                        r = color0[0]
                        g = color0[1]
                        b = color0[2]
                    } else if (pixelIndex === 1) {
                        r = color1[0]
                        g = color1[1]
                        b = color1[2]
                    }

                    if (hasAlpha) {
                        if (pixelIndex === 2) {
                            r = (color0[0] + color1[0]) / 2
                            g = (color0[1] + color1[1]) / 2
                            b = (color0[2] + color1[2]) / 2
                        } else if (pixelIndex === 3) {
                            a = 0
                        }
                    } else {
                        if (pixelIndex === 2) {
                            r = (2 * color0[0] + color1[0]) / 3
                            g = (2 * color0[1] + color1[1]) / 3
                            b = (2 * color0[2] + color1[2]) / 3
                        } else if (pixelIndex === 3) {
                            r = (color0[0] + 2 * color1[0]) / 3
                            g = (color0[1] + 2 * color1[1]) / 3
                            b = (color0[2] + 2 * color1[2]) / 3
                        }
                    }

                    const idx = (blockY + y) * height + (blockX + x)

                    const r8 = Math.floor((r * 527 + 23) >> 6)
                    const g8 = Math.floor((g * 259 + 33) >> 6)
                    const b8 = Math.floor((b * 527 + 23) >> 6)

                    pixelData[idx] = [r8, g8, b8, a]
                }
            }
        }
    }

    return pixelData
}
