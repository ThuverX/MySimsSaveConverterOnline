import { FileEntry } from "@/system/SaveConverter";
import { atom, useAtom, useAtomValue } from "jotai";
import { use, useEffect, useState } from "react";

export const filesAtom = atom<FileEntry[]>([]);
export const isEditorOpenAtom = atom<boolean>(false);
export const activeFileAtom = atom<FileEntry | null>(null);
export const changedFilePathsAtom = atom<string[]>([]);

export function useHasChanged(file?: FileEntry) {
    const changedFiles = useAtomValue(changedFilePathsAtom);
    const filesAtomValue = useAtomValue(filesAtom);
    if (!file) return false;

    return changedFiles.includes(file.Name) ||
        (filesAtomValue.find((f) => f.Name === file.Name)?.HasChanged ?? false);
}

const statsAtom = atom<{
    SimName: string;
    TownName: string;
    NumStars: number;
    TimePlayed: string;
}>({
    SimName: "Unknown",
    TownName: "Unknown",
    NumStars: 0,
    TimePlayed: "0:00:00",
});

function parseTimePlayed(hexTicks: string) {
    const buf = Buffer.from(hexTicks, "hex");
    const totalSeconds = buf.readDoubleBE(0);
    return totalSeconds.toFixed(0);
    // const hours = Math.floor(totalSeconds / 3600);
    // const minutes = Math.floor((totalSeconds % 3600) / 60);
    // const seconds = Math.floor(totalSeconds % 60);
    // return `${hours}:${minutes.toString().padStart(2, "0")}:${
    //     seconds.toString().padStart(2, "0")
    // }`;
}

export function useStats() {
    const files = useAtomValue(filesAtom);
    const changedFilePaths = useAtomValue(changedFilePathsAtom);
    const [stats, setStats] = useAtom(statsAtom);

    useEffect(() => {
        let SimName = "Unknown";
        let TownName = "Unknown";
        let NumStars = 0;
        let TimePlayed = "0:00:00";

        const saveHeader = files.find((f) =>
            f.Name.toLowerCase() === "saveheader.xml"
        )?.GetText();

        if (!saveHeader) {
            return setStats({
                SimName,
                TownName,
                NumStars,
                TimePlayed,
            });
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(saveHeader, "application/xml");

        const simNameNode = doc.querySelector("SimName");
        if (simNameNode) SimName = simNameNode.textContent || "Unknown";

        const townNameNode = doc.querySelector("TownName");
        if (townNameNode) TownName = townNameNode.textContent || "Unknown";

        const starsNode = doc.querySelector("NumStars");
        if (starsNode) NumStars = parseInt(starsNode.textContent || "0");

        const timePlayedNode = doc.querySelector("TimePlayed");
        if (timePlayedNode) {
            TimePlayed = parseTimePlayed(timePlayedNode.textContent || "0");
        }

        setStats({
            SimName,
            TownName,
            NumStars,
            TimePlayed,
        });
    }, [files, changedFilePaths]);

    return stats;
}
