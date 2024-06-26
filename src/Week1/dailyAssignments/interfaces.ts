export interface Brand {
  id: number;
  name: string;
}

export interface ErrorMessages {
  alreadyExists: string;
  notFound: string;
  invalidId: string;
  portMessage: string;
  deleteMessage: string;
};

export interface TaskMessages {
  task1Message: string;
  task2Message: string;
}