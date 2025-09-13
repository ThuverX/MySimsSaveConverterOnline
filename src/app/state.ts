import { FileEntry } from "@/system/SaveConverter";
import { atom, useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { GCTImage } from "@/system/GCTImage";

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

type Stats = {
    SimName: string;
    TownName: string;
    NumStars: number;
    TimePlayed: string;
    loaded: boolean;
};

type MapBuilding = {
    x: number;
    y: number;
    rot: number;
    type: string;
};

type GameMap = {
    name: string;
    xml: string;
    buildings: MapBuilding[];
};

type Maps = {
    loaded: boolean;
    maps: GameMap[];
};

const mapsAtom = atom<Maps>({
    loaded: false,
    maps: [],
});

function parseTimePlayed(hexTicks: string) {
    const ticks = BigInt("0x" + hexTicks);
    const totalSeconds = Number(ticks / BigInt("60750352"));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}:${
        seconds.toString().padStart(2, "0")
    }`;
}

const MAP_FILE_NAMES = ["desert.world", "forest.world", "townsquare.world"];

export function useMaps() {
    const files = useAtomValue(filesAtom);
    const changedFilePaths = useAtomValue(changedFilePathsAtom);
    const [maps, setMaps] = useAtom(mapsAtom);

    useEffect(() => {
        const mapFiles: GameMap[] = files.filter((f) =>
            MAP_FILE_NAMES.includes(f.Name.toLowerCase())
        ).map((f) => ({ name: f.Name, xml: f.GetText(), buildings: [] }));

        for (const map of mapFiles) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(map.xml, "application/xml");

            const buildings: MapBuilding[] = Array.from(
                doc.querySelectorAll("Building"),
            ).map((building) => {
                //eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                const position: number[] = building.querySelector("Translation")?.textContent.trim().split(" ").map(parseFloat)!;
                //eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                const name: string = building.querySelector("ObjectDef")?.textContent!;

                return ({
                    x: position[0],
                    y: position[2],
                    rot: 0,
                    type: name,
                });
            });

            map.buildings = buildings;
        }

        setMaps({
            loaded: mapFiles.length > 0,
            maps: mapFiles,
        });
    }, [files, changedFilePaths]);

    return maps;
}

export function useStats() {
    const files = useAtomValue(filesAtom);
    const changedFilePaths = useAtomValue(changedFilePathsAtom);
    const [stats, setStats] = useState<Stats>({
        loaded: false,
        NumStars: 0,
        SimName: "Unknown",
        TimePlayed: "0:00:00",
        TownName: "Unknown"
    });

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
                loaded: false,
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
            loaded: true,
        });
    }, [files, changedFilePaths]);

    return stats;
}


export function usePlayerImage() {
    const files = useAtomValue(filesAtom);
    const changedFilePaths = useAtomValue(changedFilePathsAtom);
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const gctFile = files.find((f) =>
            f.Name.toLowerCase().endsWith(".xml.texture")
        )

        if(!gctFile) return

        const gctImage = new GCTImage()
        gctImage.read(new DataView(gctFile.GetData().buffer), 0)
        gctImage.convertToImage()

        setImage(gctImage.imageElement);
    }, [files, changedFilePaths]);

    return image
}