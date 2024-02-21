const API_KEY = '59db89f3fab8455081d13257e11ce5d2';
let nuews = [];
const getLatestNews = async () => {
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
    const reponse = await fetch (url);
    const data = await reponse.json();
    console.log('rrr', reponse);
    news = data.articles;
    console.log('ddd', news);
};

getLatestNews();