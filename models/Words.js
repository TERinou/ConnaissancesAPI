const DumpRelations = require('./DumpRelations');
const mongoose = require('mongoose');
const jeuxdemots = require('jeuxdemots');

const WordSchema = new mongoose.Schema({
	word: {
		type: String,
		unique: true,
		required: [true, "A word is required"]
	},
	relations: [
		{
			word: {
				type: String,
				required: [true, "A word is required"]
			},
			type: {
				type: String,
				enum: DumpRelations,
				required: [true, "A relation type is required"]
			}
		}
	]
});

WordSchema.pre('findOne', function () {
    const {word} = this.getQuery();
    if (word) return addWordFromJDM(word);
});

WordSchema.pre('validate', function (next) {
    return addRelationsFromJDM(this).then(() => next());
});

const WordModel = mongoose.model('Words', WordSchema);

async function getRelationsFromJDM(word) {
    const relations = (await jeuxdemots.search(word)).getInRelations();
    return relations.reduce((relations, relation) => {
        if (DumpRelations.includes(relation.type)) {
            relations.push({word: relation.name, relation: relation.type});
        }

        return relations;
    }, []);
}

async function addRelationsFromJDM(newWord) {
    newWord.relations = getRelationsFromJDM(newWord)
    return newWord;
}

async function addWordFromJDM(word) {
    return WordModel.findOneAndUpdate({word}, {
        $setOnInsert: {
            word,
            relations: await getRelationsFromJDM(word)
        }
    }, {upsert: true, new: true}).exec();


}

module.exports = WordModel;
