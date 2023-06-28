import { Cursor, CursorStatus } from './Cursor';
import { Source } from '../../../enums';

export class CursorQuery {
  async findOrCreate(source: Source, defaultCursor: Omit<Cursor, 'source'>): Promise<Cursor.Object> {
    const foundCursor = await Cursor.Model.findOne({
      source,
    });

    if (foundCursor) {
      return foundCursor.toObject();
    }

    const createdCursor = await Cursor.Model.create({
      ...defaultCursor,
      source,
    });

    return createdCursor.toObject();
  }

  /**
   * advances the cursor forward to the next submission and updates the status to be idle
   * @param source
   * @param lastSubmissionId
   */
  async advance(source: Source, lastSubmissionId: string): Promise<void> {
    await Cursor.Model.updateOne(
      { source },
      {
        lastSubmissionId,
        status: CursorStatus.Idle,
      },
    );
  }

  async updateStatus(source: Source, status: CursorStatus, report?: Cursor.Report | undefined): Promise<void> {
    await Cursor.Model.updateOne(
      { source },
      { status, report },
    );
  }
}
