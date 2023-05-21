import { ProviderInit } from "./types";
import * as Y from "yjs";
import * as FS from "expo-file-system";
import * as base64 from "react-native-quick-base64";

export const init: ProviderInit = (doc) => {
  new FSProvider(doc);
};

const YDB_FILENAME = "content";
const YDIR = FS.documentDirectory + "ygroceries/";

const yFile = (name: string) => `${FS.documentDirectory}${name}.dat`;

async function fileExists(filename: string): Promise<boolean> {
  const fileInfo = await FS.getInfoAsync(filename);
  if (!fileInfo.exists) {
    return false;
  }
  return true;
}

class FSProvider {
  private doc: Y.Doc;

  constructor(doc: Y.Doc) {
    this.doc = doc;
    this.init();
  }

  private async init() {
    //await ensureDirExists();
    try {
      const exists = await fileExists(yFile(YDB_FILENAME));

      // Fetch from disk
      if (exists) {
        const fromDisk = await FS.readAsStringAsync(yFile(YDB_FILENAME), {
          encoding: "base64",
        });
        if (fromDisk) {
          Y.applyUpdate(this.doc, yDecode(fromDisk));
        }
      }
    } catch (err) {
      console.error(err);
      throw new Error("Unable to check if file exists");
    }

    // Subscribe to updates
    this.doc.on("update", (update) => {
      const content = Y.encodeStateAsUpdate(this.doc);
      FS.writeAsStringAsync(yFile(YDB_FILENAME), yEncode(content), {
        encoding: "base64",
      });
    });
  }
}

function yDecode(b64: string): Uint8Array {
  return base64.toByteArray(b64);
}

function yEncode(yContent: Uint8Array): string {
  return base64.fromByteArray(yContent);
}
