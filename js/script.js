let news = [];
const getLatestNews = async () => {
  const url = new URL(
    `https://friendly-trifle-ee6c52.netlify.app`);
    const reponse = await fetch (url);
    const data = await reponse.json();
    console.log('rrr', reponse);
    news = data.articles;
    console.log('ddd', news);
};

getLatestNews();