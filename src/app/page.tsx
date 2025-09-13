"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircleIcon, Edit, LucideHammer, LucideStar } from "lucide-react";
import { SaveConverter } from "@/system/SaveConverter";
import { saveAs } from "file-saver";
import { downloadZip } from "client-zip";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { CozyBundleIcon, OriginalIcon } from "./icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
import Map from "./map";
import PlayerImage from "./playerimage";

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
                <div className="prose p-10 min-w-full flex flex-col">
                    <h1>MySims Save Converter</h1>
                    <p>
                        Use this tool to convert your save files from Cozy
                        Bundle to Original and back.
                    </p>
                    <ul>
                        <li>
                            Select your <code>.sav</code> <b>file</b>{" "}
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
                            <CozyBundleIcon />Open Cozy Bundle Save
                        </Button>
                        <Button
                            className="cursor-pointer"
                            onClick={() =>
                                document.getElementById("dir-input")?.click()}
                        >
                            <OriginalIcon />Open MySims SaveGame
                        </Button>
                    </div>
                    {/* <div className="flex">
                    <Map name="townsquare.world"/>
                    <Map name="forest.world"/>
                    <Map name="desert.world"/>

                    </div> */}
                    {(stats.loaded)
                        ? (
                            <div className="bg-[#0eb5c4] rounded-xl mt-8 flex items-center gap-4 font-trebuchet text-2xl relative">
                                <PlayerImage style={{ imageRendering: "pixelated" }} className="flex h-40 w-40 border-8 bg-[#57cbd6] rounded-xl border-[#00414a] my-4 ml-4" />

                                <div className="flex flex-col mr-4 py-4 h-40 justify-between">
                                    <span>Sim Name: {stats.SimName}</span>
                                    <span>Town Name: {stats.TownName}</span>
                                    <span>Time Played: {stats.TimePlayed}</span>
                                </div>
                                <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
                                    {new Array(5).fill(null).map((_, i) => (
                                        <img
                                            src={i < stats.NumStars
                                                ? "star-filled.png"
                                                : "star.png"}
                                            key={i}
                                            style={{
                                                top: "calc(((var(--spacing) * 48) - (var(--spacing) * 10)) / 2)",
                                                right:
                                                    "calc(((var(--spacing) * 48) - (var(--spacing) * 10)) / 2)",
                                                transform: `rotate(${
                                                    (i / 5) * 120 - 90
                                                }deg) translate(100%,0) scale(0.7) `,
                                            }}
                                            className="w-20 h-20 absolute !m-0"
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                        : null}
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
                    <div className="flex flex-col gap-4 mt-auto">
                        <Alert variant="default">
                            <AlertDescription className="flex">
                                Report any issues on <a href="https://github.com/ThuverX/MySimsSaveConverterOnline">Github</a>
                            </AlertDescription>
                        </Alert>
                        <Alert variant="default">
                            <AlertCircleIcon />
                            <AlertTitle>Disclaimer</AlertTitle>
                            <AlertDescription>
                                This website is a fan-made project and is not affiliated with, endorsed by, or sponsored by Electronic Arts Inc., Maxis, or the MySims franchise. All trademarks and copyrights are the property of their respective owners.
                            </AlertDescription>
                        </Alert>
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
