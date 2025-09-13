/**
 * A class that represents a byte buffer.
 *
 * @export
 * @class ByteBuffer
 */
export class ByteBuffer {
    private _buffer: Buffer
    private _pointer = 0
    private _endianness: ByteBuffer.Endianness = ByteBuffer.Endianness.BigEndian

    /**
     * Creates an instance of ByteBuffer.
     * @param {Buffer} [buffer]
     * @memberof ByteBuffer
     */
    constructor(buffer?: Buffer) {
        this._buffer = buffer ?? Buffer.alloc(0)
    }

    /**
     * Seeks the buffer by the given offset.
     *
     * @param {number} offset
     * @memberof ByteBuffer
     */
    public seek(offset: number): void {
        this._pointer += offset
    }

    /**
     * Jumps the buffer to the given absolute offset.
     *
     * @param {number} offset
     * @memberof ByteBuffer
     */
    public jump(offset: number): void {
        this._pointer = offset
    }

    /**
     * Reads an unsigned 8-bit integer.
     *
     * @return {*}  {number}
     * @memberof ByteBuffer
     */
    public readUInt8(): number {
        const value = this._buffer.readUInt8(this._pointer)
        this._pointer += 1
        return value
    }

    /**
     * Reads an unsigned 16-bit integer.
     *
     * @return {*}  {number}
     * @memberof ByteBuffer
     */
    public readUInt16(): number {
        if (this._endianness === ByteBuffer.Endianness.BigEndian) {
            const value = this._buffer.readUInt16BE(this._pointer)
            this._pointer += 2
            return value
        } else {
            const value = this._buffer.readUInt16LE(this._pointer)
            this._pointer += 2
            return value
        }
    }

    /**
     * Reads an unsigned 32-bit integer.
     *
     * @return {*}  {number}
     * @memberof ByteBuffer
     */
    public readUInt32(): number {
        if (this._endianness === ByteBuffer.Endianness.BigEndian) {
            const value = this._buffer.readUInt32BE(this._pointer)
            this._pointer += 4
            return value
        } else {
            const value = this._buffer.readUInt32LE(this._pointer)
            this._pointer += 4
            return value
        }
    }

    /**
     * Reads an unsigned integer with the given byte length.
     *
     * @param {number} bytes
     * @return {*}  {number}
     * @memberof ByteBuffer
     */
    public readUInt(bytes: number): number {
        if (this._endianness === ByteBuffer.Endianness.BigEndian) {
            const value = this._buffer.readUIntBE(this._pointer, bytes)
            this._pointer += bytes
            return value
        } else {
            const value = this._buffer.readUIntLE(this._pointer, bytes)
            this._pointer += bytes
            return value
        }
    }

    // /**
    //  * Reads an unsigned 64-bit integer.
    //  *
    //  * @return {*}  {Long}
    //  * @memberof ByteBuffer
    //  */
    // public readUInt64(): Long {
    //     if (this._endianness === ByteBuffer.Endianness.BigEndian) {
    //         const arr = Array.from(
    //             this._buffer.subarray(this._pointer, this._pointer + 8)
    //         )
    //         const value = Long.fromBytesBE(arr, true)

    //         this._pointer += 8

    //         return value
    //     } else {
    //         const arr = Array.from(
    //             this._buffer.subarray(this._pointer, this._pointer + 8)
    //         )
    //         const value = Long.fromBytesLE(arr, true)

    //         this._pointer += 8

    //         return value
    //     }
    // }

    /**
     * Reads a signed 8-bit integer.
     *
     * @return {*}  {number}
     * @memberof ByteBuffer
     */
    public readInt8(): number {
        const value = this._buffer.readInt8(this._pointer)
        this._pointer += 1
        return value
    }

