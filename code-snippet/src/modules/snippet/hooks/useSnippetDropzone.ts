import type { DragEvent } from "react";
import { useDropzone } from "react-dropzone";
import { describeRejection, FILE_ACCEPT, MAX_FILE_BYTES } from "../lib/snippetFile";

interface UseSnippetDropzoneOptions {
  onFile: (file: File) => void;
  onReject: (message: string) => void;
  disabled: boolean;
}

const letTextDragsThrough = (event: DragEvent<HTMLElement>) => {
  if (!event.dataTransfer.types.includes("Files")) event.stopPropagation();
};

export function useSnippetDropzone({ onFile, onReject, disabled }: UseSnippetDropzoneOptions) {
  const dropzone = useDropzone({
    accept: FILE_ACCEPT,
    maxSize: MAX_FILE_BYTES,
    multiple: false,
    noClick: true,
    noKeyboard: true,
    disabled,
    onDropAccepted: ([file]) => {
      if (file) onFile(file);
    },
    onDropRejected: ([rejection]) => {
      if (rejection) onReject(describeRejection(rejection));
    },
  });

  const getRootProps = () =>
    dropzone.getRootProps({
      onDragEnter: letTextDragsThrough,
      onDragOver: letTextDragsThrough,
      onDragLeave: letTextDragsThrough,
      onDrop: letTextDragsThrough,
    });

  return {
    getRootProps,
    getInputProps: dropzone.getInputProps,
    isDragActive: dropzone.isDragActive,
    openFileDialog: dropzone.open,
  };
}