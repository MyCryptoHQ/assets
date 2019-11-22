import './index';
import { run } from './runner';

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('./runner', () => ({
  run: jest.fn().mockImplementation(() => Promise.resolve())
}));

it('runs the application with passed command args', () => {
  expect(run).toHaveBeenCalledTimes(1);
});
