export interface IFile {
    name: string;
    content: string;
}

export class MockFileStream {
    private mockedFiles: IFile[] = [];

    public __setMockFiles(files: IFile[]): void {
        this.mockedFiles = files;
    }

    public existsSync(file: string): boolean {
        return this.mockedFiles.some(f => f.name === file);
    }

    public readFileSync(file: string): string {
        if(!this.existsSync(file)) {
            throw 'File not found';
        }

        return this.mockedFiles.find(f => f.name === file).content;
    }
}
