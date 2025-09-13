import { ByteBuffer } from '../ByteBuffer'
import { readColorRGB565 } from './BC1'

/**
 * Decompresses a BC3 (`D3DFMT_DXT4`, `D3DFMT_DXT5`, `DXGI_FORMAT_BC3_UNORM`, `DXGI_FORMAT_BC3_UNORM_SRGB`) compressed texture to RGBA8.
 *
 * @see https://docs.microsoft.com/en-us/windows/win32/direct3d10/d3d10-graphics-programming-guide-resources-block-compression#bc3
 *
 * @export
 * @param {ByteBuffer} compressedData
 * @param {number} width
 * @param {number} height
 * @return {*}  {Array<[number, number, number, number]>}
 */
export function decompressBC3(
    compressedData: ByteBuffer,
    width: number,
    height: number
): Array<[number, number, number, number]> {
    const pixelData: Array<[number, number, number, number]> = []

    for (let blockY = 0; blockY < height; blockY += 4) {
        for (let blockX = 0; blockX < width; blockX += 4) {
            const alphavalue0 = compressedData.readUInt8()
            const alphavalue1 = compressedData.readUInt8()

            const alphaIndices1 = compressedData.readUInt(3) // 24 bits
            const alphaIndices2 = compressedData.readUInt(3) // 24 bits
            const alphaBits: Array<number> = []

            for (let i = 0; i < 8; i++)
                alphaBits.push((alphaIndices1 >> (3 * i)) & 0b111)
            for (let i = 0; i < 8; i++)
                alphaBits.push((alphaIndices2 >> (3 * i)) & 0b111)

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

            const alphaMap: Record<number, number> = {
                0: alphavalue0,
                1: alphavalue1
            }

            if (alphavalue0 > alphavalue1) {
                // 6 interpolated alpha values.
                alphaMap[2] = (6 / 7) * alphavalue0 + (1 / 7) * alphavalue1 // bit code 010
                alphaMap[3] = (5 / 7) * alphavalue0 + (2 / 7) * alphavalue1 // bit code 011
                alphaMap[4] = (4 / 7) * alphavalue0 + (3 / 7) * alphavalue1 // bit code 100
                alphaMap[5] = (3 / 7) * alphavalue0 + (4 / 7) * alphavalue1 // bit code 101
                alphaMap[6] = (2 / 7) * alphavalue0 + (5 / 7) * alphavalue1 // bit code 110
                alphaMap[7] = (1 / 7) * alphavalue0 + (6 / 7) * alphavalue1 // bit code 111
            } else {
                // 4 interpolated alpha values.
                alphaMap[2] = (4 / 5) * alphavalue0 + (1 / 5) * alphavalue1 // bit code 010
                alphaMap[3] = (3 / 5) * alphavalue0 + (2 / 5) * alphavalue1 // bit code 011
                alphaMap[4] = (2 / 5) * alphavalue0 + (3 / 5) * alphavalue1 // bit code 100
                alphaMap[5] = (1 / 5) * alphavalue0 + (4 / 5) * alphavalue1 // bit code 101
                alphaMap[6] = 0 // bit code 110
                alphaMap[7] = 255 // bit code 111
            }

            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    const pixelIndex = bits[y * 4 + x]
                    const alphaIndex = alphaBits[y * 4 + x]

                    const r = colorMap[pixelIndex][0]
                    const g = colorMap[pixelIndex][1]
                    const b = colorMap[pixelIndex][2]
                    const a = Math.floor(alphaMap[alphaIndex])

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
