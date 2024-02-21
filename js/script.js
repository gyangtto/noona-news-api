let news = [];
q = '';
page = '';
category = '';
const getLatestNews = async () => {
  const url = new URL(
    `http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines?q=${q}`);
  const reponse = await fetch(url);
  const data = await reponse.json();
  console.log('rrr', reponse);
  news = data.articles;
  console.log('ddd', news);
};

getLatestNews();