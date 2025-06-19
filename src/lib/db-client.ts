import { Constants } from "$lib/constants";
import type { Control, Image } from "$lib/schema";
import Dexie, { type EntityTable } from "dexie";

type InsertControl = Omit<Control, "id">;
type InsertImage = Omit<Image, "id">;

class DB extends Dexie {
  control!: EntityTable<Control, "id">;
  image!: EntityTable<Image, "id">;

  constructor() {
    super("pictile.tasukaru.app");
    this.version(1).stores({
      control: "++id",
      image: "++id",
    });

    this.version(2)
      .stores({
        control: "++id",
        image: "++id",
      })
      .upgrade((tx) => {
        return tx
          .table("control")
          .toCollection()
          .modify((control) => {
            control.cellAspectRatio = { width: 1, height: 1 };
          });
      });
  }
}

export class DBClient {
  private db: DB;
  constructor(db: DB = new DB()) {
    this.db = db;
  }

  public get control(): Promise<Control> {
    return (async () => {
      const controls = await this.db.control.toArray();
      if (controls.length > 0) {
        return controls[0];
      }
      return Constants.DEFAULT_CONTROL;
    })();
  }

  public async updateControl(
    newControl: Partial<InsertControl>
  ): Promise<Control> {
    const controls = await this.db.control.toArray();
    if (controls.length > 0) {
      await this.db.control.update(controls[0].id, newControl);
      return { ...controls[0], ...newControl };
    }
    // レコードが存在しなければ新規作成する
    const id = await this.db.control.add({
      ...newControl,
      ...Constants.DEFAULT_CONTROL,
    });
    const insertedConfiguration = await this.db.control.get(id);
    if (!insertedConfiguration) {
      throw new Error("Failed to create default configuration");
    }
    return insertedConfiguration;
  }

  public get images(): Promise<Image[]> {
    return this.db.image.toArray();
  }

  public async addImage(image: InsertImage): Promise<Image> {
    const id = await this.db.image.add(image);
    return { id, ...image };
  }

  public async deleteImage(id: number): Promise<void> {
    await this.db.image.delete(id);
  }

  public async clear(): Promise<void> {
    await this.db.control.clear();
    await this.db.image.clear();
  }
}
