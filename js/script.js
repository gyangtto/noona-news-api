let news = [];
const url = "https://friendly-trifle-ee6c52.netlify.app/top-headlines";

const getLatestNews = async () => {
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