import { FuraffinitySubmission, SubmissionStatus, SubmissionReport } from './FuraffinitySubmission';

export class FuraffinitySubmissionQuery {
  async create(submission: FuraffinitySubmission): Promise<FuraffinitySubmission.Object> {
    const document = await FuraffinitySubmission.Model.create(submission);
    return document.toObject();
  }

  async findOneIdle(): Promise<FuraffinitySubmission.Object | undefined> {
    const document = await FuraffinitySubmission.Model.findOne({
      status: SubmissionStatus.Idle,
    });

    return document?.toObject();
  }

  async findOneByUrl(options: FindOneByUrlOptions): Promise<FuraffinitySubmission.Object | undefined> {
    const document = await FuraffinitySubmission.Model.findOne({
      $or: [
        { url: options.url },
        { downloadUrl: options.downloadUrl },
      ],
    });

    return document?.toObject();
  }

  async findAllIdle(): Promise<FuraffinitySubmission.Object[]> {
    const documents = await FuraffinitySubmission.Model.find({
      status: SubmissionStatus.Idle,
    });

    return documents.map(doc => doc.toObject());
  }

  async updateStatus(id: string, status: SubmissionStatus, report?: Partial<SubmissionReport> | undefined): Promise<void> {
    const doc = await FuraffinitySubmission.Model.findOne({ id }, { report: 1 });

    if (!doc) {
      return;
    }

    if (doc.report?.duplicatesIds && report?.duplicatesIds) {
      report.duplicatesIds = [...doc.report.duplicatesIds, ...report.duplicatesIds];
    }

    doc.status = status;
    doc.report = report as SubmissionReport;

    await doc.save();
  }
}

export interface FindOneByUrlOptions {
  url: string;
  downloadUrl: string;
}
