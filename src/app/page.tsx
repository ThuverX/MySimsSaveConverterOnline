"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Download, Upload, ArrowRight} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {FileEntry, SaveConverter} from "@/system/SaveConverter";
import {useState} from "react";
import { saveAs } from 'file-saver';
import {downloadZip} from "client-zip";

const converter = new SaveConverter();

export default function Home() {

    const [ files, setFiles ] = useState<FileEntry[]>([]);

    const handleFile = async (file: File) => {
        setFiles([])

        await converter.read(file)

        setFiles(converter.files)
    }

    const handleFolder = async (files: File[]) => {
        setFiles([])

        await converter.fromFolder(files)

        setFiles(converter.files)
    }

    const saveFile = async () => {
        if(files.length <= 0) return

        saveAs(new Blob([converter.write()]), converter.saveName + ".sav")
    }

    const saveZip = async () => {
        if(files.length <= 0) return

        const fileList: File[] = []

        for (const file of converter.files) {
            fileList.push(new File([file.DataUncompressed], file.Name))
        }

        const zip = downloadZip(fileList, {})

        saveAs(await zip.blob(), converter.saveName + ".zip")
    }

    return (
        <div className="flex items-center justify-center grow min-h-screen ">
            <div className="flex flex-col">
                <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                    MySims Save Converter
                </h3>
                <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                    <li>Drop in your <code>.sav</code> file <i>(From MySims Cozy Bundle)</i></li>
                    <li>or your <code>SaveGame</code> folder <i>(From Release or Taco Bell)</i></li>
                </ul>
                <Tabs defaultValue="old->new">
                    <TabsList className="w-full">
                        <TabsTrigger className="cursor-pointer" value="old->new">Old <ArrowRight/> New</TabsTrigger>
                        <TabsTrigger className="cursor-pointer" value="new->old">New <ArrowRight/> Old</TabsTrigger>
                    </TabsList>
                    <TabsContent value="old->new" >
                        <div className="container flex gap-8 mt-8">
                            <Upload className="m-auto"/>
                            <Input
                                type="file"
                                webkitdirectory="true"
                                className="cursor-pointer"
                                onChange={(e) => handleFolder([...e.target.files!]) }
                            />
                            <Button disabled={files.length <= 0} className="cursor-pointer" onClick={saveFile}>
                                <Download className="m-auto mr-2"/>
                                Download to .sav
                            </Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="new->old">
                        <div className="container flex gap-8 mt-8">
                            <Upload className="m-auto"/>
                            <Input
                                type="file"
                                accept=".sav"
                                className="cursor-pointer"
                                onChange={(e) => handleFile(e.target.files![0]) }
                            />
                            <Button disabled={files.length <= 0} className="cursor-pointer" onClick={saveZip}>
                                <Download className="m-auto mr-2"/>
                                Download to .zip
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
                <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                    <li>Your Cozy Bundle save games can be found in <code>%LOCALAPPDATA%/Electronic Arts/MySims</code></li>
                    <li>And your old save games can be found in <code>%USERPROFILE%/Documents/Electronic Arts/MySims</code></li>
                </ul>
                <h2>Check out the source code for this website on <a href="" className="text-blue-500">Github</a></h2>
            </div>
        </div>
    );
}
