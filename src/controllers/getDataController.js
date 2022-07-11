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
                const url = `http://localhost:4000/api/v1${link.split("/wiki")[1]}`
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
    },
    getItem: async (req, res) => {
        try {
            const character = req.params.character;
            const titles = [];
            const values = [];
            const obj = {};
            const data = [];
            const galleries = [];
            const response = await axios.get(`https://kimetsu-no-yaiba.fandom.com/wiki/${character}`);
            const htmls = response.data;
            const $ = cheerio.load(htmls);
            $(".wikia-gallery-item").each(function (){
                const gallery = $(this).find("a > img").attr("data-src")
                galleries.push(gallery);
            })
            $("aside", htmls).each(function () {
                const image = $(this).find("img").attr("src");
                let urlImage;
                if(image){
                    urlImage = image.slice(0, image.indexOf(".png") + 4)
                }
                $(this).find("section > div > h3").each(function () {
                    titles.push($(this).text());
                })
                $(this).find("section > div > .pi-data-value").each(function () {
                    values.push($(this).text());
                })
                for (var i = 0; i < titles.length; i++) {
                    obj[titles[i].toLowerCase()] = values[i];
                }
                if(urlImage){
                    data.push({
                        name: character.replace("_", " "),
                        image: urlImage,
                        thumbnail: obj
                    });
                }
            })
            return res.status(200).json({...data[0], galleries});
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json(error);
        }
    }
}

module.exports = getDataController