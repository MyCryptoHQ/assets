interface Task {
  title: string;
  task: TaskFunction;
}

interface ListrTask {
  skip(reason: string): void;
}

type TaskFunction =
  | ((context: any, task: ListrTask) => Promise<unknown>)
  | ((context: any, task: ListrTask) => unknown);

export default class Listr {
  private context: any;

  public constructor(private tasks: Task[]) {
    // noop
  }

  public async run(context: any): Promise<void> {
    this.context = context || {};

    for (const task of this.tasks) {
      const result = await task.task(this.context, {
        skip: jest.fn()
      });

      if (result instanceof Listr) {
        await result.run(this.context);
      }
    }

    return this.context;
  }
}
