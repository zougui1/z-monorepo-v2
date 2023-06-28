import { FuraffinitySubmissionQuery, FindOneByUrlOptions } from './FuraffinitySubmissionQuery';
import { FuraffinitySubmission, SubmissionReport, SubmissionStatus } from './FuraffinitySubmission';

describe('FuraffinitySubmissionQuery', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a document and return it', async () => {
      const furaffinitySubmission = {
        id: '69',
        url: 'https://furaffinity/view/69',
      };

      // @ts-ignore
      jest.spyOn(FuraffinitySubmission.Model, 'create').mockResolvedValue({
        toObject: () => ({
          ...furaffinitySubmission,
          _id: 'kfdbnjrufhguiodr',
        }),
      });

      const result = await new FuraffinitySubmissionQuery().create(furaffinitySubmission as any);

      expect(result).toEqual({
        ...furaffinitySubmission,
        _id: 'kfdbnjrufhguiodr',
      });
      expect(FuraffinitySubmission.Model.create).toBeCalledWith(furaffinitySubmission);
    });
  });

  describe('findOneIdle', () => {
    it('should return undefined when no document was found', async () => {
      jest.spyOn(FuraffinitySubmission.Model, 'findOne').mockResolvedValue(undefined);

      const result = await new FuraffinitySubmissionQuery().findOneIdle();

      expect(result).toBeUndefined();
      expect(FuraffinitySubmission.Model.findOne).toBeCalledWith({
        status: SubmissionStatus.Idle,
      });
    });

    it('should return the document when found', async () => {
      jest.spyOn(FuraffinitySubmission.Model, 'findOne').mockResolvedValue({
        toObject: () => ({
          _id: 'fdijgndruojif',
          id: '69',
          url: 'https://furaffinity/view/69',
        }),
      });

      const result = await new FuraffinitySubmissionQuery().findOneIdle();

      expect(result).toEqual({
        _id: 'fdijgndruojif',
        id: '69',
        url: 'https://furaffinity/view/69',
      });
      expect(FuraffinitySubmission.Model.findOne).toBeCalledWith({
        status: SubmissionStatus.Idle,
      });
    });
  });

  describe('findOneByUrl', () => {
    it('should return undefined when no document was found', async () => {
      const options: FindOneByUrlOptions = {
        url: 'https://furaffinity/view/69',
        downloadUrl: 'https://d.furaffinity.net/lpsjdfuisjnhouiez',
      };

      jest.spyOn(FuraffinitySubmission.Model, 'findOne').mockResolvedValue(undefined);

      const result = await new FuraffinitySubmissionQuery().findOneByUrl(options);

      expect(result).toBeUndefined();
      expect(FuraffinitySubmission.Model.findOne).toBeCalledWith({
        $or: [
          { url: options.url },
          { downloadUrl: options.downloadUrl },
        ],
      });
    });

    it('should return the document when found', async () => {
      const options: FindOneByUrlOptions = {
        url: 'https://furaffinity/view/69',
        downloadUrl: 'https://d.furaffinity.net/lpsjdfuisjnhouiez',
      };

      jest.spyOn(FuraffinitySubmission.Model, 'findOne').mockResolvedValue({
        toObject: () => ({
          _id: 'fdijgndruojif',
          id: '69',
          url: 'https://furaffinity/view/69',
        }),
      });

      const result = await new FuraffinitySubmissionQuery().findOneByUrl(options);

      expect(result).toEqual({
        _id: 'fdijgndruojif',
        id: '69',
        url: 'https://furaffinity/view/69',
      });
      expect(FuraffinitySubmission.Model.findOne).toBeCalledWith({
        $or: [
          { url: options.url },
          { downloadUrl: options.downloadUrl },
        ],
      });
    });
  });

  describe('findAllIdle', () => {
    it('should return the document when found', async () => {
      jest.spyOn(FuraffinitySubmission.Model, 'find').mockResolvedValue([
        {
          toObject: () => ({
            _id: 'fdijgndruojif',
            id: '69',
            url: 'https://furaffinity/view/69',
          }),
        },
      ]);

      const result = await new FuraffinitySubmissionQuery().findAllIdle();

      expect(result).toEqual([
        {
          _id: 'fdijgndruojif',
          id: '69',
          url: 'https://furaffinity/view/69',
        },
      ]);
      expect(FuraffinitySubmission.Model.find).toBeCalledWith({
        status: SubmissionStatus.Idle,
      });
    });
  });

  describe('updateStatus', () => {
    describe('when no document was found', () => {
      it('should do nothing', async () => {
        const id = '69';
        const status = SubmissionStatus.Downloading;

        const save = jest.fn();
        jest.spyOn(FuraffinitySubmission.Model, 'findOne').mockResolvedValue(undefined);

        await new FuraffinitySubmissionQuery().updateStatus(id, status);

        expect(FuraffinitySubmission.Model.findOne).toBeCalledWith(
          { id },
          { report: 1 },
        );
        expect(save).not.toBeCalled();
      });
    });

    describe('when a document was found', () => {
      it('should update the status and remove the report', async () => {
        const id = '69';
        const status = SubmissionStatus.Downloading;

        const document = {
          save: jest.fn(),
        };
        jest.spyOn(FuraffinitySubmission.Model, 'findOne').mockResolvedValue(document);

        await new FuraffinitySubmissionQuery().updateStatus(id, status);

        expect(FuraffinitySubmission.Model.findOne).toBeCalledWith(
          { id },
          { report: 1 },
        );
        expect(document.save).toBeCalled();
        expect(document).toHaveProperty('status', status);
        expect(document).toHaveProperty('report', undefined);
      });

      it('should not update the duplicates IDs when the report has no duplicates IDs', async () => {
        const id = '69';
        const status = SubmissionStatus.Downloading;

        const document = {
          save: jest.fn(),
          report: {
            duplicatesIds: ['87'],
          },
        };
        jest.spyOn(FuraffinitySubmission.Model, 'findOne').mockResolvedValue(document);

        await new FuraffinitySubmissionQuery().updateStatus(id, status);

        expect(FuraffinitySubmission.Model.findOne).toBeCalledWith(
          { id },
          { report: 1 },
        );
        expect(document.save).toBeCalled();
        expect(document).toHaveProperty('status', status);
        expect(document).toHaveProperty('report', undefined);
      });

      it('should update the report', async () => {
        const id = '69';
        const status = SubmissionStatus.Downloading;
        const report: Partial<SubmissionReport> = {
          error: 'Has duplicates',
          duplicatesIds: ['87'],
        };

        const document = {
          save: jest.fn(),
        };
        jest.spyOn(FuraffinitySubmission.Model, 'findOne').mockResolvedValue(document);

        await new FuraffinitySubmissionQuery().updateStatus(id, status, report);

        expect(FuraffinitySubmission.Model.findOne).toBeCalledWith(
          { id },
          { report: 1 },
        );
        expect(document.save).toBeCalled();
        expect(document).toHaveProperty('status', status);
        expect(document).toHaveProperty('report', {
          error: 'Has duplicates',
          duplicatesIds: ['87'],
        });
      });

      it('should concat the duplicates IDs when both the doc and report have duplicates IDs', async () => {
        const id = '69';
        const status = SubmissionStatus.Downloading;
        const report: Partial<SubmissionReport> = {
          duplicatesIds: ['87'],
        };

        const document = {
          save: jest.fn(),
          report: {
            duplicatesIds: ['45'],
          },
        };
        jest.spyOn(FuraffinitySubmission.Model, 'findOne').mockResolvedValue(document);

        await new FuraffinitySubmissionQuery().updateStatus(id, status, report);

        expect(FuraffinitySubmission.Model.findOne).toBeCalledWith(
          { id },
          { report: 1 },
        );
        expect(document.save).toBeCalled();
        expect(document).toHaveProperty('status', status);
        expect(document).toHaveProperty('report', {
          duplicatesIds: ['45', '87'],
        });
      });
    });
  });
});
