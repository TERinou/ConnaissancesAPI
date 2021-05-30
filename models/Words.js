const DumpRelations = require('./DumpRelations');
const mongoose = require('mongoose');
const jeuxdemots = require('jeuxdemots');

const WordSchema = new mongoose.Schema({
  word: {
    type: String,
    unique: [true, "word already exist"],
    required: [true, "word is required"]
  },
  relations: [{
    word: {
      type: String,
      required: [true, "relation word is required"]
    },
    type: {
      type: String,
      enum: DumpRelations,
      required: [true, "relation type is required"]
    }
  }]
});


WordSchema.pre('findOne', async function () {
    const {word} = this.getQuery();
    const {$disableMiddleware, ...query} = this.getQuery();
    this.setQuery(query);
    if (query.word && !$disableMiddleware) return await addWordFromJDM(word);
});

WordSchema.pre('validate', async function () {
    return await addRelationsFromJDM(this);
});

const WordModel = mongoose.model('Words', WordSchema);

async function getRelationsFromJDM(word) {
    const relations = (await jeuxdemots.search(word)).getInRelations();
    return relations.reduce((relations, relation) => {
        if (Object.keys(DumpRelations).includes(relation.type)) {
            relations.push({word: relation.name, type: relation.type});
        }

        return relations;
    }, []);
}

async function addRelationsFromJDM(newWord) {
    newWord.relations = await getRelationsFromJDM(newWord)
    return newWord;
}

async function addWordFromJDM(word) {
    if(!(await WordModel.findOne({word, $disableMiddleware: true}))) {
        return WordModel.findOneAndUpdate({word}, {
            $setOnInsert: {
                word,
                relations: await getRelationsFromJDM(word)
            }
        }, {upsert: true, new: true}).exec();
    }
}

module.exports = WordModel;
