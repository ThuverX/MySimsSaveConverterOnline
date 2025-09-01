"use-client";
import {
	ChevronRight,
	File,
	Folder,
	LucideFileArchive,
	LucideFileText,
	LucideGlobe,
} from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useAtom, useAtomValue } from "jotai";
import { activeFileAtom, changedFilePathsAtom, filesAtom, useHasChanged } from "./state";
import { useEffect, useState } from "react";
import { FileEntry } from "@/system/SaveConverter";

import MonacoEditor from "@monaco-editor/react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { initMonaco } from "./manaco";
import { useTheme } from "next-themes";

interface TreeItem {
	type: "file" | "folder";
	path: string;
	file?: FileEntry;
	children?: TreeItem[];
}

const Editor = () => {
	const files = useAtomValue(filesAtom);
	const [tree, setTree] = useState<TreeItem[]>([]);
	const activeFile = useAtomValue(activeFileAtom);
	const [ changedFilePaths, setChangedFilePaths ] = useAtom(changedFilePathsAtom);
	const theme = useTheme();

	useEffect(() => {
		if (files.length <= 0) return setTree([]);

		setTree(filesToTree(files));
		setChangedFilePaths(files.filter(f => f.HasChanged).map(f => f.Name));
	}, [files]);

	return (
		<div className="flex grow">
			<Sidebar className="h-full" collapsible="icon">
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Files</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{tree.map((item, index) => (
									<Tree key={index} item={item} />
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarRail />
			</Sidebar>
			<div className="flex flex-col grow">
				<DialogHeader className="p-4">
					<DialogTitle>
						{activeFile ? activeFile.Name : "No file selected"}
					</DialogTitle>
				</DialogHeader>
				<MonacoEditor
					defaultLanguage="xml"
					value={activeFile ? activeFile.GetText() : ""}
					onChange={(value) => {
						if (activeFile && value !== undefined) {
							files.find(f => f.Name === activeFile.Name)?.SetText(value);
							if(!changedFilePaths.includes(activeFile.Name)) {
								setChangedFilePaths([...changedFilePaths, activeFile.Name])
							}
						}
					}}
					beforeMount={initMonaco}
					theme={theme.resolvedTheme === "dark"
						? "shadcn-dark"
						: "shadcn-light"}
				/>
			</div>
		</div>
	);
};

function filesToTree(files: FileEntry[]) {
	const root: TreeItem[] = [];

	for (const file of files) {
		const parts = file.Name.split(/[\\/]/);
		let currentLevel = root;

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			const existingPath = currentLevel.find(
				(item) => item.path === part,
			);
			if (!existingPath) {
				const newItem: TreeItem = {
					type: i === parts.length - 1 ? "file" : "folder",
					path: part,
					...(i === parts.length - 1 ? { file } : { children: [] }),
				};
				currentLevel.push(newItem);
				if (newItem.type === "folder") {
					currentLevel = newItem.children!;
				}
			} else {
				if (existingPath.type === "folder") {
					currentLevel = existingPath.children!;
				}
			}
		}
	}
	return root;
}

function IconFromFileName({ name }: { name?: string }) {
	switch (name) {
		case "sav":
			return <LucideFileArchive />;
		case "txt":
		case "xml":
			return <LucideFileText />;
		case "world":
			return <LucideGlobe />;
		default:
			return <File />;
	}
}

function Tree({ item }: { item: TreeItem }) {
	const [activeFile, setActiveFile] = useAtom(activeFileAtom);
	const hasChanged = useHasChanged(item.file);

	const { path, type, children } = item;
	const [name] = path.split(/[\\/]/);
	const extension = name.split(".").pop()?.toLowerCase();

	if (type === "file") {
		return (
			<SidebarMenuButton
				isActive={activeFile?.Name === item.file?.Name}
				onClick={() => item.file && setActiveFile(item.file)}
				className="cursor-pointer"
			>
				<IconFromFileName name={extension} />
				{name}
				{hasChanged &&
					(
						<SidebarMenuBadge>
							*
						</SidebarMenuBadge>
					)}
			</SidebarMenuButton>
		);
	}

	return (
		<SidebarMenuItem>
			<Collapsible
				className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
				defaultOpen={name === "components" || name === "ui"}
			>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton>
						<ChevronRight className="transition-transform" />
						<Folder />
						{name}
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{children?.map((subItem, index) => (
							<Tree key={index} item={subItem} />
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		</SidebarMenuItem>
	);
}

export default Editor;
