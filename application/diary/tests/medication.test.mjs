import sinon from 'sinon';
import { expect } from 'chai';
import mongoose from 'mongoose';
import Medication from '../models/Medication.js';

describe('Medication Model', () => {
  let saveStub, deleteByEmailStub, getRecordsStub, deleteByIdStub;

  beforeEach(() => {
    saveStub = sinon.stub(Medication.prototype, 'save');
    deleteByEmailStub = sinon.stub(Medication, 'deleteMany');
    getRecordsStub = sinon.stub(Medication, 'find');
    deleteByIdStub = sinon.stub(Medication, 'findByIdAndDelete');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('addRecord', () => {
    it('should add a medication record successfully', async () => {
      const record = {
        email: 'test@sneezl.com',
        date: new Date(),
        name: 'Zyrtec',
        quantity: 10,
      };

      const mockMedication = { ...record, _id: new mongoose.Types.ObjectId() };
      saveStub.resolves(mockMedication);

      const result = await Medication.addRecord(record);

      expect(saveStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(mockMedication);
    });

    it('should throw an error if saving fails', async () => {
      const record = {
        email: 'test@sneezl.com',
        date: new Date(),
        name: 'Zyrtec',
        quantity: 10,
      };

      saveStub.rejects(new Error('Database error'));

      try {
        await Medication.addRecord(record);
      } catch (error) {
        expect(error.message).to.equal('Database error');
      }
    });
  });

  describe('deleteByEmail', () => {
    it('should delete medication records by email', async () => {
        const email = 'test@sneezl.com';
        const mockDeleteResult = { deletedCount: 2 };
        deleteByEmailStub.resolves(mockDeleteResult);
      
        const result = await Medication.deleteByEmail(email);
      
        expect(deleteByEmailStub.calledOnceWith({email})).to.be.true;
        expect(result).to.deep.equal(mockDeleteResult);
      });
      

    it('should throw an error if deleting by email fails', async () => {
      const email = 'test@sneezl.com';
      deleteByEmailStub.rejects(new Error('Delete failed'));

      try {
        await Medication.deleteByEmail(email);
      } catch (error) {
        expect(error.message).to.equal('Delete failed');
      }
    });
  });

  describe('getRecords', () => {
    it('should retrieve medication records by email', async () => {
      const email = 'test@sneezl.com';
      const mockRecords = [
        { email, date: new Date(), name: 'Zyrtec', quantity: 10 },
        { email, date: new Date(), name: 'Clarytine', quantity: 5 },
      ];
      getRecordsStub.resolves(mockRecords);

      const result = await Medication.getRecords(email);

      expect(getRecordsStub.calledOnceWith({email})).to.be.true;
      expect(result).to.deep.equal(mockRecords);
    });

    it('should throw an error if getting records fails', async () => {
      const email = 'test@sneezl.com';
      getRecordsStub.rejects(new Error('Get records failed'));

      try {
        await Medication.getRecords(email);
      } catch (error) {
        expect(error.message).to.equal('Get records failed');
      }
    });
  });

  describe('deleteById', () => {
    it('should delete a medication record by ID', async () => {
      const id = new mongoose.Types.ObjectId();
      const mockDeletedRecord = { _id: id };
      deleteByIdStub.resolves(mockDeletedRecord);

      const result = await Medication.deleteById(id);

      expect(deleteByIdStub.calledOnceWith(id)).to.be.true;
      expect(result).to.deep.equal(mockDeletedRecord);
    });

    it('should throw an error if deleting by ID fails', async () => {
      const id = new mongoose.Types.ObjectId();
      deleteByIdStub.rejects(new Error('Delete by ID failed'));

      try {
        await Medication.deleteById(id);
      } catch (error) {
        expect(error.message).to.equal('Delete by ID failed');
      }
    });
  });
});
