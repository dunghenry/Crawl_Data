const axios = require('axios');
const cheerio = require('cheerio');
const logEvents = require('../helpers/logEvents');
const getDataController = {
    getListData: async (req, res) => {
        try {
            const response = await axios.get("https://kimetsu-no-yaiba.fandom.com/wiki/Kimetsu_no_Yaiba_Wiki");
            const htmls = response.data;
            const $ = cheerio.load(htmls)
            const data = [];
            const limit = +req.query.limit
            $(".portal", htmls).each(function () {
                const name = $(this).find("a").attr("title");
                const link = $(this).find("a").attr("href");
                const url = `http://localhost:4000/v1${link.split("/wiki")[1]}`
                const image = $(this).find("a>img").attr("data-src");
                const item = { name, url, image }
                data.push(item);
            })
            if (limit && limit > 0) {
                return res.status(200).json(data.splice(0, limit));
            }
            return res.status(200).json(data);
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error);
        }
    }
}

module.exports = getDataController