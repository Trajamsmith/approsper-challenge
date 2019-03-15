const knex = require("./index");

const initDB = async () => {
  if (await knex.schema.hasTable("advertisement")) return;

  await knex.schema.createTable("advertisement", function(table) {
    table.increments("id");
    table.string("url");
    table.string("category");
    table.float("cpi");
    table.integer("total_impressions");
  });
};

const insertAdvert = async (url, category, cpi) => {
  await knex.insert({ url, category, cpi }).into("advertisement");
};

const pickRandom = async () => {
  const countObj = await knex("advertisement").count();
  const count = countObj[0].count;

  const randID = Math.floor(Math.random() * count + 1);

  const ad = knex("advertisement").where({ id: randID });
  await knex("advertisement")
    .where({ id: randID })
    .increment({ total_impressions: 1 });
  return ad;
};

const pickRandomFromCat = async categoryArray => {
  let ads = [];

  for (let category of categoryArray) {
    const adsInCat = await knex("advertisement").where({ category });
    ads = ads.concat(adsInCat);
  }

  const randInd = Math.floor(Math.random() * ads.length);
  const ad = ads[randInd];
  await knex("advertisement")
    .where({ url: ad.url })
    .increment({ total_impressions: 1 });
  return ads[randInd];
};

const genRevReport = async () => {
  // SELECT category, SUM(cpi * total_impressions) FROM advertisement GROUP BY category
  const sums = await knex.raw(
    "SELECT category, SUM(cpi * total_impressions) FROM advertisement GROUP BY category"
  );
  return sums.rows;
};

module.exports = {
  initDB,
  insertAdvert,
  pickRandom,
  pickRandomFromCat,
  genRevReport
};
