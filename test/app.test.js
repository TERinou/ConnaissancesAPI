const app = require('../app');
const request = require('supertest');

const db = require('../db');
const Questions = require('../models/Questions');
const Words = require('../models/Words');

function isQuestionsModel(obj) {
  expect(obj).toEqual(
    expect.objectContaining({
      ok: expect.any(Boolean),
      question: expect.objectContaining({
        _id: expect.any(String),
        content: expect.any(String)
      })
    })
  );
}

function isWordsModel(obj) {
  expect(obj).toEqual(
    expect.objectContaining({
      word: expect.any(String),
      relations: expect.arrayContaining([
        expect.objectContaining({
          word: expect.any(String),
          type: expect.any(String)
        })
      ])
    })
  );
}

// Conversations test
describe('/v1/conversations/', () => {
  describe('GET /question', () => {

    beforeAll(async () => await db.connect());

    afterEach(async () => await db.clear());

    afterAll(async () => await db.close());

    it('has Questions model', () => {
      expect(Questions).toBeDefined();
    });

    it('has expected keys', () => {
      let expectedKeys = ['content'];
      let keys = Object.keys(Questions.schema.paths);
      let attributes = [keys[0]];
      expect(attributes).toStrictEqual(expectedKeys);
    });

    it('should throw an error if content key is empty', async () => {
      try {
        await new Questions({ content: "" }).save();
      }
      catch (err) {
        expect(err.errors.content.kind).toEqual("required");
      }
    });

    it('should respond with 200 status code', async () => {
      await Questions.create({ content: "I'm a mock question ?" });
      const response = await request(app)
        .get('/v1/conversations/question')
        .expect('Content-Type', /json/)
        .expect(200);

      isQuestionsModel(response.body);
    });

    it('should respond with 404 status code', async () => {
      const response = await request(app)
        .get('/v1/conversations/question')
        .expect('Content-Type', /json/)
        .expect(404);
    });
  });

  describe('POST /replies', () => {

    beforeAll(async () => await db.connect());

    afterEach(async () => await db.clear());

    afterAll(async () => await db.close());

    it('has Words model', () => {
      expect(Words).toBeDefined();
    })

    it('has expected keys', () => {
      let expectedKeys = ['word', 'relations'];
      let keys = Object.keys(Words.schema.paths);
      let attributes = [keys[0], keys[1]];
      expect(attributes).toStrictEqual(expectedKeys);
    });

    it('should throw an error if word key is empty', async () => {
      try {
        await new Words({
          word: '',
          relations: [{ word: 'mockWord', type: 'r_isa' }]
        }).save();
      }
      catch (err) {
        expect(err.errors.word.kind).toEqual("required");
      }
    });

    // it('should throw an error if word key is not unique', async () => {
    //   try {
    //     const word = new Words({
    //       word: 'mock',
    //       relations: [
    //         { word: 'test', type: 'r_isa' }
    //       ]
    //     })
    //     await word.save();
    //     await word.save();
    //   }
    //   catch (err) {
    //     expect(err.code).toEqual(11000);
    //   }
    // });

    // it('should respond with 200 status code', async () => {
    //   await Words.create({
    //     word: 'mock',
    //     relations: [{ word: "mock", type: "r_isa" }]
    //   });

    //   const response = await request(app)
    //     .post('/v1/conversations/replies')
    //     .send({ content: "" })
    //     .expect('Content-Type', /json/)
    //     .expect(200);
    // });

  });
});