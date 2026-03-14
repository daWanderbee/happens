export {};

declare global {
  var reactionStream:
    | {
        enqueue: (data: string) => void;
      }
    | undefined;
}
