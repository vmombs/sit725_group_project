import sinon from 'sinon';
import { expect } from 'chai';
import mongoose from 'mongoose';
import Symptom from '../models/Symptom.js';

describe('Symptom Model', () => {
    before(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/symptom_test', {});
    });

    after(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    });

    afterEach(async () => {
        sinon.restore();
        await Symptom.deleteMany({});
    });

    describe('addRecord', () => {
        it('should add a symptom record successfully', async () => {
            const record = {
                email: 'test@sneezl.com',
                date: new Date(),
                name: 'Sneezing',
                severity: 'Moderate',
            };

            const savedRecord = await Symptom.addRecord(record);

            expect(savedRecord).to.have.property('_id');
            expect(savedRecord.email).to.equal(record.email);
            expect(savedRecord.name).to.equal(record.name);
            expect(savedRecord.severity).to.equal(record.severity);
        });

        it('should throw an error if required fields are missing', async () => {
            const record = {
                email: 'test@sneezl.com',
                date: new Date(),
            };

            try {
                await Symptom.addRecord(record);
            } catch (error) {
                expect(error).to.exist;
                expect(error.name).to.equal('ValidationError');
            }
        });
    });

    describe('deleteByEmail', () => {
        it('should delete records by email', async () => {
            const record = {
                email: 'test@sneezl.com',
                date: new Date(),
                name: 'Itchy Eyes',
                severity: 'Mild',
            };

            await Symptom.addRecord(record);
            const result = await Symptom.deleteByEmail('test@sneezl.com');

            expect(result).to.have.property('deletedCount', 1);

            const remainingRecords = await Symptom.getRecords('test@sneezl.com');
            expect(remainingRecords).to.be.empty;
        });

        it('should return deletedCount as 0 if no records match', async () => {
            const result = await Symptom.deleteByEmail('nonexistent@sneezl.com');
            expect(result).to.have.property('deletedCount', 0);
        });
    });

    describe('getRecords', () => {
        it('should retrieve records by email', async () => {
            const record = {
                email: 'test@sneezl.com',
                date: new Date(),
                name: 'Fever',
                severity: 'High',
            };

            await Symptom.addRecord(record);
            const records = await Symptom.getRecords('test@sneezl.com');

            expect(records).to.have.lengthOf(1);
            expect(records[0].email).to.equal(record.email);
            expect(records[0].name).to.equal(record.name);
        });

        it('should return an empty array if no records match', async () => {
            const records = await Symptom.getRecords('nonexistent@sneezl.com');
            expect(records).to.be.empty;
        });
    });

    describe('deleteById', () => {
        it('should delete a record by ID', async () => {
            const record = {
                email: 'test@sneezl.com',
                date: new Date(),
                name: 'Cough',
                severity: 'Mild',
            };

            const savedRecord = await Symptom.addRecord(record);
            const result = await Symptom.deleteById(savedRecord._id);

            expect(result).to.have.property('_id');
            expect(result.email).to.equal(record.email);

            const remainingRecords = await Symptom.getRecords('test@sneezl.com');
            expect(remainingRecords).to.be.empty;
        });

        it('should return null if no record matches the ID', async () => {
            const result = await Symptom.deleteById(new mongoose.Types.ObjectId());
            expect(result).to.be.null;
        });
    });
});
