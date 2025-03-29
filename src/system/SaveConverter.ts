import { Buffer } from "node:buffer";
import zlib from 'node:zlib';

export class FileEntry {

    public NameLength: number = 0
    public Name: string = ""
    public Size: number = 0
    public UncompressedSize: number = 0
    public DataCompressed: Uint8Array  = new Uint8Array ()
    public DataUncompressed: Uint8Array  = new Uint8Array ()
    public Checksum: number = 0

    public read(view: DataView, offset: number): number {
        this.NameLength = view.getUint32(offset, true); offset+=4
        this.Name = ""

        for(let i = 0; i < this.NameLength; i++) {
            const byte = view.getUint8(offset); offset+=1
            this.Name += String.fromCharCode(byte)
        }

        this.Size = view.getUint32(offset, true); offset+=4
        offset+=4
        this.UncompressedSize = view.getUint32(offset, true); offset+=4
        offset+=4
        this.DataCompressed = new Uint8Array(view.buffer.slice(offset, offset + this.Size)); offset+=this.Size
        this.DataUncompressed = zlib.inflateSync(Buffer.from(this.DataCompressed))
        this.Checksum = view.getUint8(offset); offset+=1

        return offset
    }

    public async fromFolder(file: File) {
        this.Name = file.webkitRelativePath
        this.Size = file.size
        this.DataUncompressed = new Uint8Array(await file.arrayBuffer())
        this.DataCompressed = zlib.deflateRawSync(Buffer.from(this.DataUncompressed), {
            level: -1
        })
        this.Checksum = 1
    }

    public GetText() {
        return new TextDecoder("utf-8").decode(this.DataUncompressed)
    }

    public write(view: DataView, offset: number): number {
        view.setUint32(offset, this.Name.length, true); offset+=4
        for (let i = 0; i < this.Name.length; i++) {
            const byte = this.Name.charCodeAt(i)
            view.setInt8(offset, byte); offset+=1
        }

        view.setUint32(offset, this.DataCompressed.length, true); offset+=4
        view.setUint32(offset, 0, true); offset+=4
        view.setUint32(offset, this.Size, true); offset+=4
        view.setUint32(offset, 0, true); offset+=4

        for(let i = 0; i < this.DataCompressed.length; i++) {
            view.setUint8(offset, this.DataCompressed[i]); offset+=1
        }
        view.setUint8(offset, 1); offset+=1

        return offset
    }
}

export class SaveConverter {

    public files: Array<FileEntry> = []
    public fileCount: number = 0
    public saveName: string = ""

    public async read(file: File): Promise<number> {
        this.saveName = file.name.split(".")[0]
        this.files = []
        const view = new DataView(await file.arrayBuffer())
        let offset = 0
        this.fileCount = view.getUint32(offset, true); offset+=4

        for(let i = 0; i < this.fileCount; i++) {
            const entry = new FileEntry()

            offset = entry.read(view, offset)

            this.files.push(entry)
        }

        return offset
    }

    public async fromFolder(files: File[]): Promise<number> {
        this.files = []

        this.saveName = files[0].webkitRelativePath.split(/\\|\//)[0]

        console.log(files[0].webkitRelativePath)

        for(const file of files) {
            const entry = new FileEntry()

            await entry.fromFolder(file)

            this.files.push(entry)
        }

        return 0
    }

    public write(): ArrayBuffer {
        const view = new DataView(new ArrayBuffer(2_000_000_000))
        let offset = 0
        view.setUint32(offset, this.files.length, true); offset+=4

        for(const file of this.files) {
            offset = file.write(view, offset)
        }

        return view.buffer.slice(0, offset)
    }
}