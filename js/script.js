const API_KEY = `59db89f3fab8455081d13257e11ce5d2`;
const myUrl = 'https://friendly-trifle-ee6c52.netlify.app//headlines?country=kr';
const noonaUrl ='http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines'
let news = [];

const getLatestNews = async () => {
  let url = new URL(myUrl);
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