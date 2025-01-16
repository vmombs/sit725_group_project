import sinon from 'sinon';
import { expect } from 'chai';
import mongoose from 'mongoose';
import * as diaryController from '../controllers/diaryController.js';
const { addMedication } = diaryController;
import Medication from '../models/Medication.js';

describe('addMedication', () => {
    let req, res, addRecordStub;

    before(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', {
        });
    });

    after(async () => {
        await mongoose.connection.close();
    });

    beforeEach(() => {
        console.log("test", Medication)
        req = {
            user: { email: 'test@example.com' },
            body: {
                date: '2025-01-01',
                name: 'Aspirin',
                quantity: 2,
            },
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
        addRecordStub = sinon.stub(Medication, 'addRecord');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return 401 if user is not authenticated', async () => {
        req.user = null;
        await addMedication(req, res);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({ statusCode: 401, message: 'Unauthorized' })).to.be.true;
    });

    it('should save medication record and return 201 status', async () => {
        addRecordStub.resolves({ id: 1, ...req.body });

        await addMedication(req, res);

        expect(addRecordStub.calledWith({
            email: req.user.email,
            date: req.body.date,
            name: req.body.name,
            quantity: req.body.quantity,
        })).to.be.true;
        expect(res.json.calledWith({
            statusCode: 201,
            data: {
                email: req.user.email,
                date: req.body.date,
                name: req.body.name,
                quantity: req.body.quantity,
            },
            message: 'success',
        })).to.be.true;
    });

    it('should handle errors and log them', async () => {
        const consoleSpy = sinon.spy(console, 'error');
        addRecordStub.rejects(new Error('Database error'));

        await addMedication(req, res);

        expect(consoleSpy.calledWith('Failed to add medication:', sinon.match.instanceOf(Error))).to.be.true;
    });
});
