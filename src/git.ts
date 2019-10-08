import { workspace } from 'vscode';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

export class Git {
  static exists() {
    return this.execute('', ['--version']);
  }

  static async commit(message: string) {
    const { stdout: hasStaged } = await this.execute('status', [
      '--porcelain',
      '--untracked-files=no'
    ]);

    if (!hasStaged) {
      this.execute('add', [`--all`]);
    }

    this.execute('commit', [`--message=${message}`, '--quiet', '--all']);
  }

  private static execute(command?: string, options: string[] = []) {
    const { rootPath: cwd } = workspace;

    return exec(`git ${command} ${options.join(' ')}`, { cwd });
  }
}