    /**
     * Reads a signed 16-bit integer.
     *
     * @return {*}  {number}
     * @memberof ByteBuffer
     */
    public readInt16(): number {
        if (this._endianness === ByteBuffer.Endianness.BigEndian) {
            const value = this._buffer.readInt16BE(this._pointer)
            this._pointer += 2
            return value
        } else {
            const value = this._buffer.readInt16LE(this._pointer)
            this._pointer += 2
            return value
        }
    }

    /**
     * Reads a signed 32-bit integer.
     *
     * @return {*}  {number}
     * @memberof ByteBuffer
     */
    public readInt32(): number {
        if (this._endianness === ByteBuffer.Endianness.BigEndian) {
            const value = this._buffer.readInt32BE(this._pointer)
            this._pointer += 4
            return value
        } else {
            const value = this._buffer.readInt32LE(this._pointer)
            this._pointer += 4
            return value
        }
    }

    // /**
    //  * Reads a signed integer with the given byte length.
    //  *
    //  * @return {*}  {Long}
    //  * @memberof ByteBuffer
    //  */
    // public readInt64(): Long {
    //     if (this._endianness === ByteBuffer.Endianness.BigEndian) {
    //         const arr = Array.from(
    //             this._buffer.subarray(this._pointer, this._pointer + 8)
    //         )
    //         const value = Long.fromBytesBE(arr, false)

    //         this._pointer += 8

    //         return value
    //     } else {
    //         const arr = Array.from(
    //             this._buffer.subarray(this._pointer, this._pointer + 8)
    //         )
    //         const value = Long.fromBytesLE(arr, false)

    //         this._pointer += 8

    //         return value
    //     }
    // }

    /**
     * Reads a float.
     *
     * @return {*}  {number}
     * @memberof ByteBuffer
     */
    public readFloat(): number {
        if (this._endianness === ByteBuffer.Endianness.BigEndian) {
            const value = this._buffer.readFloatBE(this._pointer)
            this._pointer += 4
            return value
        } else {
            const value = this._buffer.readFloatLE(this._pointer)
            this._pointer += 4
            return value
        }
    }

    /**
     * Reads a double.
     *
     * @return {*}  {number}
     * @memberof ByteBuffer
     */
    public readDouble(): number {
        if (this._endianness === ByteBuffer.Endianness.BigEndian) {
            const value = this._buffer.readDoubleBE(this._pointer)
            this._pointer += 8
            return value
        } else {
            const value = this._buffer.readDoubleLE(this._pointer)
            this._pointer += 8
            return value
        }
    }

    /**
     * Reads a string with the given length.
     *
     * @param {number} length
     * @return {*}  {string}
     * @memberof ByteBuffer
     */
    public readString(length: number): string {
        const value = this._buffer.toString(
            'utf8',
            this._pointer,
            this._pointer + length
        )
        this._pointer += length
        return value
    }

    public readCString(): string {
        let value = ''

        while (this._pointer < this._buffer.length) {
            const char = this._buffer.toString(
                'utf8',
                this._pointer,
                this._pointer + 1
            )
            this._pointer += 1

            if (char === '\0') {
                break
            }

            value += char
        }

        return value
    }

    /**
     * Reads a short.
     *
     * @return {*}  {number}
     * @memberof ByteBuffer
     */
    public readShort(): number {
        return this.readUInt16()
    }

    /**
     * Reads an integer.
     *
     * @return {*}  {number}
     * @memberof ByteBuffer
     */
    public readInt(): number {
        return this.readUInt32()
    }

    // /**
    //  * Reads a long.
    //  *
    //  * @return {*}  {Long}
    //  * @memberof ByteBuffer
    //  */
    // public readLong(): Long {
    //     return this.readUInt64()
    // }

    /**
     * Gets a byte at the given offset.
     *
     * @param {number} offset
     * @return {*}  {number}
     * @memberof ByteBuffer
     */
    public at(offset: number): number {
        return this._buffer[offset]
    }

    /**
     * Writes an unsigned 8-bit integer.
     *
     * @param {number} value
     * @memberof ByteBuffer
     */
    public writeUInt8(value: number): void {
        this._buffer.writeUInt8(value, this._pointer)
        this._pointer += 1
    }

