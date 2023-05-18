import * as Y from "yjs";
import debug from "debug";
import { EventEmitter } from "fbemitter";
import { MMKV } from "react-native-mmkv";

const mmkv = new MMKV();

export default class YMMKVProvider {
  protected logger: debug.Debugger;
  private emitter = new EventEmitter();

  constructor(private doc: Y.Doc) {
    this.logger = debug("y-" + doc.clientID);

    // Load initial state from MMKV
    this.loadStateFromDisk();

    // Subscribe to the YDoc for updates
    this.subscribeToDocumentUpdates();
  }

  onSave(handler: () => void) {
    return this.emitter.addListener("save", handler);
  }

  save = async () => {
    const content = Y.encodeStateAsUpdate(this.doc);
    mmkv.set("content", content);
    this.emitter.emit("save");
  };

  private subscribeToDocumentUpdates = () => {
    this.doc.on("update", () => {
      this.save();
    });
  };

  private loadStateFromDisk = async () => {
    const data = mmkv.getBuffer("content");

    if (data) {
      this.applyUpdate(data);
      console.log("loaded state from disk");
    } else {
      console.log("no data");
    }
  };

  private applyUpdate(update: Uint8Array) {
    Y.applyUpdate(this.doc, update);
  }

  public destroy() {
    this.logger("destroying");
  }
}
