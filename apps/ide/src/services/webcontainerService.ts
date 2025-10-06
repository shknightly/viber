import { WebContainer, FileSystemTree } from '@webcontainer/api';
import { useIDEStore } from '../store/useIDEStore';

let webcontainerInstance: WebContainer | null = null;

const initialFiles: FileSystemTree = {
  'index.js': {
    file: {
      contents: `
import express from 'express';
const app = express();
const port = 3111;

app.get('/', (req, res) => {
  res.send('Hello from your WebContainer IDE!');
});

app.listen(port, () => {
  console.log(\`App is running on http://localhost:\${port}\`);
});
`,
    },
  },
  'package.json': {
    file: {
      contents: `
{
  "name": "webcontainer-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
`,
    },
  },
};

export async function initializeWebContainer() {
  const { setWebcontainerInstance, appendToTerminalOutput, setIsLoadingWebContainer } = useIDEStore.getState();

  if (webcontainerInstance) {
    return webcontainerInstance;
  }

  appendToTerminalOutput('Booting WebContainer...\r\n');
  setIsLoadingWebContainer(true);

  try {
    webcontainerInstance = await WebContainer.boot();
    setWebcontainerInstance(webcontainerInstance);
    appendToTerminalOutput('WebContainer booted successfully!\r\n');

    await webcontainerInstance.mount(initialFiles);
    appendToTerminalOutput('Initial files mounted.\r\n');

    // Listen for WebContainer logs and append to terminal output
    webcontainerInstance.on('server-ready', (port, url) => {
        appendToTerminalOutput(`Server ready on port ${port}: ${url}\r\n`);
    });

    setIsLoadingWebContainer(false);
    return webcontainerInstance;
  } catch (error) {
    console.error('Failed to boot WebContainer:', error);
    appendToTerminalOutput(`Error booting WebContainer: ${error}\r\n`);
    setIsLoadingWebContainer(false);
    throw error;
  }
}

export async function installDependencies(instance: WebContainer) {
  const { appendToTerminalOutput } = useIDEStore.getState();
  appendToTerminalOutput('Installing dependencies...\r\n');
  const installProcess = await instance.spawn('npm', ['install']);
  installProcess.output.pipeTo(
    new WritableStream({
      write(chunk) {
        appendToTerminalOutput(chunk);
      },
    }),
  );
  const exitCode = await installProcess.exit;
  if (exitCode !== 0) {
    throw new Error('Failed to install dependencies');
  }
  appendToTerminalOutput('Dependencies installed.\r\n');
}

export async function runCommand(instance: WebContainer, command: string, args: string[]) {
  const { appendToTerminalOutput } = useIDEStore.getState();
  const process = await instance.spawn(command, args);

  process.output.pipeTo(
    new WritableStream({
      write(chunk) {
        appendToTerminalOutput(chunk);
      },
    }),
  );

  const exitCode = await process.exit;
  return exitCode;
}

export async function writeFile(instance: WebContainer, path: string, content: string) {
  await instance.fs.writeFile(path, content);
}

export async function readFile(instance: WebContainer, path: string): Promise<string> {
  const content = await instance.fs.readFile(path, 'utf8');
  return content;
}

export async function readDir(instance: WebContainer, path: string = '.'): Promise<{ name: string; isDirectory: boolean }[]> {
  const entries = await instance.fs.readdir(path, { withFileTypes: true });
  return entries.map(entry => ({
    name: entry.name,
    isDirectory: entry.isDirectory()
  }));
}

// Helper to recursively get files for the file explorer
export async function getFileTree(instance: WebContainer, path: string = '.'): Promise<any[]> {
    const entries = await readDir(instance, path);
    const tree: any[] = [];
    for (const entry of entries) {
        if (entry.name === 'node_modules') continue; // Ignore node_modules for cleaner display
        if (entry.isDirectory) {
            tree.push({
                name: entry.name,
                isDirectory: true,
                children: await getFileTree(instance, `${path}/${entry.name}`)
            });
        } else {
            tree.push({
                name: entry.name,
                isDirectory: false,
                content: await readFile(instance, `${path}/${entry.name}`) // Read content for editor sync
            });
        }
    }
    return tree;
}