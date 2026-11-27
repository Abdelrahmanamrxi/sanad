if (typeof globalThis.MessagePort === "undefined") {
  globalThis.MessagePort = (
    typeof globalThis.MessageChannel !== "undefined"
      ? new globalThis.MessageChannel().port1.constructor
      : class MessagePort {}
  ) as unknown as typeof globalThis.MessagePort;
}
