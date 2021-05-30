# Main
mongoimport --db TERinou --collection questions --file ./jsons/questions.json --jsonArray --drop
mongoimport --db TERinou --collection words --file ./jsons/words.json --jsonArray --drop

# Test
mongoimport --db TERinouTest --collection words --file ./tests/words.json --jsonArray --drop