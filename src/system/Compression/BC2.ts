import { ByteBuffer } from '../ByteBuffer'
import { readColorRGB565 } from './BC1'

/**
 * Decompresses a BC2 (`D3DFMT_DXT2`,`D3DFMT_DXT3`,`DXGI_FORMAT_BC2_UNORM`, `DXGI_FORMAT_BC2_UNORM_SRGB`) compressed texture to RGBA8.
 *
 * @see https://docs.microsoft.com/en-us/windows/win32/direct3d10/d3d10-graphics-programming-guide-resources-block-compression#bc2
 *
 * @export
 * @param {ByteBuffer} compressedData
 * @param {number} width
 * @param {number} height
 * @return {*}  {Array<[number, number, number, number]>}
 */
export function decompressBC2(
    compressedData: ByteBuffer,
    width: number,
    height: number
): Array<[number, number, number, number]> {
    const pixelData: Array<[number, number, number, number]> = []

    for (let blockY = 0; blockY < height; blockY += 4) {
        for (let blockX = 0; blockX < width; blockX += 4) {
            const alphaIndices1 = compressedData.readUInt32()
            const alphaIndices2 = compressedData.readUInt32()
            const alphaBits: Array<number> = []

            for (let i = 0; i < 8; i++)
                alphaBits.push((alphaIndices1 >> (4 * i)) & 0b1111)
            for (let i = 0; i < 8; i++)
                alphaBits.push((alphaIndices2 >> (4 * i)) & 0b1111)

            const color0 = readColorRGB565(compressedData.readUInt16())
            const color1 = readColorRGB565(compressedData.readUInt16())

            const indices = compressedData.readUInt32()
            const bits: Array<number> = []

            for (let i = 0; i < 16; i++) bits.push((indices >> (2 * i)) & 0b11)

            const colorMap: Record<number, [number, number, number]> = {
                0: color0,
                1: color1,
                2: [
                    (2 * color0[0] + color1[0]) / 3,
                    (2 * color0[1] + color1[1]) / 3,
                    (2 * color0[2] + color1[2]) / 3
                ],
                3: [
                    (color0[0] + 2 * color1[0]) / 3,
                    (color0[1] + 2 * color1[1]) / 3,
                    (color0[2] + 2 * color1[2]) / 3
                ]
            }

            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    const pixelIndex = bits[y * 4 + x]
                    const alphaIndex = alphaBits[y * 4 + x]

                    const r = colorMap[pixelIndex][0]
                    const g = colorMap[pixelIndex][1]
                    const b = colorMap[pixelIndex][2]
                    const a = Math.floor((alphaIndex / 16) * 255)

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
