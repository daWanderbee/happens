export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      globalThis.reactionStream = controller;
    },
    cancel() {
      globalThis.reactionStream = null;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
