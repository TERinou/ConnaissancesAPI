const { consoleHandler } = require('../lib');

const app = require('../app');
const config = require('../config');
const request = require('supertest');
const db = require('../db');

const Questions = require('../models/Questions');
const Words = require('../models/Words');
const { resetConsoleOutput } = require('../lib/consoleHandler');

describe('Test all the models', () => {
	beforeAll(async () => await db.connect());
	beforeEach(async () => consoleHandler.removeConsoleOutput());
	afterEach(async () => await db.clear());
	afterAll(async () => await db.close());

	describe('Questions', () => {

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
	});

	describe('Words', () => {

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

		it('should throw an error if relations.word is empty', async () => {
			const word = new Words({
				word: 'mock',
				relations: [{ word: '', type: 'r_isa' }]
			});
			const err = word.validateSync();
			expect(err.errors['relations.0.word'].kind).toEqual('required');
		});

		it('should throw an error if relations.type is empty', async () => {
			const word = new Words({
				word: 'mock',
				relations: [{ word: 'test', type: '' }]
			});
			const err = word.validateSync();
			expect(err.errors['relations.0.type'].kind).toEqual('required');
		});

		it('should throw an error if relations.type is not a valid enum value', async () => {
			const word = new Words({
				word: 'mock',
				relations: [{ word: 'test', type: 'test' }]
			});
			const err = word.validateSync();
			expect(err.errors['relations.0.type'].kind).toEqual('enum');
		});

		it('should add a new word with default empty relations array', async () => {
			const word = await new Words({ word: 'mock' }).save();
			expect(word).toBeTruthy();
			expect(word.relations).not.toEqual([]);
		});
	});
});


describe('/v1/conversations', () => {

	describe('GET /question', () => {

		beforeAll(async () => await db.connect());

		afterEach(async () => await db.clear());

		afterAll(async () => await db.close());

		it('should respond with 200 status code', async () => {
			await new Questions({ content: "It is a mock question ?" }).save();
			const response = await request(app)
				.get('/v1/conversations/question')
				.expect('Content-Type', /json/)
				.expect(200);

			expect(response.body).toEqual(
				expect.objectContaining({
					ok: expect.any(Boolean),
					question: expect.objectContaining({
						_id: expect.any(String),
						content: expect.any(String)
					})
				})
			);
		});

		it('should respond with 404 status code', async () => {
			const response = await request(app)
				.get('/v1/conversations/question')
				.expect('Content-Type', /json/)
				.expect(404);
		});
	});

	describe('POST /replies', () => {

		beforeAll(async () => await db.connect(config.db_test));
		beforeEach(async () => consoleHandler.removeConsoleOutput());
		afterAll(async () => await db.close(false));

		it('should respond with 200 status code (found relation)', async () => {
			const response = await request(app)
				.post('/v1/conversations/replies')
				.send({ content: "Est-ce que arbre a pour couleur vert ?" })
				.expect('Content-Type', /json/)
				.expect(200);

			expect(response.body).toEqual(
				expect.objectContaining({
					ok: expect.any(Boolean),
					relation: expect.objectContaining({
						word: expect.any(String),
						type: expect.any(String),
						relatedTo: expect.any(String)
					})
				})
			);
		});

		it('should respond with 200 status code (found relation & inferences)', async () => {
			const response = await request(app)
				.post('/v1/conversations/replies')
				.send({ content: "Est-ce que arbre est lié à végétal ?" })
				.expect('Content-Type', /json/)
				.expect(200);

			expect(response.body).toEqual(
				expect.objectContaining({
					ok: expect.any(Boolean),
					relation: expect.objectContaining({
						word: expect.any(String),
						type: expect.any(String),
						relatedTo: expect.any(String)
					}),
					inferences: expect.arrayContaining([
						expect.objectContaining({
							word: expect.any(String),
							type: expect.any(String),
							relatedTo: expect.any(String)
						})
					])
				})
			);
		});

		it('should respond with 404 status code (no relation found)', async () => {
			const response = await request(app)
				.post('/v1/conversations/replies')
				.send({ content: "Est-ce que arbre a pour couleur pourpre ?" })
				.expect('Content-Type', /json/)
				.expect(404);

			expect(response.body).toEqual(
				expect.objectContaining({
					ok: expect.any(Boolean),
					code: expect.any(String),
					message: expect.any(String),
					information: expect.objectContaining({
						word: expect.any(String),
						type: expect.any(String),
						relatedTo: expect.any(String)
					})
				})
			);
		});

		it('should respond with 500 status code (wrong sentence format)', async () => {
			try {
				await request(app)
					.post('/v1/conversations/replies')
					.send({ content: "Est-ce qu'un arbre a pour couleur pourpre ?" })
					.expect('Content-Type', /json/);

			} catch (err) {
				expect(err.statusCode).toEqual(500);
			}
		});
	});
});