    /**
     * Writes an unsigned 16-bit integer.
     *
     * @param {number} value
     * @memberof ByteBuffer
     */
    public writeUInt16(value: number): void {
        if (this._endianness === ByteBuffer.Endianness.BigEndian) {
            this._buffer.writeUInt16BE(value, this._pointer)

            this._pointer += 2
        } else {
            this._buffer.writeUInt16LE(value, this._pointer)

            this._pointer += 2
        }
    }

    /**
     * Writes an unsigned 32-bit integer.
     *
     * @param {number} value
     * @memberof ByteBuffer
     */
    public writeUInt32(value: number): void {
        if (this._endianness === ByteBuffer.Endianness.BigEndian) {
            this._buffer.writeUInt32BE(value, this._pointer)

            this._pointer += 4
        } else {
            this._buffer.writeUInt32LE(value, this._pointer)

            this._pointer += 4
        }
    }

    // /**
    //  * Writes an unsigned integer with the given byte length.
    //  *
    //  * @param {Long} value
    //  * @memberof ByteBuffer
    //  */
    // public writeUInt64(value: Long): void {
    //     if (this._endianness === ByteBuffer.Endianness.BigEndian) {
    //         const arr = value.toUnsigned().toBytesBE()
    //         this.append(ByteBuffer.from(arr))
    //     } else {
    //         const arr = value.toUnsigned().toBytesLE()
    //         this.append(ByteBuffer.from(arr))
    //     }
    // }

    /**
     * Writes a signed 8-bit integer.
     *
     * @param {number} value
     * @memberof ByteBuffer
     */
    public writeInt8(value: number): void {
        this._buffer.writeInt8(value, this._pointer)
        this._pointer += 1
    }

    /**
     * Writes a signed 16-bit integer.
     *
     * @param {number} value
     * @memberof ByteBuffer
     */
    public writeInt16(value: number): void {
        if (this._endianness === ByteBuffer.Endianness.BigEndian) {
            this._buffer.writeInt16BE(value, this._pointer)

            this._pointer += 2
        } else {
            this._buffer.writeInt16LE(value, this._pointer)

            this._pointer += 2
        }
    }

    /**
     * Writes a signed 32-bit integer.
     *
     * @param {number} value
     * @memberof ByteBuffer
     */
    public writeInt32(value: number): void {
        if (this._endianness === ByteBuffer.Endianness.BigEndian) {
            this._buffer.writeInt32BE(value, this._pointer)

            this._pointer += 4
        } else {
            this._buffer.writeInt32LE(value, this._pointer)

            this._pointer += 4
        }
    }

    // /**
    //  * Writes a signed integer with the given byte length.
    //  *
    //  * @param {Long} value
    //  * @memberof ByteBuffer
    //  */
    // public writeInt64(value: Long): void {
    //     if (this._endianness === ByteBuffer.Endianness.BigEndian) {
    //         const arr = value.toSigned().toBytesBE()
    //         this.append(ByteBuffer.from(arr))
    //     } else {
    //         const arr = value.toSigned().toBytesLE()
    //         this.append(ByteBuffer.from(arr))
    //     }
    // }

    /**
     * Writes a float.
     *
     * @param {number} value
     * @memberof ByteBuffer
     */
    public writeFloat(value: number): void {
        if (this._endianness === ByteBuffer.Endianness.BigEndian) {
            this._buffer.writeFloatBE(value, this._pointer)

            this._pointer += 4
        } else {
            this._buffer.writeFloatLE(value, this._pointer)

            this._pointer += 4
        }
    }

    /**
     * Writes a double.
     *
     * @param {number} value
     * @memberof ByteBuffer
     */
    public writeDouble(value: number): void {
        if (this._endianness === ByteBuffer.Endianness.BigEndian) {
            this._buffer.writeDoubleBE(value, this._pointer)

            this._pointer += 8
        } else {
            this._buffer.writeDoubleLE(value, this._pointer)

            this._pointer += 8
        }
    }

