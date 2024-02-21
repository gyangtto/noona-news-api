const API_KEY = `59db89f3fab8455081d13257e11ce5d2`;

let news = [];

const getLatestNews = async () => {
  let url = new URL(`https://friendly-trifle-ee6c52.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`);
  const requestUrl = new URL(url);
  console.log('uuu', requestUrl);

  const reponse = await fetch(requestUrl);
  const data = await reponse.json();
  console.log('rrr', reponse);
  news = data.articles;
  console.log('ddd', data);
  console.log('nnn', news);
};

getLatestNews();