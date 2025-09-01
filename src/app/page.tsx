"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, LucideHammer, LucideStar } from "lucide-react";
import { SaveConverter } from "@/system/SaveConverter";
import { saveAs } from "file-saver";
import { downloadZip } from "client-zip";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { CozyBundleIcon, OriginalIcon } from "./icons";

import { useAtom } from "jotai";
import { filesAtom, isEditorOpenAtom, useStats } from "./state";
import Editor from "./editor";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Dialog, DialogContent } from "@/components/ui/dialog";

const converter = new SaveConverter();

export default function Home() {
    const [files, setFiles] = useAtom(filesAtom);
    const [isEditorOpen, setIsEditorOpen] = useAtom(isEditorOpenAtom);
    const stats = useStats();

    const handleFile = async (file: File) => {
        setFiles([]);

        await converter.read(file);

        setFiles(converter.files);
    };

    const handleFolder = async (files: File[]) => {
        setFiles([]);

        await converter.fromFolder(files);

        setFiles(converter.files);
    };

    const saveFile = async () => {
        if (files.length <= 0) return;

        saveAs(new Blob([converter.write()]), converter.saveName + ".sav");
    };

    const saveZip = async () => {
        if (files.length <= 0) return;

        const fileList: File[] = [];

        for (const file of converter.files) {
            fileList.push(
                new File([file.DataUncompressed as BlobPart], file.Name),
            );
        }

        const zip = downloadZip(fileList, {});

        saveAs(await zip.blob(), converter.saveName + ".zip");
    };

    return (
        <>
            <div className="absolute top-0 right-0 m-8 z-[9999]">
                <ModeToggle />
            </div>
            <div className="flex grow lg:max-w-5/8 mx-auto border-l-1 border-r-1 border-secondary min-h-screen">
                <div className="prose p-10 min-w-full">
                    <h1>MySims Save Converter</h1>
                    <p>
                        Use this tool to convert your save files from Cozy
                        Bundle to Original and back.
                    </p>
                    <ul>
                        <li>
                            Drop in your <code>.sav</code> <b>file</b>{" "}
                            from MySims Cozy Bundle
                            <CozyBundleIcon />
                            <br />
                            <i>
                                (Found in{" "}
                                <code>
                                    %LOCALAPPDATA%/Electronic Arts/MySims
                                </code>)
                            </i>
                        </li>
                        <li>
                            Or your <code>SaveGame</code> <b>folder</b>{" "}
                            from MySims or Taco Bell Edition
                            <OriginalIcon />
                            <br />
                            <i>
                                (Found in{" "}
                                <code>
                                    %USERPROFILE%/Documents/Electronic
                                    Arts/MySims
                                </code>)
                            </i>
                        </li>
                    </ul>
                    <div className="flex gap-4 my-2">
                        <Input
                            id="file-input"
                            type="file"
                            accept=".sav"
                            className="hidden"
                            onChange={(e) => handleFile(e.target.files![0])}
                        />
                        <Input
                            id="dir-input"
                            type="file"
                            webkitdirectory="true"
                            className="hidden"
                            onChange={(e) => handleFolder([...e.target.files!])}
                        />
                        <Button
                            className="cursor-pointer"
                            onClick={() =>
                                document.getElementById("file-input")?.click()}
                        >
                            <CozyBundleIcon />Open CozyBundle Save
                        </Button>
                        <Button
                            className="cursor-pointer"
                            onClick={() =>
                                document.getElementById("dir-input")?.click()}
                        >
                            <OriginalIcon />Open MySims SaveGame
                        </Button>
                    </div>
                    <h2>Stats</h2>
                    { (stats.SimName !== "Unknown" && stats.TownName !== "Unknown") ? (
                    <div className="flex flex-col">
                        <span>Sim Name: {stats.SimName}</span>
                        <span>Town Name: {stats.TownName}</span>
                        <span className="flex">
                            Number of Stars: {stats.NumStars}{" "}
                            <div className="flex ml-4">

                            {new Array(5).fill(null).map((
                                _,
                                i,
                            ) => (
                                i < stats.NumStars ? (
                                    <LucideStar
                                        key={i}
                                        className="text-yellow-400"
                                    />
                                ) : (
                                    <LucideStar
                                        key={i}
                                        className="text-gray-400"
                                    />
                            )))}
                            </div>
                        </span>
                        {/* <span>Time Played: {stats.TimePlayed}</span> */}
                    </div>
                    ) : (
                        <span>Select a save file to see your stats.</span>
                    )}
                    <h2>Actions</h2>
                    <div className="flex gap-4 my-2">
                        <Tooltip>
                            <TooltipContent>
                                Edit your save file here in your browser.
                            </TooltipContent>

                            <TooltipTrigger>
                                <Button
                                    disabled={files.length <= 0}
                                    className="cursor-pointer"
                                    onClick={() => setIsEditorOpen(true)}
                                >
                                    <LucideHammer />Edit save file
                                </Button>
                            </TooltipTrigger>
                        </Tooltip>

                        <Tooltip>
                            <TooltipContent>
                                Save this file as a .sav file to use with Cozy
                                Bundle.
                            </TooltipContent>

                            <TooltipTrigger>
                                <Button
                                    disabled={files.length <= 0}
                                    className="cursor-pointer"
                                    onClick={saveFile}
                                >
                                    <CozyBundleIcon />Download .sav
                                </Button>
                            </TooltipTrigger>
                        </Tooltip>
                        <Tooltip>
                            <TooltipContent>
                                Save all files in a zip to use with MySims or
                                Taco Bell Edition.
                            </TooltipContent>

                            <TooltipTrigger>
                                <Button
                                    disabled={files.length <= 0}
                                    className="cursor-pointer"
                                    onClick={saveZip}
                                >
                                    <OriginalIcon />Download SaveData
                                </Button>
                            </TooltipTrigger>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                <DialogContent className="min-w-3/4 min-h-3/4 p-0 overflow-hidden">
                    <SidebarProvider className="min-h-full">
                        <Editor />
                    </SidebarProvider>
                </DialogContent>
            </Dialog>
        </>
    );
}