    /**
     * Writes a string.
     *
     * @param {string} value
     * @memberof ByteBuffer
     */
    public writeString(value: string): void {
        this._buffer.write(value, this._pointer, value.length, 'utf8')
        this._pointer += value.length
    }

    /**
     * Writes a string with a null terminator.
     *
     * @param {string} value
     * @memberof ByteBuffer
     */
    public writeCString(value: string): void {
        this.writeString(value)
        this.writeUInt8(0)
    }

    /**
     * Writes a short.
     *
     * @param {number} value
     * @memberof ByteBuffer
     */
    public writeShort(value: number): void {
        this.writeUInt16(value)
    }

    /**
     * Writes an integer.
     *
     * @param {number} value
     * @memberof ByteBuffer
     */
    public writeInt(value: number): void {
        this.writeUInt32(value)
    }

    // /**
    //  * Writes a long.
    //  *
    //  * @param {Long} value
    //  * @memberof ByteBuffer
    //  */
    // public writeLong(value: Long): void {
    //     this.writeUInt64(value)
    // }

    /**
     * Slices a part of a buffer.
     *
     * @param {number} [length]
     * @param {number} [until]
     * @return {*}  {ByteBuffer}
     * @memberof ByteBuffer
     */
    public slice(length?: number, until?: number): ByteBuffer {
        if (length === undefined) {
            length = this.remaining()
        }

        if (until === undefined) {
            until = this._pointer + length
        }

        return this.copy(this._pointer, until)
    }

    /**
     * Reads a buffer with the given length.
     *
     * @param {number} length
     * @return {*}
     * @memberof ByteBuffer
     */
    public readBytes(length: number) {
        const buffer = this.slice(length)
        this._pointer += length
        return buffer
    }

    /**
     * Reads a four character code.
     *
     * @return {*}  {string}
     * @memberof ByteBuffer
     */
    public readFourCC(): string {
        let str = ''
        for (let i = 0; i < 4; i++) {
            const num = this.readUInt8()
            const ch = String.fromCharCode(num)

            str += ch
        }

        return str
    }

    /**
     * Returns the remaining bytes.
     *
     * @return {*}  {number}
     * @memberof ByteBuffer
     */
    public remaining(): number {
        return this._buffer.length - this._pointer
    }

    /**
     * Appends a buffer.
     *
     * @param {ByteBuffer} buffer
     * @memberof ByteBuffer
     */
    public append(buffer: ByteBuffer): void {
        this._buffer = Buffer.concat([this._buffer, buffer.toBuffer()])

        this._pointer += buffer.length()
    }

    /**
     * Returns the capacity of the buffer.
     *
     * @return {*}  {number}
     * @memberof ByteBuffer
     */
    public capacity(): number {
        return this._buffer.length
    }

    /**
     * Clones the buffer.
     *
     * @return {*}  {ByteBuffer}
     * @memberof ByteBuffer
     */
    public clone(): ByteBuffer {
        const buffer = Buffer.alloc(this._buffer.length)
        this._buffer.copy(buffer)
        return new ByteBuffer(buffer)
    }

    /**
     * Returns the length of the buffer.
     *
     * @return {*}  {number}
     * @memberof ByteBuffer
     */
    public length(): number {
        return this._buffer.length
    }

    /**
     * Returns the current pointer of the buffer.
     *
     * @return {*}  {number}
     * @memberof ByteBuffer
     */
    public pointer(): number {
        return this._pointer
    }

    /**
     * Returns the endianness of the buffer.
     *
     * @return {*}  {ByteBuffer.Endianness}
     * @memberof ByteBuffer
     */
    public endianness(): ByteBuffer.Endianness {
        return this._endianness
    }

    /**
     * Sets the endianness of the buffer.
     *
     * @param {ByteBuffer.Endianness} endianness
     * @memberof ByteBuffer
     */
    public setEndianness(endianness: ByteBuffer.Endianness): void {
        this._endianness = endianness
    }

    /**
     * Copies a part of the buffer.
     *
     * @param {number} from
     * @param {number} to
     * @return {*}  {ByteBuffer}
     * @memberof ByteBuffer
     */
    public copy(from: number, to: number): ByteBuffer {
        const buffer = Buffer.alloc(to - from)
        this._buffer.copy(buffer, 0, from, to)
        const bb = new ByteBuffer(buffer)
        bb.setEndianness(this._endianness)
        return bb
    }

    /**
     * Grows the buffer by the given size.
     *
     * @param {number} size
     * @memberof ByteBuffer
     */
    public grow(size: number): void {
        const buffer = Buffer.alloc(this._buffer.length + size)
        this._buffer.copy(buffer)
        this._buffer = buffer
    }

    /**
     * Sets the size of the buffer.
     *
     * @param {number} size
     * @memberof ByteBuffer
     */
    public setSize(size: number): void {
        const buffer = Buffer.alloc(size)
        this._buffer.copy(buffer)
        this._buffer = buffer
    }

    /**
     * Returns the internal buffer.
     *
     * @return {*}  {Buffer}
     * @memberof ByteBuffer
     */
    public toBuffer(): Buffer {
        return this._buffer
    }

    /**
     * Returns the internal buffer as an array.
     *
     * @return {*}  {Array<number>}
     * @memberof ByteBuffer
     */
    public toArray(): Array<number> {
        return Array.from(this._buffer)
    }

    /**
     * Returns the internal buffer as a hex string.
     *
     * @return {*}  {string}
     * @memberof ByteBuffer
     */
    public toString(): string {
        return '<ByteBuffer> ' + this._buffer.toString('utf8')
    }

    /**
     * Wraps a buffer into a byte buffer.
     *
     * @static
     * @param {Buffer} buffer
     * @return {*}  {ByteBuffer}
     * @memberof ByteBuffer
     */
    public static wrap(buffer: Buffer): ByteBuffer {
        return new ByteBuffer(buffer)
    }

    /**
     * Creates a byte buffer from a hex string.
     *
     * @static
     * @param {string} hex
     * @return {*}  {ByteBuffer}
     * @memberof ByteBuffer
     */
    public static fromHex(hex: string): ByteBuffer {
        return new ByteBuffer(Buffer.from(hex, 'hex'))
    }

    /**
     * Creates a byte buffer from an array.
     *
     * @static
     * @param {(Array<number> | Buffer | Uint8Array)} arr
     * @return {*}  {ByteBuffer}
     * @memberof ByteBuffer
     */
    public static from(arr: Array<number> | Buffer | Uint8Array): ByteBuffer {
        return new ByteBuffer(Buffer.from(arr))
    }

    /**
     * Creates a byte buffer with the given size.
     *
     * @static
     * @param {number} size
     * @return {*}  {ByteBuffer}
     * @memberof ByteBuffer
     */
    public static allocate(size: number): ByteBuffer {
        return new ByteBuffer(Buffer.alloc(size))
    }

    /**
     * Creates a byte buffer with the given size and endianness.
     *
     * @static
     * @param {number} size
     * @param {ByteBuffer.Endianness} endianness
     * @return {*}  {ByteBuffer}
     * @memberof ByteBuffer
     */
    public static allocateWithEndian(
        size: number,
        endianness: ByteBuffer.Endianness
    ): ByteBuffer {
        const buffer = Buffer.alloc(size)
        const byteBuffer = new ByteBuffer(buffer)
        byteBuffer.setEndianness(endianness)
        return byteBuffer
    }
}

export namespace ByteBuffer {
    export enum Endianness {
        BigEndian = 'BE',
        LittleEndian = 'LE'
    }
}
